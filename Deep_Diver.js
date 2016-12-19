/**
*Title: Deep_Diver.js
*Author: John B. Casey <github: caseyj> <email:caseyjohnb@gmail.com>
*Language: Javascript
*Description : A tool developed to automate deep copy operations of a large 
		object network. With this system any javascript object should be taken 
		and all connected pieces of data will be appropriately deep copied into
		the target clone copy. 

		In this current version a starting object(NODE) is given and
*
*/

/**
*Specialty object used for internal operations to store and share related data
*
*
*/
function arc_point(source_index, source_identifier, data, DT, my_ID){
	return {
		"source_index": source_index,
		"source_identifier": source_identifier,
		"data": data,
		"data_type": DT,
		"my_ID": my_ID
	};
}

/**
*Initializes new squish_network object which contains all data needed to 
		reconstruct an object
*
*
*
*/
function squish_network(){
	return {
		//adjacency list of data connections
		"arc_list": [],
		//list of the empty notes and their reference strings
		"node_list": {}
	};
}


/**
*A function used to identify the type identity of an ambiguous object
*
*Input: 
	incoming_object-> the object whos type we wish to identify
*Output:
	a string indicating what type of object will be generated
*/
object_identifier = function(incoming_object){
	//null is a language error and is known as an object by typeof
	if(incoming_object===null){
		return "null";
	}
	//if its an array we tag it that way
	else if(Array.isArray(incoming_object)){
		return "array";
	}
	//otherwise its a regular object
	return typeof(incoming_object);
}

/**
*Returns a boolean if the item examined is a primitive
	such as int, double, NaN, string(kinda in js), or boolean
*
*Inputs:
	incoming_primitive->the data item to be examined
*Outputs:
	boolean if the data item is a primitive it returns true
*/
primitive_identifier = function(incoming_primitive){
	switch(typeof(incoming_primitive)){
		case "number":
		case "boolean":
		case "string":
			return true;
			break;
		default:
			return false;
			break;
	}
}

//var depth_string = function()


/*
*Function which will locate all objects to be copied and store their references
	And their connections to the original object
*
*Input:
	A singular Javascript object reference
*Output:
	A mapping between all objects 
*
*
*/
var decompose_network = function(js_object){
	//create an ID variable which will keep track of unique objects found
	var ID = 0;
	//the references we have already seen, we want to avoid cycles, so it maps OBJECT->boolean
	var seen_objects = [];
	//the adjacency list of object references to values and other objects
	var edges = [];
	//the stack we track references to be explored via topology
	var todo_list = [];
	//list of seen objects by ID
	var objectTracker = {};
	//this will track newly found objects to the arc they are discovered on
	var seen_arcs = [];

	//create an adjacency object and push it onto the adjacency list and the todo_list
	var start = arc_point(null, null, js_object, object_identifier(js_object), ID);
	//set it up that we start exploring the object graph from the "root"
	todo_list.push(start);
	//add this to our list of edges we have found indicating there is no "entry" and this is where we start
	edges.push(start); 
	//track 
	objectTracker[ID] = start;
	ID++;
	//loop while theres still references to be explored on the object graph
	while(todo_list[0]!=null){
		//pop off the reference on todo_list[size-1]
		var current_arc_point = todo_list.pop();
		var arc_data = current_arc_point.data;
		var my_ID = current_arc_point["my_ID"];
		//if the data isnt primitive we will loop!
		//primitive data are anything that are not objects which hold other peices of data
		//in this case strings are primitives as well as numeric values and booleans
		if(!primitive_identifier(arc_data)){
			//mark this datapoint as seen, we dont need to look at it ever again as we are about to 
			//	stack the references
			seen_objects.push(arc_data);
			seen_arcs.push(current_arc_point);
			//switch on the datatype: 
				//nulls are objects so we ignore them, other peices of data are
				//		then deconstructed by their contained identifiers, 
				//		stacked and explored
			switch (object_identifier(arc_data)){
				case "object":
				case "array":
					Object.keys(arc_data).sort().forEach(function(key){
						//look at the data at that key
						var narc_data = arc_data[key];
						//if its not a primitive and refers to another object, we got here and stack it up
						if(!primitive_identifier(narc_data)&&object_identifier(narc_data)!="null"){
							//create a new arc object tracking data to and from this datapoint and key 
							var new_arc = arc_point(key,my_ID,narc_data, object_identifier(narc_data), ID);
							//map this arc to the current ID
							edges.push(new_arc);
							//console.log(seen_objects);
							//if we have not seen this datapoint yet we will add it to the stack and eventually get to it
							if(seen_objects.indexOf(narc_data)==-1){
								
								objectTracker[ID] = new_arc;
								ID++
								todo_list.push(new_arc);
							}
						}
						else if(object_identifier(narc_data)!="null"){
							var new_arc = arc_point(key,my_ID,narc_data, object_identifier(narc_data), ID);
							
							ID++
							edges.push(new_arc);
						}
						//its a primitive so we need to map it and NOT recurse
						else{
							//create a new arc object for this reference to primitive data, and then add it to the adjacency list
							var new_arc = arc_point(key, my_ID,narc_data, typeof(narc_data), ID);
							
							ID++
							edges.push(new_arc);
						}

					});
					break;
				//ignore nulls entirely
				case "null":
					break;
				default: 
					break;
			}
		}
		
	}
	//console.log(seen_objects)
	//go through the list of edges and reassign the data property to the first arc ID of the target object 
	for(var i = 0; i<edges.length; i++){
		var edge = edges[i];
		var current_datum = edge["data"];
		//get the index of the object in the seen_objects array	
		var object_index = seen_objects.indexOf(current_datum);
		if(object_index>-1){
			edge["data"] = seen_arcs[object_index]["my_ID"];	
		}
	}
	//change each object found into it's type
	Object.keys(objectTracker).forEach(function(key){
		e_types = objectTracker[key]["data_type"];
		switch(e_types){
			case "object":
				objectTracker[key] = {};
				break;
			case "array":
				objectTracker[key] = [];
				break;
			default:
				break;
		}

	});
	return { "Object_Nodes": objectTracker, "edge_list":edges};
}

