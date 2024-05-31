class Canvas {
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
        for (let i = bound.first.col; i < bound.last.col + 2; i++) {
            Functions.line(this.context,
                i * Consts.square_size + this.translation.x, this.translation.y,
                i * Consts.square_size + this.translation.x, max_y);
        }
        for (let i = bound.first.row; i < bound.last.row + 2; i++) {
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
                this.squares[this.mouse_index.row][this.mouse_index.col].x + this.translation.x,
                this.squares[this.mouse_index.row][this.mouse_index.col].y + this.translation.y,
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

class Canvas_square {
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

class Color_picker {
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

class Color_square {
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

class Consts {
    static square_size = 50;
    static square_count = 20;
    static canvas_width = 800;
    static canvas_height = 600;
    static default_color = 'white';
    static cp_width = 400;
    static cp_height = 200;
    static cp_colors = [
        ['red', 'green', 'blue', 'yellow', 'brown', 'pink'],
        ['orange', 'black', 'white', 'purple']];
    static cp_square_size; // constant calculated at ./Color_picker.js:17
    static grid_color = 'black';
    static grid_width = 1;
    static highlight_width = 4;
}

class Functions {
    static valid_indeces(matrix, row, col) {
        return (
            0 <= row && row < matrix.length &&
            0 <= col && col < matrix[row].length
        );
    }
    static line(context, x1, y1, x2, y2) {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
    }
}

const canvas = new Canvas(document.getElementById('main_widget'));
const color_picker = new Color_picker(document.getElementById('color_picker'));
const translation_label = document.getElementById('translation_label');
const x_input = document.getElementById('x_input');
const y_input = document.getElementById('y_input');
const jump_button = document.getElementById('jump_button');
let canvas_info = {
    mouse_down_timestamp: 0
}
let color_picker_info = {
    mouse_down_timestamp: 0
}
function set_translation(square_count_x, square_count_y) {
    canvas.translation.x = -square_count_x * Consts.square_size;
    canvas.translation.y = -square_count_y * Consts.square_size;
    canvas.draw_all();
    translation_label.textContent = "x = " + square_count_x + " y = " + square_count_y;
}
canvas.html.addEventListener('mousedown', (event) => {
    if (event.buttons !== 1) {
        return;
    }
    canvas_info.mouse_down_timestamp = Date.now();
});
canvas.html.addEventListener('click', (event) => {
    if (!(Date.now() - canvas_info.mouse_down_timestamp < 200)) {
        return;
    }
    let pos = canvas.get_square_at({ x: event.offsetX, y: event.offsetY });
    if (!Functions.valid_indeces(canvas.squares, pos.row, pos.col)) {
        return;
    }
    canvas.squares[pos.row][pos.col].color
        = color_picker.squares[color_picker.chosen_index.row][color_picker.chosen_index.col].color;
    canvas.draw_all();
});
canvas.html.addEventListener('mousemove', (event) => {
    if (event.buttons === 1) {
        canvas_info.mouse_down_timestamp = 0; // Prevent click event from firing
        canvas.translation.x += event.movementX;
        canvas.translation.y += event.movementY;
        translation_label.textContent = "x = " + Math.floor(-canvas.translation.x / Consts.square_size) + " y = " + Math.floor(-canvas.translation.y / Consts.square_size);
        canvas.draw_all();
    } else if (event.buttons === 0) {
        let mouse_index_aux = canvas.get_square_at({ x: event.offsetX, y: event.offsetY });
        if (mouse_index_aux !== canvas.mouse_index) {
            canvas.mouse_index = mouse_index_aux;
            canvas.draw_all();
        }
    }
});
color_picker.html.addEventListener('mousedown', (event) => {
    if (event.buttons !== 1) {
        return;
    }
    color_picker_info.mouse_down_timestamp = Date.now();
});
color_picker.html.addEventListener('mousemove', (event) => {
    color_picker_info.mouse_down_timestamp = 0;
    if (event.buttons !== 0) {
        return;
    }
    let mouse_index_aux = color_picker.get_square_at({ x: event.offsetX, y: event.offsetY });
    if (mouse_index_aux != color_picker.mouse_index) {
        color_picker.mouse_index = mouse_index_aux;
        color_picker.draw_all();
    }
});
color_picker.html.addEventListener('click', (event) => {
    if (!(Date.now() - color_picker_info.mouse_down_timestamp < 200)) {
        return;
    }
    let aux_choice = color_picker.get_square_at({ x: event.offsetX, y: event.offsetY });
    if (aux_choice.row == -1 && aux_choice.col == -1) {
        return;
    }
    color_picker.chosen_index = aux_choice;
    color_picker.draw_all();
});
canvas.draw_all();
color_picker.draw_all();
function keypress_handler(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        let x, y;
        x = parseInt(x_input.value.trim());
        y = parseInt(y_input.value.trim());
        if(isNaN(x) || isNaN(y)) {
            return;
        }
        set_translation(x, y);
    }
}
x_input.addEventListener('keypress', keypress_handler);
y_input.addEventListener('keypress', keypress_handler);

