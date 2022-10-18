var import_file = function(json_file, file_name) {
    //copying the content of nodes and links 
    var nodes = [...json_file.nodes]
    var links = [...json_file.links]
    //console.log(nodes)
    for(let i = 0; i < links.length; i++){
      if(links[i].target.id != null || links[i].source.id != null){
        links[i].target = links[i].target.id
        links[i].source = links[i].source.id
      }
    }

    document.getElementById("exportJSON").onclick = function(){
      downloadHandler(this);
    }

    function downloadHandler(el){
      if(json_file != null || files != null){
        let f = JSON.parse(JSON.stringify(json_file));
        
        for(var i = 0; i < f.nodes.length; i++){
          delete f.nodes[i].vx
          delete f.nodes[i].vy
          delete f.nodes[i].x
          delete f.nodes[i].y
          delete f.nodes[i].index
        }
  
        for(var i = 0; i < f.links.length; i++){
          delete f.links[i].source.vx
          delete f.links[i].source.vy
          delete f.links[i].source.x
          delete f.links[i].source.y
          delete f.links[i].target.vx
          delete f.links[i].target.vy
          delete f.links[i].target.x
          delete f.links[i].target.y
          delete f.links[i].target.index
          delete f.links[i].source.index
        }
  
        var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(f));
        el.setAttribute('href', 'data:' + data)
        if(files != null){
          el.setAttribute('download', files[0].name)
        }
        else{
          var result = /[^/]*$/.exec(file_name)[0];
          el.setAttribute('download', result)
        }
        
     
      }
      else{
        alert("Nothing to download!")
      }
  
    }

    // Define menu
		var menu = [
			{
				title: 'Remove Node',
				action: function (data, event) {
					removeNode(data, event);
				}
			},
		]

    var menu_link = [
      {
        title: 'Remove Link',
        action: function(data, event){
          removeLink(data, event);
        }
      }
    ]


    var add_link = [
      {
        title: 'Create Link',
        action: function(data, event){
          toggleModal();
        }
      },
      {
        title: 'Create Node',
        action: function(data, event){
            newNodeModal();
        }
      }
    ]

    
function createLink(){
  var src = document.getElementById("source-select").value
  var target = document.getElementById("target-select").value
  var label = document.getElementById("label-input").value

  let obj = new Object()
  obj.source = src
  obj.target = target
  obj.label = label

  links.push(obj)
  json_file.links.push(obj)
  import_file(json_file, file_name)

/*  reDraw(
  simulation.force("link").links(links)
  simulation.alpha(0.1)
  simulation.restart()
  console.log(links)*/

  untoggleModal()
}

function createNode(){
  let valid = true

  const id = document.getElementById("id-input").value
  const label = document.getElementById("label-input").value
  const type = document.getElementById("id-type").value
  const ontology = document.getElementById("ontology-name").value
  const partialorno = document.getElementById("e_p").value
  const ontologyid = document.getElementById("ontology-id-input").value
  const matching_concept = document.getElementById("matching-node").value

  let matching = []
  if(ontology.length != 0 && partialorno.length != 0 && ontologyid.length != 0 && matching_concept.length != 0 ){
    matching = [ontology, partialorno, ontologyid, matching_concept]
  }

  if(id.length === 0) valid = false
  if(label.length === 0) valid = false
  if(type.length === 0) valid = false

  if(valid){
    let obj = new Object()
    obj.id = id
    obj.label = label
    obj.type = type
    obj.matching = matching
    
    nodes.push(obj)
    json_file.nodes.push(obj)
    console.log(nodes)
    import_file(json_file, file_name)

    untoggleNodeModal()
  }
  else{
    alert("There are important fields that are empty")
  }

}



function untoggleModal() {
    if(document.getElementById("source") != null){
      document.getElementById("source").remove();
      document.getElementById("target").remove();
      document.getElementById("link-button").remove();
      document.getElementById("label").remove();
      modal.classList.toggle("show-modal");
    } 
}

function untoggleNodeModal(){
    document.getElementById("id-node").remove()
    document.getElementById("label-node").remove()
    document.getElementById("type").remove()
    document.getElementById("ontology").remove()
    document.getElementById("partialorno").remove()
    document.getElementById("ontology-id").remove()   
    document.getElementById("matching").remove()
    document.getElementById("create-node-button").remove()
    modal_node.classList.toggle("show-modal")
}

