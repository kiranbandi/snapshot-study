// Methods for drawing each stimulus type

// Drawing constants
var COLORTYPE = {
	HSV: 	{value: 0, mins: [0, 0, 0, 0], 	maxs:[360, 100, 100, 1], name: "HSV", step: 1},
	Lab: 	{value: 1, mins: [0, -128, -128, 0], 	maxs: [100, 128, 128, 1], name: "Lab", step: 1},
	LCh: 	{value: 2, mins: [0, 0, 0, 0], 	maxs: [100, 100, 360, 1], name: "LCh", step: 1},
	Alpha: 	{value: 3, mins: [0, 0, 0, 0], 	maxs: [1, 0, 0, 0], name: "Alpha", step: 0.01}
};

var responseFlag = false;


// Convert from a visual angle to pixel values to compute sizes
var visualAngleToPixels = function(angleDegrees, inchesToDisplay, approxDpi) {
	var angleRadians = angleDegrees * Math.PI / 180.0;
	return inchesToDisplay * Math.tan(angleRadians / 2.0) * approxDpi;
};

// Convert from a pixel size to a visual angle in degrees
var pixelsToVisualAngle = function(pixels, inchesToDisplay, approxDpi) {
	var sizeInches = 2 * pixels / approxDpi; 		// 2 is to account for pixels being a radius
	return 2 * Math.atan2(sizeInches, (2 * inchesToDisplay)) * (180 / Math.PI);
};


function normal(mu, sigma, nsamples){
    if(!nsamples) nsamples = 6
    if(!sigma) sigma = 1
    if(!mu) mu=0

    var run_total = 0
    for(var i=0 ; i<nsamples ; i++){
       run_total += Math.random()
    }

    return sigma*(run_total - nsamples/2)/(nsamples/2) + mu
};


var adapt = function(record) {


	//prompt first

	if (record) {
		// Record the response -- this is the actual study
		//first, ask for the rating

		if(resp==0){
			promptRating();
		}else{
			rating = 1;


			postResponseValues(resp);
		}



	// Set the screen to grey to avoid afterimage effects
	d3.selectAll("circle").remove();
	d3.selectAll("rect").remove();
	d3.selectAll("path").remove();
	d3.selectAll("g").remove();
	d3.selectAll("polygon").remove();
	d3.select("div #stimuli").select("svg")
				.append("rect")
				.attr("width", function() {
					return (2*proximity + 2 * GRID_PAD + 4 * LARGEST_SIZE);

				})
				.attr("height", function() {
					return (2*proximity + 2 * GRID_PAD + 2 * LARGEST_SIZE);
				})
				.attr("x",0)
				.attr("fill", "rgb(200,200,200)");




	}else{
		//test trial, just go next
		//nextTrial:
		respInt = setInterval(logResponse, 500);
	}


}

//ask for rating
var promptRating = function(){
	rating = prompt('Please rate how different the emphasized point was from the other points (e.g., if it was a different color, how different), ' +
                'on a 1-7 scale, where 1 = just slightly different, and 7 = very different.')
			checkResponseInput()
}

//check input from rating
var checkResponseInput = function(response){
	//console.log("im inside checkResponse" + rating)
	//console.log(isNaN((rating)));
	if(isNaN(rating)){
		promptRating()
	}else{
		if(rating < 1 || rating > 7 ){
			promptRating()
		}else{
			//all good
			postResponseValues(resp);
		}
	}

}


