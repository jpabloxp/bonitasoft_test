
var refreshIntervalId = null;
var currentColor = null;
var mousedown = false;
var degree = 20;
var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;
var rectList = [{
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    color: 0
}];

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");
// first save the untranslated/unrotated context
ctx.save();

canvas.addEventListener("mousemove", function (e) {
    dibujar(e);
});

canvas.addEventListener("mousedown", function (e) {

    startX = parseInt(e.clientX);
    startY = parseInt(e.clientY);
    currentColor = getRandomColor();

    console.log(startX, startY);
    mousedown = true;

});

canvas.addEventListener("mouseup", function (e) {

    if((startX !== endX) && (startY !== endY)){
        rectList.push({
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY,
            color: currentColor
        });
    }
    mousedown = false;
});

canvas.addEventListener('dblclick', function (e) {
    
    var clickX = parseInt(e.clientX);
    var clickY = parseInt(e.clientY);
    degree = 20;

    for (var i in rectList) {
        if (rectList.hasOwnProperty(i)) {
            if ((rectList[i].startX <= clickX) && (rectList[i].endX >= clickX) && (rectList[i].startY <= clickY) && (rectList[i].endY >= clickY)) {

                refreshIntervalId = window.setInterval(function() { rotar(i); }, 20);
                break;
            }
        }
    }

});

function limpiar(){

    ctx.restore();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
}

function dibujar(e){

    endX = parseInt(e.clientX);
    endY = parseInt(e.clientY);
    
    if(mousedown) {
        
        var width = endX - startX;
        var height = endY - startY;

        limpiar();

        ctx.fillStyle = currentColor;
        ctx.beginPath();
        ctx.fillRect(startX, startY, width, height);
        //ctx.fill();
        ctx.closePath();

        dibujarEstado();
    }
}

function rotar(index){

    var found = false;
    limpiar();

    for (var i in rectList) {
        if (rectList.hasOwnProperty(i)) {

            var width = rectList[i].endX - rectList[i].startX;
            var height = rectList[i].endY - rectList[i].startY;

            ctx.fillStyle = rectList[i].color;
            ctx.beginPath(); 

            if (i === index) {

                ctx.translate((rectList[i].startX + width), (rectList[i].startY + height));
                ctx.rotate(((degree * Math.PI) / 180));
                ctx.fillRect((-width / 2), (-height / 2), width, height);
                ctx.closePath();
                    
                degree += 20;
                break;
            }
        }
    }

    ctx.restore();
    dibujarEstado(index);
    ctx.save();
    if(degree > 360){

        clearInterval(refreshIntervalId);
        rectList.splice(index, 1);
        limpiar();
        dibujarEstado();
    }

}

function dibujarEstado(){

    for (var i in rectList) {
        if (rectList.hasOwnProperty(i)) {

            var width = rectList[i].endX - rectList[i].startX;
            var height = rectList[i].endY - rectList[i].startY;
            
            ctx.fillStyle = rectList[i].color;
            ctx.beginPath(); 
            ctx.fillRect(rectList[i].startX, rectList[i].startY, width, height);
            ctx.closePath();
        }
    }
}
function dibujarEstado(index){

    for (var i in rectList) {
        if (rectList.hasOwnProperty(i)) {

            if (i !== index) {

                var width = rectList[i].endX - rectList[i].startX;
                var height = rectList[i].endY - rectList[i].startY;
                
                ctx.fillStyle = rectList[i].color;
                ctx.beginPath(); 
                ctx.fillRect(rectList[i].startX, rectList[i].startY, width, height);
                ctx.closePath();
            }
        }
    }
}

function getRandomColor() {

    var letters = '0123456789ABCDEF';
    var color = '#';

    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}