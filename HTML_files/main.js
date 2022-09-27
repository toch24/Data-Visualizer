let main_file = function(file) {
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

files = null

//initial graph
fetch(file)
.then(response => response.json())
.then(json => import_file(json, file))


    document.getElementById('import').onclick = function(){
      files = document.getElementById('selectFiles').files
      console.log(files)
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