// [stimuli, stimuliColor, level, showTarget, targetShape]
var postResponseValues = function(response) {
		var correct;
		switch(trial_array[initialSelection][3]) {
		  case true:
		  		if(resp==0){
		  			correct=true;
		  			wrongPopUp=false;
				}
		  		else{
		  			correct=false;
		  			wrongPopUp=true;
				}
			break;
		  case false:
		  		if(resp==1){
		  			correct=true;
		  			wrongPopUp=false;
				}
		  		else{
		  			correct=false;
		  			wrongPopUp=true;
				}
			break;
		  default:
			console.log("default shoulnt happen")
		}



		//check for dummy accuracy
		if(trial_array[initialSelection][0] == "dummy"){
			dummy_count+=1;
			if (correct == true){
				dummy_correct+=1;
			}
			dummy_accuracy = dummy_correct/dummy_count
		}

		//check for lv 4-6 accuracy:
		if(trial_array[initialSelection][0] != "dummy" && trial_array[initialSelection][2] >=4){
			high_performance_trials+=1;
			if (correct == true){
				high_performance_correct+=1;
			}
			performance_check_accuracy = high_performance_correct/high_performance_trials;
		}


		endTime = new Date();
		var trialTime = endTime-trialStartTime
		console.log("trial time:" + trialTime)
	//stimuliColor: trial_array[initialSelection][1],
	    var trialResult = {
			trialStart: trialStartTime,
			trialEnd: endTime,
			trialTime: endTime-trialStartTime,
			stimuli: trial_array[initialSelection][0],
			userRating: rating,
			level: trial_array[initialSelection][2],
			targetPresent: trial_array[initialSelection][3],
			targetShape: trial_array[initialSelection][4],
			targetSize: trial_array[initialSelection][5][0],
			distractorBlur: trial_array[initialSelection][6],
			distractorOpacity: trial_array[initialSelection][7],
			targetX: targetX,
			targetY: targetY,
			distanceFromCenter: distanceFromCenter,
	        response: resp,
			correct: correct
        };
		//console.log(trialResult)
        $.post("#", trialResult).then(function(){
        	//after posting results, move to next trial
            respInt = setInterval(logResponse, 500);
        })
};


