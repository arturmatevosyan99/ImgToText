var text_title = "I Love You";
var words = text_title.split("")

words = words.filter(function (str) {
    return /\S/.test(str);
});

var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);
var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');
var img = new Image();
var imgData;
var imgDataEdges;

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

document.getElementById('inputtext').addEventListener('keyup', function () {
   
    text_title = this.value;
    words = text_title.split("")

    words = words.filter(function (str) {
        return /\S/.test(str);
    });

});

function getInfo(e) {
    imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}
function handleImage(e) {
    var reader = new FileReader();
    imgData = 0

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

    }
    reader.readAsDataURL(e.target.files[0]);

}
function convertToImage() {
    window.open(canvas.toDataURL('png'));
}
// document.getElementById('download').onclick = function download() {
//     convertToImage();
// }




function getImagePixelsColor() {



    if (!imgData) {
        imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }



    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // console.log(imgData.data);
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
            //console.log('rgba(' + red + ', ' + green + ', ' + blue + ',' + (bgcolor / 255.0) + ')');
            ctx.textBaseline = 'middle';
            let word = words[Math.round(Math.random() * (words.length - 1))]
           // console.log( words )
            ctx.font = sizeOfWorld / word.length * 1.8 + "px 'Montserrat'";

            ctx.fillText(word, x * sizeOfWorld, y * sizeOfWorld);
        }
        i += canvas.width * 4 * (sizeOfWorld - 1)// 640000

    }

    
}


var fileUploadEl = document.getElementById('imageLoader'),
    srcImgEl = document.getElementById('src-image')

fileUploadEl.addEventListener("change", function (e) {
    srcImgEl.src = URL.createObjectURL(e.target.files[0]);
}, false);

function edgeDetact() {
    var canvasE = document.getElementById('imageCanvasforEgde');
    var ctxE = canvasE.getContext('2d');
    var src = cv.imread(srcImgEl); // load the image from <img>\
    var dst = new cv.Mat();

    cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);

    cv.Canny(src, dst, 89, 90, 3, false); // You can try more different parameters
    cv.imshow('imageCanvasforEgde', dst); // display the output to canvas


    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    imgDataEdges = ctxE.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let i = 0; i < imgDataEdges.length; i += 4) {
        let red = imgDataEdges[i];
        let green = imgDataEdges[i + 1];
        let blue = imgDataEdges[i + 2];
        // imgData.data[i + 3] = 255;
        let bgcolor = imgDataEdges[i + 3];
       // console.log('rgba(' + red + ', ' + green + ', ' + blue + ',' + (bgcolor / 255.0) + ')');

        if (red == 255 && green == 255 && blue == 255) {
            imgData.data[i] = 0 //imgDataEdges[i]
            imgData.data[i + 1] = 0 //imgDataEdges[i + 1]
            imgData.data[i + 2] = 0 //imgDataEdges[i + 2]
            imgData.data[i + 3] = imgDataEdges[i + 3]
        }
    }

    ctx.putImageData(imgData, 0, 0);
    //ctx.drawImage(imgData, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    src.delete(); // remember to free the memory
    dst.delete();



}
// opencv loaded?
window.onOpenCvReady = function () {
    document.getElementById('loading-opencv-msg').remove();
}


function generate()
{   
    if (document.getElementById('edges_yes').checked) {
        console.log("Yes");
        getImagePixelsColor()
        edgeDetact()
    }
    else{
        console.log("No");
        getImagePixelsColor()
    }
}