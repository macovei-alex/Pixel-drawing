import { Consts } from './Consts.js';

export class Canvas_square {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color
    }

    draw(context, translation) {
        context.beginPath();
        context.fillStyle = this.color;
        context.fillRect(this.x + translation.x, this.y + translation.y, Consts.square_size, Consts.square_size);
        context.stroke();
    }
}