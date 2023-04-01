import { BigNumber } from '../api/BigNumber';
import { ExponentialCost, FirstFreeCost, LinearCost } from '../api/Costs';
import { Localization } from '../api/Localization';
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
var authors = 'Martin_mc, Eylanding, propfeds\n\nThanks to:\nGlen Pugh, for ' +
'his implementation of the Riemann-Siegel formula\nSneaky, Gen & Gaunter, ' +
'for maths consultation';
var version = 0;

let gameOffline = false;
let t = 0;
let tTerm = BigNumber.ZERO;
let zTerm = BigNumber.ZERO;
let wTerm = BigNumber.ZERO;
let rCoord = 0;
let iCoord = 0;
let quaternaryEntries =
[
    new QuaternaryEntry('t', null),
    new QuaternaryEntry('\\dot{\\omega}', null)
];

const scale = 4;
const HALF = BigNumber.from(0.5);

// All balance parameters are aggregated for ease of access

const resolution = 5;
const speedMaxLevel = 2;
const getSpeed = (level) => 1 << (level * 2);
const getZetaExp = (level) => HALF.pow(level);

const c1ExpMaxLevel = 3;
const c1ExpInc = 0.07;
const getc1Exp = (level) => BigNumber.ONE + BigNumber.from(c1ExpInc * level);
const c1Cost = new FirstFreeCost(new ExponentialCost(1, 0.7));
const getc1 = (level) => Utils.getStepwisePowerSum(level, 2, 8, 0);

const c2Cost = new ExponentialCost(1400, 2.8);
const getc2 = (level) => BigNumber.TWO.pow(level);

const bMaxLevel = 10;
const bCost = new ExponentialCost(1e6, Math.log2(1e6));
const getb = (level) => BigNumber.ONE + HALF * level;
const getbTerm = (level) => BigNumber.TEN.pow(-getb(level));

const permaCosts =
[
    BigNumber.TEN.pow(9),
    BigNumber.TEN.pow(14),
    BigNumber.TEN.pow(21)
];

const milestoneCost = new LinearCost(20, 20);

const tauRate = 1;
const pubExp = 0.2;
var getPublicationMultiplier = (tau) => tau.pow(pubExp);
var getPublicationMultiplierFormula = (symbol) =>
`{${symbol}}^{${pubExp}}`;

const locStrings =
{
    en:
    {
        speed: '\\text{speed}',
        zExp: '{{{0}}}\\text{{ exponent}}',
        half: '\\text{half}'
    }
};

const menuLang = Localization.language;
/**
 * Returns a localised string.
 * @param {string} name the internal name of the string.
 * @returns {string} the string.
 */
let getLoc = (name, lang = menuLang) =>
{
    if(lang in locStrings && name in locStrings[lang])
        return locStrings[lang][name];

    if(name in locStrings.en)
        return locStrings.en[name];
    
    return `String missing: ${lang}.${name}`;
}

let even = (n) =>
{
    if(n % 2 == 0)
        return 1;
    else
        return -1;
}

let theta = (t) =>
{
    return t/2*Math.log(t/2/Math.PI) - t/2 - Math.PI/8 + 1/48/t + 7/5760/t/t/t;
}