var renderSingleMark = function(svg) {

	// Create symbol
	var symbol = d3.symbol();

	//console.log(trial_array[initialSelection][0])
	//console.log("level" + trial_array[initialSelection][2])

	for (var i = 0; i < positions.length; i++) {
		switch(positions[i][6]) {

		case "circle_filled":

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("circle")
				.attr("cx", function (d) {
					return d[2];
				})
				.attr("cy", function (d) {
					return d[3];
				})
				.attr("r", function (d) {
					return d[0][0] / 2.0;
				})
				.attr("fill", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});
			break;

		case "square_filled":

			d3.select("body").append("svg").attr("id", "hidden-svg");
			d3.select("#hidden-svg").append("path")
				.attr("d", d3.symbol("square").size(64))
				.attr("id", "hidden-path");
			var hidden_path = d3.select("#hidden-path");
			var bbox = hidden_path.node().getBBox();
			var error = Math.min(positions[0][0][0] / bbox.width, positions[0][0][0] / bbox.height);
			d3.select("#hidden-svg").remove();

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("path")
				.attr("d", d3.symbol().type(d3.symbolSquare).size(error * error * 64))
				//.attr("d", d3.symbol("square").size(error * error * 64))
				.attr("transform", function (d) {
					return "translate(" + d[2] + "," + d[3] + ")";
				})
				.attr("fill", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});
			break;

		case "triangle_filled":

			d3.select("body").append("svg").attr("id", "hidden-svg");
			d3.select("#hidden-svg").append("path")
				.attr("d", d3.symbol().type(d3.symbolTriangle).size(64))
				.attr("id", "hidden-path");
			var hidden_path = d3.select("#hidden-path");
			var bbox = hidden_path.node().getBBox();
			var error = Math.min(positions[0][0][0] / bbox.width, positions[0][0][0] / bbox.height);
			d3.select("#hidden-svg").remove();

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("path")
				.attr("d", d3.symbol().type(d3.symbolTriangle).size(error * error * 64))
				.attr("transform", function (d) {
					return "translate(" + d[2] + "," + d[3] + ")";
				})
				.attr("fill", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});
			break;

		case "diamond_filled":

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("polygon")
				.attr("points", function (d) {
					return generateScaledDiamondPolyPoints(d[0][0]);
				})
				.attr("transform", function (d) {
					return "translate(" + d[2] + "," + d[3] + ")";
				})
				.attr("fill", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});
			break;

		case "star_filled":

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("polygon")
				.attr("points", function (d) {
					return generateScaledStarPolyPoints(d[0][0]);
				})
				.attr("transform", function (d) {
					return "translate(" + d[2] + "," + d[3] + ")";
				})
				.attr("fill", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});
			break;

		case "circle_unfilled":

			var stroke_width = Math.round(positions[0][0][0] / 10.0);

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("circle")
				.attr("cx", function (d) {
					return d[2];
				})
				.attr("cy", function (d) {
					return d[3];
				})
				.attr("r", function (d) {
					return ((d[0][0] / 2.0) - (stroke_width / 2.0));
				})
				.attr("stroke-width", function (d) {
					return stroke_width.toString();
				})
				.attr("fill", "transparent")
				.attr("stroke", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});
			break;

		case "square_unfilled":

			var stroke_width = Math.round(positions[0][0][0] / 10.0);
			var width = positions[0][0][0] - stroke_width;

			d3.select("body").append("svg").attr("id", "hidden-svg");
			d3.select("#hidden-svg").append("path")
				.attr("d", d3.symbol().type(d3.symbolSquare).size(64))
				.attr("id", "hidden-path");
			var hidden_path = d3.select("#hidden-path");
			var bbox = hidden_path.node().getBBox();
			var error = Math.min(width / bbox.width, width / bbox.height);
			d3.select("#hidden-svg").remove();

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("path")
				.attr("d", d3.symbol().type(d3.symbolSquare).size(error * error * 64))
				.attr("transform", function (d) {
					return "translate(" + d[2] + "," + d[3] + ")";
				})
				.attr("stroke-width", function (d) {
					return stroke_width.toString();
				})
				.attr("fill", "transparent")
				.attr("stroke", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});
			break;

		case "triangle_unfilled":

			var stroke_width = Math.round(positions[0][0][0] / 10.0);
			var width = positions[0][0][0] - stroke_width;

			d3.select("body").append("svg").attr("id", "hidden-svg");
			d3.select("#hidden-svg").append("path")
				.attr("d", symbol.type("triangle-up").size(64))
				.attr("id", "hidden-path");
			var hidden_path = d3.select("#hidden-path");
			var modifier = 0.85;
			var bbox = hidden_path.node().getBBox();
			var error = Math.min(width / bbox.width, width / bbox.height);
			d3.select("#hidden-svg").remove();

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("path")
				.attr("d", symbol.type("triangle-up").size(modifier * (error * error * 64)))
				.attr("transform", function (d) {
					return "translate(" + d[2] + "," + d[3] + ")";
				})
				.attr("stroke-width", function (d) {
					return stroke_width.toString();
				})
				.attr("fill", "transparent")
				.attr("stroke", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});
			break;

		case "diamond_unfilled":

			var stroke_width = Math.round(positions[0][0][0] / 10.0);
			var size = (positions[0][0][0] - stroke_width) * 0.925;

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("polygon")
				.attr("points", function (d) {
					return generateScaledDiamondPolyPoints(d[0][0]);
				})
				.attr("transform", function (d) {
					return "translate(" + d[2] + "," + d[3] + ")";
				})
				.attr("stroke-width", function (d) {
					return stroke_width.toString();
				})
				.attr("fill", "transparent")
				.attr("stroke", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});
			break;

		case "star_unfilled":

			var stroke_width = Math.round(positions[0][0][0] / 10.0);
			var size = (positions[0][0][0] - stroke_width) * 0.80;

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("polygon")
				.attr("points", function (d) {
					return generateScaledStarPolyPoints(d[0][0]);
				})
				.attr("transform", function (d) {
					return "translate(" + d[2] + "," + d[3] + ")";
				})
				.attr("stroke-width", function (d) {
					return stroke_width.toString();
				})
				.attr("fill", "transparent")
				.attr("stroke", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});
			break;

		case "qton1":

			var stroke_width = Math.round(positions[0][0][0] / 10.0);

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("circle")
				.attr("cx", function (d) {
					return d[2];
				})
				.attr("cy", function (d) {
					return d[3];
				})
				.attr("r", function (d) {
					return ((d[0][0] / 2.0) - (stroke_width / 2.0));
				})
				.attr("stroke-width", function (d) {
					return stroke_width.toString();
				})
				.attr("fill", "transparent")
				.attr("stroke", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("polygon")
				.attr("points", function (d) {
					return generateScaledQTon1PolyPoints(d[0][0]);
				})
				.attr("transform", function (d) {
					return "translate(" + d[2] + "," + d[3] + ")";
				})
				.attr("fill", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});
			break;

		case "qton2":
			var stroke_width = Math.round(positions[0][0][0] / 10.0);

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("circle")
				.attr("cx", function (d) {
					return d[2];
				})
				.attr("cy", function (d) {
					return d[3];
				})
				.attr("r", function (d) {
					return ((d[0][0] / 2.0) - (stroke_width / 2.0));
				})
				.attr("stroke-width", function (d) {
					return stroke_width.toString();
				})
				.attr("fill", "transparent")
				.attr("stroke", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});


			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("polygon")
				.attr("points", function (d) {
					return generateScaledQTon2PolyPoints(d[0][0]);
				})
				.attr("transform", function (d) {
					return "translate(" +  d[2] + "," +  d[3] + ")";
				})
				.attr("fill", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});
			break;

		case "qton3":
			var stroke_width = Math.round(positions[0][0][0] / 10.0);

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("circle")
				.attr("cx", function (d) {
					return d[2];
				})
				.attr("cy", function (d) {
					return d[3];
				})
				.attr("r", function (d) {
					return ((d[0][0] / 2.0) - (stroke_width / 2.0));
				})
				.attr("stroke-width", function (d) {
					return stroke_width.toString();
				})
				.attr("fill", "transparent")
				.attr("stroke", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});


			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("polygon")
				.attr("points", function (d) {
					return generateScaledQTon3PolyPoints(d[0][0]);
				})
				.attr("transform", function (d) {
					return "translate(" + d[2] + "," + d[3] + ")";
				})
				.attr("fill", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});
			break;

		case "qton4":
			var stroke_width = Math.round(positions[0][0][0] / 10.0);

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("circle")
				.attr("cx", function (d) {
					return d[2];
				})
				.attr("cy", function (d) {
					return d[3];
				})
				.attr("r", function (d) {
					return ((d[0][0] / 2.0) - (stroke_width / 2.0));
				})
				.attr("stroke-width", function (d) {
					return stroke_width.toString();
				})
				.attr("fill", "transparent")
				.attr("stroke", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});


			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("polygon")
				.attr("points", function (d) {
					return generateScaledQTon4PolyPoints(d[0][0]);
				})
				.attr("transform", function (d) {
					return "translate(" + d[2] + "," + d[3] + ")";
				})
				.attr("fill", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});
			break;

		case "qton5":
			var stroke_width = Math.round(positions[0][0][0] / 10.0);

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("circle")
				.attr("cx", function (d) {
					return d[2];
				})
				.attr("cy", function (d) {
					return d[3];
				})
				.attr("r", function (d) {
					return ((d[0][0] / 2.0) - (stroke_width / 2.0));
				})
				.attr("stroke-width", function (d) {
					return stroke_width.toString();
				})
				.attr("fill", "transparent")
				.attr("stroke", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});


			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("polygon")
				.attr("points", function (d) {
					return generateScaledQTon5PolyPoints(d[0][0]);
				})
				.attr("transform", function (d) {
					return "translate(" + d[2] + "," + d[3] + ")";
				})
				.attr("fill", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});
			break;

		case "qton6":
			var stroke_width = Math.round(positions[0][0][0] / 10.0);

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("circle")
				.attr("cx", function (d) {
					return d[2];
				})
				.attr("cy", function (d) {
					return d[3];
				})
				.attr("r", function (d) {
					return ((d[0][0] / 2.0) - (stroke_width / 2.0));
				})
				.attr("stroke-width", function (d) {
					return stroke_width.toString();
				})
				.attr("fill", "transparent")
				.attr("stroke", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});


			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("polygon")
				.attr("points", function (d) {
					return generateScaledQTon6PolyPoints(d[0][0]);
				})
				.attr("transform", function (d) {
					return "translate(" + d[2] + "," + d[3] + ")";
				})
				.attr("fill", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});
			break;

		case "qton7":
			var stroke_width = Math.round(positions[0][0][0] / 10.0);

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("circle")
				.attr("cx", function (d) {
					return d[2];
				})
				.attr("cy", function (d) {
					return d[3];
				})
				.attr("r", function (d) {
					return ((d[0][0] / 2.0) - (stroke_width / 2.0));
				})
				.attr("stroke-width", function (d) {
					return stroke_width.toString();
				})
				.attr("fill", "transparent")
				.attr("stroke", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("polygon")
				.attr("points", function (d) {
					return generateScaledQTon7PolyPoints(d[0][0]);
				})
				.attr("transform", function (d) {
					return "translate(" + d[2] + "," + d[3] + ")";
				})
				.attr("fill", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				});
			break;

		case "motion_pixels":

			var intensity;
			switch(trial_array[initialSelection][2]){
				case 1:
					intensity=6;
					break;
				case 2:
					intensity=5;
					break;
				case 3:
					intensity=4;
					break;
				case 4:
					intensity=3;
					break;
				case 5:
					intensity=2;
					break;
				case 6:
					intensity=1;
					break;
			}

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("circle")
				.attr("cx", function (d) {
					return d[2];
				})
				.attr("cy", function (d) {
					return d[3];
				})
				.attr("r", function (d) {
					return d[0][0] / 2.0;
				})
				.attr("fill", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				})
				.transition()
					.on("start",function repeat(){
						d3.active(this)
							.transition()          // apply a transition
							.ease(d3.easeLinear)           // control the speed of the transition
							.duration(500)           // apply it over X000 milliseconds
							.attr("cx", function (d) {
								return d[2]-(trial_array[initialSelection][2]*5);
							})        // move the circle on the x axis
							.transition()        // apply a transition
							.ease(d3.easeLinear)          // control the speed of the transition
							.duration(500)           // apply it over 2000 milliseconds
							.attr("cx", function (d) {
								return d[2]+(trial_array[initialSelection][2]*5);
							})
						.on("end", repeat);
				 });  // return the circle tothe x axis
			break;


		case "motion":

			var intensity;
			switch(trial_array[initialSelection][2]){
				case 1:
					console.log("yo here intesity 1")
					intensity=6;
					break;
				case 2:
					intensity=5;
					break;
				case 3:
					intensity=4;
					break;
				case 4:
					intensity=3;
					break;
				case 5:
					intensity=2;
					break;
				case 6:
					intensity=1;
					break;
			}

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("circle")
				.attr("cx", function (d) {
					return d[2];
				})
				.attr("cy", function (d) {
					return d[3];
				})
				.attr("r", function (d) {
					return d[0][0] / 2.0;
				})
				.attr("fill", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				})
				.transition()
					.on("start",function repeat(){
						d3.active(this)
							.transition()          // apply a transition
							.ease(d3.easeLinear)           // control the speed of the transition
							.duration((intensity*1000)*2)           // apply it over X000 milliseconds
							.attr("cx", function (d) {
								return d[2]-50;
							})        // move the circle on the x axis
							.transition()        // apply a transition
							.ease(d3.easeLinear)          // control the speed of the transition
							.duration((intensity*1000)*2)           // apply it over x000 milliseconds
							.attr("cx", function (d) {
								return d[2]+50;
							})
						.on("end", repeat);
				 });  // return the circle tothe x axis
			break;

			case "flicker_opacity":
			var intensity;
			switch(trial_array[initialSelection][2]){
				case 1:
					console.log("yo here intesity 1")
					intensity=0.8334;
					break;
				case 2:
					intensity=0.6668;
					break;
				case 3:
					intensity=0.5002;
					break;
				case 4:
					intensity=0.3336;
					break;
				case 5:
					intensity=0.167;
					break;
				case 6:
					intensity=0.0;
					break;
			}

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("circle")
				.attr("cx", function (d) {
					return d[2];
				})
				.attr("cy", function (d) {
					return d[3];
				})
				.attr("r", function (d) {
					return d[0][0] / 2.0;
				})
				.attr("fill", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				})
				.transition()
					.on("start",function repeat(){
						d3.active(this)
							.transition()          // apply a transition
							.ease(d3.easeLinear)
							.duration(500)
							.style("opacity", intensity)
							.transition()
							.ease(d3.easeLinear)
							.duration(500)
							.style("opacity", trial_array[initialSelection][7])
						.on("end", repeat);
				 });
			break;


		case "flicker":
			var intensity;
			switch(trial_array[initialSelection][2]){
				case 1:
					intensity=6;
					break;
				case 2:
					intensity=5;
					break;
				case 3:
					intensity=4;
					break;
				case 4:
					intensity=3;
					break;
				case 5:
					intensity=2;
					break;
				case 6:
					intensity=1;
					break;
			}

			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("circle")
				.attr("cx", function (d) {
					return d[2];
				})
				.attr("cy", function (d) {
					return d[3];
				})
				.attr("r", function (d) {
					return d[0][0] / 2.0;
				})
				.attr("fill", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				})
				.transition()
					.on("start",function repeat(){
						d3.active(this)
							.transition()          // apply a transition
							.ease(d3.easeLinear)
							.duration((intensity*1000)*2)
							.style("opacity", 0)
							.transition()
							.ease(d3.easeLinear)
							.duration((intensity*1000)*2)
							.style("opacity", trial_array[initialSelection][7])
						.on("end", repeat);
				 });
			break;

		case "pulse_size":

			var intensity;
			switch(trial_array[initialSelection][2]){
				case 1:
					intensity=22;
					break;
				case 2:
					intensity=23.79;
					break;
				case 3:
					intensity=25.42;
					break;
				case 4:
					intensity=26.93;
					break;
				case 5:
					intensity=28.33;
					break;
				case 6:
					intensity=29.64;
					break;
			}
			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("circle")
				.attr("cx", function (d) {
					return d[2];
				})
				.attr("cy", function (d) {
					return d[3];
				})
				.attr("r", function (d) {
					return d[0][0] / 2.0;
				})
				.attr("fill", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				})
				.transition()
					.on("start",function repeat(){
						d3.active(this)
							.transition()          // apply a transition
							.ease(d3.easeLinear)
							.duration(500)
							.attr("r", intensity/2.0)
							.transition()
							.ease(d3.easeLinear)
							.duration(500)
							.attr("r", 20.00/2.0)
						.on("end", repeat);
				 });
			break;


		case "pulse":

			var intensity;
			switch(trial_array[initialSelection][2]){
				case 1:
					console.log("yo here intesity 1")
					intensity=6;
					break;
				case 2:
					intensity=5;
					break;
				case 3:
					intensity=4;
					break;
				case 4:
					intensity=3;
					break;
				case 5:
					intensity=2;
					break;
				case 6:
					intensity=1;
					break;
			}
			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("circle")
				.attr("cx", function (d) {
					return d[2];
				})
				.attr("cy", function (d) {
					return d[3];
				})
				.attr("r", function (d) {
					return d[0][0] / 2.0;
				})
				.attr("fill", function (d) {
					// Converting from Lab to RGB
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				})
				.transition()
					.on("start",function repeat(){
						d3.active(this)
							.transition()          // apply a transition
							.ease(d3.easeLinear)
							.duration((intensity*1000)*2)
							.attr("r", 29.64/2.0)
							.transition()
							.ease(d3.easeLinear)
							.duration((intensity*1000)*2)
							.attr("r", 20.00/2.0)
						.on("end", repeat);
				 });
			break;


		default:
			// Default shape is circle_filled (this case is reached in tutorial.html)
			svg.selectAll("svg")
				.data([positions[i]])
				.enter()
				.append("circle")
				.attr("cx", function (d) {
					return d[2];
				})
				.attr("cy", function (d) {
					return d[3];
				})
				.attr("r", function (d) {
					return d[0][0] / 2.0;
				})
				.attr("fill", function (d) {
					// Converting from Lab to RGB
					//console.log(d);
					var c = convertFrom(d[1], COLORTYPE.Lab);
					// Format as "rgba()" -- writeData.js
					return toHtml(c);
				})
				.style("opacity", trial_array[initialSelection][7])
				.style("filter", "url(#drop-shadow)");
			break;
	}
}//close for loop
};

