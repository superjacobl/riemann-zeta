import { BigNumber } from '../api/BigNumber';
import { ExponentialCost, FirstFreeCost, LinearCost } from '../api/Costs';
import { QuaternaryEntry, theory } from '../api/Theory';
import { Utils } from '../api/Utils';
import { Vector3 } from '../api/Vector3';

var id = 'riemann_zeta_f';
var getName = (language) =>
{
    let names =
    {
        en: 'Riemann Zeta Function',
    };

    return names[language] || names.en;
}
var getDescription = (language) =>
{
    let descs =
    {
        en:
`A function that goes around.`,
    };

    return descs[language] || descs.en;
}
var authors = 'Martin_mc, Eylanding, propfeds\n\nThanks to:\nGen, for the ' +
'Zeta calculation code\n Sneaky, Gen & Gaunter, for maths consultation';
var version = 0;

let gameOffline = false;
let t = BigNumber.ZERO;
let rCoord = 0;
let iCoord = 0;
let quaternaryEntries = [];
quaternaryEntries.push(new QuaternaryEntry('t', null));

const HALF = BigNumber.from(0.5);

// All balance parameters are aggregated for ease of access

let tdotInverse = 5;
let tdot = BigNumber.from(1 / tdotInverse);

const c1Cost = new FirstFreeCost(new ExponentialCost(1, 0.8));
const getc1 = (level) => Utils.getStepwisePowerSum(level, 2, 8, 0);

const c2Cost = new ExponentialCost(1400, 2.8);
const getc2 = (level) => BigNumber.TWO.pow(level);

const bCost = new ExponentialCost(1e6, Math.log2(1e8));
const getb = (level) => (BigNumber.ONE - BigNumber.from(0.8).pow(level + 1)) *
BigNumber.FIVE;
const getbTerm = (level) => BigNumber.TEN.pow(-getb(level));

// The first three zeroes, lol
const permaCosts =
[
    BigNumber.TEN.pow(14),
    BigNumber.TEN.pow(21),
    BigNumber.TEN.pow(25)
];

const milestoneCost = new LinearCost(25, 25);

const tauRate = 1;
const pubExp = 0.2;
var getPublicationMultiplier = (tau) => tau.pow(pubExp);
var getPublicationMultiplierFormula = (symbol) =>
`{${symbol}}^{${pubExp}}`;

// Gen
let zeta = (s_r, s_i) =>
{
    let sum_r = BigNumber.ZERO;
    let sum_i = BigNumber.ZERO;

    for(var i = BigNumber.ONE; i <= 6; i += BigNumber.ONE)
    {
        tmp_r = power1(i, -s_r, -s_i);
        tmp_i = power2(i, -s_r, -s_i);
        sum_r += tmp_r;
        sum_i += tmp_i;
    }
    rCoord = sum_r.toNumber();
    iCoord = sum_i.toNumber();
    return (sum_r * sum_r + sum_i * sum_i).sqrt();
}

// shin
let power1 = (a, b, c) =>
{
    let arg = c * a.log();
    return a.pow(b) * arg.cos();
}

// impact
let power2 = (a, b, c) =>
{
    let arg = c * a.log();
    return a.pow(b) * arg.sin();
}

/**
 * Returns a string of a fixed decimal number, with a fairly uniform width.
 * @param {number} x the number.
 * @returns {string}
 */
let getCoordString = (x) => x.toFixed(x >= -0.01 ?
    (x <= 9.999 ? 3 : (x <= 99.99 ? 2 : 1)) :
    (x < -9.99 ? (x < -99.9 ? 0 : 1) : 2)
);

var c1, c2, b;

var currency;