let C = (n, z) =>
{
    if(n == 0)
        return (+.38268343236508977173 * Math.pow(z, 0.0) 
                +.43724046807752044936 * Math.pow(z, 2.0)
                +.13237657548034352332 * Math.pow(z, 4.0)
                -.01360502604767418865 * Math.pow(z, 6.0)
                -.01356762197010358089 * Math.pow(z, 8.0)
                -.00162372532314446528 * Math.pow(z,10.0)
                +.00029705353733379691 * Math.pow(z,12.0)
                +.00007943300879521470 * Math.pow(z,14.0)
                +.00000046556124614505 * Math.pow(z,16.0)
                -.00000143272516309551 * Math.pow(z,18.0)
                -.00000010354847112313 * Math.pow(z,20.0)
                +.00000001235792708386 * Math.pow(z,22.0)
                +.00000000178810838580 * Math.pow(z,24.0)
                -.00000000003391414390 * Math.pow(z,26.0)
                -.00000000001632663390 * Math.pow(z,28.0)
                -.00000000000037851093 * Math.pow(z,30.0)
                +.00000000000009327423 * Math.pow(z,32.0)
                +.00000000000000522184 * Math.pow(z,34.0)
                -.00000000000000033507 * Math.pow(z,36.0)
                -.00000000000000003412 * Math.pow(z,38.0)
                +.00000000000000000058 * Math.pow(z,40.0)
                +.00000000000000000015 * Math.pow(z,42.0));
    else if(n == 1)
        return (-.02682510262837534703 * Math.pow(z, 1.0) 
                +.01378477342635185305 * Math.pow(z, 3.0)
                +.03849125048223508223 * Math.pow(z, 5.0)
                +.00987106629906207647 * Math.pow(z, 7.0)
                -.00331075976085840433 * Math.pow(z, 9.0)
                -.00146478085779541508 * Math.pow(z,11.0)
                -.00001320794062487696 * Math.pow(z,13.0)
                +.00005922748701847141 * Math.pow(z,15.0)
                +.00000598024258537345 * Math.pow(z,17.0)
                -.00000096413224561698 * Math.pow(z,19.0)
                -.00000018334733722714 * Math.pow(z,21.0)
                +.00000000446708756272 * Math.pow(z,23.0)
                +.00000000270963508218 * Math.pow(z,25.0)
                +.00000000007785288654 * Math.pow(z,27.0)
                -.00000000002343762601 * Math.pow(z,29.0)
                -.00000000000158301728 * Math.pow(z,31.0)
                +.00000000000012119942 * Math.pow(z,33.0)
                +.00000000000001458378 * Math.pow(z,35.0)
                -.00000000000000028786 * Math.pow(z,37.0)
                -.00000000000000008663 * Math.pow(z,39.0)
                -.00000000000000000084 * Math.pow(z,41.0)
                +.00000000000000000036 * Math.pow(z,43.0)
                +.00000000000000000001 * Math.pow(z,45.0));
    else if(n == 2)
        return (+.00518854283029316849 * Math.pow(z, 0.0)
                +.00030946583880634746 * Math.pow(z, 2.0)
                -.01133594107822937338 * Math.pow(z, 4.0)
                +.00223304574195814477 * Math.pow(z, 6.0)
                +.00519663740886233021 * Math.pow(z, 8.0)
                +.00034399144076208337 * Math.pow(z,10.0) 
                -.00059106484274705828 * Math.pow(z,12.0) 
                -.00010229972547935857 * Math.pow(z,14.0) 
                +.00002088839221699276 * Math.pow(z,16.0) 
                +.00000592766549309654 * Math.pow(z,18.0) 
                -.00000016423838362436 * Math.pow(z,20.0)
                -.00000015161199700941 * Math.pow(z,22.0)
                -.00000000590780369821 * Math.pow(z,24.0)
                +.00000000209115148595 * Math.pow(z,26.0)
                +.00000000017815649583 * Math.pow(z,28.0)
                -.00000000001616407246 * Math.pow(z,30.0)
                -.00000000000238069625 * Math.pow(z,32.0)
                +.00000000000005398265 * Math.pow(z,34.0)
                +.00000000000001975014 * Math.pow(z,36.0)
                +.00000000000000023333 * Math.pow(z,38.0)
                -.00000000000000011188 * Math.pow(z,40.0)
                -.00000000000000000416 * Math.pow(z,42.0)
                +.00000000000000000044 * Math.pow(z,44.0)
                +.00000000000000000003 * Math.pow(z,46.0));
    else if(n == 3) 
        return (-.00133971609071945690 * Math.pow(z, 1.0)
                +.00374421513637939370 * Math.pow(z, 3.0)
                -.00133031789193214681 * Math.pow(z, 5.0)
                -.00226546607654717871 * Math.pow(z, 7.0)
                +.00095484999985067304 * Math.pow(z, 9.0)
                +.00060100384589636039 * Math.pow(z,11.0)
                -.00010128858286776622 * Math.pow(z,13.0)
                -.00006865733449299826 * Math.pow(z,15.0)
                +.00000059853667915386 * Math.pow(z,17.0)
                +.00000333165985123995 * Math.pow(z,19.0)
                +.00000021919289102435 * Math.pow(z,21.0)
                -.00000007890884245681 * Math.pow(z,23.0)
                -.00000000941468508130 * Math.pow(z,25.0)
                +.00000000095701162109 * Math.pow(z,27.0)
                +.00000000018763137453 * Math.pow(z,29.0)
                -.00000000000443783768 * Math.pow(z,31.0)
                -.00000000000224267385 * Math.pow(z,33.0)
                -.00000000000003627687 * Math.pow(z,35.0)
                +.00000000000001763981 * Math.pow(z,37.0)
                +.00000000000000079608 * Math.pow(z,39.0)
                -.00000000000000009420 * Math.pow(z,41.0)
                -.00000000000000000713 * Math.pow(z,43.0)
                +.00000000000000000033 * Math.pow(z,45.0)
                +.00000000000000000004 * Math.pow(z,47.0));
    else
        return (+.00046483389361763382 * Math.pow(z, 0.0)
                -.00100566073653404708 * Math.pow(z, 2.0)
                +.00024044856573725793 * Math.pow(z, 4.0)
                +.00102830861497023219 * Math.pow(z, 6.0)
                -.00076578610717556442 * Math.pow(z, 8.0)
                -.00020365286803084818 * Math.pow(z,10.0)
                +.00023212290491068728 * Math.pow(z,12.0)
                +.00003260214424386520 * Math.pow(z,14.0)
                -.00002557906251794953 * Math.pow(z,16.0)
                -.00000410746443891574 * Math.pow(z,18.0)
                +.00000117811136403713 * Math.pow(z,20.0)
                +.00000024456561422485 * Math.pow(z,22.0)
                -.00000002391582476734 * Math.pow(z,24.0)
                -.00000000750521420704 * Math.pow(z,26.0)
                +.00000000013312279416 * Math.pow(z,28.0)
                +.00000000013440626754 * Math.pow(z,30.0)
                +.00000000000351377004 * Math.pow(z,32.0)
                -.00000000000151915445 * Math.pow(z,34.0)
                -.00000000000008915418 * Math.pow(z,36.0)
                +.00000000000001119589 * Math.pow(z,38.0)
                +.00000000000000105160 * Math.pow(z,40.0)
                -.00000000000000005179 * Math.pow(z,42.0)
                -.00000000000000000807 * Math.pow(z,44.0)
                +.00000000000000000011 * Math.pow(z,46.0)
                +.00000000000000000004 * Math.pow(z,48.0));
}

