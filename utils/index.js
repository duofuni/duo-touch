
const RGBReg = /^#([0-9|a-f]{3}|[0-9|a-f]{6})$/
const RGBAReg = /^rgb+[a]?\((.*?)\)$/
const color16Reg = /^#([a-fA-F\d]{6}|[a-fA-F\d]{3})$/

export let color16ToRgbaObj = c => {
    let rgbaArr = [],
        color = c.toLowerCase();
    if (color && RGBReg.test(color)) {
        color.length === 4 && (color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`);

        for (var i = 1; i < 7; i += 2) {
            rgbaArr.push(parseInt("0x" + color.slice(i, i + 2)));
        }
    }
    if (RGBAReg.test(color)) {
        let [, v] = color.match(RGBAReg)
        rgbaArr = v.split(',')
    }

    return rgbaArr.length === 4 ? `rgba(${rgbaArr.join()})` : `rgba(${rgbaArr.join()},1)`
}
export let setStyleByName = (o, k, v) => { o && (o.style[k] = v) }

export let isNumber = v => (typeof v === 'number' || (typeof v === 'string' && !isNaN(v)))

export let isColorStr = v => (typeof v === 'string' && (RGBReg.test(v) || RGBAReg.test(v) || color16Reg.test(v)))

export let addKeyframes = () => {
    const style = document.createElement('style');
    style.innerHTML = `@keyframes duo__ripple__animation {
        0% {
          opacity: 1;
          transform: scale(1);
        }
      
        100% {
          opacity: 0;
          transform: scale(8);
        }
      }`;
    document.head.appendChild(style);
}
export const getCSSValue = (el, prop) => {
    if (prop in el.style) {
        return getComputedStyle(el).getPropertyValue(stringToHyphens(prop)) || '0';
    }
}
export let is = {
    arr: function (a) { return Array.isArray(a); },
    str: function (a) { return typeof a === 'string'; },
    fnc: function (a) { return typeof a === 'function'; }
};

let stringToHyphens = s => (s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase())
let t = 'transform';
export let rand = v => (Math.random() * v - v / 2)
export let transformString = (getCSSValue(document.body, t) ? t : '-webkit-' + t);