var init = () =>
{
    currency = theory.createCurrency();
    /* c1
    A sea one.
    */
    {
        let getDesc = (level) => `c_1=${getc1(level).toString(0)}`;
        let getInfo = (level) =>
        {
            return getDesc(level);
        }
        c1 = theory.createUpgrade(1, currency, c1Cost);
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level));
        c1.getInfo = (amount) => Utils.getMathTo(getInfo(c1.level),
        getInfo(c1.level + amount));
    }
    /* c2
    A sea two.
    */
    {
        let getDesc = (level) => `c_2=2^{${level}}`;
        let getInfo = (level) => `c_2=${getc2(level).toString(0)}`;
        c2 = theory.createUpgrade(2, currency, c2Cost);
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level));
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level),
        getInfo(c2.level + amount));
    }
    /* b
    A bee.
    */
    {
        let getDesc = (level) => getInfo(level);
        let getInfo = (level) => `b=${getb(level).toString(3)}`;
        b = theory.createUpgrade(3, currency, bCost);
        b.getDescription = (_) => Utils.getMath(getDesc(b.level));
        b.getInfo = (amount) => Utils.getMathTo(getInfo(b.level),
        getInfo(b.level + amount));
    }
    
    theory.createPublicationUpgrade(0, currency, permaCosts[0]);
    theory.createBuyAllUpgrade(1, currency, permaCosts[1]);
    theory.createAutoBuyerUpgrade(2, currency, permaCosts[2]);

    theory.primaryEquationHeight = 60;
    theory.primaryEquationScale = 0.96;
    theory.secondaryEquationHeight = 72;

    updateAvailability();
}

var updateAvailability = () =>
{
}

var tick = (elapsedTime, multiplier) =>
{
    if(game.isCalculatingOfflineProgress)
        gameOffline = true;
    else if(gameOffline)
    {
        theory.clearGraph();
        gameOffline = false;
    }

    let dtime = BigNumber.from(elapsedTime * multiplier);
    let c1Term = getc1(c1.level);
    let c2Term = getc2(c2.level);
    let bTerm = getbTerm(b.level);
    let bonus = theory.publicationMultiplier;

    t += tdot * elapsedTime;
    currency.value += dtime * t * c1Term * c2Term * bonus /
    (zeta(HALF, t) + bTerm);
    theory.invalidateTertiaryEquation();
    theory.invalidateQuaternaryValues();
}

var getPrimaryEquation = () =>
{
    return `\\dot{\\rho}=\\frac{t\\times c_1c_2}
    {|\\zeta(\\frac{1}{2}+ti)|+10^{-b}}`;
}

var getSecondaryEquation = () =>
{
    return `\\begin{array}{c}\\zeta (s) = \\sum_{n=1}^{6}\\frac{1}{n^s}
    \\\\\\\\${theory.latexSymbol}=\\max\\rho\\end{array}`;
}

var getTertiaryEquation = () =>
{
    return `\\zeta (\\frac{1}{2}+ti)=${getCoordString(rCoord)}+
    ${getCoordString(iCoord)}i`;
}

var getQuaternaryEntries = () =>
{
    quaternaryEntries[0].value = t;

    return quaternaryEntries;
}

var getTau = () => currency.value.pow(tauRate);

var getCurrencyFromTau = (tau) =>
[
    tau.max(BigNumber.ONE).pow(BigNumber.ONE / tauRate),
    currency.symbol
];

var postPublish = () =>
{
    theory.invalidatePrimaryEquation();
    theory.invalidateSecondaryEquation();
    theory.invalidateTertiaryEquation();
    updateAvailability();
}

var getInternalState = () => JSON.stringify
({
    version: version,
    t: t.toBase64String()
})

var setInternalState = (stateStr) =>
{
    if(!stateStr)
        return;

    let state = JSON.parse(stateStr);
    if('t' in state)
        t = BigNumber.fromBase64String(state.t);

    theory.invalidatePrimaryEquation();
    theory.invalidateTertiaryEquation();
}

var get3DGraphPoint = () => new Vector3(rCoord/3, -iCoord/3, t.toNumber());

var get3DGraphTranslation = () => new Vector3(0, 0, -t.toNumber());

init();
