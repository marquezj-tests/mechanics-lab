# Regression tests

Run all suites from the project directory:

```sh
node tests/run.cjs
```

No installation, browser, build step, or network access is required. The runner discovers top-level `.cjs` suites and stops on failure. Long energy/collision experiments take longer than editor tests.

| Area | Suites |
|---|---|
| Inverted double-pendulum startup, geometry, dynamics, energy, reset/replay and preset/file parity | default-pendulum |
| Spanish/English UI, flag selector, preferences, custom text and recording preservation | languages |
| Integration, damping, gravity, constraints | physics, energy |
| Precision convergence, recording clock, reaction averaging, settings persistence | precision |
| Shapes, editing, selection, clipboard, undo, tools, replay | solids |
| Touch multi-selection, box selection, pan modes, group movement and recording preservation | touch-selection |
| Energy/replay diagnostics, physical work/loss explanations, bar/string residuals | diagnostics |
| Contacts, friction, elastic energy and momentum | collisions, elastic-collisions, lattice |
| Off-center spring/damper geometry, torque, energy/momentum, reactions and replay | off-center-springs |
| Spring attachment editing, rendering/picking, persistence, resizing and bilingual example | spring-attachments-ui |
| Live geometry editing with joint/bar/string constraints, supports, blocked edits and pointer tracking | joint-editing |
| Moving-body sliders: inclined motion, rotating-axis gradients, reactions, conservation, contacts, editing, persistence and bilingual UI | sliders, sliders-ui |
| Welds: equilibrium/couples, rigid motion, conservation, contact/support impulses, clusters, editing/persistence and bilingual comparison | welds, welds-ui |
| Direct torques: signed acceleration/work/power, support/joint reactions, inertia comparison, UI/persistence and replay | torques, torques-ui |
| General hinges: analytical motion, reactions, conservation, editing, persistence and bilingual example | hinges, hinges-ui |
| Bars, supports, reaction forces and torque | bars, supports, forces, bridge, bridge-preset, bridge-fixed, support-example |
| Strings, finite-radius routing, fixed and moving pulleys | strings, movable-pulleys |
| Plot variables, multiple curves, CSV and moving readouts | plots, solids |
| Offline resources, icons, snap increments, Save As, failed imports, all example files and repeatability | workflows |

Physics suites compare with analytical motion, conservation laws, force balance, constraint residuals and numerical tolerances. Workflow tests execute the inline application code with DOM/canvas stubs. Those stubs cannot verify native browser layout, pointer delivery, downloads, dialogs, rendering or touch behavior; use the manual compatibility checklist for those.