var toHtml = function(color) {
  if (!color){
      return "black";
  }
  return "rgba(" + parseInt(255 * color[0]) + "," + parseInt(255 * color[1]) + "," + parseInt(255 * color[2]) + "," + color[3] + ")";
};

// all the other stimuli

var generateScaledQTon6PolyPoints = function(radius) {
	fixedDiameter = 86;
	points = [[4, -43],
	          [4, -10],
	          [28, -34],
	          [34, -28],
	          [10, -4],
	          [43, -4],
	          [43, 4],
	          [10, 4],
	          [34, 28],
	          [28, 34],
	          [4, 10],
	          [4, 43],
	          [-4, 43],
	          [-4, 10],
	          [-28, 34],
	          [-34, 28],
	          [-10, 4],
	          [-43, 4],
	          [-43, -4],
	          [-10, -4],
	          [-34, -28],
	          [-28, -34],
	          [-4, -10],
	          [-4, -43]];

	return generatePolyPointsString(fixedDiameter, radius, points);
}

var generateScaledQTon5PolyPoints = function(radius) {
	fixedDiameter = 86;
	points = [[4, -43],
			  [4, -7],
			  [35, -25],
			  [39, -19],
			  [8, 0],
			  [39, 19],
			  [35, 25],
			  [4, 7],
			  [4, 43],
			  [-4, 43],
			  [-4, 7],
			  [-35, 25],
			  [-39, 19],
			  [-8, 0],
			  [-39, -19],
			  [-35, -25],
			  [-4, -7],
			  [-4, -43]];

	return generatePolyPointsString(fixedDiameter, radius, points);
}


