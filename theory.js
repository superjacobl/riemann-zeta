import { BigNumber } from '../api/BigNumber';
import { ExponentialCost, FirstFreeCost, LinearCost, StepwiseCost } from '../api/Costs';
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
`We need a better introduction for the Zeta function.`,
    };

    return descs[language] || descs.en;
}
var authors = 'Martin_mc, Eylanding, propfeds\n\nThanks to:\nGlen Pugh, for ' +
'his implementation of the Riemann-Siegel formula\nSneaky, Gen & Gaunter, ' +
'for maths consultation';
var version = 0.25;

let gameOffline = false;
let t = 0;
let t_dot = 0;
let tTerm = BigNumber.ZERO;
let zTerm = BigNumber.ZERO;
let derivTerm = BigNumber.ZERO;
let rCoord = -1.4603545088095868;
let iCoord = 0;
let quaternaryEntries =
[
    new QuaternaryEntry('\\dot{t}', null),
    new QuaternaryEntry('t', null),
    new QuaternaryEntry('\\zeta \'', null)
];

const scale = 4;
const HALF = BigNumber.from(0.5);

// All balance parameters are aggregated for ease of access

const resolution = 4;
const speedMaxLevel = 1;
const getSpeed = (level) => 1 << (level * 2);
const getBlackholeSpeed = (z) => Math.min(z**2 + 0.02, 1/resolution);

const c1ExpMaxLevel = 3;
// The first 3 zeta zeroes lol
const c1ExpTable =
[
    BigNumber.ONE,
    BigNumber.from(1.14),
    BigNumber.from(1.21),
    BigNumber.from(1.25)
];
const getc1Exp = (level) => c1ExpTable[level];
const c1Cost = new FirstFreeCost(new ExponentialCost(220, 0.6));
const getc1 = (level) => Utils.getStepwisePowerSum(level, 2, 8, 0);

const c2Cost = new ExponentialCost(1400, 2.4);
const getc2 = (level) => BigNumber.TWO.pow(level);

const bMaxLevel = 8;
const bCost = new ExponentialCost(1e6, Math.log2(1e8));
const getb = (level) => BigNumber.ONE + HALF * (level/2);
const getbMarginTerm = (level) => BigNumber.TEN.pow(-getb(level));

const w1Cost = new StepwiseCost(new ExponentialCost(150000, 4.4), 10);
const getw1 = (level) => Utils.getStepwisePowerSum(level, 2, 8, 1);

const w2Cost = new ExponentialCost(1, Math.log2(100));
const getw2 = (level) => BigNumber.TWO.pow(level);

const permaCosts =
[
    BigNumber.TEN.pow(9),
    BigNumber.TEN.pow(14),
    BigNumber.TEN.pow(21)
];

const milestoneCost = new CompositeCost(2, new LinearCost(2.5, 2.5),
new LinearCost(10, 5));

const tauRate = 0.1;
const pubExp = 2;
var getPublicationMultiplier = (tau) => tau.pow(pubExp);
var getPublicationMultiplierFormula = (symbol) =>
`{${symbol}}^{${pubExp}}`;

