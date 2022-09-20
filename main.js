var main_function = function() {

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

function windowOnClick(event) {
    if (event.target === modal) {
        untoggleModal();
    }
    else if (event.target === modal_node){
      untoggleNodeModal();
    }
}

closeButton.addEventListener("click", untoggleModal());
window.addEventListener("click", windowOnClick);

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
        el.setAttribute('download', files[0].name)
      }
      else{
        alert("Nothing to download!")
      }

    }

    document.getElementById('import').onclick = function(){
      files = document.getElementById('selectFiles').files
      if(files.length <= 0){
        alert("No file!")
        return false
      }
      if(files[0].type != 'application/json'){
        alert("Not a JSON file!")
        return false
      }

      var fr = new FileReader();

      fr.readAsText(files.item(0));
  
      //to contain the json

      fr.onload = function(e) { 
      json_file = JSON.parse(e.target.result);
      import_file(json_file)
    } //end of json onLoad 

  } //end of import function
}