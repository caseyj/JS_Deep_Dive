/**
*Linked List Test suite
*
*v0.1->functions to interact with the nodes are not part of an object class
*v0.2-> functions below bottom will be used to construct graph subtypes
*
*
*
*
*/

/*
*Just keeps track of head and tail of a LL
*/
var meta_node = function(){
	this.head = null;
	this.tail = null;
}
var meta_getHead = function(meta){
	return meta.head;
}
var meta_getTail = function(meta){
	return meta.tail;
}

var meta_setHead = function(meta, headNode){
	meta.head = headNode;
}

var meta_setTail = function(meta, tailNode){
	meta.tail = tailNode;
}

/**
*A Linked list node with a single exit pointer
*/
var Snode = function(datum, next){
	this.data = datum;
	this.next = next;
}


/*
*A linked list node with 2 exit pointers
*/
var Dnode = function(previous,datum,next){
	this.previous = previous;
	this.data = datum;
	this.next = next;
}

var node_getData = function(node){
		return node.data;
}

var node_getNext = function(node){
		return node.next;
}

var node_setNext = function(rooter, node){
		rooter.next = node;
}

var node_getPrevious = function(node){
		return node.previous;
}

var node_setPrevious = function(rooter, node){
		rooter.previous = node;
}

/**
*Class to generate and test a linear singley linked list
*/
var SList = function(){
	this.meta = new meta_node();
}
var get_meta = function(sList){
	return sList.meta;
}

var enqueue_Snode = function(sList, data){
	var n_node = Snode(data, null);
	var meta = get_meta(sList);
	if(meta_getHead(meta)==null){
		sList.meta_setHead(meta, n_node);
		sList.meta_setTail(meta, n_node);
	}
	else{
		var current_tail = meta_getTail(meta);
		current_tail.node_setNext(meta, n_node);
		sList.meta_setTail(meta, n_node);
	}
	return sList;
}

var dequeue_Snode = function(sList){
	var meta = get_meta(sList);
	var head = meta_getHead(meta);
	if(head!=null){
		meta_setHead(meta, node_getNext(head));
	}
	return head;
}

/************************************************************************
*************************************************************************
*************************************************************************
*****************functions below create graphs to test with**************
*************************************************************************
*************************************************************************
*************************************************************************
*************************************************************************
*************************************************************************/
//N1->N2->N3->...NM
var classic_LL = function(size){
	var LL = new Snode();
	for(var i = 0; i<size; i++){
		LL = enqueue_Snode(LL, i);
	}
	return LL;
}

// N1->N2->N3->...NM->N1
var circle_LL = function(size){
	var LL = new Snode();
	LL = enqueue_Snode(LL, 0);
	var start = meta_getHead(get_meta(LL));
	var fin = start;
	for(var i = 1; i<size; i++){
		LL = enqueue_Snode(LL, i);
		fin = meta_getHead(get_meta(LL));
	}
	node_setNext(fin, start);
	return LL
}