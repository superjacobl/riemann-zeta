# To-do List

- [ ] Nerf min black hole speed from 0.04 -> 0.06? Doesn't feel good if slow
- [ ] Black hole reliance on activeness (gets weaker with offline progress)
  - Idea: black hole no longer lets the particle go through it, but instead will suck the particle to the nearest zero, freezing time
  this will likely resolve tick length issues
- [ ] Post-spiral swap doesn't feel engaging
- [ ] Change w3 to be x^3 instead of 2^x?

- [x] Drop zeta computation layers from 4 to 1

## Balance

- 0.2.6 (dev)
  - c1 c2 alone can easily reach publication without w2
- 0.2.7 (bependence)
  - Early game too slow
- 0.3.1
  - [x] Move 225 milestone to 250
  - [x] Initial c2 cost from 1400 -> 1500

## Design

- Derivative: currency called delta
  - Synergy: zeta gains radius as t goes up
  - w1: boosts both rho & delta
    - [ ] w1 exponent?
  - w2: boosts delta only

- Black hole ms: when zeta(s) is small t_dot is lower 
  - Current formula: z^2 + 0.02 (small attraction radius)
  - Reduces t gain (and subsequently delta gain) but preserves c1 c2 growth
  - Max speed is the same as no black hole (0.25) to avoid solar swapping
    - [ ] Need tiers?

- [ ] Warp? increases starting t
  - Perma upgrade
  - Power: 2^n

- [ ] Speed ms? used to skip slow early sections
