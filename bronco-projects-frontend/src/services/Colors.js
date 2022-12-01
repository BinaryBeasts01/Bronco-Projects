export const getDominantColor = (base64, isPng) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = `data:image/${isPng ? "png" : "jpeg"};base64, ${base64}`;

        image.onload = function () {
            //const colorThief = new ColorThief();
            const color = [0, 0, 0];
            resolve(color);
        }
    });
}

export default getDominantColor;