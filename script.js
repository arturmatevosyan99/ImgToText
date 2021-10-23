// --------------------------------
// Text on Picture
// --------------------------------

// Storing text and their symbols
// --------------------------------
var text_title = "text2img";
var words = text_title.split("")
// --------------------------------

// Uploading an image to the Project
// ------------------------------------
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
var imgHalfData

img.crossOrigin = "anonymous";

window.addEventListener('load', DrawPlaceholder)

function DrawPlaceholder() {
    img.onload = function () {
        DrawOverlay(img);
        
        DynamicText(img)
    };

}
// -----------------------------------------------------------

// Getting image info
// -------------------------------
function DrawOverlay(img) {
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(30, 144, 255, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
// -------------------------------

// Getting text from input
// -------------------------------
document.getElementById('inputtext').addEventListener('keyup', function () {

    if (this.value == "") {
        text_title = "text2img"
    }
    else {
        text_title = this.value;
    }
    words = text_title.split("")

    words = words.filter(function (str) {
        return /\S/.test(str);
    });

});
// -------------------------------

// reading a picture by pixels
// ------------------------------
function handleImage(e) {
    var reader = new FileReader();
    imgData = 0

    reader.onload = function (event) {
        img.onload = function () {
            canvas.width = 400;
            canvas.height = 400 / img.width * img.height;

            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
        }
        img.src = event.target.result;
        src = event.target.result;
        canvas.classList.add("show");
        DrawOverlay(img);
        

    }
    reader.readAsDataURL(e.target.files[0]);

}
// ------------------------------

// Algoritm that putting Text on Picture
function getImagePixelsColor() {

    // new Data for first time runnig algoritm
    if (!imgData) {
        imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    // option background_color
    if (document.getElementById("background_color_no").checked) {
        fillBackground()
    }
    else {
        for (let i = 3; i < imgData.data.length; i += 4) {

            imgData.data[i] = 50;

        }
        ctx.putImageData(imgData, 0, 0);
    }

    // Text positins styles
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    
    let i = 0 // pixel number
    let mearge = 2 // mearge betwen chars

    // Adding space bettwin chars
    if (document.getElementById("CharSpace_yes").checked) {
        mearge = 1
    }

    let countOfText = 50 * mearge
    console.log(countOfText);
    let sizeOfWorld = canvas.width / countOfText * mearge
    let index = 0;
    // Getting Image pixels with R G B
    for (let y = 0; y < countOfText * canvas.height / canvas.width; y++) {
        for (let x = 0; x < countOfText; x++) {

            let red = imgData.data[i];
            let green = imgData.data[i + 1];
            let blue = imgData.data[i + 2];
            imgData.data[i + 3] = 255;

            i += canvas.width * 4 / countOfText

            // Chacked monochrome_yes option
            if (document.getElementById('monochrome_yes').checked) {
                ctx.fillStyle = document.getElementById('monochrome_color').value

                let hex_code = document.getElementById('monochrome_color').value.split("");
                let redm = parseInt(hex_code[1] + hex_code[2], 16);
                let greenm = parseInt(hex_code[3] + hex_code[4], 16);
                let bluem = parseInt(hex_code[5] + hex_code[6], 16);

                // Putting Color with monochrome
                ctx.fillStyle = 'rgba(' + (red + (red + redm) / 2) / 2 + ',' + (green + (green + greenm) / 2) / 2 + ',' + (blue + (blue + bluem) / 2) / 2 + ',' + (255) + ')';

            } else {
                // Putting image pixel color
                ctx.fillStyle = 'rgba(' + red + ',' + green + ',' + blue + ',' + (255) + ')';
            }

            // text position
            ctx.textBaseline = 'middle';
            let word = words[index]
            index < words.length - 1 ? index++ : index = 0;

            // Text font
            let select = document.getElementById('font');
            let value = select.options[select.selectedIndex].value;

            // Text style
            let selectf = document.getElementById('fstyle');
            let valueF = selectf.options[selectf.selectedIndex].value;

            // Text size
            let valueS = - document.getElementById("fontsize").value
            ctx.font = valueF + ' ' + (sizeOfWorld / word.length * 1.5 - valueS) + 'px ' + value;
            ctx.fillText(word, x * sizeOfWorld / mearge, y * sizeOfWorld);
        }
        i += canvas.width * 4 * (sizeOfWorld - 1)

    }

}

// img downloader
var fileUploadEl = document.getElementById('imageLoader'),
    srcImgEl = document.getElementById('src-image')

fileUploadEl.addEventListener("change", function (e) {
    srcImgEl.src = URL.createObjectURL(e.target.files[0]);
}, false);

// Edg detector

// opencv loaded?
window.onOpenCvReady = function () {
    document.getElementById('loading-opencv-msg').remove();
}

// filling Background white
function fillBackground() {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

}

// Main function for runnig algoritm
function generate() {

    // chacked text imput and image loading
    if (!img.src && document.getElementById('inputtext').value == "") {
        alert("Please upload an input image and enter text")
        return
    }
    if (!img.src) {
        alert("Please upload an input image")
        return
    }
    if (document.getElementById('inputtext').value == "") {
        alert("Please enter input text")
        return
    }
    else {
        text_title = document.getElementById('inputtext').value;
    }
    words = text_title.split("")

    // Half image options
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    if (document.getElementById("part_left_half").checked) {

        imgHalfData = ctx.getImageData(0, 0, canvas.width / 2, canvas.height);
    }
    else if (document.getElementById("part_right_half").checked) {
        imgHalfData = ctx.getImageData(canvas.width / 2, 0, canvas.width, canvas.height);
    }
    else {
        imgHalfData;
    }

    // Upper and Lower case option
    if (document.getElementById('case_upper').checked) {
        text_title = text_title.toUpperCase();
        console.log(text_title);
        words = text_title.split("")
    }
    else if (document.getElementById('case_lower').checked) {
        text_title = text_title.toLowerCase();
        console.log(text_title);
        words = text_title.split("")
    }

    // Word Space Option
    if (document.getElementById('WordsSpace_yes').checked) {
        words = words.filter(function (str) {
            return /\S/.test(str);
        });
    }

    // main algoritm
    getImagePixelsColor()

    // Part of image drowing
    if (document.getElementById("part_left_half").checked) {
        ctx.putImageData(imgHalfData, 0, 0)
    }
    else if (document.getElementById("part_right_half").checked) {
        ctx.putImageData(imgHalfData, canvas.width / 2, 0)
    }

}