import { Canvas } from "./Canvas.js";
import { Color_picker } from "./Color_picker.js";

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