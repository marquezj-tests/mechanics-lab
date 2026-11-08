# Mechanics Lab

A self-contained, offline 2D mechanics laboratory for introductory college physics.

[Open Mechanics Lab online](https://marquezj-tests.github.io/mechanics-lab/). To work offline, download `index.html` and open it in your browser.

Open `index.html` directly in a modern browser. No installation, build step, server, or internet access is required. The same file adapts to laptop and mobile screens.

## Interface language

Spanish (Argentina) is the default. Use **🇦🇷 Español / 🇬🇧 English** at the upper right to switch languages. The choice is remembered when browser local storage is available; blocked storage still allows switching for the current session. Both languages work offline in the same HTML file. Switching preserves the running experiment, recording, selection, plots and initial conditions. Custom object names and monitor captions remain as entered; new objects and example names use the language selected when they are created. Physics variable IDs, SI units, saved JSON and numeric CSV values remain unchanged. Plot CSV display headers use the selected language.

## First experiment

1. Press **Run** to simulate the example. **Pause**, **Step**, and **Reset** control playback.
2. Drag the timeline to inspect an earlier recorded state. **Replay** advances through the recording, then continues at its end. Recordings stop at 120 seconds.
3. Choose a point mass or pinned support in the builder, then click the canvas to place it.
4. Choose **Spring**, then click two bodies to connect them. A new spring starts at its natural length; edit its length or move a body to stretch it.
   Select a spring to edit its **Damping (N·s/m)** coefficient. Drag opposes relative motion along the spring: `F_drag = -c × extension speed`. Zero preserves ideal undamped motion. Coefficients are saved in experiment files; older files default to zero.
5. Choose **Linear constraint** and click a mass. Its line starts horizontally through the mass; edit its angle and origin in Properties.
6. Select and drag bodies to edit initial positions. Enable **Snap to fine grid** in Builder to snap new bodies and dragged positions to minor grid intersections. The fine grid is one-fifth of the major spacing (normally 0.2 m; 0.4 m when zoomed out). Snapping is saved with the experiment and does not affect simulated motion. On desktop, drag empty space to box-select components; Alt-drag or middle-drag pans. On touch screens, empty-space dragging pans. Use **Fit** and zoom buttons to adjust the view.
   At time zero, green arrows show each mass’s initial velocity. Drag a green arrowhead to set its direction and magnitude; the inspector updates while dragging. One metre per second is drawn as 0.75 metres on the canvas. Set zero or very small velocities in Properties. Reset or rewind to time zero to reveal these controls. Constraints project the chosen velocity onto their permitted line. With snapping enabled, velocity dragging snaps speed to 0.1 m/s increments and direction to 5° increments. Constrained masses retain their line direction and snap their permitted speed to 0.1 m/s increments.
7. Press **Add plot** above the canvas to create an optional plot window. Choose a shared X variable and one or more independent Y variables, including time on either axis. Use **＋ Line** to add another curve to the same plot. Each plot is a fixed screen panel: drag its header, resize its corner, minimize, close, or export its own CSV. For a phase portrait, choose a mass’s x position for X and x velocity for Y. Samples stay in acquisition order, and the orange dot marks the replay sample. There is no reserved plot area when no plots exist. Plot settings and positions save with the experiment; older files open without plot windows. The inspector’s readout-source selector and **Export measurements CSV** still provide complete body/link measurements.
8. **Save As…** opens a filename dialog and downloads initial conditions, components, settings, monitor selection, and view as JSON. The `.json` extension is added automatically; the dialog remembers the last saved or opened filename. **Open** reloads that file. Recorded histories are not saved.

On mobile, the bottom tabs open the builder and property panels. Use the Canvas tab to dismiss them. The canvas toolbar’s **Select multiple** icon enables additive selection: tap components to add/remove them, drag empty space to add a selection box, or tap empty space to clear the selection. Toggle it off to drag the selected group. Use the adjacent **Pan canvas** icon to pan from anywhere, including over a body. Both modes work with a mouse or touch, preserve recordings, and reset when another builder tool is chosen. Copy and Paste buttons work with these groups. These two controls show their active state and have tooltips/accessibility labels. Keyboard shortcuts on laptops: Ctrl/Cmd+C to copy, Ctrl/Cmd+V to paste, Ctrl/Cmd+A to select all; Space to run/pause; Delete to remove the selection; Ctrl/Cmd+Z to undo; Ctrl/Cmd+Shift+Z to redo; Escape to cancel a spring connection.

## Solid bodies

Choose **Rectangle**, **Circle**, or **Triangle**, then click to place a body. Choose **Free polygon**, click 3–64 vertices around its boundary, then press **Finish polygon** (or Enter). Concave polygons are supported; crossing edges and zero-area polygons are rejected.

Select a solid to reveal its controls:

- The center cross marks its uniform-density center of mass and is the attachment point for springs. Choose Spring and click the cross (or the body) to connect it.
- Drag a square at a corner to resize about the center. Rectangles resize along their local axes; circles change radius; triangles and free polygons scale uniformly.
- Drag an outer circular control to rotate about the center. Rotation snaps to 5° when snapping is on.
- Drag the body to move it. Edit mass, initial rotation, and initial angular velocity in Properties. Rectangle dimensions and circle radius also have numerical inputs.

Solids participate in the same spring and gravity simulation as point masses. Orientation is recorded for replay; angular readouts and CSV columns use the body’s rotation and angular velocity. Shapes, dimensions, and angular initial conditions are saved in JSON files. Center attachments exert no spring torque. Collisions can change angular velocity; off-center spring attachments are not implemented yet.

## Optional fixed plots

Plots are presentation panels stored separately from physical bodies. Gravity, forces, collisions, camera zoom/pan, and component motion do not move them. Adding, moving, resizing, changing axes, or closing a plot preserves the current recording. Multiple plots can use different bodies, links, or supports at once. Up to 12 windows can be open. Missing/deleted variable sources fall back to time. Each plot supports up to eight lines on a common scale. Line controls choose its Y variable and color, toggle visibility, or remove it; the final line cannot be removed without closing the plot. The legend identifies all curves and units. Hidden lines do not affect autoscaling but remain in CSV exports. Adding or editing lines preserves the recording and saves with the experiment; older single-line plots migrate automatically. Per-plot CSV exports include sample time, the shared X value, and every configured Y line with labeled units.

To compare energies, set X to **Time (s)** and the first Y to **Mechanical energy (J)**. Press **＋ Line**; the next line defaults to **Kinetic energy (system) (J)** when it is not already present. Add **Potential energy (system) (J)** if desired. Mechanical energy includes translational and rotational kinetic energy, gravitational potential energy, and spring elastic energy; potential energy is mechanical minus kinetic energy. The zero of gravitational potential is y = 0, so mechanical or potential energy may be negative. Energy curves use the same physical units and scale, without normalization. For other variables with different units, the legend preserves each unit and the Y heading indicates mixed units.

## Monitors attached to components

Choose **Readout monitor** in Builder and click a body, anchor, spring, bar, or force to attach a moving numeric label. Point masses start with x velocity, links with tension, and applied forces with force magnitude. In the component’s Properties, **On-canvas monitors** lets you choose any available component variable and press **Attach monitor**. You can attach multiple variables, change a monitor’s quantity or decimal precision, and remove individual labels.

Readouts follow a body’s center, a link’s midpoint (including rotating off-center bar pins), or a force’s attachment point. Drag a label to change its offset from the component. Labels remain upright and use screen-sized text for readability while zooming. Leader lines identify the component, and labels stay within the visible canvas where possible.

Attaching or repositioning labels preserves the current recording and playback. Labels display the selected replay frame’s values, including recorded bar reactions. They are saved with experiment files; old files load without them. Deleting a component also removes its monitors, including labels attached to links or forces removed with that body. Bar tension at time zero reads zero until a reaction has been measured by running or stepping.

## Applied forces and link measurements

Choose **Applied force**, then click a point mass or solid. The red arrow attaches at the center if you click near the center cross; elsewhere on a solid, it attaches at that body-local point. Edit force components in newtons and attachment coordinates in Properties, or drag the red arrowhead. The visual scale is 0.1 m per newton. With snapping enabled, force dragging uses 0.1 N and 5° increments. Zero or very short forces can be edited numerically.

By default, force direction stays fixed in world coordinates while the attachment moves with its body. Enable **Rotate direction with body** to make the force components body-local. Off-center forces produce torque about the center of mass. Forces are constant in time; switching and formulas are future work. Applied forces are saved with experiments, follow resize operations, and are deleted when their target body is deleted. External forces can add or remove mechanical energy.

Select a spring or bar on the canvas to show reaction readouts in Properties, or choose it as the inspector’s live readout source. Use **Add plot** to plot any reaction-force component, tension, moment, or impulse against time or any other quantity. **Load forces & reactions** demonstrates a 2 kg beam, a 4 N off-center load, and two supporting bars.

Measurement conventions:

- **Force on A** uses world components; endpoint B receives the opposite force. Signed axial force is positive in tension and negative in compression.
- **Moment A / B** means the torque exerted by that link force about each attached body’s center of mass. Ideal freely rotating pins transmit no independent bending couple. Center-attached springs therefore have zero endpoint moments.
- **Bar reaction force** is calculated from the bar solver’s accumulated impulses divided by the physics step duration. It includes dynamic and collision transients. Impulses and angular impulses are measured over the last base physics step (normally 1/240 s), rather than cumulatively or over the 1/60 s recording interval. At time zero no dynamic bar reaction has been measured yet.
- **Spring force** includes Hooke’s-law force and axial damping. Its displayed impulse is an instantaneous-force estimate multiplied by the base physics step duration.
- **Link momentum is zero:** springs and bars are ideal massless links. Their impulses describe transferred momentum, not stored momentum. Body linear momentum and angular momentum about the center of mass are available in readouts, plot axis choices, and body CSV exports.

Reaction values follow recorded replay. Link CSV exports contain force, tension, moments, impulses, and the zero link-momentum quantities; body exports include linear and angular momentum. All measured quantities can be chosen independently for each plot’s X or Y axis, including time. Redundant constraints may have non-unique individual reactions; avoid using this simulator as a structural design solver.

## Rigid bars

Choose **Rigid bar** in Builder, then click two different bodies or anchors. The bar starts at the distance between the chosen attachment points. Point masses and anchors attach at their centers. On a solid, click its center cross for a central pin, or elsewhere on the body for an off-center pin that can transmit torque.

Bars are ideal massless, fixed-length rods with freely rotating pins, except at fixed point supports where their direction is clamped. They connect bodies without a spring’s stretching or damping. Select a bar to change its length or its attachment coordinates relative to each body’s center and orientation. Before a run, inconsistent initial positions are assembled to match the stored lengths, without adding a velocity kick. The corrected positions become the run’s reset state; the source JSON file remains unchanged unless you save again. When a solid is resized, its bar attachment points scale with it.

Connected solids do not collide with each other by default; enable **Collide connected solids** on the bar to change that. They continue to collide with other solids. Bars themselves have no collision volume or mass. Save/load, duplicate, undo/redo, and deletion work with bars; deleting a body also deletes its attached bars. Old files load with no bars.

Use **Load bar pendulum** for a ready-made example. The constraint solver solves coupled bar constraints together, with extra substeps. It targets a position error below 0.00000000001 m and checks every substep; if bar error exceeds 0.000001 m, playback pauses and restores the last recorded frame instead of displaying stretched bars. Conflicting lengths, fully immovable endpoints at the wrong separation, and incompatible slider constraints must be corrected before running. Smooth constrained motion uses RATTLE-style integration to avoid the systematic damping caused by geometric projection alone. Finite-step errors remain; inelastic collisions, spring damping, and friction dissipate energy intentionally.

## Collisions

Solid bodies collide automatically with circles and polygonal bodies, including concave polygons. Point masses and support markers do not collide. Load the **collision example** in Builder to try a disk and box above a floor.

Select a solid and configure:

- **Restitution:** 0 for an inelastic normal impact, 1 for an elastic normal impact. A pair uses the lower of its two coefficients. Restitution applies at low speeds too; elastic impacts have no artificial low-speed bounce cutoff. Set friction to zero as well for an energy-conserving impact.
- **Friction:** nonnegative Coulomb coefficient (0–2). A pair uses the geometric mean of the coefficients. Friction can change both tangential velocity and rotation.
- **Fixed body:** keeps a solid stationary as a floor, wall, or obstacle. Its initial velocities are set to zero; uncheck it to make the body dynamic again.

Collision impulses include angular response and respect linear constraints. Concave polygons are decomposed into convex pieces. The solver uses iterative contact impulses. Frictionless elastic contact sets reflect approaching velocities while preserving kinetic energy, including rotational and bar-constrained motion; contacts made approaching by an earlier impulse are resolved in subsequent reflection passes. Newly reached elastic impacts are located by rolling back and subdividing the time step, targeting penetration below 1e-8 m with at most 24 refinement levels. Elastic contacts do not receive position pushes that would change spring or gravitational potential energy. Inelastic or frictional contacts retain overlap correction. Up to 32 initial adaptive substeps per physics timestep reduce tunneling; extremely fast motion, very thin shapes, deep initial overlap, and dense stacks remain approximate. Create bodies without overlap for the most reliable results. Restitution, friction, and fixed state are saved with experiments. Older files default to restitution 0.8, friction 0.3, and dynamic bodies.

## Physics model and limits

- SI units; positive y points upward. Gravity acts downward.
- Point masses, uniform rigid bodies, pinned and fixed supports, massless Hooke's-law springs, and ideal straight-line constraints.
- Velocity Verlet / RATTLE integration with symmetric exact pairwise damping half-steps and collision impulses at a base 1/240-second timestep, with adaptive collision subdivisions; measurements recorded at 60 Hz. Playback speed does not change the numerical timestep.
- Line constraints project position and velocity onto the permitted line. Adding a constraint removes perpendicular velocity.
- Editing restores initial conditions and clears recordings. Moving a constrained mass also moves its constraint line; numerical position fields instead project onto the existing line.
- Distance monitors measure from the world origin. The energy readout and CSV energy column refer to the complete system.
- Spring damping dissipates mechanical energy; this energy is not tracked as heat. Damping acts along each spring, rather than as ambient air resistance.
- The fixed timestep is unsuitable for arbitrarily stiff springs or very small masses. Reduce stiffness or increase mass if motion becomes unstable. Numerical energy is approximate.
- Point masses have no angular motion or collision geometry. Applied forces, strings and fixed/movable pulleys are implemented. Gears, motors, mathematical expressions and visual programming remain future work.
- JSON imports are validated and limited to 200 bodies, 400 each of springs/bars/strings/applied forces, and 2 MB.

## Solver precision

Expand **Solver & energy** in Properties for the current mechanical energy, its change from the initial recorded state, and the largest bar-length/string-extension error. Slack strings contribute zero extension error. Values follow replay. This panel also identifies configured mechanisms that can change mechanical energy; it does not measure dissipated heat or external work. The link metric measures length only, not every support/angle constraint. The panel is collapsed by default to preserve screen space.

Constrained drift uses a RATTLE/SHAKE update: position corrections act along the beginning-of-step constraint Jacobian, followed by velocity constraints at the new configuration. This follows the velocity-Verlet constraint formulation described in the [LAMMPS RATTLE documentation](https://docs.lammps.org/fix_shake.html) and [GROMACS constraint-algorithm reference](https://manual.gromacs.org/current/reference-manual/algorithms/constraint-algorithms.html). Using the new geometry for both projections had introduced systematic energy loss even while preserving bar length.

Choose **Solver precision** in Builder → Experiment. **Standard** retains the existing solver; **High** halves its internal timestep and **Very high** quarters it. These settings refine collision-adaptive subdivisions as well as free and constrained motion. They cost roughly two or four times as much integration work, with additional cost for difficult contacts. They do not guarantee accuracy for arbitrarily stiff systems. Changing precision restores initial conditions, clears the recording, and can be undone. Precision saves with the experiment; older files use Standard. All settings keep the base 1/240 s measurement interval, 60 Hz recording and 120 s recording limit. Playback speed remains independent of accuracy.

Mechanical energy change alone is not a numerical-error estimate. Friction, spring damping and inelastic impacts dissipate energy, while applied forces can do work. Compare conservative experiments at successively finer precision to assess integration error; no energy correction is applied.

The solver uses 64-bit arithmetic, a 1e-11 m constraint target, coupled constraint solves, and eight subdivisions of each 1/240 s base step when bars or strings are present at Standard precision. Difficult nonlinear steps are rolled back and retried at smaller timesteps, including rollback of reaction-impulse measurements. Energy is not artificially restored or velocities rescaled to match an energy target. Initial assembly remains separate from time integration.

`node tests/energy.cjs` checks long-run energy error, bar lengths, and time reversal. Representative maximum errors, normalized by available swing energy (rather than the arbitrary zero of gravitational potential), are:

| Conservative experiment | Duration | Maximum relative energy error |
|---|---:|---:|
| Standard bar pendulum | 120 s | 0.000037% |
| Double pendulum | 30 s | 0.000028% |
| Off-center rigid pendulum | 30 s | 0.000012% |
| User’s triangular pendulum | 30 s | 0.000046% |

The earlier standard-pendulum solver lost approximately 8.9% of its swing energy in 60 s. These benchmarks exclude dissipative settings: spring damping, friction, and restitution below one still remove energy. Finite impact-time refinement and extreme or incompatible mechanisms have additional numerical limits. Inelastic/frictional contact overlap correction can also change potential energy.

## Bridge example

Choose **Examples → Load monitored bridge** (**Ejemplos → Cargar puente con monitores**), or open `examples/bridge-monitored.json`, and run or step to see 15 moving readouts: Rx, Ry, and torque for the left pin and right roller support (free in x, restrained in y), and signed tension for all nine bars. Positive bar values indicate tension; negative values indicate compression. Duplicate bar names in the source example were made unique. Geometry, masses, lengths, and loading are preserved.

The support reaction is the **force exerted by the support on the structure**, including the supported node’s own weight. It is measured from momentum change minus the impulses of gravity, applied forces, links, springs, and contacts. Fixed-support torque is the balancing moment about its center; ideal point pins and freely rotating slider nodes carry no reaction couple. Fixed point supports clamp attached bars and include the clamping couples in their reaction torque. Support measurements are recorded for replay and available as plot axes and attached readouts.

For this bridge the expected vertical reactions are 29.62 N at the left pin and 39.43 N at the right roller, with zero horizontal force and support torque. Run `node tests/bridge.cjs` to verify the reactions, overall force/moment balance, and monitor definitions. `node tests/bridge-preset.cjs` verifies the offline menu example matches the JSON file, retains the roller and all 15 monitors through reset/replay/undo, and loads correctly in Spanish.

## Verification

Run **`node tests/run.cjs`** for the complete dependency-free suite. See [test coverage](tests/README.md) and the [manual browser qualification checklist](BROWSER_QA.md). Real-browser and device qualification is pending; Node workflow tests use DOM/canvas stubs.

`tests/languages.cjs` checks Spanish defaults, both flag choices, remembered preferences and blocked-storage fallback, static labels/tooltips, plot and readout translation, user text preservation, errors, and unchanged running/recorded experiment state during switching.

`tests/touch-selection.cjs` checks modifier-free group selection, touch taps/boxes, cancellation, group movement/copy/paste/undo, explicit panning and recording preservation. `tests/diagnostics.cjs` checks energy changes during replay, physical-loss/work explanations, link-length residuals and read-only rendering.

`tests/workflows.cjs` checks offline packaging, icon definitions/accessibility labels, snapping, Save As initial conditions, failed-import atomicity and repeatable reset for every example. `tests/precision.cjs` checks analytical convergence, precision persistence/validation, undo/reset, the recording clock and measured pulley tension across settings.

Run `node tests/energy.cjs` for long-run single/double/rigid pendulum energy, constraint-length precision, the supplied triangular pendulum, and time reversibility.

`node tests/solids.cjs` also checks attached-monitor creation, variable values and units, moving anchors, dragging offsets without clearing recordings, replay, save/load, deletion cascades, and malformed configuration rejection.

Run `node tests/forces.cjs` for constant-force acceleration, applied torque, follower forces, spring equilibrium, support reactions and moments, centripetal force, impulses, momentum definitions, and reaction replay. Force editing and file compatibility are covered by `tests/solids.cjs`.

Run `node tests/plots.cjs` for plot quantities, system energy components, and axis defaults. `tests/solids.cjs` also checks multi-line controls, legends/colors, energy comparisons, visibility/removal, CSV columns, save/load, and single-line migration. Plot sampling, independent X/Y selectors, time on either axis, rendering, fixed screen positions, drag/resize, minimize/close, save/load, reset, and deleted-source fallback are covered by `tests/solids.cjs`.

Run `node tests/bars.cjs` for bar pendulum period/length, connected masses, momentum, chains, off-center torque, constrained motion, and anchor endpoints. Bar editor and file-handling checks are included in `tests/solids.cjs`.

Run `node tests/collisions.cjs` for elastic/inelastic impacts, unequal masses, energy and momentum, angular response, friction, fixed floors, resting contacts, concave shapes, constrained motion, and fast-object substeps.

Run `node tests/solids.cjs` for solid geometry, creation, resize/rotation gestures, serialization, and rotational replay checks. These gesture checks use a headless DOM/canvas stub; they do not replace visual browser QA.

Run `node tests/physics.cjs` to check the analytical oscillator period, bounded energy error, free fall, vertical equilibrium, line constraints, momentum conservation, coincident endpoints, import validation, analytical damped motion, axial drag, damping energy dissipation, and damping file round-tripping.

The initial browser check covered the app preview, stepping, simulation graphs, constraint creation, JSON save/reload, and the layout at laptop and mobile viewport sizes. Physical mobile devices and a full browser compatibility matrix have not yet been tested.

### Support types

The builder’s former **Fixed anchor** tool is now **Pinned support**. Click empty space to place a pin, or click an existing point mass or solid to restrain its center. Use **Roller support · X** or **Roller support · Y** on an existing mass or solid. Use **Fixed support** on a body, or click empty space to place a fixed attachment marker. You can also change or remove a body’s support in Properties.

- **Pinned support:** restrains x and y; permits rigid-body rotation.
- **Roller support · X:** allows translation along x, restrains y, and permits rotation.
- **Roller support · Y:** allows translation along y, restrains x, and permits rotation.
- **Fixed support:** restrains translation and rotation.

Supports act at the body’s center. Each has a distinct ground symbol. Existing anchor files remain compatible. Support force components and fixed-support reaction torque are available to monitors and plots. A fixed point support (standalone marker or point mass) clamps every attached bar in its edited direction and supplies a reaction couple. A fixed support on a solid locks the solid’s position and rotation; bar attachments on that solid remain ideal pins.

Run `node tests/supports.cjs` to check support restraints, free rotation, reaction force/torque balance, and interaction with off-center bar attachments. Editor and save/load checks are in `tests/solids.cjs`.

### Selecting, copying, and pasting components

In **Select & move**, drag a box from empty desktop canvas to select bodies by their centers, links by their midpoints, and forces by their arrow tips. Shift-click toggles one component; Shift-drag adds a box to the selection. Drag a selected body to move the group, including its support and constraint origins. Delete removes the selection and any dependent links, forces, and readouts. Escape clears the selection. Selecting alone preserves the recording.

Use the **Copy** and **Paste** buttons above the canvas, or Ctrl/Cmd+C and Ctrl/Cmd+V. The app keeps its own offline component clipboard for the current page session. It also survives opening another experiment in the same page. Copies use initial conditions, include links between copied bodies, applied forces and attached readouts, and get fresh IDs on paste. Copying a link includes its two endpoint bodies; copying a force includes its target body. Paste offsets each new group so it can be distinguished from the original. Copying does not change the recording; pasting or moving objects resets the experiment as other physical edits do. Paste and group moves/deletions can be undone. Plot windows remain independent of component selection.

Run `node tests/solids.cjs` for selection, group dragging/deletion, offline clipboard and keyboard controls, dependency/readout remapping, support origins, unique IDs, save/load, undo/redo, and touch panning.

### Pinned versus fixed: same beam, same load

Choose **Load pinned vs fixed** in Builder, or open `examples/pinned-vs-fixed.json`. Both beams have mass 2 kg, length 2 m, thickness 0.2 m, zero initial velocity, a center support, and a 2 N downward force attached 1 m to the right of the center. Gravity is on. The applied force keeps pointing downward as the beam rotates. Only the support condition differs; the beams are separated horizontally so they cannot collide.

Press **Run** or **Step**. The left, pinned beam rotates clockwise with zero support reaction couple. The right, fixed beam remains horizontal and its support supplies a counterclockwise reaction torque of +2 N·m. Both centers remain at rest, and both vertical reactions are 21.62 N (weight plus applied load). The beam’s moment of inertia is 0.673333 kg·m², so the pinned beam initially accelerates at −2.970297 rad/s². Attached readouts show rotation, support torque, and vertical reaction; reactions are measured after the first step. This compares ideal rigid-body rotation and equilibrium, without beam bending.

For graphs, press **Add plot** and choose **Pinned beam · rotation** for Y. Add a second line for **Fixed beam · rotation**, using time for X. A second plot can compare the two support torques. Reset repeats the comparison from identical initial conditions.

Run `node tests/support-example.cjs` to verify identical physical parameters, initial angular acceleration, stationary centers, fixed-support force/torque balance, and all six readouts.

### Bridge with one fixed support

Open `examples/bridge-fixed-left.json` for the monitored bridge with its right end free and its left support fixed. It uses the same masses, bars and loads as `bridge-monitored.json`. To build it yourself, remove the right roller support (set Support to None) and change the left support to **Fixed support**. The fixed point support now restrains both attached bars’ directions, making this triangulated bridge a cantilever. A pinned left support leaves the entire bridge free to rotate when the right support is removed.

For this loading the fixed support reaction is **69.05 N upward** and **236.58 N·m counterclockwise**, with zero horizontal force. The support-torque readout includes the bar clamping couples. Individual bars’ axial tensions are still available; their force vectors can also contain shear at clamped ends. Reaction moments are moments on the attached body about its center. This remains an ideal rigid-member model without elastic beam bending. Removing the fixed support releases the clamped directions. Reference directions persist in saved experiments, are updated when editing the geometry, and follow copy/paste. Removing a support or constraint also removes its now-unavailable support readouts, keeping the edited experiment reloadable.

Run `node tests/bridge-fixed.cjs` for the original falling case, the five-second stationary cantilever, reaction force/moment balance, monitored torque, save/load and clamp release. The same editing sequence and replay are covered in `tests/solids.cjs`.

### Nine-circle spring lattice

Choose **Load 3 × 3 spring lattice** in Builder, or open `examples/spring-lattice-3x3.json`. Nine identical 1 kg disks of radius 0.25 m start on a square grid with 1.5 m spacing. Six horizontal and six vertical springs connect nearest neighbors. Each spring has stiffness 12 N/m, natural length 1.5 m, and zero damping. Gravity is off and all circles are free to move in 2D.

The upper-left circle starts with velocity **(0.5, −0.35) m/s**; all others start at rest. Press **Run** to see the disturbance propagate. Attached readouts compare the kicked circle’s speed with the center circle’s speed. Reset restores the grid and initial kick. The free lattice also drifts at its center-of-mass velocity, **(0.05556, −0.03889) m/s**, because the initial kick gives it net momentum. Use Fit or pan to follow it. For a graph, add a plot of Circle 1’s x velocity against time and add a second line for Circle 5’s x velocity.

`node tests/lattice.cjs` verifies the grid, spring connections, initial kick, motion reaching the center, energy conservation, momentum, center-of-mass drift, readouts and file validation. The preset, drawing, recording and reset are covered in `tests/solids.cjs`.

### Elastic-collision energy checks

Elastic, frictionless impacts now preserve rebound energy even below 0.5 m/s. Impact impulses use the effective mass of the permitted mechanism motion when bars or sliders are present; energy is not discarded by projecting an unconstrained rebound afterward. Multiple elastic contacts resolve approaching contact sets without forcing initially separating contacts toward a zero rebound speed. Elastic overlap handling refines impact timing instead of changing positions after the impulse. No global energy restoration or velocity rescaling is used.

`node tests/elastic-collisions.cjs` checks speeds down to 0.00001 m/s, unequal and oblique impacts, linear/angular momentum, simultaneous contacts, box contact manifolds, spring potential energy, and bar-connected impacts. It also runs the nine-circle lattice for the full 120-second recording. The previous collision handling lost **47.71%** of mechanical energy in that example; the corrected solver's final change is about **+0.0046%**, with a maximum absolute relative error below **0.01%**. This remaining finite-step error is not physical damping. Restitution below one, friction, spring damping, and work by external forces can still change mechanical energy as intended.

### Strings and pulleys

The builder has two new icon tools, with hover tooltips:

1. **Fixed pulley:** click to place a fixed, massless, frictionless wheel. Edit its center position and radius in Properties. **Movable pulley** places a translating axle/load, or converts an existing point mass; its radius, mass and initial velocity are editable.
2. **String:** click a mass, rigid body or support for the first endpoint, click zero or more pulleys in routing order, then click a different endpoint. To attach to a pulley’s axle instead of wrapping the rim, Alt-click it, or use **Start/Finish string at axle** in Properties (also available on touch screens). Without a pulley, the string connects its endpoints directly. Escape cancels an unfinished route. On solids, click away from the center to use a local attachment that can transmit torque.

A string is massless and inextensible. Its initial length equals its routed length, including straight tangent strands and arcs around the finite pulley rims. Edit **String length** to introduce slack or change the length limit. Strings pull when taut and never push; slack strings have zero tension and are drawn dashed with a sag. Each pulley’s wrap can be clockwise or counterclockwise; changing a wrap direction resets the string length to the new route. Up to eight distinct pulleys can route each string, and multiple strings can share an axle.

All spans of an ideal string share the same tension. A pulley changes the force direction: the forces at the two endpoints need not be opposite vectors. Axle readouts show the balancing support force from every string routed over that wheel, with zero reaction couple for the frictionless axle. Local string attachments generate moments on rigid bodies. Strings and bars participate in the same coupled constraint solve. While a string remains taut, the solver uses the constrained integrator to limit energy drift; when a slack string snaps taut, incompatible outward velocity is removed by an inelastic capture impulse. No elastic rebound or stretch is assigned to this ideal string. Pulley axes can be fixed or movable; the rim remains massless and frictionless, without rotational inertia. The movable assembly’s mass represents its translating axle, housing and attached load. Strings and pulley markers do not have collision geometry. Keep endpoints outside pulley rims and routed wheels separated.

String tension, force on each endpoint, endpoint moments, routed length, and slack length are available as plot variables and attached readouts. Measurements record and replay with the experiment. Copy/paste carries the endpoint bodies and routed pulleys, with fresh references; deleting a pulley or endpoint also removes its dependent strings and readouts. Existing experiment files remain compatible.

Choose **Examples → Load pulley oscillator**, or open `examples/pulley-oscillator.json`. Two 1 kg circles hang on a string over a 0.5 m radius pulley, with vertical guides. A 4 N/m spring below the left mass provides the restoring force. Both masses start with equal, opposite velocities of 0.5 m/s. Gravity supplies baseline tension; the spring produces equal and opposite oscillations with period **2π√(2/4) ≈ 4.443 s**. The attached readouts compare velocities, tension and axle reaction.

`node tests/strings.cjs` checks the finite-radius geometry, the analytical Atwood acceleration/tension, axle reactions, slack/capture/release, pendulum and oscillator energy, multiple pulleys, coupled strings/bars, off-center torque, measurements and file validation. Builder tools, route creation, drawing, properties, copy/paste, deletion/undo, the example and replay are covered in `tests/solids.cjs`.

### Movable pulleys and Atwood machines

A **Movable pulley** has a translating axle and load. Its **Axle + load mass** includes the housing/load mass; the rim is ideal, massless and frictionless, so both strands retain equal tension. The axle feels the vector sum of the strand forces. It can move freely in 2D, follow a linear guide, or connect to strings, springs and bars at its center. Properties can switch between **Fixed** and **Movable** axle motion. Fixing an existing assembly pins its axle while retaining its mass and applied forces. A fixed massless marker gets a 1 kg load when made movable. Change the mass to match the intended system. For an underhung movable pulley, select the string’s **Counterclockwise** wrap direction on that wheel.

Two new Examples are included:

| Example | Setup | Acceleration before the stop | String tension |
|---|---|---|---|
| **Load Atwood machine** (`examples/atwood-machine.json`) | 1 kg and 2 kg, one fixed pulley | Light: +3.27 m/s²; heavy: −3.27 m/s² | 13.08 N |
| **Load movable-pulley Atwood** (`examples/atwood-movable-pulley.json`) | 3 kg movable assembly, 1 kg free end, one fixed guide | Assembly: −1.40143 m/s²; free end: +2.80286 m/s² | 12.61286 N |

Positive y points upward. The classical result is `a = (m_heavy − m_light) g / (m_heavy + m_light)`. In the movable example, the free end moves twice as far and in the opposite direction to the axle: `a_free = −2 a_axle`. With assembly mass M and free mass m, `a_axle = (2m − M) g / (M + 4m)`. The fixed guide axle reaction is upward with magnitude twice the tension in both examples. Vertical guides keep the strands parallel for comparison with these formulas.

Press **Step** or **Run** to populate the acceleration and tension readouts. Each example has an inelastic travel stop to prevent the rising circle reaching the guide; the formulas apply before contact. The stop intentionally removes kinetic energy when it engages. Reset repeats the experiment. The stop’s contact impulse can produce an acceleration spike during that recorded interval.

Acceleration x/y variables are measured from the velocity change over the last physics step, including constraint/contact impulses. They are recorded alongside position and velocity, are selectable as plot axes or attached readouts, and are included in body CSV exports. The string solver includes moving-guide gradients in the same coupled system as its endpoint bodies, including multiple moving pulleys and ropes attached to their axles.

`node tests/movable-pulleys.cjs` checks both analytical examples, the 2:1 displacement/velocity ratio, tension and axle loads, finite-radius guide gradients, travel-stop stability, axle-to-string connections, free 2D momentum and energy, multiple moving guides, and serialization. `tests/solids.cjs` checks the new icon tool, point-mass conversion, axle mode changes, axle attachment controls, both example files, recorded acceleration/replay and copy/paste.
