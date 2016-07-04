var Fireworks;
(function (Fireworks_1) {
    Fireworks_1.TAU = Math.PI * 2;
    const MAX_ROCKETS = 5;
    function random(min, max) {
        return Math.random() * (max - min) + min;
    }
    Fireworks_1.random = random;
    class Fireworks {
        constructor(container) {
            Fireworks_1.rockets = [];
            Fireworks_1.particles = [];
            Fireworks_1.cw = container.clientWidth;
            Fireworks_1.ch = container.clientHeight;
            Fireworks_1.canvas = document.createElement('canvas');
            Fireworks_1.ctx = Fireworks_1.canvas.getContext('2d');
            Fireworks_1.canvas.width = Fireworks_1.cw;
            Fireworks_1.canvas.height = Fireworks_1.ch;
            container.appendChild(Fireworks_1.canvas);
            window.requestAnimationFrame(() => this.update());
        }
        update() {
            if (Fireworks_1.rockets.length < MAX_ROCKETS) {
                Fireworks_1.rockets.push(new Fireworks_1.Rocket());
            }
            Fireworks_1.ctx.globalCompositeOperation = 'destination-out';
            Fireworks_1.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            Fireworks_1.ctx.fillRect(0, 0, Fireworks_1.cw, Fireworks_1.ch);
            Fireworks_1.ctx.globalCompositeOperation = 'lighter';
            let x = null;
            x = Fireworks_1.rockets.length;
            while (x--) {
                Fireworks_1.rockets[x].render();
                Fireworks_1.rockets[x].update(x);
            }
            x = Fireworks_1.particles.length;
            while (x--) {
                Fireworks_1.particles[x].render();
                Fireworks_1.particles[x].update(x);
            }
            window.requestAnimationFrame(() => this.update());
        }
    }
    Fireworks_1.Fireworks = Fireworks;
})(Fireworks || (Fireworks = {}));
var Fireworks;
(function (Fireworks) {
    class Particle {
        constructor(position) {
            this.position = {
                x: position ? position.x : 0,
                y: position ? position.y : 0
            };
            this.velocity = {
                x: 0,
                y: 0
            };
            this.shrink = 0.75;
            this.size = 2;
            this.resistance = 1;
            this.gravity = 0;
            this.alpha = 1;
            this.fade = 0;
            this.hue = Fireworks.random(0, 360);
            this.brightness = Fireworks.random(50, 60);
            this.positions = [];
            let positionCount = 3;
            while (positionCount--) {
                this.positions.push(position);
            }
        }
        update(index) {
            this.positions.pop();
            this.positions.unshift({ x: this.position.x, y: this.position.y });
            this.velocity.x *= this.resistance;
            this.velocity.y *= this.resistance;
            this.velocity.y += this.gravity;
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            this.size *= this.shrink;
            this.alpha -= this.fade;
            if (!this.exists()) {
                Fireworks.particles.splice(index, 1);
            }
        }
        render() {
            const lastPosition = this.positions[this.positions.length - 1];
            Fireworks.ctx.beginPath();
            Fireworks.ctx.moveTo(lastPosition.x, lastPosition.y);
            Fireworks.ctx.lineTo(this.position.x, this.position.y);
            Fireworks.ctx.lineWidth = this.size;
            Fireworks.ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
            Fireworks.ctx.stroke();
        }
        exists() {
            if (this.alpha <= 0.1 || this.size <= 1) {
                return false;
            }
            if (this.position.x > Fireworks.cw || this.position.x < 0) {
                return false;
            }
            if (this.position.y > Fireworks.ch || this.position.y < 0) {
                return false;
            }
            return true;
        }
    }
    Fireworks.Particle = Particle;
})(Fireworks || (Fireworks = {}));
var Fireworks;
(function (Fireworks) {
    class Rocket extends Fireworks.Particle {
        constructor() {
            super({ x: Fireworks.random(0, Fireworks.cw), y: Fireworks.ch });
            this.velocity.y = Fireworks.random(-3, 0) - 4;
            this.velocity.x = Fireworks.random(0, 6) - 3;
            this.size = 3;
            this.shrink = 0.999;
            this.gravity = 0.01;
            this.fade = 0;
        }
        update(index) {
            super.update(index);
            if (this.position.y <= Fireworks.ch / 2 && Fireworks.random(0, 100) <= 80) {
                this.explode();
                Fireworks.rockets.splice(index, 1);
            }
        }
        explode() {
            const count = Fireworks.random(0, 10) + 100;
            for (let i = 0; i < count; i += 1) {
                const particle = new Fireworks.Particle(this.position);
                const angle = Fireworks.random(0, Fireworks.TAU);
                const speed = Math.cos(Fireworks.random(0, Fireworks.TAU)) * 15;
                particle.velocity.x = Math.cos(angle) * speed;
                particle.velocity.y = Math.sin(angle) * speed;
                particle.size = 3;
                particle.gravity = 0.2;
                particle.resistance = 0.92;
                particle.shrink = Fireworks.random(0, 0.05) + 0.93;
                particle.hue = this.hue;
                particle.brightness = this.brightness;
                Fireworks.particles.push(particle);
            }
        }
    }
    Fireworks.Rocket = Rocket;
})(Fireworks || (Fireworks = {}));
