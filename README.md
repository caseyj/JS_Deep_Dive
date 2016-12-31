##Introduction

This project was designed with the need of a complete deep copy system for a network of javascript objects. Typically when building a javascript set of objects a set of deep copy operations must be defined by hand by the programmer to create a complete deep copy of an object. These object relationships do not necessarily require a deep copy on every object reference, or a shallow copy, the system defined in this project will distinguish the difference between these copy requirements and produce the proper clone network. Both networks will be identical but entirely separate in memory.

##How It Works
#Step 1: Decomposition
After providing an "entry object" (or array) the algorithm begins picking away at the indicies in the object and stacking each newly found object based on the already popular topological sort. Anytime the algorithm see's an object a second time it disregards and chugs along. The algorithm also does not stack any "primitive" data such as integers, strings, characters, booleans, nulls, ect. as well as functions. Until the stack is empty the algorithm chugs along building an edge list in an array. This edge list easily and accurately builds connections between nodes found which are stored as empty objects(or arrays). This method generates an object containing 2 arrays, the first array is a node list of empty objects and arrays, the second array is the generated edge list.
#Step 2: Recomposition
The generated edge and node lists enter the recomposition function and the function immediately begins looping through the edge list. If the algorithm lands on a "primitive" the connection is made to the raw value at the edge's "data" property. If the edge is pointing at an object, this connection is created using the index name in the edge object by calling the node in the node list who's index matches the edge's "source_index" and giving that node a property named by the edge object's "source_identifier" and making that property equal to the node in the node list who's index matches the edge's "data" property.

In short this connection looks like this
sourceNode = nodeList[currentEdge["source_index"]] ->"source_identifier"-> nodeList[currentEdge["data"]]



##How To Use It
Call the function "copy_network" from Deep_Diver.js swith your targetted object to copy as the argument and it will return your copied object network.