/***
*Takes in a decomposed object network, reconstructs the object network and returns
*	the reconstructed network
*
*INPUTS:
	The output or output equivalent of the decompose_network() function. 
*
*OUTPUTS:
	The first node in the node list indicating the same first node found in the 
	graph before decomp
*/
var recompose_network= function(network_decomposition){
	var node_list = network_decomposition["Object_Nodes"];
	var edges = network_decomposition["edge_list"];

	//loop backwards through the list of edges reconstructing each object
	for(var i = edges.length - 1; i>0; i--){
		var currentEdge = edges[i];
		var previousEdge = edges[currentEdge["source_identifier"]];

		//lets get the data types
		var data_type = currentEdge["data_type"];
		var source_data_type = previousEdge["data_type"];
		var pointing_node = node_list[previousEdge["data"]];
		var pointer = currentEdge["source_index"];
		//switch on source data type
		switch(source_data_type){
			//get the node our current node is actually looking at 
			
			//with array we use the splice function, switch statement within 
			//		determines if hard data or another node is the pointer
			case "array":
				pointer = parseInt(pointer);
				switch(data_type){
					
					case "object":
					case "array":
						//check if the array is even big enough so we can insert
						//		if not we init a new, larger array and copy over
						if(pointer>pointing_node.length){
							var nArr = new Array(pointer);
							for(var h = 0; h<pointing_node.length;h++){
								nArr.splice(h, 1,pointing_node[h]);
							}
							pointing_node = nArr;
							node_list[previousEdge["data"]] = nArr;
						}
						pointing_node.splice(pointer, 1, node_list[currentEdge["data"]]);
						break;
					default:
						//check if the array is even big enough so we can insert
						//		if not we init a new, larger array and copy over
						if(pointer>pointing_node.length){
							var nArr = new Array(pointer);
							for(var h = 0; h<pointing_node.length;h++){
								nArr.splice(h, 1,pointing_node[h]);
							}
							pointing_node = nArr;
							node_list[previousEdge["data"]] = nArr;
						}
						pointing_node.splice(pointer, 1, currentEdge["data"]);
						break;
				}
				break;
			//with object we just point the source ID to the current edge with 
			//		the current source_identifier 
			case "object":
				if(data_type=="object" || data_type == "array"){
					pointing_node[currentEdge["source_index"]] = node_list[currentEdge["data"]];
				}
				else{
					pointing_node[currentEdge["source_index"]] = currentEdge["data"];
				}
				break;
			default:
				break;
		}

	}
	//no matter what, we return the "root" node
	return node_list[0];
}


/**
*Encodes the live data of an object into a parse-able json format in which a 
	programmer could pass an object network around as a string
*
*Input:
	A javascript object, and it's network, to be encoded into json
*Output:
	A json datasheet representing a given javascript object and it's network
*/
encode = function(js_object){
	return {};
}

/**
*Decodes a json formatted file which includes javascript object network
	data and returns an object consistent with the network blueprint
	provided to the function
*
*Input:
	A json object describing a real javascript object which must be 
		reconstructed.
*Output:
	A reconstructed javascript object, and it's network from a given
		blueprint in json 
*/
decode = function(json_object){
	return {};
}

/**
*Makes a full deep-dive copy of a provided javascript object
*
*Input:
	A single javascript object, and it's network to be cloned
*Output:
	A perfect deep-dive clone of the input object
*/
copy_network = function(js_object){
	return decode(encode(js_object));
}





/**
*A simple driver to show how the tools in this project work.
*
*
*
*
*/
var testDriver = function(){
	var arrNumbers = [];
	var arrObjects = [];
	var arrSuperNest = [];
	for(var i = 0; i<=100; i++){
		arrNumbers.push(i);
		arrObjects.push({"data":i});
		var moremoreData = {};
		var moreData = {};
		var data = {};
		moremoreData["moremoreData"] = null;
		moreData["moreData"] = moremoreData;
		data["data"] = moreData;

		moremoreData["moremoreData"] = i;

		arrSuperNest.push(data);
	}

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

	console.log("array of numbers");
	console.log(arrNumbers);
	console.log(decompose_network(arrNumbers));
	console.log(recompose_network(decompose_network(arrNumbers)));
	console.log("array of objects");
	console.log(arrObjects);
	console.log(decompose_network(arrObjects));
	console.log(recompose_network(decompose_network(arrObjects)));
	console.log("supernest");
	console.log(arrSuperNest);
	console.log(decompose_network(arrSuperNest));
	console.log(recompose_network(decompose_network(arrSuperNest)));
	console.log("object_refs");
	console.log(o1);
	console.log(decompose_network(o1));
	console.log(recompose_network(decompose_network(o1)));
	o2["next"] = o1;
	console.log("object_refs v2: now with LOOPS");
	console.log(o1);
	console.log(decompose_network(o1));
	console.log(recompose_network(decompose_network(o1)));



}

testDriver();
