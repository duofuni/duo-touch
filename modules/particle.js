import anime from "animejs/lib/anime.es.js";
import { is, rand, transformString, setStyleByName, getCSSValue } from "../utils/index.js";
class Particles {
    constructor(el, options) {
        let defaults = {
            type: 'circle',
            style: 'fill',
            color: '#000',
            canvasPadding: 150,
            duration: 1000,
            easing: 'easeInOutCubic',
            direction: 'left',
            size: function () { return Math.floor((Math.random() * 13) + 1); },
            speed: function () { return rand(4); },
            amount: 3,
            frequency: 20
        }
        this.el = el;
        this.isOnce = (options && options.once) || false
        this.isHidden = (options && options.hidden) || true
        this.options = this.extend(options, defaults);
        this.init();
    }
    init() {
        this.particles = [];
        this.frame = null;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.className = '__duo__particle_canvas';
        setStyleByName(this.canvas, 'position', 'absolute')
        setStyleByName(this.canvas, 'pointer-events', 'none')
        setStyleByName(this.canvas, 'top', '50%')
        setStyleByName(this.canvas, 'left', '50%')
        setStyleByName(this.canvas, 'transform', 'translate3d(-50%, -50%, 0)')
        setStyleByName(this.canvas, 'display', 'none')
        this.wrapper = document.createElement('div');
        this.wrapper.className = '__duo__particle_wrapper';
        setStyleByName(this.wrapper, 'position', 'relative')
        setStyleByName(this.wrapper, 'display', 'inline-block')
        setStyleByName(this.wrapper, 'overflow', 'hidden')
        this.el.parentNode.insertBefore(this.wrapper, this.el);
        this.wrapper.appendChild(this.el);
        this.parentWrapper = document.createElement('div');
        this.parentWrapper.className = '__duo__particle';
        setStyleByName(this.parentWrapper, 'display', 'inline-block')
        setStyleByName(this.parentWrapper, 'position', 'relative')
        this.wrapper.parentNode.insertBefore(this.parentWrapper, this.wrapper);
        this.parentWrapper.appendChild(this.wrapper);
        this.parentWrapper.appendChild(this.canvas);
        this.bindEvent()
    }
    loop() {
        this.updateParticles();
        this.renderParticles();
        if (this.isAnimating()) {
            this.frame = requestAnimationFrame(this.loop.bind(this));
        }
    }
    updateParticles() {
        let p;
        for (let i = 0; i < this.particles.length; i++) {
            p = this.particles[i];
            if (p.life > p.death) {
                this.particles.splice(i, 1);
            } else {
                p.x += p.speed;
                p.y = this.o.frequency * Math.sin(p.counter * p.increase);
                p.life++;
                p.counter += this.disintegrating ? 1 : -1;
            }
        }
        if (!this.particles.length) {
            this.pause();

            setStyleByName(this.canvas, 'display', 'none')
            if (is.fnc(this.o.complete)) {
                this.o.complete();
            }
        }
    }
    renderParticles() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        let p;
        for (let i = 0; i < this.particles.length; i++) {
            p = this.particles[i];
            if (p.life < p.death) {
                this.ctx.translate(p.startX, p.startY);
                this.ctx.rotate(p.angle * Math.PI / 180);
                this.ctx.globalAlpha = this.disintegrating ? 1 - p.life / p.death : p.life / p.death;
                this.ctx.fillStyle = this.ctx.strokeStyle = this.o.color;
                this.ctx.beginPath();

                switch (this.o.type) {
                    case 'circle':
                        this.ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
                        break;
                    case 'triangle':
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p.x + p.size, p.y + p.size);
                        this.ctx.lineTo(p.x + p.size, p.y - p.size);
                        break;
                    case 'rectangle':
                        this.ctx.rect(p.x, p.y, p.size, p.size);
                        break;
                }

                if (this.o.style === 'fill') {
                    this.ctx.fill();
                } else if (this.o.style === 'stroke') {
                    this.ctx.closePath();
                    this.ctx.stroke();
                }

                this.ctx.globalAlpha = 1;
                this.ctx.rotate(-p.angle * Math.PI / 180);
                this.ctx.translate(-p.startX, -p.startY);
            }
        }
    }
    play() {
        this.frame = requestAnimationFrame(this.loop.bind(this));
    }
    bindEvent() {
        this.el.addEventListener('click', () => {
            if (!this.isAnimating()) {
                this.disintegrate()
            }
        });
    }
    pause() {
        cancelAnimationFrame(this.frame);
        this.frame = null;
        if (this.disintegrating && !this.isOnce) {
            this.integrate({
                duration: 800,
                easing: 'easeOutSine'
            });
        }
    }
    // add particle to particle list
    addParticle(options) {
        let frames = this.o.duration * 60 / 1000;
        let speed = is.fnc(this.o.speed) ? this.o.speed() : this.o.speed;
        this.particles.push({
            startX: options.x,
            startY: options.y,
            x: this.disintegrating ? 0 : speed * -frames,
            y: 0,
            angle: rand(360),
            counter: this.disintegrating ? 0 : frames,
            increase: Math.PI * 2 / 100,
            life: 0,
            death: this.disintegrating ? (frames - 20) + Math.random() * 40 : frames,
            speed: speed,
            size: is.fnc(this.o.size) ? this.o.size() : this.o.size
        });
    }
    addParticles(rect, progress) {
        let x = this.options.canvasPadding,
            y = this.options.canvasPadding,
            progressDiff = this.disintegrating ?
                progress - this.lastProgress :
                this.lastProgress - progress,
            progressValue = (this.isHorizontal() ?
                rect.width :
                rect.height) * progress + progressDiff * (this.disintegrating ? 100 : 220);

        this.lastProgress = progress;

        if (this.isHorizontal()) {
            x += this.o.direction === 'left' ? progressValue : rect.width - progressValue;
        } else {
            y += this.o.direction === 'top' ? progressValue : rect.height - progressValue;
        }
        let i = Math.floor(this.o.amount * (progressDiff * 100 + 1));
        if (i > 0) {
            while (i--) {
                this.addParticle({
                    x: x + (this.isHorizontal() ? 0 : rect.width * Math.random()),
                    y: y + (this.isHorizontal() ? rect.height * Math.random() : 0)
                });
            }
        }
        if (!this.isAnimating()) {
            setStyleByName(this.canvas, 'display', 'block')
            this.play();
        }
    }
    addTransforms(value) {
        let translateProperty = this.isHorizontal() ? 'translateX' : 'translateY',
            translateValue = this.o.direction === 'left' || this.o.direction === 'top' ? value : -value;
        this.isHidden && setStyleByName(this.wrapper, transformString, `${translateProperty}(${translateValue}%)`)
        this.isHidden && setStyleByName(this.el, transformString, `${translateProperty}(${-translateValue}%)`)
    }
    disintegrate(options) {
        if (!this.isAnimating()) {
            this.disintegrating = true;
            this.lastProgress = 0;
            this.setup(options);

            this.animate((anim) => {
                let _ = this,
                    value = anim.animatables[0].target.value;

                _.addTransforms(value);
                if (_.o.duration) {
                    _.addParticles(_.rect, value / 100, true);
                }
            });
        }
    }
    integrate(options) {
        if (!this.isAnimating()) {
            this.disintegrating = false;
            this.lastProgress = 1;
            this.setup(options);
            let _ = this;
            this.animate(function (anim) {
                let value = anim.animatables[0].target.value;
                setTimeout(function () {
                    _.addTransforms(value);
                }, _.o.duration);
                if (_.o.duration) {
                    _.addParticles(_.rect, value / 100, true);
                }
            });
        }
    }
    setup(options) {
        this.o = this.extend({}, this.options, options);
        this.isHidden && setStyleByName(this.wrapper, 'visibility', 'visible')
        if (this.o.duration) {
            this.rect = this.el.getBoundingClientRect(); // {bottom left right top x y} 
            this.width = this.canvas.width = this.o.width || this.rect.width + this.o.canvasPadding * 2;
            this.height = this.canvas.height = this.o.height || this.rect.height + this.o.canvasPadding * 2;
        }
    }
    animate(update) {
        let _ = this;
        anime({
            targets: { value: _.disintegrating ? 0 : 100 },
            value: _.disintegrating ? 100 : 0,
            duration: _.o.duration,
            easing: _.o.easing,
            begin: _.o.begin,
            update: update,
            complete: function () {
                if (_.disintegrating) {
                    this.isHidden && setStyleByName(_.wrapper, 'visibility', 'visible')
                }
            },
        });
    }
    isAnimating() {
        return !!this.frame;
    }
    isHorizontal() {
        return this.o.direction === 'left' || this.o.direction === 'right';
    }
    extend(target, source) {
        !target && (target = {})
        for (let key in source) {
            !target[key] && (target[key] = source[key]);
        }
        return target;
    }

}
export default (el, value) => {
    new Particles(el, value);
}
