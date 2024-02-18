import { Canvas_square } from './Canvas_square.js';
import { Consts } from './Consts.js';
import { Functions } from './Functions.js'

export class Canvas {
    constructor(canvas) {
        this.html = canvas;
        this.html.width = Consts.canvas_width;
        this.html.height = Consts.canvas_height;

        this.context = this.html.getContext('2d');

        this.translation = { x: 0, y: 0 };
        this.squares = [];
        for (let i = 0; i < Consts.square_count; i++) {
            this.squares.push([]);
            for (let j = 0; j < Consts.square_count; j++) {
                this.squares[i].push(
                    new Canvas_square(j * Consts.square_size, i * Consts.square_size, Consts.default_color));
            }
        }

        this.mouse_index = { row: -1, col: -1 };
    }

    draw_all() {
        this.context.clearRect(0, 0, this.html.width, this.html.height);

        let bound = this.get_bounding_squares();
        this.draw_squares(bound);
        this.draw_grid(bound);
        this.draw_mouse_highlight();
    }

    draw_grid(bound) {
        this.context.strokeStyle = Consts.grid_color;
        this.context.lineWidth = Consts.grid_width;

        let max_x = this.squares[0][bound.last.col].x + Consts.square_size + this.translation.x;
        let max_y = this.squares[bound.last.row][0].y + Consts.square_size + this.translation.y;

        for (let i = bound.first.col; i < bound.last.col + 1; i++) {
            Functions.line(this.context,
                i * Consts.square_size + this.translation.x, this.translation.y,
                i * Consts.square_size + this.translation.x, max_y);
        }

        for (let i = bound.first.row; i < bound.last.row + 1; i++) {
            Functions.line(this.context,
                this.translation.x, i * Consts.square_size + this.translation.y,
                max_x, i * Consts.square_size + this.translation.y);
        }
    }

    draw_squares(bound) {
        for (let i = bound.first.row; i < bound.last.row + 1; i++) {
            for (let j = bound.first.col; j < bound.last.col + 1; j++) {
                this.squares[i][j].draw(this.context, this.translation);
            }
        }
    }

    draw_mouse_highlight() {
        this.context.strokeStyle = Consts.grid_color;
        this.context.lineWidth = Consts.highlight_width;

        if (Functions.valid_indeces(this.squares, this.mouse_index.row, this.mouse_index.col)) {
            this.context.strokeRect(
                this.squares[this.mouse_index.row][this.mouse_index.col].x,
                this.squares[this.mouse_index.row][this.mouse_index.col].y,
                Consts.square_size, Consts.square_size);
        }
    }

    get_square_at(position) {
        let x = Math.floor((position.x - this.translation.x) / Consts.square_size);
        let y = Math.floor((position.y - this.translation.y) / Consts.square_size);

        return { row: y, col: x };
    }

    get_bounding_squares() {
        let first_square = this.get_square_at({ x: 0, y: 0 });
        first_square.row = Math.max(first_square.row, 0);
        first_square.col = Math.max(first_square.col, 0);

        let last_square = this.get_square_at({ x: this.html.width, y: this.html.height });
        last_square.row = Math.min(last_square.row, this.squares[0].length - 1);
        last_square.col = Math.min(last_square.col, this.squares.length - 1);

        return { first: first_square, last: last_square };
    }
}