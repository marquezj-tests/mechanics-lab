# Mechanics Lab

A self-contained, offline 2D mechanics laboratory for introductory college physics.

[Open Mechanics Lab online](https://marquezj-tests.github.io/mechanics-lab/). To work offline, download `index.html` and open it in your browser.

Open `index.html` directly in a modern browser. No installation, build step, server, or internet access is required. The same file adapts to laptop and mobile screens.

## Example library

All **23 menu presets** have matching downloadable JSON initial-condition files in `examples/`. The [example review](EXAMPLES_REVIEW.md) lists every lesson, its current features and suggested plots. The oldest spring–mass, bar-pendulum, applied-force and collision examples now include moving measurements. Solid examples explicitly declare static/kinetic friction; support markers explicitly declare their support kind. Elastic and undamped cases retain zero friction/damping.

**Fixed-support bridge** exposes the cantilever comparison alongside the pinned/roller bridge. **Polygon collisions** demonstrates a triangle and a concave polygon in a frictionless elastic enclosure. Ordinary collision and static/kinetic friction examples remain separate dissipative lessons. Most plots remain optional through **Add plot**; the sweep deliberately opens its two comparison plots.

`ExampleCatalog` in `index.html` is the authoritative mapping between menu buttons, scene factories and downloadable files. After changing a preset, regenerate its files with `node scripts/export-examples.cjs`. `node tests/examples-catalog.cjs` checks every mapping and menu handler, modern materials/supports, monitor availability, and eight seconds of actual simulation per example. Legacy-file migration is tested with deliberately legacy inputs rather than using current presets as old-format fixtures.

## Interface language

Spanish (Argentina) is the default. Use **🇦🇷 Español / 🇬🇧 English** at the upper right to switch languages. The choice is remembered when browser local storage is available; blocked storage still allows switching for the current session. Both languages work offline in the same HTML file. Switching preserves the running experiment, recording, selection, plots and initial conditions. Custom object names and monitor captions remain as entered; new objects and example names use the language selected when they are created. Physics variable IDs, SI units, saved JSON and numeric CSV values remain unchanged. Plot CSV display headers use the selected language.

## First experiment

The startup scene is an **inverted double pendulum**: two 1 kg point masses on two massless 1 m bars, under gravity. The bars start 8° and −6° from the upward vertical, with zero initial velocity and High solver precision. This slight perturbation lets the unstable inverted system fall instead of remaining perfectly balanced. **Load examples → Inverted double pendulum** restores it; the spring–mass example remains in the menu. Moving readouts now show the lower mass speed and upper bar tension. Its standalone file is `examples/inverted-double-pendulum.json`.

1. Press **Run** to simulate the example. **Pause**, **Step**, and **Reset** control playback.
2. Drag the timeline to inspect an earlier recorded state. **Replay** advances through the recording, then continues at its end. Recordings stop at the configured **Simulation limit (s)** (120 seconds by default; adjustable from 1 to 600 seconds next to the playback controls).
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

- The center cross marks its uniform-density center of mass. Choose Spring and click the cross for a center attachment, or another point on the solid for an off-center attachment.
- Drag a square at a corner to resize about the center. Rectangles resize along their local axes; circles change radius; triangles and free polygons scale uniformly.
- Drag an outer circular control to rotate about the center. Rotation snaps to 5° when snapping is on.
- Drag the body to move it. Edit mass, initial rotation, and initial angular velocity in Properties. Rectangle dimensions and circle radius also have numerical inputs.

Solids participate in the same spring and gravity simulation as point masses. Orientation is recorded for replay; angular readouts and CSV columns use the body’s rotation and angular velocity. Shapes, dimensions, and angular initial conditions are saved in JSON files. Center attachments exert no spring torque. Off-center springs, dampers, applied forces and collisions can change angular velocity.

## Springs and dampers on rigid bodies

Choose **Spring** and select two bodies or supports. On a solid, click near its center cross for a central connection or elsewhere on its surface for a local attachment. Point masses and support markers attach only at their centers. A new spring's natural length is the distance between its chosen attachment points. Selected/off-center attachments are shown as small pins; clicking the drawn spring selects it at its actual location.

Properties provides **Attachment A/B x/y (m)** in each body's local coordinates. The attachments rotate with the body and scale when it is resized. Both elastic force and axial damping act along the line between those points and produce torque `r × F` about each center of mass. Damping uses attachment-point velocities, including `ω × r`. Its split impulse update accounts for rotational inertia, linear restraints, and coupled bar/string constraints; a string can release when the damper pulls inward. Internal spring/damper forces conserve total linear and angular momentum in an isolated system; damping removes mechanical energy.

**Load examples → Off-center spring oscillator** (**Cargar ejemplos → Oscilador con resorte excéntrico**) loads a pinned beam and a spring attached at its right end. The beam starts rotated 25°; the undamped spring drives angular oscillation. Readouts show the beam angle and spring moment on the beam. Add damping in the spring properties to see rotational decay. The standalone scene is `examples/off-center-spring.json`.

Spring length, extension, force, endpoint moments and angular impulse estimates use the actual rotating attachment geometry during simulation and replay. Moving readouts follow the attachment midpoint. Copy/paste, duplicate, undo, resizing, Save As and JSON reload retain local attachments. Existing version-1 files without attachment coordinates remain center-connected.

## Optional fixed plots

Plots are presentation panels stored separately from physical bodies. Gravity, forces, collisions, camera zoom/pan, and component motion do not move them. Adding, moving, resizing, changing axes, or closing a plot preserves the current recording. Multiple plots can use different bodies, links, or supports at once. Up to 12 windows can be open. Missing/deleted variable sources fall back to time. Each plot supports up to eight lines on a common scale. Line controls choose its Y variable and color, toggle visibility, or remove it; the final line cannot be removed without closing the plot. The legend identifies all curves and units. Hidden lines do not affect autoscaling but remain in CSV exports. Adding or editing lines preserves the recording and saves with the experiment; older single-line plots migrate automatically. Per-plot CSV exports include sample time, the shared X value, and every configured Y line with labeled units.

To compare energies, set X to **Time (s)** and the first Y to **Mechanical energy (J)**. Press **＋ Line**; the next line defaults to **Kinetic energy (system) (J)** when it is not already present. Add **Potential energy (system) (J)** if desired. Mechanical energy includes translational and rotational kinetic energy, gravitational potential energy, and spring elastic energy; potential energy is mechanical minus kinetic energy. The zero of gravitational potential is y = 0, so mechanical or potential energy may be negative. Energy curves use the same physical units and scale, without normalization. For other variables with different units, the legend preserves each unit and the Y heading indicates mixed units.

## Monitors attached to components

Choose **Readout monitor** in Builder and click a body, anchor, spring, bar, or force to attach a moving numeric label. Point masses start with x velocity, links with tension, and applied forces with force magnitude. In the component’s Properties, **On-canvas monitors** lets you choose any available component variable and press **Attach monitor**. You can attach multiple variables, change a monitor’s quantity or decimal precision, and remove individual labels.

Readouts follow a body’s center, a link’s midpoint (including rotating off-center spring and bar attachments), or a force’s attachment point. Drag a label to change its offset from the component. Labels remain upright and use screen-sized text for readability while zooming. Leader lines identify the component, and labels stay within the visible canvas where possible.

Attaching or repositioning labels preserves the current recording and playback. Labels display the selected replay frame’s values, including recorded bar reactions. They are saved with experiment files; old files load without them. Deleting a component also removes its monitors, including labels attached to links or forces removed with that body. Bar tension at time zero reads zero until a reaction has been measured by running or stepping.

## Applied forces and link measurements

Choose **Applied force**, then click a point mass or solid. The red arrow attaches at the center if you click near the center cross; elsewhere on a solid, it attaches at that body-local point. Edit force components in newtons and attachment coordinates in Properties, or drag the red arrowhead. The visual scale is 0.1 m per newton. With snapping enabled, force dragging uses 0.1 N and 5° increments. Zero or very short forces can be edited numerically.

By default, force direction stays fixed in world coordinates while the attachment moves with its body. Enable **Rotate direction with body** to make the force components body-local. Off-center forces produce torque about the center of mass. Forces are constant in time; switching and formulas are future work. Applied forces are saved with experiments, follow resize operations, and are deleted when their target body is deleted. External forces can add or remove mechanical energy.

Select a spring or bar on the canvas to show reaction readouts in Properties, or choose it as the inspector’s live readout source. Use **Add plot** to plot any reaction-force component, tension, moment, or impulse against time or any other quantity. **Forces & reactions** demonstrates a 2 kg beam, a 4 N off-center load, and two supporting bars.

Measurement conventions:

- **Force on A** uses world components; endpoint B receives the opposite force. Signed axial force is positive in tension and negative in compression.
- **Moment A / B** means the total torque exerted by the link about each attached body’s center of mass, including any reaction couple. Ideal freely rotating pins transmit no independent bending couple. Center-attached springs therefore have zero endpoint moments.
- **Bar reaction force** is calculated from the bar solver’s accumulated impulses divided by the physics step duration. It includes dynamic and collision transients. Impulses and angular impulses are measured over the last base physics step (normally 1/240 s), rather than cumulatively or over the 1/60 s recording interval. At time zero no dynamic bar reaction has been measured yet.
- **Spring force** includes Hooke’s-law force and axial damping. Its displayed impulse is an instantaneous-force estimate multiplied by the base physics step duration.
- **Link momentum is zero:** springs and bars are ideal massless links. Their impulses describe transferred momentum, not stored momentum. Body linear momentum and angular momentum about the center of mass are available in readouts, plot axis choices, and body CSV exports.

Reaction values follow recorded replay. Link CSV exports contain force, tension, moments, impulses, and the zero link-momentum quantities; body exports include linear and angular momentum. All measured quantities can be chosen independently for each plot’s X or Y axis, including time. Redundant constraints may have non-unique individual reactions; avoid using this simulator as a structural design solver.

## Rigid bars

Choose **Rigid bar** in Builder, then click two different bodies or anchors. The bar starts at the distance between the chosen attachment points. Point masses and anchors attach at their centers. On a solid, click its center cross for a central pin, or elsewhere on the body for an off-center pin that can transmit torque.

Bars are ideal massless, fixed-length rods with freely rotating pins, except at fixed point supports where their direction is clamped. They connect bodies without a spring’s stretching or damping. Select a bar to change its length or its attachment coordinates relative to each body’s center and orientation. Before a run, inconsistent initial positions are assembled to match the stored lengths, without adding a velocity kick. The corrected positions become the run’s reset state; the source JSON file remains unchanged unless you save again. When a solid is resized, its bar attachment points scale with it.

Connected solids do not collide with each other by default; enable **Collide connected solids** on the bar to change that. They continue to collide with other solids. Bars themselves have no collision volume or mass. Save/load, duplicate, undo/redo, and deletion work with bars; deleting a body also deletes its attached bars. Old files load with no bars.

Use **Bar pendulum** for a ready-made example. The constraint solver solves coupled bar constraints together, with extra substeps. It targets a position error below 0.00000000001 m and checks every substep; if bar error exceeds 0.000001 m, playback pauses and restores the last recorded frame instead of displaying stretched bars. Conflicting lengths, fully immovable endpoints at the wrong separation, and incompatible slider constraints must be corrected before running. Smooth constrained motion uses RATTLE-style integration to avoid the systematic damping caused by geometric projection alone. Finite-step errors remain; inelastic collisions, spring damping, and friction dissipate energy intentionally.

## Collisions

Solid bodies collide automatically with circles and polygonal bodies, including concave polygons. Point masses and support markers do not collide. Load the **collision example** in Builder to try a disk and box above a floor.

Select a solid and configure:

- **Restitution:** 0 for an inelastic normal impact, 1 for an elastic normal impact. A pair uses the lower of its two coefficients. Restitution applies at low speeds too; elastic impacts have no artificial low-speed bounce cutoff. Set friction to zero as well for an energy-conserving impact.
- **Static friction μs / Kinetic friction μk:** coefficients from 0 to 2, with μk ≤ μs. Static friction can prevent relative contact slip; kinetic friction opposes sliding. Contacts use geometric means separately for each coefficient. Friction can change both tangential velocity and rotation. Editing either field adjusts the other if necessary to keep the pair ordered; setting static friction to zero makes both zero.
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
- Point masses have no angular motion or collision geometry. Applied forces, strings and fixed/movable pulleys are implemented. Ideal gear transmissions and torque-limited motors are implemented; formula inputs and calculated measurements are implemented; visual programming remains future work.
- JSON imports are validated and limited to 200 bodies, 400 each of springs/bars/strings/applied forces, and 2 MB.

## Formulas, parameters and calculated measurements

Open **Formulas and parameters** (**Fórmulas y parámetros**) in Builder to access every applied load and add named numeric parameters with optional unit labels. The load buttons open input formulas; **Parameters and calculations** returns to the shared draft. Names begin with an ASCII letter and contain letters, digits or underscores (maximum 24 characters); built-in names are reserved. Units are descriptive labels, with SI values expected; dimensional consistency is not checked automatically. Editing parameters resets the experiment after validation. Up to 30 parameters and 30 calculations are supported.

Select an applied force, torque or motor and choose **Edit input formulas** (**Editar fórmulas de entrada**). Expressions can replace force Fx/Fy, pure torque or motor target speed. Blank expressions retain the numeric values; active formulas take precedence over those fields. Formula-driven force arrows select the load for editing rather than changing its numeric fallback by dragging. Inputs may use `t` (simulation seconds), named parameters and their target body's `x`, `y`, `vx`, `vy`, `angle`, `omega`, and `mass`. Angle and angular velocity are in radians and rad/s. **Add variable reference** creates a named alias and a variable-selection menu for another body's state. Inputs cannot depend on reaction forces, accelerations, other loads or calculated measurements, preventing algebraic feedback loops. Expressions are evaluated at integration stages using simulation time, independently of playback speed; adaptive retries restore that clock. General velocity-dependent force formulas use explicit stage values and can require smaller timesteps, particularly with strong feedback; use the dedicated spring damping solver for stiff damping.

The bounded interpreter supports `+ - * / ^`, parentheses, `pi`, `e`, and `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2(y,x)`, `sqrt`, `abs`, `exp`, `log` (natural logarithm), `floor`, `ceil`, `min(a,b)`, `max(a,b)` and `clamp(value,min,max)`. Exponentiation is right-associative and binds more tightly than unary minus: `-2^2 = -4`. Decimal points and comma-separated function arguments are used in both interface languages. Expressions are limited to 256 characters, 128 tokens and 32 levels of parenthesis/function nesting; there is no JavaScript evaluation, property access, assignment or scripting. Results must be finite with absolute value at most 10¹²; applied force/torque inputs also obey their ±100000 limits, and motor speed its ±1000 rad/s limit. Guard potentially zero denominators or square-root domains explicitly with `max`/`clamp` when appropriate.

In the global editor, add a **Calculated measurement**, give it a name, expression and unit label, then add references using the variable menus. Calculations have access to `t`, parameters and any existing recorded physical variable, including system energy, body states, link/support reactions and motor work. They cannot reference other calculations. Choose **Follow component** to expose the calculation in that component's moving-readout list, or **Plots only**. Calculations are available on either plot axis and as additional lines; plot CSV includes them. Values are recorded per complete sample, and replay uses recorded data. Saved files preserve definitions and references, not runtime caches or recordings.

**Validate and apply** checks syntax, references, input limits and initial values before replacing the experiment. An invalid draft stays open with an error and leaves the current model intact. A later undefined result pauses the simulation and restores the last complete recorded sample. Deleting a referenced component removes dependent calculations/readouts or disables the affected input formula, retaining its numeric fallback; a toast explains the cleanup. Copy/paste includes referenced components and shared parameters, remaps aliases/readouts, and renames conflicting parameters so incoming expressions retain their values. Optional `parameters`, `calculations`, and load `expressions`/`bindings` fields extend version 1 JSON; old files retain their existing behavior.

Choose **Load examples → Formula-driven oscillator** (**Cargar ejemplos → Oscilador con fórmulas**) or open `examples/formula-driven-oscillator.json`. A 1 kg mass on a horizontal guide is connected to an undamped 4 N/m spring at its 2 m natural length. The force is `A*cos(2*pi*f*t)`, initially A = 1 N and f = 0.25 Hz. Moving readouts compare simulated x with `A/(K-M*(2*pi*f)^2)*(cos(2*pi*f*t)-cos(sqrt(K/M)*t))` and display their difference. Add these two displacement variables as lines on one plot to compare. The references K and M read the selected spring stiffness and body mass, so editing either physical property updates the comparison automatically. The expression assumes zero displacement from the chosen equilibrium, zero initial velocity and no damping, and excludes exact resonance; changing those assumptions requires a different analytical solution. Reset reproduces the experiment.

`node tests/formulas.cjs` checks mathematical precedence/functions, parser/resource bounds, code/property rejection, numerical domains, validation and dependency restrictions. `node tests/formula-physics.cjs` checks analytical driven-oscillator convergence, time-dependent forces/torques/motor targets, mechanical work, retry clock restoration and recorded input evaluation. `node tests/formulas-ui.cjs` covers atomic editing, calculated plots/readouts/CSV, clipboard renaming, deletion cleanup, runtime pause/replay and Spanish controls.

## Frequency sweep through resonance

Choose **Load examples → Resonance frequency sweep** (**Cargar ejemplos → Barrido de frecuencia y resonancia**) or open `examples/resonance-frequency-sweep.json`. This is a separate preset; the fixed-frequency oscillator and its analytical comparison remain available.

The 1 kg mass, 4 N/m spring and horizontal guide start at rest at the spring's natural length. Light axial damping is 0.08 N·s/m (damping ratio 0.02). A 0.12 N sinusoidal force sweeps linearly from 0 Hz to 0.60 Hz over 120 s; its formula then holds 0.60 Hz beyond the default recording window. Parameters `A`, `fStart`, `rate` and `duration` control the force amplitude, starting frequency, frequency rate (0.005 Hz/s) and sweep duration. The phase integrates the frequency: during the ramp, `2*pi*(fStart*t + rate*t^2/2)`; after the ramp it continues continuously at the final frequency. Using `sin(2*pi*f(t)*t)` would give the wrong sweep rate.

The undamped natural frequency is `sqrt(k/m)/(2*pi) ≈ 0.31831 Hz`; the excitation crosses it at **63.66 s**. Calculated readouts obtain actual mass and spring stiffness through variable references, so the natural frequency and crossing-time readout update if those properties are edited. Body mass and spring stiffness are now available as plot/formula variables. Keep a nonzero positive sweep rate and a frequency range containing the natural frequency when using the crossing-time calculation.

Two plots open with the preset: displacement against time, and excitation/natural frequencies against time. Moving readouts show both frequencies, and the support readout gives the expected crossing time. Use 2× playback to reach resonance sooner, or rewind the recorded run to compare the frequency crossing with the response growth. On narrow screens the frequency plot initially collapses to preserve space; expand or move/collapse either plot as needed. They remain fixed screen windows, independent of gravity.

This is a finite-rate transient sweep, not a steady-state frequency-response measurement: the largest displacement occurs after crossing the natural frequency because the response takes time to build. With the default settings, the response grows as it approaches resonance, reaches its largest amplitude after the 63.66 s crossing, then decreases as the excitation moves farther above resonance. These values depend on sweep rate, damping and initial conditions. Reset reproduces the sweep, and saved files retain the formulas, references, monitors and plot lines.

`node tests/frequency-sweep.cjs` verifies chirp phase/frequency continuity, physical natural-frequency references, crossing time, response growth/decay, default plots, recording/replay/reset/save, responsive placement and Spanish labels.

## Torque-limited speed motors

Choose **Motor** and click a solid. Set **Target speed (rad/s)** and **Maximum torque (N·m)** in Properties, or uncheck **Motor enabled**. Positive speed is counterclockwise. A zero target brakes toward rest; zero maximum torque or disabling releases the shaft. The default target is 1 rad/s with a 1 N·m limit. Motors apply a pure torque about the center with no resultant force. They reference the ground; their housing receives the opposite torque. Add supports separately to position the axle. This is an ideal mechanical controller, with no electrical, thermal or efficiency model.

Each integration substep uses bounded angular impulses projected through the connected joints, including gears and unilateral strings. The controller accounts for the inertia of the mechanism and caps its impulse to avoid driving past the target. Other loads and collisions can still disturb the shaft between controller solves. If the mechanism prevents rotation, the motor applies its capped torque against the constraint and does zero work. Competing motors are resolved in forward/reverse order in the two half-steps; finite-step torque sharing is approximate. A prescribed angular velocity is never imposed by overwriting the shaft velocity.

The purple curved **M** marker selects the motor. Its label gives target speed; Properties and monitors report actual shaft speed, speed error, measured torque, mechanical power and cumulative work. Work is signed: acceleration supplies energy, braking can remove it. Each impulse records `J × (ωbefore + ωafter) / 2`, the mechanical energy it transfers to the constrained system. Torque and power average over the latest 1/240 s physics step; work accumulates from the initial conditions. Motor data follow rewind/replay and resume from the recorded endpoint. CSV exports these quantities; every quantity can be a plot axis or line. Copy/paste, undo, Save As/Open and deletion work with motors. Saved initial conditions retain settings, not simulated work or controller state. Files use `kind: "motor"`, `speed` in rad/s (−1000 to 1000), `maxTorque` (0 to 100000 N·m), and `enabled` in the existing applied-load collection.

Choose **Load examples → Motor-driven gears** (**Cargar ejemplos → Engranajes con motor**) or open `examples/motor-driven-gears.json`. A 1 N·m motor accelerates the gear pair with effective inertia 2 kg·m² toward 2 rad/s on A and −1 rad/s on B. It reaches the target after 4 s, supplying 4 J, then supplies zero torque in this unloaded ideal example. Attached monitors show both shaft speeds, motor torque and cumulative work. Compare motor work and mechanical energy as two lines on one plot; both start at zero here.

`node tests/motors.cjs` covers analytical ramp/target capture, signed braking and work, released shafts, fixed/geared stall reactions, a resisting torque, unilateral string release, retry accounting and validation. `node tests/motors-ui.cjs` covers tools/fields, picking, persistence, clipboard/undo, work recording/replay/resume/reset, plots/CSV and Spanish controls. Browser/device qualification remains listed in BROWSER_QA.md.

## Ideal gears

Choose **Ideal gears** (**Engranajes ideales**) and click two solids, in order A then B. Their centers become the shaft attachments. Properties exposes the signed velocity ratio `r = ωB / ωA` and phase `θB − r θA`. Negative ratios turn in opposite directions; positive ratios turn in the same direction. Allowed magnitudes are 0.01 through 100. Two circles initialize the ratio to `−radiusA / radiusB`, limited to that range; other solid pairs start at −1. Subsequent resizing does not change the chosen ratio. Editing the ratio retains the current angles by recalculating phase; phase edits assemble on Run/Step. Angles and phase are unwrapped, so fractional ratios remain consistent over many revolutions. Rotating either solid in the editor drives its partner while preserving the constraint.

This is a massless, lossless **angular transmission**, with no tooth geometry, backlash, slip, tooth contact forces or axle positioning constraint. Add pinned supports separately for stationary axles. Any solid shape can represent a shaft; translating a shaft does not move its partner. Linked solids ignore mutual collisions by default. A fixed shaft locks its partner's rotation; conflicting constraints stop playback. Incompatible initial angular velocities are projected once before the experiment begins, which can remove initial kinetic energy; choose compatible velocities for energy comparisons.

Transmitted moments on A and B, angular impulses, powers and phase error are available in moving monitors and arbitrary plot axes/lines. Positive torque is counterclockwise on each shaft. The reactions satisfy `τA + r τB = 0`; `τA ωA + τB ωB = 0`, so the transmission does no net work. The modeled housing carries the balancing torque: unequal-ratio shafts alone need not conserve total angular momentum. Bearing forces and housing loads are not inferred. Gear CSV exports both torques, both powers and phase error, using recorded velocities during replay. Rewind/reset, copy/paste, undo and Save As/Open preserve the gear definition and monitors. Files use `joint: "gear"`, `ratio`, `phase` (radians) and centered local attachments in the shared `bars` collection.

Choose **Load examples → Ideal gear transmission** (**Cargar ejemplos → Transmisión por engranajes**) or open `examples/ideal-gear-transmission.json`. Two pinned 2 kg disks of radii 1 m and 2 m have inertias 1 and 4 kg·m². A +1 N·m applied torque drives A through ratio −0.5: αA = 0.5 rad/s² and αB = −0.25 rad/s², with transmitted torques −0.5 and −1 N·m. Their kinetic energy equals the applied torque's work. Angular spokes make both rotations visible; four attached monitors show velocities and transmitted torques.

`node tests/gears.cjs` checks these analytical accelerations/torques, conservation over multiple turns and signed ratios, a three-shaft train, fixed shafts, independent translation, initial velocity projection and validation. `node tests/gears-ui.cjs` covers creation, ratio/phase fields, joint-preserving edits, selection, clipboard/save/undo, recorded power/replay/CSV, plots and Spanish controls.

## General hinge joints

Choose the **Hinge** icon (**Articulación**) and click an attachment point on each of two different bodies or supports. On solids, click a center or an off-center point; coordinates are relative to the body and rotate with it. Escape cancels. Click the same shared pivot twice to choose the two overlapping bodies. The two pins assemble to one position when Run or Step begins; a dashed connector shows any initial mismatch. Assembly can move or rotate bodies and removes incompatible initial velocity. Use already coincident pins and compatible velocities for quantitative initial conditions.

The ideal massless hinge enforces both x and y coincidence and allows relative rotation. It transmits a force vector, with moments about the bodies’ centers from its attachment offsets, and no independent bending couple. Even a hinge attached to a fixed support allows its other body to rotate. Point masses attach at their centers and have no rotational degree of freedom. Edit both local attachment coordinates in Properties. Connected solids ignore mutual collisions by default; **Collide connected solids** enables them and may conflict with overlapping pin geometry.

A purple circular pivot remains selectable over its attached solids. Reaction Fx/Fy, force magnitude, moments, impulses, pin separation and relative rotation are available in attached monitors and plots. Relative rotation is angle B minus angle A in radians; it is not wrapped. Reactions appear after the first step and follow recorded replay. Hinge CSV exports label the force magnitude explicitly. Copy/paste, resize, delete/undo, Save As and Open preserve hinges and their readouts. Version 1 files store hinges in the existing bilateral `bars` collection with `joint: "hinge"` and `length: 0`; ordinary bars omit `joint`. The shared limit is 400 bars and hinges.

Choose **Load examples → Hinged double pendulum** (**Cargar ejemplos → Péndulo doble articulado**) or open `examples/hinged-double-pendulum.json`. Two uniform 1 kg beams, each 1.6 m long and 0.2 m wide, start at 0.55 rad from the downward vertical with zero velocity. One hinge joins the upper beam to ground and another joins the beam ends. Gravity is on, spring damping and contact friction are zero, and precision is High. Attached readouts show the moving hinge force and lower beam rotation. Compare this distributed-mass pendulum with the default point-mass double pendulum. Reset repeats its initial state.

`tests/hinges.cjs` checks analytical pendulum acceleration, two-coordinate constraints, support reactions, free rotation at a fixed ground support, initial assembly/conflicts, momentum/angular momentum/energy, coupled hinges and impact responses. `tests/hinges-ui.cjs` covers overlapping-body selection, inspector edits, resizing, clipboard/readout references, serialization, deletion/undo, recording/replay/reset, CSV and both interface languages.

Dragging, rotating or resizing a connected solid now assembles its mechanism **during the edit**, rather than waiting for Run. Hinges remain coincident, bars keep their stored lengths, and strings can become slack but cannot stretch. Connected bodies move and rotate as needed. Numerical position, rotation and size fields use the same solve. Rotation handles retain the requested angle when the mechanism permits it; if an edit conflicts with fixed supports or other constraints, the editor retains the last feasible pose. Constraints take priority over grid snapping. Springs may stretch normally.

Only the edited mechanism is assembled; unrelated unfinished connections remain untouched. Supports and linear guides on other bodies remain in place. Selecting and moving a support, or a group containing it, deliberately relocates that support and adjusts the connected mechanism. Initial velocities are preserved by geometric joint assembly; no motion, constraint impulse or reaction force is generated by dragging. The edit becomes the new initial geometry, clears a previous recording and remains one undoable action. This editor solve does not prevent solid overlaps; collision resolution remains part of simulation.

`tests/joint-editing.cjs` verifies constraints after each intermediate pointer event, hinge rotation and resizing, bar/string limits, unequal-mass pointer tracking, roller guides, blocked mechanisms, inspector edits, disconnected mechanisms, support relocation, velocity preservation, undo/redo and the next simulation step.

Hinges, moving-body sliders, welded joints, pure applied torques, separate static/kinetic friction, ideal gear transmissions and torque-limited motors are implemented. Formula inputs and calculated measurements are also implemented. Next are visual programming and the remaining browser/device qualification.

## Sliders on moving bodies

Choose **Moving-body slider** (**Corredera con guía móvil**) and click a solid for guide A, then a different solid or point mass for carriage B. On solids, click the center or an off-center attachment point. The guide axis passes through A’s attachment point and rotates with A. Its default direction is A’s local x axis; edit **Local axis angle (°)** in Properties to change it. A guide can move freely, rotate about a pinned support, or be fixed as a stationary rail. Use a solid guide for a stationary rail as well; the existing Linear constraint tool remains available for a simple world-space line.

The ideal slider allows unlimited frictionless travel along the guide axis. It constrains perpendicular separation and, for a solid carriage, keeps B’s initial angle relative to A. Edit **Relative carriage angle (°)** to change that orientation. A point-mass carriage has no angle constraint and behaves as a pin in a moving slot. The guide need not overlap the carriage; both local attachment offsets remain editable. Editing joint attachment/axis settings assembles them on Run or Step. Dragging, rotating and resizing bodies keeps the slider assembled during the edit. Grid snapping remains subordinate to the constraints.

The slider carries transverse force and reaction couples, with zero force along its ideal axis. The guide receives the moment of the moving contact about its own attachment, plus the couple required to maintain a solid carriage’s relative angle. These contributions are included in **Moment A/B about COM** and support reactions. Sliding position (signed along the axis), sliding velocity, perpendicular guide offset, relative rotation, reaction forces, moments and impulses are available as plots and moving readouts. The dashed purple rail shows the axis and a rectangular marker follows B’s attachment. The marker can be selected over the carriage; drag another part of the solid to move the body. Connected solids ignore mutual collisions by default. The rail has no collision surface, friction, travel stops or motor.

Choose **Load examples → Moving-guide slider** (**Cargar ejemplos → Corredera con guía móvil**) or open `examples/moving-guide-slider.json`. A uniform 2 kg guide, 4 m long, rotates about its pinned center. A 1 kg solid carriage starts 1 m along its axis at 0.35 rad, with 0.5 m/s initial sliding velocity. A 6 N/m undamped spring of natural length 1 m connects the guide center to the carriage. Gravity makes the guide rotate while the carriage slides. Both bodies keep their relative angle. High precision is selected; attached readouts show sliding position and joint reaction magnitude. The displayed rail does not impose end stops at the guide’s physical ends.

Sliders save in the existing version 1 `bars` collection as `joint: "slider"`, `length: 0`, a local `axisAngle` in radians, and a `referenceAngle` for relative rotation. Copy/paste, resizing, monitors, CSV, replay, reset, deletion and undo preserve them. Bars, hinges and sliders share the 400-link limit. `tests/sliders.cjs` verifies analytical incline acceleration and reactions, reaction couples, the rotating-axis Jacobian, energy and momentum, elastic impacts, point carriages and validation. `tests/sliders-ui.cjs` covers builder ordering, geometry/axis fields, joint-preserving editing, picking, clipboard/persistence, playback and both languages.

## Welded joints

Choose **Welded joint** (**Unión soldada**) and click an attachment point on each of two solids. Click a shared corner/edge twice to connect overlapping attachment points. A weld makes the points coincide and holds the solids’ initial relative angle. Their masses, inertias and shapes remain separate, but the connected assembly moves as a rigid unit. Use a fixed solid to weld to the ground. Point masses and support markers have no orientation and cannot be welded; apply a support to a solid instead.

A square marker with an X identifies the weld and stays selectable over the bodies. Properties expose both local attachments and **Relative angle (°)**. Joint-parameter edits assemble on Run or Step; dragging, rotating, resizing and numerical body-geometry edits keep the assembly connected immediately. Impossible moves stop at the last feasible pose. Assembly may change incompatible initial positions/velocities, so use coincident pins and consistent rigid-body velocities for quantitative initial conditions. Welds are ideal, massless and infinitely rigid; they do not bend elastically or break.

**Joint couple on A (N·m)** measures the pure torque transmitted at the joint, positive counterclockwise on body A. The couple on B is its opposite. It is separate from **Moment A/B about COM**, which also includes each attachment force’s lever arm. Hinges report zero joint couple; welds and solid-carriage sliders can transmit one. Couples are recorded for replay, selectable in moving readouts and plots, and included in joint CSV exports alongside the existing forces, moments and angular impulses. Support reactions include the transmitted couple. Welding to a fixed solid can therefore carry a cantilever load.

Welded clusters ignore internal collisions by default, including overlapping pieces connected through intermediate welded bodies. Other solids still collide with the assembly. The existing **Collide connected solids** setting can explicitly enable collision for a connected pair, which may conflict with the weld geometry. Copy/paste, Save As/Open, resize, delete/undo, replay and reset retain the joint and its measurements. Welds use the version 1 `bars` collection with `joint: "weld"`, `length: 0` and `referenceAngle` in radians. All bilateral bars/joints share the 400-link limit.

Choose **Load examples → Hinge vs weld** (**Cargar ejemplos → Articulación vs soldadura**) or open `examples/hinge-vs-weld.json`. Each experiment has two uniform 1 kg beams, each 2 m × 0.2 m, with A pinned at its center and B attached to its right end. Gravity is off, both pairs start at rest, and a constant 2 N downward force acts at B’s outer end. Only the connecting joint differs. The hinged pair changes relative angle and transmits no joint couple. The welded pair keeps zero relative angle and transmits a couple; its initial angular acceleration is **−6 / (4 + 2 × 0.3366667) ≈ −1.28388 rad/s²**. Moving readouts compare relative angle and joint couple. Reset repeats the comparison.

`tests/welds.cjs` checks force/couple equilibrium, analytical rigid-assembly acceleration, unequal-mass off-center momentum/angular momentum/energy, elastic contact/support impulses, welded-cluster collision exclusion, conflicting constraints, comparison measurements and schema validation. `tests/welds-ui.cjs` covers shared-point creation, solid-only attachments, angle/geometry edits, clipboard/persistence/undo, rendering/picking, replay, CSV and both languages.

## Directly applied torque

Choose **Applied torque** (**Torque aplicado**) and click a solid. The new load is a pure couple of +1 N·m, with zero resultant force. A positive value turns counterclockwise; a negative value turns clockwise. Select the curved arrow, including its arc, to edit **Torque (N·m)** in Properties. Zero is valid. Its arrow indicates sign, with a fixed screen size; it does not encode magnitude by length. Edit the scalar value in Properties rather than dragging the arrow. Point masses have no rotational degree of freedom and cannot receive this load. Off-center applied forces remain available separately.

A free solid obeys **α = τ/I** while its center continues its translational motion. A center pin permits rotation; a fixed body supplies the opposite support torque and stays stationary. Hinges, sliders, welds and collisions participate in the same constrained solve as other loads. A pure couple is independent of attachment location and body orientation, so resizing or rotating the target does not change its value. Multiple torques and forces add algebraically. Editing a load restores initial conditions and clears the old recording.

Attached monitors and plots can display **Applied torque (N·m)** and instantaneous **Power (W)**, with **P = τω**. Power is signed: a torque opposing rotation removes kinetic energy until the rotation reverses. Replay uses the angular velocity of the recorded frame. Body monitors still provide angle, angular velocity, angular momentum and kinetic energy. The energy diagnostics identify work by applied torques; a changing mechanical energy is expected under external work. Pure applied torques do not accumulate work history. Use the separate Motor tool for speed control and cumulative motor work.

Torque loads copy/paste, duplicate, delete/undo, Save As/Open and replay with their target bodies and readouts. They share the existing 400-load `forces` collection. A version 1 entry has `type: "force"`, `kind: "torque"`, a signed `torque` in N·m, its solid `target`, canonical zero `fx`, `fy` and local coordinates, and `bodyFrame: false`. Existing force files remain compatible. The measurements CSV for a torque source exports time, applied torque, target angular velocity, angular momentum about COM, power and angle.

Choose **Load examples → Torque and inertia** (**Cargar ejemplos → Torque e inercia**) or open `examples/torque-and-inertia.json`. Two uniform 2 kg disks, of radii 1 m and 2 m, each receive +1 N·m and rotate about center pins with gravity off. Their inertias are **1 and 4 kg·m²**, so their angular accelerations are **1 and 0.25 rad/s²**. Both start at rest. At t = 1 s their angular velocities are 1 and 0.25 rad/s, angles are 0.5 and 0.125 rad, and angular momenta are equal at 1 kg·m²/s. Their kinetic energies equal the work **τΔθ**: 0.5 and 0.125 J. Attached readouts show torque and angular velocity. Add plots to compare the angular velocities, energies or load powers.

`tests/torques.cjs` checks signed and zero torque, constant angular acceleration, zero net force, translational drift, angular momentum/work-energy, pin/fixed-support reactions, weld/slider transmission, recorded power and validation. `tests/torques-ui.cjs` covers solid-only creation, both arrow directions and arc picking, numeric values, monitor/plot defaults, geometry edits, clipboard/persistence/undo, replay/CSV, energy diagnostics and both languages.

## Static and kinetic friction

Select a solid and edit **Static friction μs** (**Rozamiento estático μs**) and **Kinetic friction μk** (**Rozamiento cinético μk**). The permitted range is **0 ≤ μk ≤ μs ≤ 2**. Increasing kinetic friction above the current static value raises static friction too; lowering static friction below the current kinetic value lowers kinetic friction. This permits a direct zero edit and keeps saved materials valid. New solids start with both values at 0.3.

For a pair of surfaces, the solver uses **μs,pair = √(μs,A μs,B)** and **μk,pair = √(μk,A μk,B)**. Sticking contact can supply the force required up to **|Ft| ≤ μs N**. Once slipping, the friction magnitude is **μk N**, opposite relative contact motion. An object already sliding does not gain the larger static resistance simply because its speed is small. When it stops, static friction can hold it again. Static friction describes no slip at the contact, not necessarily a stationary center: rolling without sliding also uses static friction. There is no separate rolling-resistance or air-drag model.

Contact patches converge their normal loads and static impulse bounds before deciding whether to slide, avoiding a premature switch at one corner of a block. Explicit paired materials resolve existing resting contacts around both force half-steps, preventing the position creep that results when friction is applied only after drift. These are finite-step contact constraints: extreme speeds, tiny shapes, deep overlaps, tipping, dense stacks and contact transitions remain approximate. Friction can dissipate energy when surfaces slide; ideal static friction need not dissipate energy.

Older files containing only `friction` retain their single-coefficient behavior and display it in both fields. Editing a material writes explicit `staticFriction` and `kineticFriction` values; `friction` is retained as the kinetic fallback. Version 1 JSON, Save As/Open, copy/paste, duplicate, resizing and undo preserve the pair. Invalid, non-finite or reversed coefficient pairs are rejected on import. Setting both values to zero retains frictionless elastic contact when restitution is one.

Choose **Load examples → Static vs kinetic friction** (**Cargar ejemplos → Rozamiento estático vs cinético**) or open `examples/static-vs-kinetic-friction.json`. Two 1 kg blocks rest on horizontal tracks under gravity, with **μs = 0.6**, **μk = 0.3** and zero restitution. A 4 N push is below the **5.886 N** static limit, so the upper block stays still and its friction is −4 N. A 7 N push exceeds the static limit, so the lower block slides with friction **−2.943 N** and acceleration **4.057 m/s²**. Before reaching the stop, at t = 1 s it has moved 2.0285 m and has speed 4.057 m/s. Each track has an inelastic travel stop, reached by the sliding block at about 1.86 s; the formulas apply before contact with that stop. Reset repeats the experiment.

Moving readouts show each block’s x velocity and the friction on it. The friction readout uses its fixed track’s horizontal support reaction, which equals the force of friction on the block in this setup. The track’s own weight does not contribute horizontally. Track reaction measurements include all contact impulses, so they should not be interpreted as a general-purpose friction sensor in arbitrary scenes. Add plots to compare velocities or the two horizontal track reactions.

`tests/friction.cjs` checks the static threshold without creep, signed kinetic acceleration, very slow sliding, stopping without reversal, energy loss, independently mixed material pairs, inclined planes, rolling, joint-coupled contact, explicit-zero elastic impacts, travel stops and legacy/paired validation. `tests/friction-ui.cjs` checks material fields, ordered edits/zero/bounds, clipboard/persistence/undo, new-solid defaults, measured reactions, example playback/reset and both languages.

## Solver precision

Expand **Solver & energy** in Properties for the current mechanical energy, its change from the initial recorded state, and the largest bar-length/hinge-pin separation/string-extension error. Slack strings contribute zero extension error. Values follow replay. This panel also identifies configured mechanisms that can change mechanical energy; it does not measure dissipated heat or external work. The link metric measures length only, not every support/angle constraint. The panel is collapsed by default to preserve screen space.

Constrained drift uses a RATTLE/SHAKE update: position corrections act along the beginning-of-step constraint Jacobian, followed by velocity constraints at the new configuration. This follows the velocity-Verlet constraint formulation described in the [LAMMPS RATTLE documentation](https://docs.lammps.org/fix_shake.html) and [GROMACS constraint-algorithm reference](https://manual.gromacs.org/current/reference-manual/algorithms/constraint-algorithms.html). Using the new geometry for both projections had introduced systematic energy loss even while preserving bar length.

Choose **Solver precision** next to the playback controls. **Standard** retains the existing solver; **High** halves its internal timestep and **Very high** quarters it. These settings refine collision-adaptive subdivisions as well as free and constrained motion. They cost roughly two or four times as much integration work, with additional cost for difficult contacts. They do not guarantee accuracy for arbitrarily stiff systems. Changing precision restores initial conditions, clears the recording, and can be undone. Precision saves with the experiment; older files use Standard. All settings keep the base 1/240 s measurement interval, 60 Hz recording and adjustable 1–600 s recording limit. Playback speed remains independent of accuracy.

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

Choose **Load examples → Monitored bridge** (**Cargar ejemplos → Puente con monitores**), or open `examples/bridge-monitored.json`, and run or step to see 15 moving readouts: Rx, Ry, and torque for the left pin and right roller support (free in x, restrained in y), and signed tension for all nine bars. Positive bar values indicate tension; negative values indicate compression. Duplicate bar names in the source example were made unique. Geometry, masses, lengths, and loading are preserved.

The support reaction is the **force exerted by the support on the structure**, including the supported node’s own weight. It is measured from momentum change minus the impulses of gravity, applied forces, links, springs, and contacts. Fixed-support torque is the balancing moment about its center; ideal point pins and freely rotating slider nodes carry no reaction couple. Fixed point supports clamp attached bars and include the clamping couples in their reaction torque. Support measurements are recorded for replay and available as plot axes and attached readouts.

For this bridge the expected vertical reactions are 29.62 N at the left pin and 39.43 N at the right roller, with zero horizontal force and support torque. Run `node tests/bridge.cjs` to verify the reactions, overall force/moment balance, and monitor definitions. `node tests/bridge-preset.cjs` verifies the offline menu example matches the JSON file, retains the roller and all 15 monitors through reset/replay/undo, and loads correctly in Spanish.

## Verification

Run **`node tests/run.cjs`** for the complete dependency-free suite. See [test coverage](tests/README.md) and the [manual browser qualification checklist](BROWSER_QA.md). Real-browser and device qualification is pending; Node workflow tests use DOM/canvas stubs.

`tests/languages.cjs` checks Spanish defaults, both flag choices, remembered preferences and blocked-storage fallback, static labels/tooltips, plot and readout translation, user text preservation, errors, and unchanged running/recorded experiment state during switching.

`tests/touch-selection.cjs` checks modifier-free group selection, touch taps/boxes, cancellation, group movement/copy/paste/undo, explicit panning and recording preservation. `tests/diagnostics.cjs` checks energy changes during replay, physical-loss/work explanations, link-length residuals and read-only rendering.

`tests/workflows.cjs` checks offline packaging, icon definitions/accessibility labels, snapping, Save As initial conditions, failed-import atomicity and repeatable reset for every example. `tests/precision.cjs` checks analytical convergence, precision persistence/validation, undo/reset, the recording clock and measured pulley tension across settings.

Run `node tests/energy.cjs` for long-run single/double/rigid pendulum energy, constraint-length precision, the supplied triangular pendulum, and time reversibility.

`node tests/solids.cjs` also checks attached-monitor creation, variable values and units, moving anchors, dragging offsets without clearing recordings, replay, save/load, deletion cascades, and malformed configuration rejection.

`node tests/off-center-springs.cjs` checks rotated attachment geometry, force/energy-gradient torque, rotational and constraint-aware damping, momentum and energy, fixed/pinned support reactions, unilateral string release, recorded measurements and legacy files. `node tests/spring-attachments-ui.cjs` checks builder placement, attachment fields, rendering/picking, monitor positions, resizing, copy/paste/save/undo and the bilingual example.

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

Choose **Pinned vs fixed** in Builder, or open `examples/pinned-vs-fixed.json`. Both beams have mass 2 kg, length 2 m, thickness 0.2 m, zero initial velocity, a center support, and a 2 N downward force attached 1 m to the right of the center. Gravity is on. The applied force keeps pointing downward as the beam rotates. Only the support condition differs; the beams are separated horizontally so they cannot collide.

Press **Run** or **Step**. The left, pinned beam rotates clockwise with zero support reaction couple. The right, fixed beam remains horizontal and its support supplies a counterclockwise reaction torque of +2 N·m. Both centers remain at rest, and both vertical reactions are 21.62 N (weight plus applied load). The beam’s moment of inertia is 0.673333 kg·m², so the pinned beam initially accelerates at −2.970297 rad/s². Attached readouts show rotation, support torque, and vertical reaction; reactions are measured after the first step. This compares ideal rigid-body rotation and equilibrium, without beam bending.

For graphs, press **Add plot** and choose **Pinned beam · rotation** for Y. Add a second line for **Fixed beam · rotation**, using time for X. A second plot can compare the two support torques. Reset repeats the comparison from identical initial conditions.

Run `node tests/support-example.cjs` to verify identical physical parameters, initial angular acceleration, stationary centers, fixed-support force/torque balance, and all six readouts.

### Bridge with one fixed support

Choose **Load examples → Fixed-support bridge** or open `examples/bridge-fixed-left.json` for the monitored bridge with its right end free and its left support fixed. It uses the same masses, bars and loads as `bridge-monitored.json`. To build it yourself, remove the right roller support (set Support to None) and change the left support to **Fixed support**. The fixed point support now restrains both attached bars’ directions, making this triangulated bridge a cantilever. A pinned left support leaves the entire bridge free to rotate when the right support is removed.

For this loading the fixed support reaction is **69.05 N upward** and **236.58 N·m counterclockwise**, with zero horizontal force. The support-torque readout includes the bar clamping couples. Individual bars’ axial tensions are still available; their force vectors can also contain shear at clamped ends. Reaction moments are moments on the attached body about its center. This remains an ideal rigid-member model without elastic beam bending. Removing the fixed support releases the clamped directions. Reference directions persist in saved experiments, are updated when editing the geometry, and follow copy/paste. Removing a support or constraint also removes its now-unavailable support readouts, keeping the edited experiment reloadable.

Run `node tests/bridge-fixed.cjs` for the original falling case, the five-second stationary cantilever, reaction force/moment balance, monitored torque, save/load and clamp release. The same editing sequence and replay are covered in `tests/solids.cjs`.

### Nine-circle spring lattice

Choose **3 × 3 spring lattice** in Builder, or open `examples/spring-lattice-3x3.json`. Nine identical 1 kg disks of radius 0.25 m start on a square grid with 1.5 m spacing. Six horizontal and six vertical springs connect nearest neighbors. Each spring has stiffness 12 N/m, natural length 1.5 m, and zero damping. Gravity is off and all circles are free to move in 2D.

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

Choose **Load examples → Pulley oscillator**, or open `examples/pulley-oscillator.json`. Two 1 kg circles hang on a string over a 0.5 m radius pulley, with vertical guides. A 4 N/m spring below the left mass provides the restoring force. Both masses start with equal, opposite velocities of 0.5 m/s. Gravity supplies baseline tension; the spring produces equal and opposite oscillations with period **2π√(2/4) ≈ 4.443 s**. The attached readouts compare velocities, tension and axle reaction.

`node tests/strings.cjs` checks the finite-radius geometry, the analytical Atwood acceleration/tension, axle reactions, slack/capture/release, pendulum and oscillator energy, multiple pulleys, coupled strings/bars, off-center torque, measurements and file validation. Builder tools, route creation, drawing, properties, copy/paste, deletion/undo, the example and replay are covered in `tests/solids.cjs`.

### Movable pulleys and Atwood machines

A **Movable pulley** has a translating axle and load. Its **Axle + load mass** includes the housing/load mass; the rim is ideal, massless and frictionless, so both strands retain equal tension. The axle feels the vector sum of the strand forces. It can move freely in 2D, follow a linear guide, or connect to strings, springs and bars at its center. Properties can switch between **Fixed** and **Movable** axle motion. Fixing an existing assembly pins its axle while retaining its mass and applied forces. A fixed massless marker gets a 1 kg load when made movable. Change the mass to match the intended system. For an underhung movable pulley, select the string’s **Counterclockwise** wrap direction on that wheel.

Two new Examples are included:

| Example | Setup | Acceleration before the stop | String tension |
|---|---|---|---|
| **Atwood machine** (`examples/atwood-machine.json`) | 1 kg and 2 kg, one fixed pulley | Light: +3.27 m/s²; heavy: −3.27 m/s² | 13.08 N |
| **Movable-pulley Atwood** (`examples/atwood-movable-pulley.json`) | 3 kg movable assembly, 1 kg free end, one fixed guide | Assembly: −1.40143 m/s²; free end: +2.80286 m/s² | 12.61286 N |

Positive y points upward. The classical result is `a = (m_heavy − m_light) g / (m_heavy + m_light)`. In the movable example, the free end moves twice as far and in the opposite direction to the axle: `a_free = −2 a_axle`. With assembly mass M and free mass m, `a_axle = (2m − M) g / (M + 4m)`. The fixed guide axle reaction is upward with magnitude twice the tension in both examples. Vertical guides keep the strands parallel for comparison with these formulas.

Press **Step** or **Run** to populate the acceleration and tension readouts. Each example has an inelastic travel stop to prevent the rising circle reaching the guide; the formulas apply before contact. The stop intentionally removes kinetic energy when it engages. Reset repeats the experiment. The stop’s contact impulse can produce an acceleration spike during that recorded interval.

Acceleration x/y variables are measured from the velocity change over the last physics step, including constraint/contact impulses. They are recorded alongside position and velocity, are selectable as plot axes or attached readouts, and are included in body CSV exports. The string solver includes moving-guide gradients in the same coupled system as its endpoint bodies, including multiple moving pulleys and ropes attached to their axles.

`node tests/movable-pulleys.cjs` checks both analytical examples, the 2:1 displacement/velocity ratio, tension and axle loads, finite-radius guide gradients, travel-stop stability, axle-to-string connections, free 2D momentum and energy, multiple moving guides, and serialization. `tests/solids.cjs` checks the new icon tool, point-mass conversion, axle mode changes, axle attachment controls, both example files, recorded acceleration/replay and copy/paste.

## License

Copyright 2026 Nacho Marquez. Licensed under the [Apache License 2.0](LICENSE). The standalone HTML file also includes the complete license.

### Simulation duration and long runs

Set **Simulation limit (s)** (**Límite de simulación (s)**) next to the playback controls to a whole number from **1 to 600 seconds**; the default is **120 seconds**. This is simulated time, independent of playback speed and solver precision. At the limit, recording stops exactly; replay still works. Increase the limit to continue from the latest recorded state, preserving existing motion and plots. To shorten a run below its latest recorded time, reset first. The limit saves with the experiment, survives Reset, and supports Undo/Redo. Older files without a limit use 120 seconds.

The **600 s maximum is a practical recording bound, not a universal accuracy guarantee**. It caps recording at 36,001 frames (60 Hz), five times the default memory footprint; large scenes and phones may need shorter runs. Duration alone cannot determine integration accuracy: spring frequency/stiffness, constraints, impacts and chaotic motion matter. The solver keeps its base 1/240 s timestep; High and Very high refine internal steps. Check energy and compare runs at finer precision, especially when phase or resonance timing matters.

For a 600 s undamped oscillator with mass 1 kg, stiffness 64 N/m and amplitude 0.5 m (angular frequency 8 rad/s), measured peak relative energy errors were **0.02778% / 0.006945% / 0.001737%** for Standard / High / Very high. Despite bounded energy error, maximum position differences from the analytical solution reached **0.1109 / 0.02777 / 0.006943 m**, demonstrating cumulative phase error and roughly fourfold convergence per precision level. A separate 600 s single-pendulum run at Standard precision kept peak energy deviation below **0.000037% of its 3.924 J initial oscillation energy** and bar-length error below **9 × 10⁻¹⁶ m**. Accumulated integration-clock error stayed below **10⁻⁷ s** in all four benchmarks, while recorded timestamps use the integer timestep count. These measurements apply to these systems; they do not certify every model for ten minutes. Use `node tests/simulation-limit.cjs` to check duration controls and recording behavior, and `node tests/long-duration.cjs` for the 600 s numerical benchmarks.

### Position trajectories

Plot a body's **x (m)** against its **y (m)** to view its path. A single-body x–y plot (in either axis order) uses equal pixels per metre, so circular motion appears circular even in a wide plot window. XY plots retain all recorded samples when drawing the path; skipping every nth sample had connected distant positions with straight chords, making long pendulum recordings appear to drift inward. Time-series plots retain their drawing reduction. CSV always contains the full recorded data.

In the default inverted double pendulum, mass 1 moves on a 1 m circle about the fixed pivot. A 120 s High-precision check kept its radius within **5 × 10⁻¹² m**; the previous plot reduction could draw chords **0.25 m** inside that circle. The 60 Hz recording still represents curved motion with straight segments between samples. Double-pendulum timing is chaotic and finite-step phase error remains; equal scaling and full XY paths correct the plotting artifact, without changing the integrator. `node tests/plot-trajectories.cjs` checks long-path rendering, equal scales, axis reversal, replay and CSV.

### On-demand frequency spectra

Each time plot (X = **Time**) has an **FFT** button with the tooltip **Compute spectra** (**Calcular espectros**). Record motion, then press FFT to pause and analyze all recorded samples for the plot's visible curves. Rewinding does not shorten the analyzed interval. The spectrum opens in a separate dialog; it preserves the experiment, recording, replay cursor and source plot. At least eight finite, uniformly spaced samples and one visible curve are required. XY plots do not show this action.

The horizontal axis is frequency in Hz; one-sided amplitudes use each source variable's units, shown in the legend. **Remove mean** and **Hann window** are enabled initially; turn them off to inspect DC or rectangular-window results. Windowing precedes zero-padding, and amplitudes are normalized by the window's coherent gain (with single-sided DC/Nyquist scaling). The summary shows the recorded interval, sample count, recording rate and FFT bin spacing Δf. Padding refines this bin grid but adds no measured frequency resolution. Set **Maximum frequency (Hz)** to zoom into lower frequencies; the default is the Nyquist frequency, 30 Hz for 60 Hz recordings. **Export spectrum CSV** exports every frequency bin, independent of zoom. The result stays fixed until a setting changes or FFT is pressed again; it adds no ongoing FFT work during simulation. Spectral results are transient and can be recomputed after a new run; experiment JSON continues to save initial conditions and source plots.

For a quick check, run the formula-driven oscillator, add a time plot of its mass x position, compute the spectrum, and set the maximum frequency to 1 Hz. Its undamped response contains both the 0.25 Hz forcing and the approximately 0.318 Hz natural oscillation; a longer record separates the peaks more clearly. The sweep example is nonstationary, so its full-run spectrum spreads energy across its swept frequencies. Frequencies above 30 Hz can alias into the recorded band; solver precision does not change this recording limit. `node tests/spectra.cjs` compares the FFT to an independent DFT and checks amplitudes, padding, multiple curves, errors, CSV, localization and recording preservation.