var generateScaledQTon2PolyPoints = function(radius) {
	fixedDiameter = 86;
	points = [[43, -43],
			  [43, -36],
			  [4, -36],
			  [4, 43],
			  [-4, 43],
			  [-4, -36],
			  [-43, -36],
			  [-43, -43]];

	return generatePolyPointsString(fixedDiameter, radius, points);
}

var generateScaledQTon3PolyPoints = function(radius) {
	fixedDiameter = 86;
	points = [[0, -4],
			  [35, -26],
			  [39, -19],
			  [4, 3],
			  [4, 43],
			  [-4, 43],
			  [-4, 3],
			  [-39, -19],
			  [-35, -26]];

	return generatePolyPointsString(fixedDiameter, radius, points);
}

var generateScaledQTon4PolyPoints = function(radius) {
	fixedDiameter = 86;
	points = [[4, -43],
			  [4, -4],
			  [43, -4],
			  [43, 4],
			  [4, 4],
			  [4, 43],
			  [-4, 43],
			  [-4, 4],
			  [-43, 4],
			  [-43, -4],
			  [-4, -4],
			  [-4, -43]];

	return generatePolyPointsString(fixedDiameter, radius, points);
}

//custom made to be bw 4 and 5
var generateScaledQTon7PolyPoints = function(radius) {
	fixedDiameter = 86;
	points = [[4, -43],
			  [4, -4],
			  [43, -4],
			  [43, 4],

		[8, 0],

		[39, 19],
			  [35, 25],
			  [4, 7],
			  [4, 43],
			  [-4, 43],
			  [-4, 7],



			 // [-39, -19],
			 // [-35, -25],
			 // [-4, -7],

			  [4, 4],
			  [4, 43],
			  [-4, 43],
			  [-4, 4],
			  [-43, 4],
			  [-43, -4],
			  [-4, -4],
			  [-4, -43]];

	return generatePolyPointsString(fixedDiameter, radius, points);
}


