import { BigNumber } from '../api/BigNumber';
import { ConstantCost, ExponentialCost, FirstFreeCost, LinearCost, StepwiseCost, CustomCost, FreeCost } from '../api/Costs';
import { Localization } from '../api/Localization';
import { QuaternaryEntry, theory } from '../api/Theory';
import { ui } from '../api/ui/UI';
import { Utils } from '../api/Utils';
import { Vector3 } from '../api/Vector3';
import { Color } from '../api/ui/properties/Color';
import { LayoutOptions } from '../api/ui/properties/LayoutOptions';
import { TextAlignment } from '../api/ui/properties/TextAlignment';
import { Thickness } from '../api/ui/properties/Thickness';

var id = 'riemann_zeta_f';
var getName = (language) =>
{
    const names =
    {
        en: 'Riemann Zeta Function',
        'zh-Hans': '黎曼ζ函数',
        'zh-Hant': '黎曼ζ函数',
        es: 'Función de Riemann Zeta',
        vi: 'Hàm zeta Riemann'
    };

    return names[language] || names.en;
}
var getDescription = (language) =>
{
    const descs =
    {
        en:
`The function now known as the Riemann zeta function was first defined by ` +
`Euler for integers greater than 1 as an infinite series:
ζ(s) = 1 + 1/(2^s) + 1/(3^s) + ...
The definition was later extended to real numbers by Chebyshev, and to the ` +
`complex plane by Riemann. However, as it diverges on all s with a real ` +
`component less than 1, a special version of the function was to be defined ` +
`there in order to make the function continuous. This is known as an ` +
`analytic continuation, and it is related to this infamous meme:
1 + 2 + 3 + 4 + ... = -1/12 = ζ(-1)

In this theory, we will be examining the zeta function on the line ` +
`perpendicular to the x-axis at x = 0.5, known as the critical line. In ` +
`1859, it was hypothesised by Riemann himself that, other than the so-called ` +
`'trivial zeroes' lying at negative even integers -2, -4, -6, ..., every ` +
`other root of the function lies on this critical line.`,
        'zh-Hans':
`黎曼ζ函数首次由欧拉定义的，将大于 1 的整数定义为无限系列。
ζ(s) = 1 + 1/(2^s) + 1/(3^s) + ...
这个定义后来被切比雪夫扩展到实数，又被黎曼扩展到複數(a+bi)。然而，由于它在实数小于 1 的所有 s 上等于∞，因此要在此处改变函数的定义以使函数完全连续。这被称为解析开拓.这也造成了一个臭名的笑话:
1 + 2 + 3 + 4 + ... = -1/12 = ζ(-1)

在这个理论中，我们将探索在 x = 0.5 处垂直于 x 轴的直线（称为临界线）上的 zeta 函数。 1859 年，黎曼自己假设，除了位于负偶数 -2、-4、-6、... 处的所谓“平凡零点”之外，函数的所有其他根都位于这条临界线上。`,
        'zh-Hant':
`黎曼ζ函數首次由歐拉定義的，將大於 1 的整數定義為無限系列：
ζ(s) = 1 + 1/(2^s) + 1/(3^s) + ...
這個定義後來被切比雪夫擴展到實數，又被黎曼擴展到複數(a+bi)。然而，由於它在實數小於 1 的所有 s 上等於∞，因此要在此處改變函數的定義以使函數完全連續。這被稱為解析開拓。這也造成了一個臭名的笑話:
1 + 2 + 3 + 4 + ... = -1/12 = ζ(-1)

在這個理論中，我們將探索在 x = 0.5 處垂直於 x 軸的直線（稱為臨界線）上的 zeta 函數。 1859 年，黎曼自己假設，除了位於負偶數 -2、-4、-6、... 處的所謂“平凡零點”之外，函數的所有其他根都位於這條臨界線上。`,
        es:
`Esta función conocida como Riemann Zeta fue definida por Euler para los integrales mayores a 1 como una serie de infinitos:
ζ(s) = 1 + 1/(2^s) + 1/(3^s) + ...
Su definición fue extendida a los números reales gracias a Chebyshev, y luego al plano complejo gracias a Riemann. Sin embargo, a medida que diverge a todo s con un componente real menor a 1, una versión especial de la función fue definida para hacer la función continua. Esta se le conoce como la continuación analítica, y está relacionada a su infame meme:
1 + 2 + 3 + 4 + ... = -1/12 = ζ(-1)

En esta teoría, examinaremos la función de zeta en la línea perpendicular al axis-x cuando x = 0.5, conocido como la ruta crítica. En 1859, fue hipotetizado por el mismo Riemann que, excluyendo a los conocidos "ceros triviales" que permanecen con negativos integrales par -2, -4, -6, ... cada otra raíz de la función yace en esta ruta crítica.`,
        vi:
`Trước khi được mang tên Riemann, hàm zeta được định nghĩa bởi Euler dưới ` +
`dạng chuỗi vô hạn trên miền các số tự nhiên lớn hơn 1:
ζ(s) = 1 + 1/(2^s) + 1/(3^s) + ...
Định nghĩa hàm zeta được mở rộng tới các số thực bởi Chebyshev, và sau đó ` +
`đến số phức bởi Riemann. Tuy nhiên, do chuỗi này phân kì đối với các giá ` +
`trị s với phần thực nhỏ hơn 1, một "phiên bản" khác của hàm zeta được định ` +
`nghĩa trên vùng này để hàm được liên thông trên toàn mặt phẳng số phức. Đây ` +
`được gọi là thác triển giải tích, và thác triển giải tích của hàm zeta có ` +
`mối liên hệ đến một meme nổi tiếng:
1 + 2 + 3 + 4 + ... = -1/12 = ζ(-1)

Trong lí thuyết này, chúng ta sẽ khám phá hàm zeta trên đường thẳng x = 0.5, ` +
`gọi là đường tới hạn. Vào năm 1859, Riemann đã giả thuyết rằng, ngoài những ` +
`"không điểm tầm thường" nằm trên các số âm chẵn -2, -4, -6, ..., tất cả các ` +
`nghiệm của hàm đều nằm trên đường tới hạn này.`
    };

    return descs[language] || descs.en;
}
var authors = 'propfeds, Eylanding\nMartin_mc, previous maintainer\n\n' +
'Thanks to:\nGlen Pugh, for the Riemann-Siegel formula implementation\nXLII, ' +
'for teaching the ancient Sim language\nSneaky, Gen & Gaunter, for maths ' +
'consultation & other suggestions\n\nTranslations:\nOmega_3301 - 简体中文、' +
'繁體中文\nJooo#0529 - Español\npropfeds - Tiếng Việt';
var version = 0.4;

