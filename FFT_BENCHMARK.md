# FFT feasibility benchmark

The experiment supports **post-run spectra** and **live spectra for a few selected variables at 5–10 updates per second**. Recomputing every spectrum at each physics step is unnecessary with the current recording rate and can consume the integration budget. No spectrum feature has been added to the application by this benchmark.

## Method

Run `node scripts/benchmark-spectra.cjs`. The script implements a reusable radix-2 FFT in ordinary JavaScript, removes the mean, applies a Hann window, computes one-sided amplitude spectra and copies the results into retained per-variable output buffers. It checks known two-tone frequencies/amplitudes, DC removal, Nyquist scaling, zero input and windowing before zero-padding. Plans, typed arrays, windows and twiddle factors are reused. Warm-up precedes nine timed batches; the table reports the median batch cost per update. Setup/allocation time is reported separately by the script.

Measured on **Node v24.22.2, Intel Xeon Silver 4114 at 2.20 GHz**, single-threaded. These are feasibility measurements, not browser or mobile performance certification. They exclude variable lookup, graph rendering, worker messaging and physics integration. CPU percentages estimate one core's occupancy as `milliseconds × updates/second ÷ 10`; values above 100% mean the requested update rate cannot be sustained on that core, even before adding physics. Playback at 2× would double the cost if FFT updates were tied to simulated time.

| FFT size | Variables | Recorded samples per variable | Median per update | CPU at 10 updates/s | CPU at 240 updates/s |
|---|---:|---:|---:|---:|---:|
| 4096 | 4 | 4096 | 1.09 ms | 1.1% | 26% |
| 4096 | 16 | 4096 | 4.37 ms | 4.4% | 105% |
| 8192 | 4 | 8192 | 2.60 ms | 2.6% | 62% |
| 65536 (full 600 s, padded) | 4 | 36001 | 24.50 ms | 24.5% | 588% |
| 65536 (full 600 s, padded) | 16 | 36001 | 97.71 ms | 97.7% | 2345% |
| 8192 (full 120 s) | 4 | 7201 | 2.48 ms | 2.5% | 59% |

For post-run analysis, the table's **four full 120 s signals require about 2.5 ms**; four full 600 s signals require about 24.5 ms, or about 98 ms for sixteen signals. These are computation times after setup and data collection, rather than end-to-end UI latencies. A 600 s run supplies 36,001 samples, padded to 65,536 FFT slots. The larger transform is not a 1,092-second recording, and padding does not add physical frequency resolution.

The optional `--recording /path/to/pendulum-position-recording.json` accepts the `{points:[{x,y},...]}` output from the pendulum investigation. Both mass-1 coordinate signals from the actual 120 s inverted-pendulum recording were processed successfully (last 4,096 samples). Their strongest positive-frequency bins were approximately 0.557 Hz and 0.586 Hz; these describe that selected segment of a nonlinear chaotic signal, not a claim about fixed natural frequencies.

## Sampling and interpretation

The app integrates at a base **240 Hz**, with additional internal substeps, but records values at **60 Hz**. With existing recorded data, analyses are limited by a **30 Hz Nyquist frequency**; four FFTs per new recorded sample provide no additional information. High/Very high solver precision does not raise the recording sample rate. Faster phenomena, stiff springs and impacts may alias; higher-frequency spectra would need a separate faster sampling buffer and an appropriate anti-aliasing design.

A 1,024-sample window covers about 17.1 s, with 0.0586 Hz FFT bin spacing; 4,096 samples cover about 68.3 s, with 0.01465 Hz bin spacing. A full 120 s record has an observation-time frequency scale near 1/120 = 0.00833 Hz. Hann windowing broadens peaks, so actual separation of nearby frequencies is worse than simply reading the FFT bin spacing. Zero-padding provides a finer display grid, not extra measured resolution. A moving spectrum trades time localization against frequency discrimination. An excitation sweep will spread energy over frequencies in a full-run FFT; a spectrogram would be a separate feature for showing how the content changes with time.

## Suggested implementation

1. Start with an on-demand **Spectrum** plot for any selected recorded variable, available when paused or finished. Use an explicit recorded interval, frequency in Hz, and one-sided amplitude in the variable's units. Offer mean removal and Hann windowing, with clear normalization; spectra of constant variables consist only of DC unless mean removal is enabled. Cache the result until the data, variable, interval or window changes. Include calculated variables where their recorded values are finite.
2. Add optional **Live spectrum**, initially up to four signals, with a 1,024- or 4,096-sample rolling buffer and a wall-clock refresh rate around 5–10 Hz. Read each selected variable once per newly recorded sample, rather than repeatedly walking every stored frame. Plot only when a spectrum is visible. Keep spectral sampling, FFT refresh and the integrator timestep independent.
3. Put longer/multiple live transforms in a Web Worker. An inline Blob worker can preserve the single-file offline packaging; its browser and mobile behavior needs verification. Reuse plans and buffers, preserve peaks when reducing display bins, and never alter physics accuracy to accommodate spectrum updates.

The post-run option is the smallest first milestone and works well on lower-powered devices. The same implementation can later serve live spectra, without committing to per-timestep recomputation.