const locStrings =
{
    en:
    {
        versionName: 'v0.2.5, Not the Bees!',
        speed: '\\text{speed}',
        zExp: '{{{0}}}\\text{{ exponent}}',
        half: '\\text{half}',
        blackhole: 'Unleash a black hole',
        blackholeInfo: 'Decreases {0} as {1} gets closer to the origin'
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

let interpolate = (t) =>
{
    let v1 = t*t;
    let v2 = 1 - (1-t)*(1-t);
    return v1*(1-t) + v2*t;
}

const zeta01Table =
[
    [
        -1.4603545088095868,
        0
    ],
    [
        -1.4553643660270397,
        -0.097816768303847834
    ],
    [
        -1.4405420816461549,
        -0.19415203999960912
    ],
    [
        -1.4163212212231056,
        -0.28759676077859003
    ],
    [
        -1.3833896356482762,
        -0.37687944704548237
    ],
    [
        -1.342642133546631,
        -0.46091792561979039
    ],
    [
        -1.2951228211781993,
        -0.53885377540755575
    ],
    [
        -1.241963631033884,
        -0.61006813708679553
    ],
    [
        -1.1843251208316332,
        -0.67417998953208147
    ],
    [
        -1.1233443487784422,
        -0.73102985025790079
    ],
    [
        -1.0600929156957051,
        -0.78065292187264657
    ],
    [
        -0.99554650742447182,
        -0.82324597632456875
    ],
    [
        -0.93056577332974644,
        -0.85913190352918178
    ],
    [
        -0.86588730259376534,
        -0.88872508711130638
    ],
    [
        -0.80212284363487529,
        -0.91249984322356881
    ],
    [
        -0.73976469567777448,
        -0.93096325430469185
    ],
    [
        -0.679195280748696,
        -0.94463296464946644
    ],
    [
        -0.62069916587171792,
        -0.954019930248939
    ],
    [
        -0.56447615104191817,
        -0.95961573448940385
    ],
    [
        -0.5106543967354793,
        -0.96188386780424429
    ],
    [
        -0.45930289034601818,
        -0.96125428450587913
    ],
    [
        -0.41044282155026063,
        -0.95812055392531381
    ],
    [
        -0.36405764581325084,
        -0.95283898111582577
    ],
    [
        -0.32010176657189976,
        -0.94572915808929037
    ],
    [
        -0.27850786866599236,
        -0.93707550120555738
    ],
    [
        -0.23919299859739693,
        -0.92712942212746241
    ],
    [
        -0.20206352115099815,
        -0.91611186212496687
    ],
    [
        -0.167019095423191,
        -0.90421598956695581
    ],
    [
        -0.13395581328989362,
        -0.89160991763812381
    ],
    [
        -0.10276863503870383,
        -0.87843934448552852
    ],
    [
        -0.073353244053944222,
        -0.86483005263542623
    ],
    [
        -0.045607427657960491,
        -0.850890230359152
    ],
    [
        -0.019432076150895955,
        -0.836712596410336
    ],
    [
        0.0052681222316752355,
        -0.82237632273994077
    ],
    [
        0.028584225755178324,
        -0.80794875873014349
    ],
    [
        0.050602769823360656,
        -0.7934869662472297
    ],
    [
        0.071405640533511838,
        -0.77903907825261309
    ],
    [
        0.091070056261173163,
        -0.76464549549431216
    ],
    [
        0.10966862939766708,
        -0.750339936434268
    ],
    [
        0.12726948615366909,
        -0.73615035542727014
    ],
    [
        0.14393642707718907,
        -0.722099743531673
    ]
];

// Linear interpolation lol
let zetaSmall = (t) =>
{
    let fullIndex = t * (zeta01Table.length - 1);
    let index = Math.floor(fullIndex);
    let offset = fullIndex - index;
    let re = zeta01Table[index][0]*(1-offset) + zeta01Table[index+1][0]*offset;
    let im = zeta01Table[index][1]*(1-offset) + zeta01Table[index+1][1]*offset;
    return [re, im, re*re + im*im];
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

let logLookup = [];
let sqrtLookup = [];

let riemannSiegelZeta = (t, n) =>
{
    let Z = 0;
    let R = 0;
    let fullN = Math.sqrt(t / (2*Math.PI));
    let N = Math.floor(fullN);
    let p = fullN - N;
    let th = theta(t);

    for(let j = 1; j <= N; ++j)
    {
        if(typeof logLookup[j] === 'undefined')
        {
            logLookup[j] = Math.log(j);
            sqrtLookup[j] = Math.sqrt(j);
        }
        Z += Math.cos(th - t*logLookup[j]) / sqrtLookup[j];
    }
    Z *= 2;

    for(let k = 0; k <= n; ++k)
    {
        R += C(k, 2*p-1) * Math.pow(2*Math.PI/t, k*0.5);
    }
    R *= even(N-1) * Math.pow(2*Math.PI/t, 0.25);

    Z += R;
    return [Z*Math.cos(th), -Z*Math.sin(th), Z];
}

let zeta = (t) =>
{
    if(t > 1)
        return riemannSiegelZeta(t, 4);
    if(t < 0.1)
        return zetaSmall(t);
    let offset = interpolate((t-0.1) * 10/9);
    let a = zetaSmall(t);
    let b = riemannSiegelZeta(t, 4);
    return [
        a[0]*(1-offset) + b[0]*offset,
        a[1]*(1-offset) + b[1]*offset,
        a[2]*(1-offset) + Math.abs(b[2])*offset
    ];
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

var warpPerma;

var c1ExpMs, speedMs, derivMs, w2Ms, blackholeMs;

var c1, c2, b, w1, w2;

var normCurrency, derivCurrency;

var init = () =>
{
    normCurrency = theory.createCurrency();
    derivCurrency = theory.createCurrency('δ', '\\delta');
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
        let getInfo = (level) => `b=${getb(level).toString()}`;
        b = theory.createUpgrade(3, normCurrency, bCost);
        b.getDescription = (_) => Utils.getMath(getDesc(b.level));
        b.getInfo = (amount) => Utils.getMathTo(getInfo(b.level),
        getInfo(b.level + amount));
        b.maxLevel = bMaxLevel;
    }
    /* w1
    A doublew 1.
    */
    {
        let getDesc = (level) => getInfo(level);
        let getInfo = (level) => `w_1=${getw1(level).toString(0)}`;
        w1 = theory.createUpgrade(4, derivCurrency, w1Cost);
        w1.getDescription = (_) => Utils.getMath(getDesc(w1.level));
        w1.getInfo = (amount) => Utils.getMathTo(getInfo(w1.level),
        getInfo(w1.level + amount));
        w1.isAvailable = false;
    }
    /* w2
    A doublew 2.
    */
    {
        let getDesc = (level) => `w_2=2^{${level}}`;
        let getInfo = (level) => `w_2=${getw2(level).toString(0)}`;
        w2 = theory.createUpgrade(5, derivCurrency, w2Cost);
        w2.getDescription = (_) => Utils.getMath(getDesc(w2.level));
        w2.getInfo = (amount) => Utils.getMathTo(getInfo(w2.level),
        getInfo(w2.level + amount));
        w2.isAvailable = false;
    }

    theory.createPublicationUpgrade(0, normCurrency, permaCosts[0]);
    theory.createBuyAllUpgrade(1, normCurrency, permaCosts[1]);
    theory.createAutoBuyerUpgrade(2, normCurrency, permaCosts[2]);
    /* Free penny
    For testing purposes
    */
    {
        let warpFive = theory.createPermanentUpgrade(9001, normCurrency,
        new FreeCost);
        warpFive.description = 'Get 5 penny for free';
        warpFive.info = 'Yields 5 penny';
        warpFive.bought = (_) => normCurrency.value = BigNumber.from(1e5) *
        (BigNumber.ONE + normCurrency.value);
    }

    theory.setMilestoneCost(milestoneCost);
    /* c1 exponent
    Standard exponent upgrade.
    */
    {
        c1ExpMs = theory.createMilestoneUpgrade(0, c1ExpMaxLevel);
        c1ExpMs.getDescription = (amount) =>
        Localization.getUpgradeIncCustomExpDesc('c_1',
        c1ExpTable[c1ExpMs.level + amount] - c1ExpTable[c1ExpMs.level] || 0);
        c1ExpMs.getInfo = (amount) =>
        Localization.getUpgradeIncCustomExpInfo('c_1',
        c1ExpTable[c1ExpMs.level + amount] - c1ExpTable[c1ExpMs.level] || 0);
        c1ExpMs.boughtOrRefunded = (_) =>
        {
            theory.invalidatePrimaryEquation();
            updateAvailability();
        }
    }
    /* Speed/exp
    Tradeoff.
    */
    // {
    //     speedMs = theory.createMilestoneUpgrade(2, speedMaxLevel);
    //     speedMs.description = Localization.getUpgradeIncCustomDesc(
    //     getLoc('speed'), `\\times${getSpeed(1)}`);
    //     speedMs.info = Localization.getUpgradeIncCustomInfo(getLoc('speed'),
    //     `\\times${getSpeed(1)}`);
    //     speedMs.isAvailable = false;
    // }
    /* Unlock omega
    Benefits from speed/exp.
    */
    {
        derivMs = theory.createMilestoneUpgrade(1, 1);
        derivMs.description = Localization.getUpgradeUnlockDesc(
        derivCurrency.symbol);
        derivMs.info = Localization.getUpgradeUnlockInfo(derivCurrency.symbol);
        derivMs.boughtOrRefunded = (_) =>
        {
            theory.invalidatePrimaryEquation();
            theory.invalidateQuaternaryValues();
            updateAvailability();
        }
        derivMs.canBeRefunded = () => w2Ms.level == 0;
    }
    /* w2
    */
    {
        w2Ms = theory.createMilestoneUpgrade(3, 1);
        w2Ms.description = Localization.getUpgradeAddTermDesc('w_2');
        w2Ms.info = Localization.getUpgradeAddTermInfo('w_2');
        w2Ms.boughtOrRefunded = (_) =>
        {
            theory.invalidatePrimaryEquation();
            updateAvailability();
        }
        w2Ms.isAvailable = false;
    }
    /* Blackhole
    Tradeoff.
    */
    {
        blackholeMs = theory.createMilestoneUpgrade(4, 1);
        blackholeMs.description = getLoc('blackhole');
        blackholeMs.info = Localization.format(getLoc('blackholeInfo'),
        Utils.getMath('\\dot{t}'), Utils.getMath('\\zeta(s)'));
        blackholeMs.isAvailable = false;
    }

    theory.primaryEquationScale = 0.96;
    theory.secondaryEquationScale = 0.96;
    theory.secondaryEquationHeight = 48;

    updateAvailability();
}

var updateAvailability = () =>
{
    w1.isAvailable = derivMs.level > 0;
    w2Ms.isAvailable = derivMs.level > 0;
    w2.isAvailable = w2Ms.level > 0;
    blackholeMs.isAvailable = c1ExpMs.level == c1ExpMaxLevel &&
    w2Ms.level > 0;
}

var isCurrencyVisible = (index) => (index && derivMs.level > 0) || !index;

var tick = (elapsedTime, multiplier) =>
{
    t_dot = (blackholeMs.level ? getBlackholeSpeed(zTerm.toNumber()) :
    1 / resolution);
    let dt = t_dot * elapsedTime;
    t += dt;

    tTerm = BigNumber.from(t);
    let bonus = BigNumber.from(elapsedTime * multiplier) *
    theory.publicationMultiplier;
    let w1Term = derivMs.level ? getw1(w1.level) : BigNumber.ONE;
    let w2Term = w2Ms.level ? getw2(w2.level) : BigNumber.ONE;
    let c1Term = getc1(c1.level).pow(getc1Exp(c1ExpMs.level));
    let c2Term = getc2(c2.level);
    let bTerm = getb(b.level);
    let z = zeta(t);
    if(t<0.25)
        log(`t=${t} ${z[0]} + ${z[1]}i`)
    if(derivMs.level)
    {
        let dr = z[0] - rCoord;
        let di = z[1] - iCoord;
        derivTerm = BigNumber.from(Math.sqrt(dr*dr + di*di) / dt);
        derivCurrency.value += derivTerm.pow(bTerm) * w1Term * w2Term * bonus;
    }
    rCoord = z[0];
    iCoord = z[1];
    zTerm = BigNumber.from(z[2]).abs();
    let bMTerm = getbMarginTerm(b.level);

    normCurrency.value += tTerm * c1Term * c2Term * w1Term * bonus /
    (zTerm.pow(bTerm) + bMTerm);

    theory.invalidateTertiaryEquation();
    theory.invalidateQuaternaryValues();
}

var getEquationOverlay = () =>
{
    let result = ui.createGrid
    ({
        inputTransparent: true,
        cascadeInputTransparent: false,
        children:
        [
            ui.createLatexLabel
            ({
                verticalTextAlignment: TextAlignment.START,
                margin: new Thickness(6, 4),
                text: getLoc('versionName'),
                fontSize: 9,
                textColor: Color.TEXT_MEDIUM
            })
        ]
    });
    return result;
}

var getPrimaryEquation = () =>
{
    let rhoPart = `\\dot{\\rho}=\\frac{t\\times c_1
    ${c1ExpMs.level ? `^{${getc1Exp(c1ExpMs.level)}}`: ''}c_2
    ${derivMs.level ? `\\times w_1`: ''}}{|\\zeta(\\frac{1}{2}+it)|^b+10^{-b}}`;
    if(!derivMs.level)
    {
        theory.primaryEquationHeight = 60;
        return rhoPart;
    }
    let omegaPart = `\\enspace\\dot{\\delta}=w_1${w2Ms.level ? 'w_2' : ''}
    \\times|\\zeta '(s)|^b`;
    theory.primaryEquationHeight = 84;
    return `\\begin{array}{c}${rhoPart}\\\\${omegaPart}\\end{array}`;
}

var getSecondaryEquation = () =>
{
    return `\\begin{array}{c}\\zeta(s)=\\frac{1}{\\Gamma(s)}\\int_{0}^{\\infty}
    \\frac{x^{s-1}\\,dx}{e^x-1},&${theory.latexSymbol}=\\max\\rho ^{${tauRate}}
    \\end{array}`;
}

var getTertiaryEquation = () =>
{
    return `|\\zeta(\\frac{1}{2}+it)|=${zTerm.toString(3)}`;
}

var getQuaternaryEntries = () =>
{
    quaternaryEntries[0].value = t_dot.toFixed(blackholeMs.level ? 3 : 2);
    quaternaryEntries[1].value = t.toFixed(2);
    if(derivMs.level)
        quaternaryEntries[2].value = derivTerm.toString(3);
    else
        quaternaryEntries[2].value = null;
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
    rCoord = -1.4603545088095868;
    iCoord = 0;
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
