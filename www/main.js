import init, { Validator } from './pkg/cjval2_wasm.js';

async function main() {
  console.log("init");
  await init();

  $("#tab-errors").hide(); 
  $("#tab-warnings").hide(); 

  // Dropbox functions
  var dropbox;
  dropbox = document.getElementById("dropbox");
  dropbox.addEventListener("dragenter", dragenter, false);
  dropbox.addEventListener("dragover", dragover, false);
  dropbox.addEventListener("drop", drop, false);
  dropbox.addEventListener("click", click, false);

  dropbox.addEventListener("change", (ev) => {
    // handleFiles(input.files);
    // console.log("event click");
    let theinput = document.getElementById('fileElem');
    handleFiles(theinput.files);
  });

  ['dragover'].forEach(eventName => {
    dropbox.addEventListener(eventName, highlight, false)
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropbox.addEventListener(eventName, unhighlight, false)
  });

  function highlight(e) {
    dropbox.classList.add('highlight')
  }

  function unhighlight(e) {
    dropbox.classList.remove('highlight')
  }

  function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function drop(e) {
    e.stopPropagation();
    e.preventDefault();
    var dt = e.dataTransfer;
    var files = dt.files;
    handleFiles(files);
  }

  function click(e) {
    // console.log("click!!!");
    $('input:file')[0].click();
  }
}

function reset_result_tables(){
  document.getElementById('err-json').innerHTML = "";
  document.getElementById('err-json-1').innerHTML = "";
}

//-- executed when files are uploaded
async function handleFiles(files) {
  if (files[0] == null) {
    return
  }
  reset_result_tables();

  // console.log("yeah I validate here {}", files);

  var f = files[0];
  var reader = new FileReader();
  reader.readAsText(f);
  reader.onload = function() {
    $("#tab-errors").show();
    let validator;
    try {
      validator = Validator.from_str(reader.result);
      document.getElementById('err-json').innerHTML = "🟢";
    } catch (error) {
      console.log(error);
      document.getElementById('err-json').innerHTML = "❌";
      document.getElementById('err-json-1').innerHTML = error;
      return;
    }
    // console.log(validator);
    let re = validator.validate_schema();
    if (re == null) {
      document.getElementById('err-schema').innerHTML = "🟢";
    } else {
      document.getElementById('err-schema').innerHTML = "❌";
      document.getElementById('err-schema-1').innerHTML = re;
    }
    console.log(re);
  }; 

  $("#fileElem").val("")


  // for (var i = 0; i < files.length; i++) {
  //   //if file is not json
  //   var split_file_name = files[i].name.split(".");
  //   if (split_file_name[split_file_name.length - 1] != "json") {
  //     alert("file '" + files[i].name + "' is not a json file");
  //     continue
  //   }

  //   //if file already exist
  //   if (files[i].name.split(".")[0] in jsonDict) {
  //     alert("file '" + files[i].name + "' already loaded!");
  //     continue
  //   }

  //   //load json into memory
  //   var objectURL = window.URL.createObjectURL(files[i])
  //   var json = await loadJSON(objectURL)
  //   var jsonName = files[i].name.split(".")[0]

  //   //json file has an error and cannot be loaded
  //   if (json == -1){
  //     window.alert("File " + jsonName + ".json has an error and cannot be loaded!")
  //     continue
  //   }

  //   //add json to the dict
  //   jsonDict[jsonName] = json;

  //   //add it to the infoBox
  //   $("#filesBox").show();
  //   $('#TreeView').append('<li id="li_' + jsonName + '">' +
  //     '<span onclick="toggleTree(this);" id="span_' + jsonName + '">▽</span>' +
  //     '<input type="checkbox" onclick="toggleFile(this);" id="checkFile_' + jsonName + '" checked>' +
  //     '<span class="spanLiFileName">' + jsonName + '</span>' +
  //     '<ul class="fileTree" id="ul_' + jsonName + '"></ul>' +
  //     '</li>')

  //   //load the cityObjects into the viewer
  //   await loadCityObjects(jsonName)

  //   //already render loaded objects
  //   renderer.render(scene, camera);
  //   console.log("JSON file '" + jsonName + "' loaded")

  // }

  // //hide loader when loadin is finished
  // $("#loader").hide();

  // //global variable that a json is loaded
  // boolJSONload = true

  // //reset the input
  // $("#fileElem").val("")

}


main();