function newNodeModal(){
  const id = '<div id = "id-node"> id: <input id="id-input" placeholder="ID"> </input> </div>'
  const label = '<div id = "label-node"> label: <input id=label-input placeholder="label"> </input></div>'
  const type = '<div id = "type"> type: <input id="id-type" placeholder="type"> </input></div>'
  const ontoloy_name = '<div id = "ontology"> ontology name: <input id="ontology-name" placeholder="ontology name"> </input></div>'
  const exact_or_partial = '<div id = "partialorno"> exact match or partial: <select id="e_p" style="width: 50%;"> <option value="" disabled selected>Select</option> <option value="E"> E (exact) </option> <option value="P"> P (partial) </option> </select> </div>'
  const ontology_id = '<div id = "ontology-id">ontology id: <input id="ontology-id-input" placeholder="ontology ID" ></input> </div>'
  const matching_concept = '<div id = "matching"> matching concept: <input id="matching-node" placeholder="matching concept"> </input> </div>'

  modal_node_content.innerHTML += id+label+type+ontoloy_name+exact_or_partial+ontology_id+matching_concept+'<button id="create-node-button">Create!</button>'

  document.getElementById("create-node-button").addEventListener("click", createNode)
  modal_node.classList.toggle("show-modal");
}

  function toggleModal() {
    //check for nodes that dont have any links (this is going to be the targets)
  //all nodes are in the source
  var src = '<div id = "source"> Source: <select name="source" id="source-select" style="width: 50%;"> '

  json_file.nodes.forEach(function(node){
    var id = node.id
    src += '<option value='+id + '>' + node.label + '</option>'
  })
  src += "</select> </div>"

  var temp = [...json_file.nodes]

  links.forEach(function(l){
    temp.forEach(function(n){
      if(l.source.id == n.id || l.target.id == n.id)
      {
        temp.splice(temp.indexOf(n), 1)
      }
    })
  })

  var target = '<div id = "target"> Target: <select name="target" id="target-select" style="width: 50%;"> '
  temp.forEach(function(node){
      var id = node.id
      target += '<option value=' + id + '>' + node.label + '</option>'
  })
  target += "</select> </div>"

  var label = '<div id = label> Label: <input id=label-input placeholder="your label"> </input></div>'

  modal_content.innerHTML += src+target+label+'<button id="link-button">Link!</button>'

  document.getElementById("link-button").addEventListener("click", createLink)
  modal.classList.toggle("show-modal");
}

function getNeighbors(node) {
  return links.reduce(function (neighbors, link) {
      if (link.target.id === node.id) {
        neighbors.push(link.source.id)
      } else if (link.source.id === node.id) {
        neighbors.push(link.target.id)
      }
      return neighbors
    },
    [node.id]
  )
}

function isNeighborLink(node, link) {
  return link.target.id === node.id || link.source.id === node.id
}
      
        
function getNodeColor(node, neighbors) {
  if (Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1) {
    return node.level === 1 ? 'blue' : 'green'
  }

  return node.level === 1 ? 'red' : 'gray'
}

function getLinkColor(node, link) {
  return isNeighborLink(node, link) ? 'green' : '#E5E5E5'
}


function getTextColor(node, neighbors) {
  return Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1 ? 'green' : 'black'
}

    var width = window.innerWidth
    var height = window.innerHeight


let svg = d3.select("#inc")
svg.attr('width', width).attr('height', height)
svg.on('contextmenu', d3.contextMenu(add_link))
svg.selectAll('*').remove();


var g_links = svg.append("g")
      .attr("class", "links");

var linkElements = g_links.selectAll("line")
  .data(links)
  .enter().append("line")
    .attr("stroke-width", 4)
	  .attr("stroke", "rgba(50, 50, 50, 0.2)")
    .on('contextmenu', d3.contextMenu(menu_link))


var g_nodes = svg.append("g")
        .attr("class", "nodes");

var g_textNode = svg.append("g")
        .attr("class", "texts")

var g_textLink = svg.append("g")
        .attr("class", "text")


// simulation setup with all forces
var simulation = d3
  .forceSimulation()
  .force('charge', d3.forceManyBody())
  .force('center', d3.forceCenter(width / 2, height / 2))

var linkForce = d3
  .forceLink()
  .id(function (link) { return link.id })
  .strength(function (link) { return 0.1 })

  var simulation = d3
  .forceSimulation()
  .force('link', linkForce)
  .force('charge', d3.forceManyBody().strength(-150))
  .force('center', d3.forceCenter(width / 2, height / 2))

var dragDrop = d3.drag().on('start', function (node) {
  node.fx = d3.event.x
  node.fy = d3.event.y
}).on('drag', function (node) {
  node.fx = d3.event.x
  node.fy = d3.event.y
  simulation.alpha(1).restart();

}).on('end', function (node) {
 /* if (!d3.event.active) {
    simulation.alpha(1)
  }
  node.fx = null
  node.fy = null*/
  
})
//

