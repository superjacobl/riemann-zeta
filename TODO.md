# To-do List

## Balance

- Theory is slow affff
- b will be useless after a while
- New approximation methods

## Design

### Mechanics

- Ok so, random crazy idea, make tdot be a function of zeta(s) so that when zeta(s) is big dot is higher and when zeta(s) is small tdot is lower 
  - Something like tdot = (9 * zeta(s) + 2 ) / 200
  - I just though it might be interesting and makes the theory faster/easier. I don't really know but I thought I'd put it out there and do some work on it (the function I gave was like a linear function that went through (0, 0.01) and (2,0.1) making tdot be 10x faster at zeta(s)=2 then zeta(s)=0 )

- An upgrade that increases t by some amount that increases each time to buy it. something like: :uparrow:t by 2^n and n just keeps going up the more you buy it, so t can reach really high levels as n keeps increases. Maybe programmatically the actual equation could be t = t1 + t2, t1dot = (whatever tdot was), t2 = this upgrade, so it would actually be: t2 = 2^(n+1) - 1.
  1. It's probably a good idea to skip some value of n here because increasing t by 4 isn't going to help anyone.
  2. I also envisioned it as an expensive upgrade, as it feels like it could get out of hand.
  3. It doesn't have to be 2^n it could be 3^n or 10^n or whatever

### Currencies

- Decoupling zeta into Re and Im, but it will diverge from our current |z| model.
- Since we have the modulus of z for a currency, how about another for the argument (angle)? 
or angular velocity (small omega)

### Milestones

- Increase t_dot by 4x, but sqrts the |z| portion
- Unlock angular velocity currency
