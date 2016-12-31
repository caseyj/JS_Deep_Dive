/*
*Title: ObjectRenderEngine.js
*Author: John B. Casey <caseyjohnb@gmail.com> <github: caseyj
*Language: Javascript, Angular JS 
*Description: a graphic web interfact to depict and describe the connections 
*		between objects provided
*/



var createPoint = function(x_coord, y_coord){
	this.x = x_coord;
	this.y = y_coord;
	return this;
}

/**
*
*CREDS TO MOZILLA.ORG ON THIS FUNCTION!!!
*/
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min+1)) + min;
}

var createPoint_fromObj = function(collector, objIndex){
		collector[objIndex] = createPoint(getRandomInt(0,600), getRandomInt(0,600));
}

var generatePoints = function(collector, objectList){
	Object.keys(objectList).forEach(function(key){
		collector[key] = new createPoint(getRandomInt(0,600), getRandomInt(0,600));
	});
	return collector
}



var run_canvas = function($scope){
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext("2d");
	//this will be used to collect ID to coordinate points that exist

	//define some functions which can be used to generate 2d data points and some lines

	var drawDot = function(context, p){
		if(p!=null){
			context.beginPath();
			context.arc(p.x,p.y,10, 2*3.14, false);
			context.fillStyle = "#000000";
			context.fill();
			context.lineWidth = 1;
			context.strokeStyle = "#666666";
			context.stroke();
		}
	}
	
	var drawLine = function(context, p1, p2){
		if(p1!=null && p2!=null){
			context.beginPath();
			context.moveTo(p1.x, p1.y);
			context.lineTo(p2.x, p2.y);
			context.strokeStyle = "black";
			context.stroke();
		}
	}

	var drawLines = function(decomposed_network, context){
		var node_list = decomposed_network["Object_Nodes"];
		var edges = decomposed_network["edge_list"];
		var ID_to_point = generatePoints({}, node_list);
		console.log(ID_to_point);
		for(var i = 0; i<edges.length; i++){
			var edge = edges[i];
			switch(edges[i]["data_type"]){
				case "object":
				case "array":
					drawDot(context, ID_to_point[edge["data"]])
					drawLine(context, ID_to_point[edge["data"]], ID_to_point[edge["my_ID"]])
					break;
				default:
					break;
			}
		}
	}

	//iteration function
	//execute those functions on our "root"
	canvas.width = 600;
	canvas.height = 600;
	//context.globalAlpha = 1.0;
	//var LL = classic_LL(2);
	var o1 = {};
	var o4 = {};
	var o3 = {};
	var o2 = {};

	o1["data"] = 1;
	o1["next"] = o4;

	o4["data"] = 4;
	o4["next"] = o3;

	o3["data"] = 3;
	o3["next"] = o2;

	o2["data"] = 2;
	o2["next"] = null;
	var network = decompose_network(o1);
	context.beginPath();
	drawLines(network, context);


}