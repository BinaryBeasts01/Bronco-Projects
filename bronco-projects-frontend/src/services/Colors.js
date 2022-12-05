import {getColor} from "color-thief-node";

export const getDominantColor = (base64, type) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = `data:image/${type};base64, ${base64}`;

        image.onload = function () {
            const color = getColor(this, 10);
            resolve(color);
        }
    });
}

export default getDominantColor;