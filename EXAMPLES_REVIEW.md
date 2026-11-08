# Example library review

Reviewed against the current builder, rigid-body constraints, static/kinetic friction, forces/torques, motors, formula references, moving readouts, arbitrary multi-line plots and JSON persistence.

## Changes made

- Every one of the 23 menu presets now has an equivalent downloadable JSON file. A catalog and export script keep both forms synchronized. Added the previously missing spring–mass, bar-pendulum, applied-force and ordinary collision files.
- All solid examples explicitly specify static and kinetic friction. Previous single coefficients initialize both to their previous value; frictionless examples remain zero. Static/kinetic threshold examples retain their distinct coefficients. Support markers explicitly identify pinned or fixed supports. Spring attachment coordinates and connected-body collision choices are explicit.
- Added speed/tension readouts to the spring–mass and point-mass pendulums, support/load-moment readouts to the applied-force lesson, and speed/spin readouts to ordinary collisions. Existing meaningful monitors remain intact.
- The analytical driven-oscillator comparison reads actual spring stiffness and body mass through K/M variable references. It is no longer hard-coded to k=4 N/m and m=1 kg. Its zero-initial-motion, undamped, non-resonant assumptions still apply.
- Added the fixed-left/free-right bridge to the menu and renamed its released end “Right end.” Its constrained-support readouts are removed; the fixed support and nine bar measurements remain.
- Added an elastic triangle/concave-polygon collision lesson to cover shapes absent from the previous examples.
- Kept focused models focused: ideal massless pulley rims, pin-ended truss bars, generic linear guides, clamped point-support bar directions and pure torques remain distinct teaching models. Their newer alternatives do not make them obsolete.
- Plot windows remain optional except for the sweep's two comparison charts. Suggested plots below expose current graphing capabilities without opening a large window over every experiment.

## Complete catalog

| Example / JSON file | Review outcome and teaching purpose | Suggested plot |
|---|---|---|
| [Spring–mass](examples/spring-mass.json) | Added speed and axial spring-force readouts; preserves free 2D motion and undamped spring | x against vx; mechanical/kinetic energy against time |
| [Inverted double pendulum](examples/inverted-double-pendulum.json) | Preserves startup geometry and high precision; added speed and upper-bar tension | Both masses' y or speed against time |
| [Bar pendulum](examples/bar-pendulum.json) | Added bob speed and bar tension; massless rigid rod with free pins remains appropriate | Speed and tension, preferably on separate plots |
| [Hinged double pendulum](examples/hinged-double-pendulum.json) | Retained physical beam inertia, off-center hinge pins and reaction/rotation monitors | Lower beam angle and hinge force |
| [Off-center spring](examples/off-center-spring.json) | Retained rotational spring response and spring moment/beam angle readouts | Beam angle; system energy; repeat with spring damping |
| [Spring lattice](examples/spring-lattice-3x3.json) | Retained elastic, frictionless, undamped 2D propagation and COM drift | Corner and center speeds; mechanical/kinetic energy |
| [Pulley oscillator](examples/pulley-oscillator.json) | Retained taut-string geometry, opposite velocities and axle/tension readings | Both vertical velocities |
| [Fixed-pulley Atwood](examples/atwood-machine.json) | Retained quantitative acceleration/tension and an inelastic travel stop | Both ay values before contact; tension |
| [Movable-pulley Atwood](examples/atwood-movable-pulley.json) | Retained 2:1 motion and translational axle mass; massless rim remains intentional | Free-end and axle y or vy |
| [Forces and reactions](examples/forces-and-reactions.json) | Added support Ry and applied off-center moment readouts | Both support Ry values; beam angle |
| [Pinned/roller bridge](examples/bridge-monitored.json) | Retained the right roller, all 15 monitors and static bar forces | Support reactions; selected bar tensions |
| [Fixed-left bridge](examples/bridge-fixed-left.json) | Added menu entry; released right end; 12 valid remaining readouts | Left support torque and Ry on separate plots |
| [Pinned versus fixed](examples/pinned-vs-fixed.json) | Retained equal beam/load parameters and contrasting rotational response | Both angles; both support torques |
| [Ordinary collisions](examples/collisions-and-friction.json) | Added disk speed and box spin; explicit equal static/kinetic coefficients preserve the previous material values | System energy shows physical dissipation |
| [Elastic polygon collisions](examples/elastic-polygon-collisions.json) | New triangle and concave polygon, enclosed by elastic frictionless walls | Mechanical energy; each body's spin |
| [Static versus kinetic friction](examples/static-vs-kinetic-friction.json) | Retained distinct μs/μk, subthreshold sticking and sliding with a stop | Both vx values; measured track forces |
| [Torque and inertia](examples/torque-and-inertia.json) | Retained pure torques, unequal inertias, angular-speed and torque readouts | Both angular velocities |
| [Ideal gears](examples/ideal-gear-transmission.json) | Retained pinned axles and explicit signed ratio; no geometric tooth forces inferred | Both angular velocities; gear powers A/B |
| [Motor-driven gears](examples/motor-driven-gears.json) | Retained torque cap, target capture and signed motor work | Motor work and mechanical energy on the same plot |
| [Moving-guide slider](examples/moving-guide-slider.json) | Retained rotating guide, unrestricted travel and relative-angle constraint | Slider position and speed; system energy |
| [Hinge versus weld](examples/hinge-vs-weld.json) | Retained matched beam/load assemblies and bending-couple contrast | Both relative angles; both joint couples |
| [Formula-driven oscillator](examples/formula-driven-oscillator.json) | Analytical solution now follows actual k/m references | Simulated x and analytical displacement; error separately |
| [Frequency sweep](examples/resonance-frequency-sweep.json) | Retained requested fStart=0, duration=120 s, integrated chirp phase, physical natural-frequency references and two ready plots | Existing displacement and frequency comparisons |

## Verification and limits

The catalog audit checks factory/menu/file equality, schema round-trips, explicit material/support fields, available finite readouts, and eight-second physical runs of every example. Existing feature suites supply analytical, conservation, contact, reaction, replay/reset, formula and persistence checks. The sweep has a separate full 120-second response test. An eight-second smoke run does not prove arbitrary-duration stability for every possible edit.

The new polygon case was also checked for eight-second mechanical-energy conservation, including concave contact and rotation: observed absolute drift was below 2e-13 J for its approximately 15.13 J initial energy. Its zero friction, unit restitution and fixed enclosure are intentional.

Atwood travel stops deliberately invalidate the free-motion acceleration formulas after contact. Contact friction, spring damping, inelastic impacts and motor/applied-force work can change system mechanical energy. The fixed-support bridge is an ideal rigid-member model with clamped member directions, not a deformable beam calculation. The frequency sweep is transient: maximum amplitude occurs after its 63.66 s natural-frequency crossing.

Desktop browser smoke checks supplement the automated audit. Full Firefox/Safari and physical mobile/offline qualification remain tracked in [BROWSER_QA.md](BROWSER_QA.md).