let zeta = (t, n) =>
{
    let ZZ = 0;
    let R = 0;
    let N = Math.sqrt(t/(2.0 * Math.PI));
    let p = Math.sqrt(t/(2.0 * Math.PI)) - N;
    let th = theta(t);

    for(let j = 1; j <= N; ++j)
    {
        ZZ += Math.cos((th - t*Math.log(j))) / Math.sqrt(j);
    }
    ZZ = 2.0 * ZZ;

    for(let k = 0; k <= n; ++k)
    {
        R = R + C(k,2.0*p-1.0) * Math.pow(2.0*Math.PI/t, k*0.5);
    }
    R = even(N-1) * Math.pow(2.0 * Math.PI / t, 0.25) * R;

    let z = ZZ + R;
    return [z*Math.cos(th), -z*Math.sin(th), z];
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

var c1ExpMs, speedMs, angleMs, blackholeMs, warpMs;

var c1, c2, b;

var normCurrency, angleCurrency;

var init = () =>
{
    normCurrency = theory.createCurrency();
    angleCurrency = theory.createCurrency('ω', '\\omega');
    /* c1
    A sea one.
    */
    {
        
        let getDesc = (level) => `c_1=${getc1(level).toString(0)}`;
        let getInfo = (level) =>
        {
            if(c1ExpMs.level > 0)
                return `c_1^{${getc1Exp(c1ExpMs.level)}}=
                ${getc1(level).pow(getc1Exp(c1ExpMs.level)).toString()}`;

            return getDesc(level);
        }
        c1 = theory.createUpgrade(1, normCurrency, c1Cost);
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
        c2 = theory.createUpgrade(2, normCurrency, c2Cost);
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level));
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level),
        getInfo(c2.level + amount));
    }
    /* b
    A bee.
    */
    {
        let getDesc = (level) => getInfo(level);
        let getInfo = (level) => `b=${getb(level).toString(1)}`;
        b = theory.createUpgrade(3, normCurrency, bCost);
        b.getDescription = (_) => Utils.getMath(getDesc(b.level));
        b.getInfo = (amount) => Utils.getMathTo(getInfo(b.level),
        getInfo(b.level + amount));
        b.maxLevel = bMaxLevel;
    }
    
    theory.createPublicationUpgrade(0, normCurrency, permaCosts[0]);
    theory.createBuyAllUpgrade(1, normCurrency, permaCosts[1]);
    theory.createAutoBuyerUpgrade(2, normCurrency, permaCosts[2]);

    theory.setMilestoneCost(milestoneCost);
    /* c1 exponent
    Standard exponent upgrade.
    */
    {
        c1ExpMs = theory.createMilestoneUpgrade(0, c1ExpMaxLevel);
        c1ExpMs.description = Localization.getUpgradeIncCustomExpDesc('c_1',
        c1ExpInc);
        c1ExpMs.info = Localization.getUpgradeIncCustomExpInfo('c_1', c1ExpInc);
        c1ExpMs.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    /* Unlock omega
    Benefits from speed/exp.
    */
    {
        angleMs = theory.createMilestoneUpgrade(1, 1);
        angleMs.description = Localization.getUpgradeUnlockDesc(
        angleCurrency.symbol);
        angleMs.info = Localization.getUpgradeUnlockInfo(angleCurrency.symbol);
        angleMs.boughtOrRefunded = (_) =>
        {
            theory.invalidatePrimaryEquation();
            theory.invalidateQuaternaryValues();
            updateAvailability();
        }
    }
    /* Speed/exp
    Tradeoff.
    */
    {
        speedMs = theory.createMilestoneUpgrade(2, speedMaxLevel);
        speedMs.description =
        `${Localization.getUpgradeIncCustomDesc(getLoc('speed'),
        `${getSpeed(1)}\\times`)}; ${Localization.getUpgradeDecCustomDesc(
        Localization.format(getLoc('zExp'), '|\\zeta(s)|'), getLoc('half'))}`;
        speedMs.info = speedMs.description;
        speedMs.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    theory.primaryEquationScale = 0.96;
    theory.secondaryEquationHeight = 42;

    updateAvailability();
}

var updateAvailability = () =>
{
}

var isCurrencyVisible = (index) => (index && angleMs.level > 0) || !index;

var tick = (elapsedTime, multiplier) =>
{
    if(game.isCalculatingOfflineProgress)
        gameOffline = true;
    else if(gameOffline)
    {
        theory.clearGraph();
        gameOffline = false;
    }

    t += getSpeed(speedMs.level) / resolution * elapsedTime;

    let dTime = BigNumber.from(elapsedTime * multiplier);
    tTerm = BigNumber.from(t);
    let bonus = theory.publicationMultiplier;
    let c1Term = getc1(c1.level).pow(getc1Exp(c1ExpMs.level));
    let c2Term = getc2(c2.level);
    let z = zeta(t, 4);
    if(angleMs.level)
    {
        wTerm = BigNumber.from((z[0]*(z[1]-iCoord) - z[1]*(z[0]-rCoord)) /
        z[2]).abs();
        angleCurrency.value += wTerm * bonus;
    }
    rCoord = z[0];
    iCoord = z[1];
    zTerm = BigNumber.from(z[2]).abs().pow(getZetaExp(speedMs.level));
    let bTerm = getbTerm(b.level);

    normCurrency.value += dTime*tTerm*c1Term*c2Term*bonus / (zTerm+bTerm);

    theory.invalidateTertiaryEquation();
    theory.invalidateQuaternaryValues();
}

var getPrimaryEquation = () =>
{
    let rhoPart = `\\dot{\\rho}=\\frac{t\\times c_1
    ${c1ExpMs.level ? `^{${getc1Exp(c1ExpMs.level)}}`: ''}c_2}
    {|\\zeta(\\frac{1}{2}+it)|
    ${speedMs.level ? `^{${getZetaExp(speedMs.level).toString(speedMs.level)}}`
    : ''}+10^{-b}}`;
    if(!angleMs.level)
    {
        theory.primaryEquationHeight = 60;
        return rhoPart;
    }
    let omegaPart = `\\dot{\\omega}=\\Im\\left|\\frac{d\\zeta}{dt}\\right|`;
    theory.primaryEquationHeight = 84;
    return `\\begin{array}{c}${rhoPart}\\\\${omegaPart}\\end{array}`;
}

var getSecondaryEquation = () =>
{
    return `\\begin{array}{c}\\zeta(s)=\\sum_{n=1}^{\\infty}\\frac{1}{n^s},&
    ${theory.latexSymbol}=\\max\\rho\\end{array}`;
}

var getTertiaryEquation = () =>
{
    return `|\\zeta(\\frac{1}{2}+it)|=${zTerm.toString(3)}`;
}

var getQuaternaryEntries = () =>
{
    quaternaryEntries[0].value = t.toFixed(2);
    if(angleMs.level)
        quaternaryEntries[1].value = wTerm;
    return quaternaryEntries;
}

var getTau = () => normCurrency.value.pow(tauRate);

var getCurrencyFromTau = (tau) =>
[
    tau.max(BigNumber.ONE).pow(BigNumber.ONE / tauRate),
    normCurrency.symbol
];

var postPublish = () =>
{
    t = 0;
    theory.invalidatePrimaryEquation();
    theory.invalidateSecondaryEquation();
    theory.invalidateTertiaryEquation();
    updateAvailability();
}

var getInternalState = () => JSON.stringify
({
    version: version,
    t: t
})

var setInternalState = (stateStr) =>
{
    if(!stateStr)
        return;

    let state = JSON.parse(stateStr);
    if('t' in state)
        t = state.t;

    theory.invalidatePrimaryEquation();
    theory.invalidateTertiaryEquation();
}

var get3DGraphPoint = () => new Vector3(rCoord / scale, -iCoord / scale,
t / scale);

var get3DGraphTranslation = () => new Vector3(0, 0, -t / scale);

init();