const versionName = 'v0.4';
const workInProgress = false;

let terms = 0;
let pubTime = 0;
let t = 0;
let t_dot = 0;
let zResult = [-1.4603545088095868, 0, 1.4603545088095868];
let zTerm = BigNumber.from(zResult[2]);
let dTerm = BigNumber.ZERO;
let lastZero = 0;
let searchingRewind = false;
let foundZero = false;
let bhzTerm = null;
let bhdTerm = null;
let quaternaryEntries =
[
    new QuaternaryEntry('\\dot{t}', null),
    new QuaternaryEntry('t', null),
    new QuaternaryEntry('\\zeta \'', null)
];

const scale = 4;

// All balance parameters are aggregated for ease of access

const derivRes = 100000;

const resolution = 4;
const getBlackholeSpeed = (z) => Math.min(z**2 + 0.004, 1/resolution);

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
const c1Cost = new FirstFreeCost(new ExponentialCost(225, 0.699));
const getc1 = (level) => Utils.getStepwisePowerSum(level, 2, 8, 0);

const c2Cost = new ExponentialCost(1500, 0.699 * 4);
const getc2 = (level) => BigNumber.TWO.pow(level);

const bMaxLevel = 6;
const bCost = new CompositeCost(1, new ConstantCost(1e15),
new CompositeCost(1, new ConstantCost(BigNumber.from(1e45)),
new CompositeCost(1, new ConstantCost(BigNumber.from('1e360')),
new CompositeCost(1, new ConstantCost(BigNumber.from('1e810')),
new CompositeCost(1, new ConstantCost(BigNumber.from('1e1050')),
new ConstantCost(BigNumber.from('1e1200')))))));
const getb = (level) => level / 2;
const bMarginTerm = BigNumber.from(1/100);

const w1Cost = new StepwiseCost(new ExponentialCost(12000, Math.log2(100)/3),
6);
const getw1 = (level) => Utils.getStepwisePowerSum(level, 2, 8, 1);

