//Graph API, specifies functions to add/remove/modify existing vertices/edges and their label (callbacks)

function setNode(nodeUpdateObj) {
    var node
    nodes.find(function(item, i) {
    	if(item.id == nodeUpdateObj.id) {
	    node = nodes[i]
	    return
	}
    });

    if(node == undefined) {
	node = nodeUpdateObj
	nodes.push(node)
    }
    
    return node
}

function setEdge(edgeUpdateObj) {
    var edge
    edges.find(function(item, i) {
    	if(item.source == edgeUpdateObj.source && item.target == edgeUpdateObj.target) {
	    edge = edges[i]
	    return
	}
    });

    if(edge == undefined) {
	edge = {
	    source: edgeUpdateObj.source,
	    target: edgeUpdateObj.target,
	    labelCallback: edgeUpdateObj.labelCallback
	}
	edges.push(edge)
    }

    for(a of edgeUpdateObj.append) {
    	if(edge[a.field] == undefined)
	    edge[a.field] = new Set()
	var exists = false
	edge[a.field].add(a.value)
    }

    for(r of edgeUpdateObj.replace) {
	edge[r.field] = r.value
    }
	
}

function getNode(nodeId) {
    var node 
    nodes.find(function(item, i) {
    	if(item.id == nodeId.id) {
    	    node = nodes[i]
    	    return
    	}
    });
    return node
}

function getEdge(edgeObj) {
    var edge
    edges.find(function(item, i) {
    	if(item.source == edgeObj.source && item.target == edgeObj.target) {
	    edge = edges[i]
	    return
	}
    });
    return edge
}

function deleteNode(nodeDelObj) {
    nodes = nodes.filter(function(value, index, arr){ return value.id != nodeDelObj.id;});
}

function deleteEdge(edgeDelObj) {
    var edge
    edges.find(function(item, i) {
    	if(item.source == edgeDelObj.source && item.target == edgeDelObj.target) {
	    edge = edges[i]
	    return
	}
    });
    
    if(edge == undefined)
	return
    
    for(a of edgeDelObj.subtract) {
    	if(edge[a.field] == undefined)
	    continue

	edge[a.field].delete(a.value)
    }

    for(r of edgeDelObj.replace) {
	edge[r.field] = r.value
    }
}
