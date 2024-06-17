export class Functions {

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

    static int_to_hex(number) {
        return "#" + number.toString(16).padStart(6, "0");
    }
}