//remove nodes function
function removeNode(d, event) {

  var linkIndex = links.filter((n) => {
          return (n.target.id == d.id || n.source.id == d.id);
        })

    linkIndex.forEach(function(l){
        console.log(links.indexOf(l)  )
        links.splice(links.indexOf(l), 1)
        json_file.links.splice(json_file.links.indexOf(l), 1)
        if(l.source.id == d.id){
          nodeIndex = json_file.nodes.indexOf(l.target)
          json_file.nodes.splice(nodeIndex, 1)
        }

    })
    
  //have to store the json.nodes to new json file and just links to new json file
  var nodeIndex = json_file.nodes.indexOf(d)
  json_file.nodes.splice(nodeIndex, 1)

  import_file(json_file, file_name)
}

function removeLink(d, event){
  console.log(d)
  
  links.splice(links.indexOf(d), 1)
  json_file.links.splice(json_file.links.indexOf(d), 1)
  simulation.force("link").links(links)
  simulation.alpha(1).restart()
  simulation.restart()

  reDraw()

}

function reDraw() {
  var update_nodes = g_nodes.selectAll("circle")
        .data(nodes);
    update_nodes.exit().remove();
 //   console.log(update_nodes)
    nodeElements = update_nodes.enter()
      .append('circle')
      .merge(update_nodes);

  var update_links = g_links.selectAll("line")
        .data(links);
      console.log(links)
    update_links.exit().remove()
    linkElements = update_links.enter()
        .append("line")
        .merge(update_links)

    var update_link_text = g_textLink.selectAll("text")
        .data(links)

    update_link_text.exit().remove()
    console.log(update_link_text)
    textLinks = update_link_text.enter()
      .append("text")
      .merge(update_link_text)

    }


function selectNode(selectedNode) {
  var neighbors = getNeighbors(selectedNode)

  // we modify the styles to highlight selected nodes
  nodeElements.attr('fill', function (node) { return getNodeColor(node, neighbors) })
  textElements.attr('fill', function (node) { return getTextColor(node, neighbors) })
  linkElements.attr('stroke', function (link) { return getLinkColor(selectedNode, link) })

}

var nodeElements = g_nodes.selectAll("circle")
  .data(nodes)
  .enter().append("circle")
    .attr("r", 10)
    .attr("fill", getNodeColor)
    .call(dragDrop)
    .on('click', selectNode)
    .on('contextmenu', d3.contextMenu(menu))



var textElements = g_textNode
  .selectAll("text")
  .data(nodes)
  .enter().append("text")
    .text(function (node) { 
      if(node.matching.length > 0){
        return node.label + " (" + node.matching[2] + ")" + " (" + node.matching[0] + ")"
      }
      return  node.label 
    })
	  .attr("font-size", 15)
	  .attr("dx", 15)
    .attr("dy", 4)

var textLinks = g_textLink
  .selectAll("text")
  .data(links)
  .enter().append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("x", function(d) {
	        if (d.target.x > d.source.x) { return (d.source.x + (d.target.x - d.source.x)/2); }
	        else { return (d.target.x + (d.source.x - d.target.x)/2); }
	    })
    .attr("y", function(d) {
	        if (d.target.y > d.source.y) { return (d.source.y + (d.target.y - d.source.y)/2); }
	        else { return (d.target.y + (d.source.y - d.target.y)/2); }
	    })
	  .attr("fill", "Black")
            .style("font", "normal 12px Arial")
            .attr("dy", ".35em")
            .text(function(d) { return d.label; })

  

  simulation.nodes(nodes).on('tick', () => {
    nodeElements
      .attr('cx', function (node) { return node.x })
      .attr('cy', function (node) { return node.y })
    textElements
      .attr('x', function (node) { return node.x })
      .attr('y', function (node) { return node.y })
    linkElements
    .attr('x1', function (link) { return link.source.x })
    .attr('y1', function (link) { return link.source.y })
    .attr('x2', function (link) { return link.target.x })
    .attr('y2', function (link) { return link.target.y })
    textLinks
    .attr("x", function(d) {
	        if (d.target.x > d.source.x) { return (d.source.x + (d.target.x - d.source.x)/2); }
	        else { return (d.target.x + (d.source.x - d.target.x)/2); }
	    })
	  .attr("y", function(d) {
	        if (d.target.y > d.source.y) { return (d.source.y + (d.target.y - d.source.y)/2); }
	        else { return (d.target.y + (d.source.y - d.target.y)/2); }
	  });
      


  })
  simulation.force("link").links(links)

}