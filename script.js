var text_title = "I Love You";
var words = text_title.split(" ")

var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);
var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');
var img = new Image();
var imgData;
img.crossOrigin = "anonymous";


window.addEventListener('load', DrawPlaceholder)

function DrawPlaceholder() {
    img.onload = function () {
        DrawOverlay(img);
        DrawText();
        DynamicText(img)
    };
    //img.src = 'https://unsplash.it/400/400/?random';

}
function DrawOverlay(img) {
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(30, 144, 255, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function DrawText() {
    // ctx.fillStyle = "black";
    // ctx.textBaseline = 'middle';
    // ctx.font = "50px 'Montserrat'";
    // ctx.fillText(text_title, 50, 50);
}
function DynamicText(img) {
    // document.getElementById('name').addEventListener('keyup', function () {
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     DrawOverlay(img);
    //     DrawText();
    //     text_title = this.value;
    //     ctx.fillText(text_title, 50, 50);
    // });
}
function getInfo(e) {
    imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}
function handleImage(e) {
    var reader = new FileReader();


    reader.onload = function (event) {
        img.onload = function () {
            canvas.width = 400;
            canvas.height = 400;
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
        }
        img.src = event.target.result;
        src = event.target.result;
        canvas.classList.add("show");
        DrawOverlay(img);
        DrawText();
        DynamicText(img);

    }
    reader.readAsDataURL(e.target.files[0]);

}
function convertToImage() {
    window.open(canvas.toDataURL('png'));
}
document.getElementById('download').onclick = function download() {
    convertToImage();
}




function getImagePixelsColor() {



    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    console.log(imgData.data);
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    let i = 0
    let countOfText = 40
    let sizeOfWorld = canvas.width / countOfText // 40
    for (let y = 0; y < countOfText; y++) {
        for (let x = 0; x < countOfText; x++) {

            let red = imgData.data[i];
            let green = imgData.data[i + 1];
            let blue = imgData.data[i + 2];
            // imgData.data[i + 3] = 255;
            let bgcolor = imgData.data[i + 3];

            i += canvas.width * 4 / countOfText // 16000

            ctx.fillStyle = 'rgba(' + red + ',' + green + ',' + blue + ',' + (bgcolor / 255) + ')';
            console.log('rgba(' + red + ', ' + green + ', ' + blue + ',' + (bgcolor / 255.0) + ')');
            ctx.textBaseline = 'middle';
            let word = words[Math.round(Math.random() * (words.length - 1))]
            ctx.font = sizeOfWorld/word.length * 1.8 + "px 'Montserrat'";

            ctx.fillText(word, x * sizeOfWorld, y * sizeOfWorld);
        }
        //i -= canvas.width * 4 / countOfText
        i += canvas.width * 4 * sizeOfWorld // 640000

    }


}

function getOptymalSize(word) {
    length = word.length

}


// var img = new Image();
// img.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
// var canvas = document.getElementById('canvas');
// var ctx = canvas.getContext('2d');
// img.onload = function() {
//   ctx.drawImage(img, 0, 0);
//   img.style.display = 'none';
// };
// var color = document.getElementById('color');
// function pick(event) {
//   var x = event.layerX;
//   var y = event.layerY;
//   var pixel = ctx.getImageData(x, y, 1, 1);
//   var data = pixel.data;
//   var rgba = 'rgba(' + data[0] + ', ' + data[1] +
//              ', ' + data[2] + ', ' + (data[3] / 255) + ')';
//   color.style.background =  rgba;
//   color.textContent = rgba;
// }
// canvas.addEventListener('mousemove', pick);