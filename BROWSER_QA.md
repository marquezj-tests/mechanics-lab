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
3. Place every body/support type; resize/rotate solids; attach springs at body centers and off-center points, bars, hinges, moving-body sliders, welded joints, applied torques, strings and both pulley types. Create a slider by choosing the guide solid before its carriage. Edit its local axis/relative angle and run the moving-guide example; verify that its rail rotates and readouts follow the carriage. Create a hinge at overlapping beam ends, select its pivot, edit local pins and verify free rotation. Drag, rotate and resize either connected beam and check that pins stay joined throughout the gesture. Repeat with an immobilized beam, a connected bar/string and numeric position/rotation edits; check undo. Run the hinged double pendulum; check moving reaction readouts, relative-angle plots, rewind/reset and saved hinges. Verify that off-center spring pins rotate/resize with the body and that their local coordinates persist after save/load. Run the off-center spring oscillator and add damping to its spring. Apply a pure torque to a solid, select its curved arc, and edit positive, negative and zero values. Check that it turns without a net force, follows the body, and survives copy/save/reload; compare the torque/inertia example and power during replay. Edit static/kinetic friction separately, including zero and edits crossing the other coefficient. Verify that the pair stays ordered, legacy single values migrate only after editing, and save/reload preserves both. Run static vs kinetic friction at slow playback: the 4 N block stays put, the 7 N block slides, and the track readouts show −4 N and −2.943 N before its stop. Edit zero and negative velocities. Verify grid and velocity snapping.
4. Use desktop box selection, copy/paste, undo/redo, and text-field keyboard shortcuts. On touch, use Select multiple to toggle components and add box selections, tap empty space to clear, toggle it off to move groups, use Pan canvas over a body, copy/paste a group, drag bodies/arrows/readouts, operate Builder/Properties/Canvas tabs, and attach strings at pulleys' axles through Properties.
5. Run each example; pause, step, rewind, replay and reset. For hinge vs weld, verify that only the hinged pair changes relative angle and that the weld reports a joint couple. Rotate/resize a welded body in the editor and check that its partner stays attached. Switching away stops playback. Changing solver precision restarts initial conditions and retains the scene.
6. Add multiple plot lines and phase axes; drag/resize/collapse plots. Export CSV and inspect headers/samples.
7. Save As with a custom name; open the saved file; compare initial conditions, precision, plots and readouts. Cancel each dialog. Reject a malformed/oversized file without changing the current experiment.
8. Run an undamped oscillator and elastic collision, then enable damping/friction/inelasticity. Check that units/readouts are legible and that physical energy loss is explained separately from numerical integration error.

Modifier-free group selection and explicit pan controls are implemented and covered by headless gesture tests. Real-device touch delivery, layout and usability remain pending qualification.
