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
function arc_point(source_index, source_identifier, data, DT){
	return {
		"source_index": source_index,
		"source_identifier": source_identifier,
		"data": data,
		"data_type": DT
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
	var seen_refs = [];
	//the adjacency list of object references to values and other objects
	var adjacencies = [];
	//the stack we track references to be explored via topology
	var todo_list = [];
	//list of seen objects by ID
	var objectTracker = {};
	//create an adjacency object and push it onto the adjacency list and the todo_list
	var start = arc_point(null, ID, js_object, object_identifier(js_object));
	todo_list.push(start);
	adjacencies.push(start);
	//maps the first object to it's ID, maps OBJECT->ID
	var masterOBJ = {};
	masterOBJ[start]= ID;
	objectTracker[ID] = start;
	ID++;
	//loop while theres still references to be explored on the object graph
	while(todo_list[0]!=null){
		//pop off the reference on todo_list[size-1]
		var current_arc_point = todo_list.pop();
		var arc_data = current_arc_point.data;
		var my_ID = masterOBJ[current_arc_point];
		//if the data isnt primitive we will loop!
		//primitive data are anything that are not objects which hold other peices of data
		//in this case strings are primitives as well as numeric values and booleans
		if(!primitive_identifier(arc_data)){
			//mark this datapoint as seen, we dont need to look at it ever again as we are about to 
			//	stack the references
			seen_refs.push(arc_data);
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
							var new_arc = arc_point(key,my_ID,narc_data, object_identifier(narc_data));
							//map this arc to the current ID
							adjacencies.push(new_arc);
							//console.log(seen_refs);
							//if we have not seen this datapoint yet we will add it to the stack and eventually get to it
							if(seen_refs.indexOf(narc_data)==-1){
								masterOBJ[new_arc]= ID;
								objectTracker[ID] = new_arc;
								ID++
								todo_list.push(new_arc);
							}
							else{
								new_arc["data"] = "object " + seen_refs.indexOf(narc_data);
							}
						}
						else if(object_identifier(narc_data)!="null"){
							var new_arc = arc_point(key,my_ID,narc_data, object_identifier(narc_data));
							masterOBJ[new_arc]= ID;
							ID++
							adjacencies.push(new_arc);
						}
						//its a primitive so we need to map it and NOT recurse
						else{
							//create a new arc object for this reference to primitive data, and then add it to the adjacency list
							var new_arc = arc_point(key,masterOBJ[current_arc_point],narc_data, typeof(narc_data));
							masterOBJ[new_arc]= ID;
							ID++
							adjacencies.push(new_arc);
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
	return { "Object_Nodes": objectTracker, "adjacency_list":adjacencies};
}

/***
*Takes in a decomposed object network, reconstructs the object network and returns
*	the reconstructed network
*
*INPUTS:
*
*OUTPUTS:
*/
var recompose_network= function(network_decomposition){
	var node_list = network_decomposition["Object_Nodes"];
	var adjacencies = network_decomposition["adjacency_list"];

	var start = null;
	//check if we start with an object or an array to get things started
	switch(node_list[0]["data_type"]){
		case "object":
			start = {};
			break;
		case "array":
			start = [];
			break;
		default:
			return node_list[0]["data"];
			break;
	}
	//adjacencies we have seen
	var seen_adjacencies = {};
	var seen_nodes = {};
	//set all seen adjacencies to false
	//also set all seen nodes to false
	for(var i = 1; i<adjacencies.length(); i++){
		seen_adjacencies[adjacencies[i]] = false;
		seen_nodes[adjacencies[i]["source_identifier"]] = false;
	}
	//for loop through the adjacencies
	for(var i = adjacencies.length(); i>0; --i){
		
	}



	return {};
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

	console.log("object_refs");
	console.log(decompose_network(o1));
	o2["next"] = o1;

	//console.log("SuperNest:");
	//console.log(arrSuperNest);
	//console.log("SuperNest end");

	console.log("array of numbers");
	console.log(decompose_network(arrNumbers));
	console.log("array of objects");
	console.log(decompose_network(arrObjects));
	console.log("supernest");
	console.log(decompose_network(arrSuperNest));
	console.log("object_refs v2");
	console.log(decompose_network(o1));



}

testDriver();
