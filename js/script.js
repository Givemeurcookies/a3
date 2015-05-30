HTMLCanvasElement.prototype.mousePosition = function(e){
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var currentElement = this;

        do {
            totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
            totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        } while(currentElement == currentElement.offsetParent);

        var x = event.pageX - totalOffsetX;
        var y = event.pageY - totalOffsetY;

        return [x, y];
    };

    /*var Utils = {
        round : function(num, n) {
            var multiplier = Math.pow(10, n);
            return Math.round(num * multiplier) / multiplier;
        },

        cutDecimals : function(num, n) {
            var multiplier = Math.pow(10, n);
            return (parseInt(num * multiplier, 0) / multiplier);
        }
    };*/

    var header = document.getElementsByTagName("h1")[0],
            canvas = document.getElementById("fireflies"),
            headerMeta, fireflies = [];

    var ctx=canvas.getContext("2d");

    function onResize(){
        headerMeta = {
            "width" : header.scrollWidth,
            "height": header.scrollHeight
        };
        resizeCanvas();
    }
    function resizeCanvas(){
        var pixelRatio = window.devicePixelRatio;

        canvas.width  = headerMeta.width * pixelRatio;
        canvas.height = headerMeta.height * pixelRatio;
        canvas.style.width  = headerMeta.width;
        canvas.style.height = headerMeta.height;
        ctx.scale(pixelRatio, pixelRatio);
    }

    var mousePos = [-1000, -1000];
    canvas.addEventListener('mousemove', function(e) {
        mousePos = canvas.mousePosition(e);
    });

    function calcObj(){
        for (var x = 0, xl = fireflies.length; x < xl; x++){
            var obj = fireflies[x];

            if (obj.current >= obj.duration) {
                fireflies[x] = Firefly(obj.x,obj.y,obj.radius);
                obj = fireflies[x];
            }

            var distanceX = mousePos[0] - obj.x;
            var distanceY = obj.y - mousePos[1];
            var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            var c = 1000;
            var d = 10;
            var e = 2;
            var moveX = -(c * distanceX) / Math.pow(distance, e);
            var moveY = (c * distanceY) / Math.pow(distance, e);

            obj.x = obj.startx + easeInOutCubic(obj.current, 0, (obj.endx-obj.startx), obj.duration) + moveX;
            obj.y = obj.starty + easeInOutCubic(obj.current, 0, (obj.endy-obj.starty), obj.duration) + moveY;
            obj.current += 1;
            fireflies[x] = obj;
        }
        // Collision detection
        // In it's own loop so the coordinates of ALL objects have moved before hit detection
    }


    function hitDetection() {
        for (var i = 0, ii = fireflies.length; i < ii; i++) {
            var obj1 = fireflies[i];
            for (var j = (i + 1); j < ii; j++) {
                var obj2 = fireflies[j];

                var dx = obj1.x - obj2.x;
                var dy = obj1.y - obj2.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                var minDistance = obj1.radius + obj2.radius;

                if (distance <= minDistance) {
                    obj1.isColliding = true;
                    obj2.isColliding = true;
                }
            }
        }

        for (i = 0; i < ii; i++) {
            var obj = fireflies[i];
            if (obj.isColliding) {
                //obj.color = 'red';
                obj.isColliding = false;
            } else obj.color = false;
        }
    }

    function draw(){
        ctx.clearRect(0, 0, headerMeta.width, headerMeta.height);
        // Draw all the fireflies
        ctx.shadowBlur=18;
        ctx.shadowColor ="#FFE364";
        for (var x = 0, xl = fireflies.length; x < xl; x++){
            var obj = fireflies[x];
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI*2);

            ctx.closePath();
            ctx.fillStyle = obj.color || "#FFE364";
            ctx.fill();
        }
    }
    function Firefly(posx, posy, radius){
        var x = posx || headerMeta.width  * Math.random(),
                y = posy || headerMeta.height * Math.random();

        return {
            "startx"   : x,
            "starty"   : y,
            "endx"     : headerMeta.width  * Math.random(),
            "endy"     : headerMeta.height * Math.random(),
            "x"        : x,
            "y"        : y,
            "radius"   : radius || Math.random() * 1.4 + 0.4,
            "current"  : 0,
            "duration" : Math.random() * (900 - 300) + 300
        };
    }
    function addFireflies(num){
        for(var x = 0; x < num; x++) {
            fireflies.push(Firefly());
        }
        console.log(num+ " fireflies added");
    }
    function loop(){
        console.time("Loop");
        calcObj();
        //hitDetection();
        draw();
        console.timeEnd("Loop");
        requestAnimationFrame(function() {loop();});
    }
    // Bindings
    document.body.onresize = onResize;

    // Shim
    window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
                function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
    })();

    function easeInOutCubic (t, b, c, d) {
        t /= d/2;
        if(t < 1) return c/2*t*t*t + b;
        t -= 2;
        return c/2*(t*t*t + 2) + b;
    }

    // Init
    onResize();
    loop();
    addFireflies(500);