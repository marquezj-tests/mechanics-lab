# Offline browser qualification

Automated Node regression tests do not establish browser compatibility. No real-browser/device results are recorded for this milestone yet.

| Target | Required check | Status |
|---|---|---|
| Chrome / Edge on a laptop | Mouse, keyboard, local file downloads | Pending |
| Firefox on a laptop | Mouse, keyboard, local file downloads | Pending |
| Safari on macOS | Mouse, keyboard, local file downloads | Pending |
| Safari on iPhone/iPad | Touch editing, panels, file open/save | Pending |
| Chrome on Android | Touch editing, panels, file open/save | Pending |

For each target, record browser/OS versions, device and date. Open the single `index.html` directly with networking disabled. Verify:

1. Icons and controls appear without requests for external assets. Portrait/landscape layouts keep Run, Reset and bottom tabs usable.
2. Place every body/support type; resize/rotate solids; attach springs, bars, strings and both pulley types. Edit zero and negative velocities. Verify grid and velocity snapping.
3. Use desktop box selection, copy/paste, undo/redo, and text-field keyboard shortcuts. On touch, use Select multiple to toggle components and add box selections, tap empty space to clear, toggle it off to move groups, use Pan canvas over a body, copy/paste a group, drag bodies/arrows/readouts, operate Builder/Properties/Canvas tabs, and attach strings at pulleys' axles through Properties.
4. Run each example; pause, step, rewind, replay and reset. Switching away stops playback. Changing solver precision restarts initial conditions and retains the scene.
5. Add multiple plot lines and phase axes; drag/resize/collapse plots. Export CSV and inspect headers/samples.
6. Save As with a custom name; open the saved file; compare initial conditions, precision, plots and readouts. Cancel each dialog. Reject a malformed/oversized file without changing the current experiment.
7. Run an undamped oscillator and elastic collision, then enable damping/friction/inelasticity. Check that units/readouts are legible and that physical energy loss is explained separately from numerical integration error.

Modifier-free group selection and explicit pan controls are implemented and covered by headless gesture tests. Real-device touch delivery, layout and usability remain pending qualification.
