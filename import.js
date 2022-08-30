var import_file = function(json_file) {
    //copying the content of nodes and links 
    var nodes = [...json_file.nodes]
    var links = [...json_file.links]
  //  console.log(nodes)
    for(let i = 0; i < links.length; i++){
      if(links[i].target.id != null || links[i].source.id != null){
        links[i].target = links[i].target.id
        links[i].source = links[i].source.id
      }
    }

    console.log(links)
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
      }
    ]

    
function createLink(){
  var src = document.getElementById("source-select").value
  var target = document.getElementById("target-select").value
  var label = document.getElementById("label-input").value
  console.log(label)
  var obj = new Object()
  obj.source = src
  obj.target = target
  obj.label = label

  links.push(obj)
  json_file.links.push(obj)
  import_file(json_file)

/*  reDraw()
  simulation.force("link").links(links)
  simulation.alpha(0.1)
  simulation.restart()
  console.log(links)*/

  untoggleModal()
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

function getVisibility(node, link){
    return isNeighborLink(node, link) ? 'visible' : 'hidden'
}

function getTextColor(node, neighbors) {
  return Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1 ? 'green' : 'black'
}

    var width = window.innerWidth
    var height = window.innerHeight


var svg = d3.select('svg')
svg.attr('width', width).attr('height', height)
svg.on('contextmenu', d3.contextMenu(add_link))
svg.selectAll('*').remove();


var g_links = svg.append("g")
      .attr("class", "links");

var linkElements = g_links.selectAll("line")
  .data(links)
  .enter().append("line")
    .attr("stroke-width", 1)
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
  .force('charge', d3.forceManyBody().strength(-120))
  .force('center', d3.forceCenter(width / 2, height / 2))

var linkForce = d3
  .forceLink()
  .id(function (link) { return link.id })
  .strength(function (link) { return 0.1 })

  var simulation = d3
  .forceSimulation()
  .force('link', linkForce)
  .force('charge', d3.forceManyBody().strength(-120))
  .force('center', d3.forceCenter(width / 2, height / 2))

var dragDrop = d3.drag().on('start', function (node) {
  node.fx = node.x
  node.fy = node.y
}).on('drag', function (node) {
  simulation.alphaTarget(0.7).restart()
  node.fx = d3.event.x
  node.fy = d3.event.y
}).on('end', function (node) {
  if (!d3.event.active) {
    simulation.alphaTarget(0)
  }
  node.fx = null
  node.fy = null
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

  import_file(json_file)
/*  simulation.force("link").links(links)
  simulation.nodes(nodes)
  simulation.alpha(1)
  simulation.restart()

  reDraw()*/

}

function removeLink(d, event){
  console.log(d)
  
  links.splice(links.indexOf(d), 1)
  json_file.links.splice(json_file.links.indexOf(d), 1)
  simulation.force("link").links(links)
  simulation.alpha(0.1)
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
  textLinks.attr('visibility', function (link) { return getVisibility(selectedNode, link)})
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
    .attr("visibility", "hidden")
    
  

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