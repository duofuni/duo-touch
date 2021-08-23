import {
    color16ToRgbaObj,
    setStyleByName,
    isNumber,
    addKeyframes,
    isColorStr
} from "../utils/index.js";

export default (el, value) => {
    let x,
        y,
        background,
        transition = .5,
        defaultBg = 'rgb(132, 132, 132, 1)'

    addKeyframes()
    el.style.position = "relative";
    el.style.overflow = "hidden";

    el.onmousemove = function (e) {
        let { left, top } = el.getBoundingClientRect()
        x = e.clientX - left
        y = e.clientY - top;

        el.onclick = function () {
            let r, g, b, div = document.createElement('div');
            if (value) {
                let t = value.transition,
                    c = value.color,
                    p = value.plain
                p && (background = defaultBg)
                c && isColorStr(c) && (background = color16ToRgbaObj(c))
                t && isNumber(t) && (transition = +t)
            } else {
                r = Math.floor(Math.random() * 256)
                g = Math.floor(Math.random() * 256)
                b = Math.floor(Math.random() * 256)
                background = `rgb(${r}, ${g}, ${b}, 1)`
            }

            setStyleByName(div, 'left', x + 'px')
            setStyleByName(div, 'top', y + 'px')
            setStyleByName(div, 'border-radius', '50%')
            setStyleByName(div, 'width', '20px')
            setStyleByName(div, 'height', '20px')
            setStyleByName(div, 'position', 'absolute')
            setStyleByName(div, 'background', background)
            setStyleByName(div, 'animation', `duo__ripple__animation ${transition}s linear both 1`)

            el.appendChild(div);
            setTimeout(function () {
                el.removeChild(div);
            }, 600)
        }
    }
}