const w2Cost = new ExponentialCost(1e5, Math.log2(10));
const getw2 = (level) => BigNumber.TWO.pow(level);

const w3Cost = new ExponentialCost(BigNumber.TEN.sqrt() *
BigNumber.from('1e600'), BigNumber.from('1e30').log2());
const getw3 = (level) => BigNumber.TWO.pow(level);

const permaCosts =
[
    BigNumber.from(1e9),
    BigNumber.from(1e14),
    BigNumber.from(1e21),
    BigNumber.from('1e1000')
];

const tauRate = 0.1;
const pubExp = 2.102;
const pubMult = BigNumber.TWO;
var getPublicationMultiplier = (tau) => tau.pow(pubExp) * pubMult;
var getPublicationMultiplierFormula = (symbol) =>
`${pubMult.toString(0)}\\times{${symbol}}^{${pubExp}}`;

const milestoneCost = new CustomCost((level) =>
{
    if(level == 0) return BigNumber.from(25 * tauRate);
    if(level == 1) return BigNumber.from(50 * tauRate);
    if(level == 2) return BigNumber.from(125 * tauRate);
    if(level == 3) return BigNumber.from(250 * tauRate);
    if(level == 4) return BigNumber.from(400 * tauRate);
    if(level == 5) return BigNumber.from(600 * tauRate);
    return BigNumber.from(-1);
});

