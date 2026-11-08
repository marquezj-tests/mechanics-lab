# Regression tests

Run all suites from the project directory:

```sh
node tests/run.cjs
```

No installation, browser, build step, or network access is required. The runner discovers top-level `.cjs` suites and stops on failure. Long energy/collision experiments take longer than editor tests.

| Area | Suites |
|---|---|
| Integration, damping, gravity, constraints | physics, energy |
| Precision convergence, recording clock, reaction averaging, settings persistence | precision |
| Shapes, editing, selection, clipboard, undo, tools, replay | solids |
| Touch multi-selection, box selection, pan modes, group movement and recording preservation | touch-selection |
| Energy/replay diagnostics, physical work/loss explanations, bar/string residuals | diagnostics |
| Contacts, friction, elastic energy and momentum | collisions, elastic-collisions, lattice |
| Bars, supports, reaction forces and torque | bars, supports, forces, bridge, bridge-fixed, support-example |
| Strings, finite-radius routing, fixed and moving pulleys | strings, movable-pulleys |
| Plot variables, multiple curves, CSV and moving readouts | plots, solids |
| Offline resources, icons, snap increments, Save As, failed imports, all example files and repeatability | workflows |

Physics suites compare with analytical motion, conservation laws, force balance, constraint residuals and numerical tolerances. Workflow tests execute the inline application code with DOM/canvas stubs. Those stubs cannot verify native browser layout, pointer delivery, downloads, dialogs, rendering or touch behavior; use the manual compatibility checklist for those.
