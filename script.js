var text_title = "text2img";
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
var imgHalfData

img.crossOrigin = "anonymous";


window.addEventListener('load', DrawPlaceholder)

function DrawPlaceholder() {
    img.onload = function () {
        DrawOverlay(img);
        DrawText();
        DynamicText(img)
    };

}
function DrawOverlay(img) {
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(30, 144, 255, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function DrawText() {
    return
}

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

function getInfo(e) {
    imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}
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
        DrawText();

    }
    reader.readAsDataURL(e.target.files[0]);

}
function convertToImage() {
    window.open(canvas.toDataURL('png'));
}





function getImagePixelsColor() {



    if (!imgData) {
        imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }





    if (document.getElementById("background_color_no").checked) {
        fillBackground()
    }
    else {
        for (let i = 3; i < imgData.data.length; i += 4) {

            imgData.data[i] = 50;

        }
        ctx.putImageData(imgData, 0, 0);
    }


    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    let i = 0
    let mearge = 2
    if (document.getElementById("CharSpace_yes").checked) {
        mearge = 1
    }

    let countOfText = 50 * mearge
    console.log(countOfText);
    let sizeOfWorld = canvas.width / countOfText * mearge
    let index = 0;
    for (let y = 0; y < countOfText * canvas.height / canvas.width; y++) {
        for (let x = 0; x < countOfText; x++) {

            let red = imgData.data[i];
            let green = imgData.data[i + 1];
            let blue = imgData.data[i + 2];
            imgData.data[i + 3] = 255;
            let bgcolor = imgData.data[i + 3];

            i += canvas.width * 4 / countOfText

            if (document.getElementById('monochrome_yes').checked) {
                ctx.fillStyle = document.getElementById('monochrome_color').value

                let hex_code = document.getElementById('monochrome_color').value.split("");
                let redm = parseInt(hex_code[1] + hex_code[2], 16);
                let greenm = parseInt(hex_code[3] + hex_code[4], 16);
                let bluem = parseInt(hex_code[5] + hex_code[6], 16);

                ctx.fillStyle = 'rgba(' + (red + (red + redm) / 2) / 2 + ',' + (green + (green + greenm) / 2) / 2 + ',' + (blue + (blue + bluem) / 2) / 2 + ',' + (255) + ')';

            } else {
                ctx.fillStyle = 'rgba(' + red + ',' + green + ',' + blue + ',' + (255) + ')';
            }

            ctx.textBaseline = 'middle';

            let word = words[index]
            index < words.length - 1 ? index++ : index = 0;
            let select = document.getElementById('font');
            let value = select.options[select.selectedIndex].value;

            let selectf = document.getElementById('fstyle');
            let valueF = selectf.options[selectf.selectedIndex].value;

            let valueS = - document.getElementById("fontsize").value

            ctx.font = valueF + ' ' + (sizeOfWorld / word.length * 1.5 - valueS) + 'px ' + value;

            ctx.fillText(word, x * sizeOfWorld / mearge, y * sizeOfWorld);
        }
        i += canvas.width * 4 * (sizeOfWorld - 1)

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
   
        let bgcolor = imgDataEdges[i + 3];
      
        if (red == 255 && green == 255 && blue == 255) {
            imgData.data[i] = 0
            imgData.data[i + 1] = 0 
            imgData.data[i + 2] = 0 

        }
        imgData.data[i + 3] = 255;

    }

    ctx.putImageData(imgData, 0, 0);

    src.delete(); // remember to free the memory
    dst.delete();



}
// opencv loaded?
window.onOpenCvReady = function () {
    document.getElementById('loading-opencv-msg').remove();
}


function fillBackground() {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

}

function generate() {
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
    if (document.getElementById('WordsSpace_yes').checked) {
        words = words.filter(function (str) {
            return /\S/.test(str);
        });
    }

    getImagePixelsColor()

    if (document.getElementById("part_left_half").checked) {
        ctx.putImageData(imgHalfData, 0, 0)
    }
    else if (document.getElementById("part_right_half").checked) {
        ctx.putImageData(imgHalfData, canvas.width / 2, 0)
    }

}