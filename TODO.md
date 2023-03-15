# To-do List

## Balance

- Theory is slow affff
- b will be useless after a while
- New approximation methods

## Design

For currencies, I currently have two ideas floating around:

- Decoupling zeta into Re and Im, but it will diverge from our current |z| model.
- Since we have the modulus of z for a currency, how about another for the argument (angle)? 
or angular velocity (small omega)

- Ok so, random crazy idea, make tdot be a function of zeta(s) so that when zeta(s) is big dot is higher and when zeta(s) is small tdot is lower 
    - Something like tdot = (9 * zeta(s) + 2 ) / 200
    - I just though it might be interesting and makes the theory faster/easier. I don't really know but I thought I'd put it out there and do some work on it (the function I gave was like a linear function that went through (0, 0.01) and (2,0.1) making tdot be 10x faster at zeta(s)=2 then zeta(s)=0 )
