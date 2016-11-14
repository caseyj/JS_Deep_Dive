/**
*Title: Deep_Diver.js
*Author: John B. Casey <github: caseyj> <email:caseyjohnb@gmail.com>
*Language: Javascript
*Description : A tool developed to automate deep copy operations of a large 
		object network. With this system any javascript object should be taken 
		and all connected pieces of data will be appropriately deep copied into
		the target clone copy. 
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
		//reference string to the datapoint 
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

/**
*Class for creating and dealing with a 
*
*
*
*
*/
reference_stack = function(){
	this.head= null,
	this.stack = []
}

reference_stack.prototype.push = function(data){
	if(this.head!=null){
			this.stack.unshift(this.head);
			this.head = data;
	}
	else{
		this.head = data;
	}
}
/*
*
*
*
*/
reference_stack.prototype.pop = function(){
	var popped = this.head;
	if(this.stack.length>0){
		var shifticle = this.stack.shift();
		this.head = shifticle;
	}
	else{
		this.head = null;
	}
	return popped;
}

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
traverse_network = function(js_object){
	//console.log(js_object);
	var ID = 0;
	var seen_refs = {};
	var adjacencies = [];
	var todo_list = [];
	var start = arc_point(null, ID, js_object, object_identifier(js_object));
	todo_list.push(start);
	adjacencies.push(start);
	var masterOBJ = {};
	masterOBJ[start] = ID;
	ID++;
	while(todo_list[0]!=null){
		//console.log(todo_list);
		var current_arc_point = todo_list.pop();
		var arc_data = current_arc_point.data;
		if(!primitive_identifier(arc_data)){
			seen_refs[arc_data] = true;
			switch (object_identifier(arc_data)){
				case "object":
				case "array":
					Object.keys(arc_data).forEach(function(key){
						var narc_data = arc_data[key];
						if(!primitive_identifier(narc_data)){
							var new_arc = arc_point(key,masterOBJ[current_arc_point],narc_data, object_identifier(narc_data));
							masterOBJ[new_arc]= ID;
							ID++
							adjacencies.unshift(new_arc);
							//console.log(adjacencies);
							if(!seen_refs[narc_data]){
								todo_list.push(new_arc);
							}
						}

						else{
							var new_arc = arc_point(key,masterOBJ[current_arc_point],narc_data, typeof(narc_data));
							masterOBJ[new_arc]= ID;
							ID++
							adjacencies.unshift(new_arc);
							//console.log(adjacencies);
							if(!seen_refs[narc_data]){
								todo_list.push(new_arc);
							}	
						}

					});
				case "null":
				default: 
					break;
			}
		}
		
	}
	return adjacencies;
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

var testDriver = function(){
	var arrNumbers = [];
	var arrObjects = [];
	var arrSuperNest = [];
	console.log("hello World");
	for(var i = 0; i<=100; i++){
		arrNumbers.push(i);
		arrObjects.push({"data":i});
		arrSuperNest.push({"data":{"moreData":{"moremoreData":i}}})
	}
	console.log(traverse_network(arrObjects));
	console.log(traverse_network(arrNumbers));
	console.log(traverse_network(arrSuperNest));



}

testDriver();
