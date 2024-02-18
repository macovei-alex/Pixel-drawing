import { Canvas } from "./Canvas.js";
import { Color_picker } from "./Color_picker.js";

let canvas = new Canvas(document.getElementById('main_widget'));
let color_picker = new Color_picker(document.getElementById('color_picker'));

let canvas_info = {
    mouse_down_timestamp: 0
}

let color_picker_info = {
    mouse_down_timestamp: 0
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
    canvas.squares[pos.row][pos.col].color
        = color_picker.squares[color_picker.chosen_index.row][color_picker.chosen_index.col].color;

    canvas.draw_all();
});

canvas.html.addEventListener('mousemove', (event) => {
    if (event.buttons === 1) {

        canvas_info.mouse_down_timestamp = 0; // Prevent click event from firing

        canvas.translation.x += event.movementX;
        canvas.translation.y += event.movementY;
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

let transition_label = document.getElementById('transition_label');
let x_area = document.getElementById('x_area');
let y_area = document.getElementById('y_area');

function keypress_handler(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        let x = x_area.value.trim();
        let y = y_area.value.trim();
        transition_label.value = 'x = ' + x + 'y = ' + y;
    }
}

x_area.addEventListener('keypress', keypress_handler);
y_area.addEventListener('keypress', keypress_handler);