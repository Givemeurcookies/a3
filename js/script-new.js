function Firefly(settings) {
	// Define defaults
	if (!settings.canvas) return false;
	this.self = defaultSettings(settings);
	console.log("Initiated fireflies");
}
Firefly.prototype.defaultSettings = function(settings){
	return {
		"ratio" : {
			"max" : settings.ratio.max || 1.4,
			"min" : settings.ratio.min || 0.4
		},
		"duration" : {
			"max" : settings.duration.max || 900,
			"min" : settings.duration.min || 300
		},
		"debug" : settings.debug || false
	};
};
Firefly.prototype.generateFirefly = function(previous){
	var settings = {
		"x" : settings.x || this.header.height * Math.random(),
		"y" : settings.y || this.header.width  * Math.random()
	};


};
Firefly.prototype.createFireflies = function(amount) {
	for(var x = 0; x < num; x++) {
		this.fireflies.push(Firefly());
	}
	console.log(num+ " fireflies added");
};
Firefly.prototype.defaultDuration = function(multiplier) {
	return {
		"max" : 900 * multiplier,
		"min" : 300 * multiplier
	};
}