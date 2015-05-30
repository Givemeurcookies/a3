	var header = document.getElementsByTagName("h1")[0],
		canvas = document.getElementById("fireflies"),
		headerMeta, fireflies = [], isMouseInside, mousePos;

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
	function startCalc(){
		for (var x = 0, xl = fireflies.length; x < xl; x++){
			var obj = fireflies[x];

			if (obj.current >= obj.duration) {
				fireflies[x] = Firefly(obj.x,obj.y,obj.radius);
				obj = fireflies[x];
			}
			
			obj.forces.x.push(easeInOutCubic(obj.current, 0, (obj.endx-obj.startx), obj.duration));
			obj.forces.y.push(easeInOutCubic(obj.current, 0, (obj.endy-obj.starty), obj.duration));
			obj.current += 1;
			fireflies[x] = obj;
			obj = null;
		}
		// Collision detection
		// In it's own loop so the coordinates of ALL objects have moved before hit detection
	}
	function endCalc(){
		for (var i = 0, il = fireflies.length; i < il; i++) {
			obj = fireflies[i];
			for (var j = 0, jl = obj.forces.x.length; j < jl; j++) {
				obj.x += (obj.forces.x[j]);
			}
			for (var jj = 0, jjl = obj.forces.y.length; jj < jjl; jj++) {
				obj.y += (obj.forces.y[jj]);
				//console.log(obj.forces.x);
			}
			obj.forces.x.length = 0;
			obj.forces.y.length = 0;
		}

	}
	function hitDetection(list1) {
		
        for (var i = 0, ii = list1.length; i < ii; i++) {
            var obj1 = fireflies[i];
			var obj2 = {
				"x" : mousePos.x,
				"y" : mousePos.y,
				"radius" : 70
			};
			if (obj1.x + obj1.radius + obj2.radius > obj2.x && obj1.x < obj2.x + obj1.radius + obj2.radius && obj1.y + obj1.radius + obj2.radius > obj2.y && obj1.y < obj2.y + obj1.radius + obj2.radius){
				var dx = obj1.x - obj2.x;
				var dy = obj1.y - obj2.y;
				var distance = Math.sqrt(dx * dx + dy * dy);
				var minDistance = obj1.radius + obj2.radius;
				if (distance <= minDistance) {
					obj1.isColliding = true;
					obj1.colx = ((obj2.x * obj1.radius) + (obj1.x * obj2.radius)) / (obj2.radius + obj1.radius);
					obj1.coly = ((obj2.y * obj1.radius) + (obj1.y * obj2.radius)) / (obj2.radius + obj1.radius);
				}
			}
        }
        for (i = 0; i < ii; i++) {
            var obj = fireflies[i];
            if (obj.isColliding) {
                obj.color = 'red';
                obj.forces.x.push(obj.x - obj.colx);
                //console.log(obj.x - obj.colx);
                obj.forces.y.push(obj.y - obj.coly);
                obj.isColliding = false;
            } else {
				obj.color = "#FFE364";
				obj.colx = null;
				obj.coly = null;
            }
        }
    }
	function draw(){
		// Draw all the fireflies
		if (isMouseInside === 1) {
			drawCircle(mousePos.x, mousePos.y, 70, "#222");
		}
		for (var x = 0, xl = fireflies.length; x < xl; x++){
			obj = fireflies[x];
			drawCircle(obj.x, obj.y, obj.radius, obj.color);
			//if (obj.colx && obj.coly) drawCircle(obj.colx, obj.coly, 4, "blue");
		}
	}
	function drawCircle(x, y, radius, color){
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI*2);
		ctx.closePath();
		//ctx.shadowBlur=18;
		//ctx.shadowColor ="#FFE364";
		ctx.fillStyle = color;
		ctx.fill();
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
			"radius"   : radius || Math.random()*1.8 +0.2,
			"color"    : "#FFE364",
			"current"  : 0,
			"duration" : Math.random() * (900 - 300) + 300,
			"forces"   : {
				"x" : [],
				"y" : []
			}
		};
	}
	function addFireflies(num){
		for(var x = 0, xl = fireflies.length; x < num; x++) {
			fireflies.push(Firefly());
		}
		console.log(num+ " fireflies added");
	}
	function loop(){
		ctx.clearRect(0, 0, headerMeta.width, headerMeta.height);
		startCalc();

		if (isMouseInside === 1) hitDetection(fireflies);
		else if (isMouseInside === 2) {
			for (var i = 0, il = fireflies.length; i < il; i++){
				obj = fireflies[i];
				obj.color = "#FFE364";
				obj.colx = null;
				obj.coly = null;
			}
			isMouseInside = 0;
		}
		endCalc();
		draw();
		requestAnimFrame(function() {loop();});
	}
	function getMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	}
	// Bindings
	document.body.onresize = onResize;
	canvas.addEventListener('mousemove', function(evt) {
        mousePos = getMousePos(canvas, evt);
	}, false);
	canvas.addEventListener('mouseenter', function(){ isMouseInside = 1; console.log("HE ENTERED!");}, false);
	canvas.addEventListener('mouseleave', function(){ isMouseInside = 2; console.log("HE LEFT! D:");}, false);
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
    addFireflies(500);
    console.log(typeof Firefly(3, 1, 70));
    loop();