const locStrings =
{
    en:
    {
        wip: '(WIP)\\\\{0}',
        pubTime: 'Time: {0}',
        terms: 'Riemann-Siegel terms: {0}',
        speed: '\\text{speed}',
        zExp: '{{{0}}}\\text{{ exponent}}',
        half: '\\text{half}',
        condition: '\\text{{if }}{{{0}}}',
        blackhole: 'Unleash a black hole',
        blackholeInfo: 'Pulls {0} backwards to the nearest zero of {1}',
        rotationLock:
        [
            'Unlock graph',
            'Lock graph'
        ],
        rotationLockInfo: 'Toggles the ability to rotate and zoom the 3D graph',
        overlay:
        [
            'Display info',
            'Hide info',
        ],
        overlayInfo: 'Toggles the display of Riemann-Siegel terms and ' +
        'publication time',
        warpFive: 'Get 5 penny with consequences',
        warpFiveInfo: 'Testing tool: {0}{1}\\ by {2}'
    },
    'zh-Hans':
    {
        wip: '(正在进行中)\n{0}',
        pubTime: '出版时间：{0}',
        terms: '黎曼-西格尔项：{0}',
        blackhole: '释放一个黑洞',
        blackholeInfo: '将 {0} 拉至于离 {1} 最接近的零',
        rotationLock:
        [
            '解锁图形',
            '锁定图形'
        ],
        rotationLockInfo: '切换旋转和缩放 3D 图形的能力',
        overlay:
        [
            '显示信息',
            '隐藏信息',
        ],
        overlayInfo: '切换 黎曼-西格尔项和出版时间的显示',
    },
    'zh-Hant':
    {
        wip: '(正在進行中)\n{0}',
        pubTime: '出版時間：{0}',
        terms: '黎曼-西格爾項：{0}',
        blackhole: '釋放一個黑洞',
        blackholeInfo: '將 {0} 拉至於離 {1} 最接近的零',
        rotationLock:
        [
            '解鎖圖形',
            '鎖定圖形'
        ],
        rotationLockInfo: '切換旋轉和縮放 3D 圖形的能力',
        overlay:
        [
            '顯示信息',
            '隱藏信息',
        ],
        overlayInfo: '切換 黎曼-西格爾項和出版時間的顯示',
    },
    es:
    {
        wip: '(TEP)\\\\{0}',
        pubTime: 'Tiempo: {0}',
        terms: 'Terminos de Riemann-Siegel: {0}',
        blackhole: 'Desata un agujero negro',
        blackholeInfo: 'Atrae {0} hacia atrás al cero más cercano de {1}',
        rotationLock:
        [
            'Desbloquear gráfica',
            'Bloquear gráfica'
        ],
        rotationLockInfo: 'Alterna la abilidad de rotar y acercar la gráfica 3D',
        overlay:
        [
            'Mostrar info',
            'Ocultar info',
        ],
        overlayInfo: 'Alternar la presentación de Riemann-Siegel en los términos y tiempo de publicación',
    },
    vi:
    {
        wip: '(Đang dở)\\\\{0}',
        pubTime: 'Thời gian: {0}',
        terms: 'Riemann-Siegel: {0} số hạng',
        speed: '\\text{tốc độ}',
        zExp: '{{{0}}}\\text{{ số mũ}}',
        half: '\\text{một nửa}',
        condition: '\\text{{khi }}{{{0}}}',
        blackhole: 'Giải phóng hố đen',
        blackholeInfo: 'Kéo {0} ngược lại tới không điểm gần nhất của {1}',
        rotationLock:
        [
            'Mở khoá đồ thị',
            'Khoá đồ thị'
        ],
        rotationLockInfo: 'Bật tắt khả năng quay và phóng to đồ thị 3D',
        overlay:
        [
            'Hiển thị thông tin',
            'Giấu thông tin',
        ],
        overlayInfo: 'Bật tắt số hạng hàm Riemann-Siegel và thời gian',
        warpFive: 'Nhận 5 đồng nhưng có hậu quả',
        warpFiveInfo: 'Công cụ thử nghiệm: {0}{1}\\ với {2}'
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
    return [re, im, Math.sqrt(re*re + im*im)];
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
    terms = N;

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
/**
 * Returns re, im and Z in an array.
 */
let zeta = (T) =>
{
    let t = Math.abs(T);
    let z;
    if(t >= 1)
        z = riemannSiegelZeta(t, 1);
    else if(t < 0.1)
        z = zetaSmall(t);
    else
    {
        let offset = interpolate((t-0.1) * 10/9);
        let a = zetaSmall(t);
        let b = riemannSiegelZeta(t, 1);
        z = [
            a[0]*(1-offset) + b[0]*offset,
            a[1]*(1-offset) + b[1]*offset,
            a[2]*(1-offset) + Math.abs(b[2])*offset
        ];
    }
    if(T < 0)
        z[1] = -z[1];
    return z;
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

var c1, c2, b, w1, w2, w3;
var c1ExpMs, derivMs, w2Ms, blackholeMs;
var w3Perma, rotationLock, overlayToggle;

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
    /* w3
    A doublew 3.
    */
    {
        let getDesc = (level) => `w_3=2^{${level}}`;
        let getInfo = (level) => `w_3=${getw3(level).toString(0)}`;
        w3 = theory.createUpgrade(6, derivCurrency, w3Cost);
        w3.getDescription = (_) => Utils.getMath(getDesc(w3.level));
        w3.getInfo = (amount) => Utils.getMathTo(getInfo(w3.level),
        getInfo(w3.level + amount));
        w3.isAvailable = false;
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

    theory.createPublicationUpgrade(0, normCurrency, permaCosts[0]);
    theory.createAutoBuyerUpgrade(1, normCurrency, permaCosts[1]);
    theory.createBuyAllUpgrade(2, normCurrency, permaCosts[2]);
    /* w3
    Standard doubling.
    */
    {
        w3Perma = theory.createPermanentUpgrade(3, normCurrency,
        new ConstantCost(permaCosts[3]));
        w3Perma.description = Localization.getUpgradeAddTermDesc('w_3');
        w3Perma.info = Localization.getUpgradeAddTermInfo('w_3');
        w3Perma.boughtOrRefunded = (_) =>
        {
            theory.invalidatePrimaryEquation();
            updateAvailability();
        }
        w3Perma.maxLevel = 1;
    }
    /* Rotation lock
    Look sideway.
    */
    {
        rotationLock = theory.createPermanentUpgrade(10, normCurrency,
        new FreeCost);
        rotationLock.getDescription = () => getLoc('rotationLock')[
        rotationLock.level];
        rotationLock.info = getLoc('rotationLockInfo');
        rotationLock.boughtOrRefunded = (_) =>
        {
            rotationLock.level &= 1;
        }
    }
    /* Overlay toggle
    Look forward.
    */
    {
        overlayToggle = theory.createPermanentUpgrade(11, normCurrency,
        new FreeCost);
        overlayToggle.getDescription = () => getLoc('overlay')[
        overlayToggle.level];
        overlayToggle.info = getLoc('overlayInfo');
        overlayToggle.boughtOrRefunded = (_) =>
        {
            overlayToggle.level &= 1;
        }
    }
    /* Free penny
    For testing purposes.
    */
    // {
    //     warpFive = theory.createPermanentUpgrade(9001, normCurrency,
    //     new FreeCost);
    //     warpFive.description = getLoc('warpFive');
    //     warpFive.info = Localization.format(getLoc('warpFiveInfo'),
    //     Utils.getMath('\\times'), Utils.getMath('\\rho'),
    //     Utils.getMath('1e5'));
    //     warpFive.bought = (_) => normCurrency.value = BigNumber.from(1e5) *
    //     (BigNumber.ONE + normCurrency.value);
    // }

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
    //     getLoc('speed'), `${getSpeed(1)}`);
    //     speedMs.info = Localization.getUpgradeIncCustomInfo(getLoc('speed'),
    //     `${getSpeed(1)}`);
    //     speedMs.isAvailable = false;
    // }
    /* Unlock delta
    Based on the 'derivative' of zeta (roughly calculated).
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
    Standard doubling.
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
    Tradeoff. Use for coasting.
    */
    {
        blackholeMs = theory.createMilestoneUpgrade(4, 1);
        blackholeMs.description = getLoc('blackhole');
        blackholeMs.info = Localization.format(getLoc('blackholeInfo'),
        Utils.getMath('t'), Utils.getMath('\\zeta(s)'));
        blackholeMs.bought = (_) =>
        {
            searchingRewind = true;
            foundZero = false;
            bhzTerm = null;
            bhdTerm = null;
            if(lastZero)
                t = lastZero;
        }
        blackholeMs.refunded = (_) =>
        {
            if(foundZero)
                lastZero = t;
            searchingRewind = false;
            foundZero = false;
            bhzTerm = null;
            bhdTerm = null;
        }
        blackholeMs.isAvailable = false;
    }

    theory.primaryEquationScale = 0.96;
    // theory.primaryEquationHeight = 84;
    // theory.secondaryEquationScale = 0.96;
    theory.secondaryEquationHeight = 60;

    updateAvailability();
}

var updateAvailability = () =>
{
    w1.isAvailable = derivMs.level > 0;
    w2Ms.isAvailable = derivMs.level > 0;
    w2.isAvailable = w2Ms.level > 0;
    w3.isAvailable = w3Perma.level > 0;
    blackholeMs.isAvailable = c1ExpMs.level == c1ExpMaxLevel && w2Ms.level > 0;
}

var isCurrencyVisible = (index) => (index && derivMs.level > 0) || !index;

var tick = (elapsedTime, multiplier) =>
{
    if(!c1.level)
        return;

    pubTime += elapsedTime;
    if(!blackholeMs.level || t < 14)
    {
        t_dot = 1 / resolution;
        t += t_dot * elapsedTime;
    }

    let tTerm = BigNumber.from(t);
    let bonus = BigNumber.from(elapsedTime * multiplier) *
    theory.publicationMultiplier;
    let w1Term = derivMs.level ? getw1(w1.level) : BigNumber.ONE;
    let w2Term = w2Ms.level ? getw2(w2.level) : BigNumber.ONE;
    let w3Term = w2Ms.level ? getw3(w3.level) : BigNumber.ONE;
    let c1Term = getc1(c1.level).pow(getc1Exp(c1ExpMs.level));
    let c2Term = getc2(c2.level);
    let bTerm = getb(b.level);

    if(!blackholeMs.level || !foundZero)
    {
        let prevZ = zResult[2];
        zResult = zeta(t);
        if(zResult[2] * prevZ <= 0 && !game.isCalculatingOfflineProgress)
            lastZero = t;
        if(derivMs.level)
        {
            let tmpZ = zeta(t + 1 / derivRes);
            let dr = tmpZ[0] - zResult[0];
            let di = tmpZ[1] - zResult[1];
            dTerm = BigNumber.from(Math.sqrt(dr*dr + di*di) * derivRes);
            derivCurrency.value += dTerm.pow(bTerm) * w1Term * w2Term * w3Term *
            bonus;
            if(blackholeMs.level && t >= 14 && !dTerm.isZero)
            {
                let d = (tmpZ[2] - zResult[2]) * derivRes;
                let bhdt = zResult[2] / d;
                // Not very accurate this way but eh (xdd)
                if(searchingRewind && bhdt < 0)
                {
                    t_dot = 1 / resolution;
                    t += t_dot * elapsedTime;
                }
                else
                {
                    t_dot = bhdt / elapsedTime;
                    t -= bhdt;
                    searchingRewind = false;
                    if(Math.abs(bhdt) < 1e-8)
                        foundZero = true;
                }
            }
        }
        zTerm = BigNumber.from(zResult[2]).abs();

        normCurrency.value += tTerm * c1Term * c2Term * w1Term * bonus /
        (zTerm / BigNumber.TWO.pow(bTerm) + bMarginTerm);
    }
    else
    {
        if(!bhzTerm || !bhdTerm)
        {
            zResult = zeta(t);
            let tmpZ = zeta(t + 1 / derivRes);
            let dr = tmpZ[0] - zResult[0];
            let di = tmpZ[1] - zResult[1];
            bhdTerm = BigNumber.from(Math.sqrt(dr*dr + di*di) * derivRes);
            bhzTerm = BigNumber.from(zResult[2]).abs();
        }
        derivCurrency.value += bhdTerm.pow(bTerm) * w1Term * w2Term * w3Term *
        bonus;
        normCurrency.value += tTerm * c1Term * c2Term * w1Term * bonus /
        (bhzTerm / BigNumber.TWO.pow(bTerm) + bMarginTerm);
    }

    theory.invalidateTertiaryEquation();
    theory.invalidateQuaternaryValues();
}

var getEquationOverlay = () =>
{
    const unicodeLangs =
    {
        'zh-Hans': true,
        'zh-Hant': true
    };
    let result = ui.createGrid
    ({
        inputTransparent: () => rotationLock.level ? true : false,
        cascadeInputTransparent: false,
        children:
        [
            ui.createLabel
            ({
                isVisible: () => menuLang in unicodeLangs ? true : false,
                verticalOptions: LayoutOptions.END,
                margin: new Thickness(6, 4),
                text: workInProgress ? Localization.format(getLoc('wip'),
                versionName) : versionName,
                fontSize: 11,
                textColor: Color.TEXT_MEDIUM
            }),
            ui.createLatexLabel
            ({
                isVisible: () => !(menuLang in unicodeLangs) ? true : false,
                verticalOptions: LayoutOptions.END,
                margin: new Thickness(6, 4),
                text: workInProgress ? Localization.format(getLoc('wip'),
                versionName) : versionName,
                fontSize: 9,
                textColor: Color.TEXT_MEDIUM
            }),
            ui.createLabel
            ({
                isVisible: () => overlayToggle.level &&
                menuLang in unicodeLangs ? true : false,
                horizontalOptions: LayoutOptions.END,
                verticalOptions: LayoutOptions.END,
                verticalTextAlignment: TextAlignment.START,
                margin: new Thickness(6, 4),
                text: () =>
                {
                    let minutes = Math.floor(pubTime / 60);
                    let seconds = pubTime - minutes*60;
                    let timeString;
                    if(minutes >= 60)
                    {
                        let hours = Math.floor(minutes / 60);
                        minutes -= hours*60;
                        timeString = `${hours}:${
                        minutes.toString().padStart(2, '0')}:${
                        seconds.toFixed(1).padStart(4, '0')}`;
                    }
                    else
                    {
                        timeString = `${minutes.toString()}:${
                        seconds.toFixed(1).padStart(4, '0')}`;
                    }
                    return Localization.format(getLoc('pubTime'),
                    timeString);
                },
                fontSize: 11,
                textColor: Color.TEXT_MEDIUM
            }),
            ui.createLatexLabel
            ({
                isVisible: () => overlayToggle.level &&
                !(menuLang in unicodeLangs) ? true : false,
                horizontalOptions: LayoutOptions.END,
                verticalOptions: LayoutOptions.END,
                verticalTextAlignment: TextAlignment.START,
                margin: new Thickness(6, 4),
                text: () =>
                {
                    let minutes = Math.floor(pubTime / 60);
                    let seconds = pubTime - minutes*60;
                    let timeString;
                    if(minutes >= 60)
                    {
                        let hours = Math.floor(minutes / 60);
                        minutes -= hours*60;
                        timeString = `${hours}:${
                        minutes.toString().padStart(2, '0')}:${
                        seconds.toFixed(1).padStart(4, '0')}`;
                    }
                    else
                    {
                        timeString = `${minutes.toString()}:${
                        seconds.toFixed(1).padStart(4, '0')}`;
                    }
                    return Localization.format(getLoc('pubTime'),
                    timeString);
                },
                fontSize: 9,
                textColor: Color.TEXT_MEDIUM
            }),
            ui.createLabel
            ({
                isVisible: () => overlayToggle.level &&
                menuLang in unicodeLangs ? true : false,
                horizontalOptions: LayoutOptions.END,
                verticalOptions: LayoutOptions.START,
                margin: new Thickness(6, 4),
                text: () => Localization.format(getLoc('terms'), terms),
                fontSize: 11,
                textColor: Color.TEXT_MEDIUM
            }),
            ui.createLatexLabel
            ({
                isVisible: () => overlayToggle.level &&
                !(menuLang in unicodeLangs) ? true : false,
                horizontalOptions: LayoutOptions.END,
                verticalOptions: LayoutOptions.START,
                margin: new Thickness(6, 4),
                text: () => Localization.format(getLoc('terms'), terms),
                fontSize: 9,
                textColor: Color.TEXT_MEDIUM
            })
        ]
    });
    return result;
}

var getPrimaryEquation = () =>
{
    let rhoPart = `\\dot{\\rho}=\\frac{t{\\mkern 1mu}c_1
    ${c1ExpMs.level ? `^{${getc1Exp(c1ExpMs.level)}}`: ''}c_2
    ${derivMs.level ? ` w_1`: ''}}{|\\zeta(\\frac{1}{2}+it)|/2^{b}+10^{-2}}`;
    if(!derivMs.level)
    {
        theory.primaryEquationHeight = 66;
        return rhoPart;
    }
    let omegaPart = `\\,\\dot{\\delta}=w_1
    ${w2Ms.level ? 'w_2' : ''}${w3Perma.level ? 'w_3' : ''}\\times
    |\\zeta '(\\textstyle\\frac{1}{2}+it)|^b`;
    theory.primaryEquationHeight = 75;
    return `\\begin{array}{c}${rhoPart}\\\\${omegaPart}\\end{array}`;
}

var getSecondaryEquation = () =>
{
    return `\\begin{array}{c}\\zeta(s)=
    \\displaystyle\\sum_{n=1}^{\\infty}n^{-s},&
    ${theory.latexSymbol}=\\max\\rho ^{${tauRate}}\\end{array}`;
    return `\\begin{array}{c}\\zeta(\\textstyle\\frac{1}{2}+it)=
    \\displaystyle\\sum_{n=1}^{\\infty}
    \\frac{(-1)^{n+1}}{n^{1/2+it}(1-2^{1/2-it})}\\\\\\\\
    \\enspace${theory.latexSymbol}=\\max\\rho ^{${tauRate}}\\end{array}`;
}

var getTertiaryEquation = () =>
{
    return `|\\zeta(\\frac{1}{2}+it)|=${(bhzTerm ?? zTerm).toString(3)}`;
}

var getQuaternaryEntries = () =>
{
    quaternaryEntries[0].value = t_dot.toFixed(2);
    quaternaryEntries[1].value = t.toFixed(2);
    if(derivMs.level)
        quaternaryEntries[2].value = (bhdTerm ?? dTerm).toString(3);
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
    pubTime = 0;
    t = 0;
    t_dot = 0;
    zResult = [-1.4603545088095868, 0, 1.4603545088095868];
    zTerm = BigNumber.from(zResult[2]);
    dTerm = BigNumber.ZERO;
    lastZero = 0;
    searchingRewind = false;
    foundZero = false;

    theory.invalidatePrimaryEquation();
    theory.invalidateSecondaryEquation();
    theory.invalidateTertiaryEquation();
    theory.invalidateQuaternaryValues();
    updateAvailability();
}

var getInternalState = () => JSON.stringify
({
    version: version,
    t: t,
    pubTime: pubTime
})

var setInternalState = (stateStr) =>
{
    if(!stateStr)
        return;

    let state = JSON.parse(stateStr);
    if('t' in state)
        t = state.t;
    if('pubTime' in state)
        pubTime = state.pubTime;

    theory.invalidatePrimaryEquation();
    theory.invalidateTertiaryEquation();
}

var get3DGraphPoint = () => new Vector3(zResult[0] / scale, -zResult[1] / scale,
t / scale);

var get3DGraphTranslation = () => new Vector3(0, 0, -t / scale);

init();