var generateScaledDiamondPolyPoints = function(radius) {
	fixedDiameter = 100;
	points = [[0, -50],
	          [37, 0],
	          [0, 50],
	          [-37, 0]];

	return generatePolyPointsString(fixedDiameter, radius, points);
}

var generateScaledStarPolyPoints = function(radius) {

	fixedDiameter = 100;
	points = [[0, -58],
			  [11, -20],
			  [50, -20],
			  [19, 3],
			  [30, 40],
			  [0, 17],
			 [-30, 40],
			 [-19, 3],
			[-50, -20],
			[-11, -20]]

	return generatePolyPointsString(fixedDiameter, radius, points);
}

var generateScaledQTon1PolyPoints = function(radius) {
	fixedDiameter = 86;
	points = [[43, -4],
			  [43, 4],
			  [-43, 4],
			  [-43, -4]];

	return generatePolyPointsString(fixedDiameter, radius, points);
}

var generatePolyPointsString = function(fixedDiameter, radius, points) {

	scaledPoints = [];
	pointsString = "";

	for (var i = 0; i < points.length; i++) {
		normalizedPoint = normalize(points[i]);
		vecLength = vectorLength(points[i])
		scaledPoint = [(vecLength/fixedDiameter)*radius*normalizedPoint[0],
					   (vecLength/fixedDiameter)*radius*normalizedPoint[1]];
		scaledPoints.push(scaledPoint);
		pointsString += (scaledPoints[i][0] + "," + scaledPoints[i][1]);
		if (i < (points.length - 1)) {
			pointsString += " ";
		}
	}

	return pointsString;
}

var vectorLength = function(vector) {
	return Math.sqrt(vector[0]*vector[0] + vector[1]*vector[1]);
}

var normalize = function(vector) {
	var length = vectorLength(vector);
	return [vector[0]/length, vector[1]/length];
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
var shuffle = function (a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

var generateRandom = function (min, max) {
  return Math.random() * (max - min) + min;
}

var startSession = function() {
    var date = new Date();
    sessionTime =  (date.getMonth() + 1)  + "_" + date.getDate() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds();
    return true;
 };