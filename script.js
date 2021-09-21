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

    if (this.value == "") {
        text_title = "text2img"
    }
    else{
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
            canvas.height = 400/img.width * img.height;
           
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
    

    fillBackground()

    // console.log(imgData.data);
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    let i = 0
    let countOfText = 50 - document.getElementById("fontsize").value
    console.log(countOfText);
    let sizeOfWorld = canvas.width / countOfText // 40
    let index = 0;
    for (let y = 0; y < countOfText * canvas.height/canvas.width; y++) {
        for (let x = 0; x < countOfText; x++) {

            let red = imgData.data[i];
            let green = imgData.data[i + 1];
            let blue = imgData.data[i + 2];
            imgData.data[i + 3] = 255;
            let bgcolor = imgData.data[i + 3];
            // if (red == 0 && green == 0 && blue == 0) {
            //     red = 255 //imgDataEdges[i]
            //     blue = 255 //imgDataEdges[i + 1]
            //     green = 255 //imgDataEdges[i + 2]

            // }
            i += canvas.width * 4 / countOfText // 16000

            if (document.getElementById('monochrome_yes').checked) {
                ctx.fillStyle = document.getElementById('monochrome_color').value
                
                let hex_code = document.getElementById('monochrome_color').value.split("");
                let redm = parseInt(hex_code[1]+hex_code[2],16);
                let greenm = parseInt(hex_code[3]+hex_code[4],16);
                let bluem = parseInt(hex_code[5]+hex_code[6],16);

                ctx.fillStyle = 'rgba(' + (red+redm)/2 + ',' + (green+greenm)/2 + ',' + (blue+bluem)/2 + ',' + (255) + ')';

            }else{
                ctx.fillStyle = 'rgba(' + red + ',' + green + ',' + blue + ',' + (255) + ')';
            }
           //console.log('rgba(' + red + ', ' + green + ', ' + blue + ',' + (bgcolor / 255.0) + ')');
            ctx.textBaseline = 'middle';
            
            let word = words[index]
            index < words.length - 1 ? index++ : index = 0;
            // console.log( words )
            let select = document.getElementById('font');
            let value = select.options[select.selectedIndex].value;


            let selectf = document.getElementById('fstyle');
            let valuef = selectf.options[selectf.selectedIndex].value;

            ctx.font = valuef + ' ' + (sizeOfWorld / word.length * 1.5) + 'px ' + value;

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

        }
        imgData.data[i + 3] = 255;

    }

    ctx.putImageData(imgData, 0, 0);
    // ctx.drawImage(imgData, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
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
    if (document.getElementById('inputtext').value == "") {
        text_title = "text2img"
    }
    else{
        text_title = document.getElementById('inputtext').value;
    }
    words = text_title.split("")

    words = words.filter(function (str) {
        return /\S/.test(str);
    });
    
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    if (document.getElementById("part_left_half").checked) {
        
        imgHalfData = ctx.getImageData(0, 0, canvas.width / 2, canvas.height);
    }
    else if(document.getElementById("part_right_half").checked)
    {
        imgHalfData = ctx.getImageData(canvas.width / 2, 0, canvas.width, canvas.height);
    }
    else{
        imgHalfData;
    }
    
    if (document.getElementById('case_upper').checked) {
        text_title = text_title.toUpperCase();
        console.log(text_title);
        words = text_title.split("")
        words = words.filter(function (str) {
            return /\S/.test(str);
        });
    }
    else if(document.getElementById('case_lower').checked){
        text_title = text_title.toLowerCase();
        console.log(text_title);
        words = text_title.split("")
        words = words.filter(function (str) {
            return /\S/.test(str);
        });
    }

    // if (document.getElementById('edges_yes').checked) {
    //     console.log("Yes");

    //     getImagePixelsColor()
    //     edgeDetact()
    // }
    // else {
    //     console.log("No");
    //     getImagePixelsColor()
    // }
    getImagePixelsColor()

    if (document.getElementById("part_left_half").checked) {
        ctx.putImageData(imgHalfData,0,0)
    }
    else if(document.getElementById("part_right_half").checked)
    {
        ctx.putImageData(imgHalfData,canvas.width/2, 0)
    }
    
}