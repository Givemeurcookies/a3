function hitDetection2(list1, list2) {
		if (typeof list2 === 'undefined') list2 = list1;
        for (var i = 0, ii = list1.length; i < ii; i++) {
            var obj1 = list1[i];

            for (var j = (i + 1), ji = list2.length; j < ji; j++) {
                var obj2 = list2[j];
                if (obj1.x + obj1.radius + obj2.radius > obj2.x && obj1.x < obj2.x + obj1.radius + obj2.radius && obj1.y + obj1.radius + obj2.radius > obj2.y && obj1.y < obj2.y + obj1.radius + obj2.radius){
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
        }
        for (i = 0; i < ii; i++) {
            var obj = list1[i];
            if (obj.isColliding) {
                obj.color = 'red';
                obj.isColliding = false;
            } else obj.color = "#FFE364";
        }
        return list1;
    }