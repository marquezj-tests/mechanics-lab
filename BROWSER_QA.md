# Offline browser qualification

Automated Node regression tests do not establish browser compatibility. Full browser/device qualification remains pending.

On 2026-11-08, a localization smoke check passed in the Codex in-app browser at a narrow viewport: the deployed site opened in Spanish, the upper-right selector displayed 🇦🇷 Español / 🇬🇧 English, and switching in both directions updated visible controls and tooltips. This does not qualify the remaining workflows or real mobile devices.

| Target | Required check | Status |
|---|---|---|
| Chrome / Edge on a laptop | Mouse, keyboard, local file downloads | Pending |
| Firefox on a laptop | Mouse, keyboard, local file downloads | Pending |
| Safari on macOS | Mouse, keyboard, local file downloads | Pending |
| Safari on iPhone/iPad | Touch editing, panels, file open/save | Pending |
| Chrome on Android | Touch editing, panels, file open/save | Pending |

For each target, record browser/OS versions, device and date. Open the single `index.html` directly with networking disabled. Verify:

1. Start with an empty language preference: Spanish is the default. Check the upper-right 🇦🇷 Español / 🇬🇧 English selector on narrow screens. Switch both ways, including while running and replaying; verify tooltips, properties, plots, moving readouts, help and save/open errors. Check that custom names/captions and the recording remain unchanged, and that preference persists when storage is allowed. Repeat with storage blocked.
2. Icons and controls appear without requests for external assets. Portrait/landscape layouts keep Run, Reset and bottom tabs usable.
3. Place every body/support type; resize/rotate solids; attach springs, bars, strings and both pulley types. Edit zero and negative velocities. Verify grid and velocity snapping.
4. Use desktop box selection, copy/paste, undo/redo, and text-field keyboard shortcuts. On touch, use Select multiple to toggle components and add box selections, tap empty space to clear, toggle it off to move groups, use Pan canvas over a body, copy/paste a group, drag bodies/arrows/readouts, operate Builder/Properties/Canvas tabs, and attach strings at pulleys' axles through Properties.
5. Run each example; pause, step, rewind, replay and reset. Switching away stops playback. Changing solver precision restarts initial conditions and retains the scene.
6. Add multiple plot lines and phase axes; drag/resize/collapse plots. Export CSV and inspect headers/samples.
7. Save As with a custom name; open the saved file; compare initial conditions, precision, plots and readouts. Cancel each dialog. Reject a malformed/oversized file without changing the current experiment.
8. Run an undamped oscillator and elastic collision, then enable damping/friction/inelasticity. Check that units/readouts are legible and that physical energy loss is explained separately from numerical integration error.

Modifier-free group selection and explicit pan controls are implemented and covered by headless gesture tests. Real-device touch delivery, layout and usability remain pending qualification.
