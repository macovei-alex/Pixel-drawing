import { Consts } from './Consts.js';

export class Color_square {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, Consts.cp_square_size, Consts.cp_square_size);
        context.stroke();
    }
}