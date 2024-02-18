import { Consts } from './Consts.js';
import { Color_square } from './Color_square.js';
import { Functions } from './Functions.js'

export class Color_picker {
    constructor() {
        this.html = document.getElementById('color_picker');
        this.html.width = Consts.cp_width;
        this.html.height = Consts.cp_height;
        this.context = this.html.getContext('2d');

        let max_cols = 0;
        for (let i = 0; i < Consts.cp_colors.length; i++) {
            max_cols = Math.max(max_cols, Consts.cp_colors[i].length);
        }

        Consts.cp_square_size = Math.min(
            Consts.cp_width / max_cols,
            Consts.cp_height / Consts.cp_colors.length); // const

        this.squares = [];
        for (let i = 0; i < Consts.cp_colors.length; i++) {
            this.squares.push([]);
            for (let j = 0; j < Consts.cp_colors[i].length; j++) {
                this.squares[i].push(new Color_square(
                    j * Consts.cp_square_size, i * Consts.cp_square_size, Consts.cp_colors[i][j]));
                console.log(this.squares[i][j]);
            }
        }

        this.chosen_index = { row: 0, col: 0 };
        this.mouse_index = { row: 0, col: 0 };
    }

    draw_all() {
        this.context.clearRect(0, 0, this.html.width, this.html.height);
        this.draw_squares();
        this.draw_grid();
        this.draw_chosen_color_highlight();
        this.draw_mouse_highlight();
    }

    draw_squares() {
        for (let i = 0; i < this.squares.length; i++) {
            for (let j = 0; j < this.squares[i].length; j++) {
                this.squares[i][j].draw(this.context);
            }
        }
    }

    draw_grid() {
        this.context.strokeStyle = Consts.grid_color;
        this.context.lineWidth = Consts.grid_width;

        let max_cols = 0;
        for (let i = 0; i < Consts.cp_colors.length; i++) {
            max_cols = Math.max(max_cols, Consts.cp_colors[i].length);
        }

        let max_width = max_cols * Consts.cp_square_size;
        let max_height = this.squares.length * Consts.cp_square_size;

        for (let i = 0; i < this.squares.length + 1; i++) {
            Functions.line(this.context,
                0, i * Consts.cp_square_size,
                max_width, i * Consts.cp_square_size);
        }

        for (let i = 0; i < this.squares[0].length + 1; i++) {
            Functions.line(this.context,
                i * Consts.cp_square_size, 0,
                i * Consts.cp_square_size, max_height);
        }
    }

    draw_chosen_color_highlight() {
        this.context.strokeStyle = Consts.grid_color;
        this.context.lineWidth = Consts.highlight_width;

        if (Functions.valid_indeces(this.squares, this.chosen_index.row, this.chosen_index.col)) {
            this.context.strokeRect(
                this.squares[this.chosen_index.row][this.chosen_index.col].x,
                this.squares[this.chosen_index.row][this.chosen_index.col].y,
                Consts.cp_square_size, Consts.cp_square_size);
        }
    }

    draw_mouse_highlight() {
        this.context.strokeStyle = Consts.grid_color;
        this.context.lineWidth = Consts.highlight_width;

        if (Functions.valid_indeces(this.squares, this.mouse_index.row, this.mouse_index.col)) {
            this.context.strokeRect(
                this.squares[this.mouse_index.row][this.mouse_index.col].x,
                this.squares[this.mouse_index.row][this.mouse_index.col].y,
                Consts.cp_square_size, Consts.cp_square_size);
        }
    }

    get_square_at(position) {
        let x = Math.floor(position.x / Consts.cp_square_size);
        let y = Math.floor(position.y / Consts.cp_square_size);

        if (Functions.valid_indeces(this.squares, y, x)) {
            return { row: y, col: x };
        }
        else {
            return { row: -1, col: -1 };
        }
    }
}