class Particle {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D();
        this.acc = p5.Vector.random2D();
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
    }

    display() {
        ellipse(this.pos.x, this.pos.y, 10, 10);
    }
}