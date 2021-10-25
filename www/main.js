import init, { Validator } from './pkg/cjval_wasm.js';


const allerrors = ["err_json_syntax", 
                   "err_schema", 
                   "err_ext_schema", 
                   "err_parents_children_consistency",
                   "err_parents_children_consistency", 
                   "err_wrong_vertex_index",
                   "err_semantics_arrays", 
                   "war_duplicate_vertices",
                   "war_unused_vertices",
                   "war_extra_root_properties"
                  ];



async function main() {
  console.log("init");
  await init();

  reset_results();

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

function reset_results(){
  $("#result-success").hide();
  $("#result-warning").hide();
  $("#result-error").hide();
  $("#tab-errors").hide(); 
  for (let i = 0; i < allerrors.length; i++) {
    let e = document.getElementById(allerrors[i]);
    e.classList.remove("table-success", "table-danger", "table-warning");
    e.children[1].innerHTML = "";
  }
}

function display_final_result(filename, isValid, hasWarnings) {
  $("#tab-errors").show();
  $("#tab-warnings").show();
  if (isValid) {
    if (!hasWarnings) {
      document.getElementById("result-success").children[0].innerHTML = filename;
      $("#result-success").show();
    } else {
      document.getElementById('result-warning').children[0].innerHTML = filename;
      $("#result-warning").show();
    }
  } else {
    document.getElementById('result-error').children[0].innerHTML = filename;
    $("#result-error").show();   
  }
}


function download_all_extensions(val, _callback) {
  let re = val.has_extensions();
  if (re != null) {
    console.log("extensions!");
    let urls = re.split('\n');
    var promises = urls.map(url => fetch(url).then(y => y.text()));
    console.log(promises);
    Promise.all(promises).then(results => {
      for (let i = 0; i < results.length; i++) {
        val.add_one_extension_from_str("a", results[i]);
      }
      // console.log("# exts2: ", val.get_extensions());
      _callback();
    });

  }
}


function allvalidations(validator, fname) {
  console.log("all validations");
  console.log("# exts1: ", validator.get_extensions());
  var isValid = true;
  var hasWarnings = false;
  //-- validate_schema
  let re = validator.validate_schema();
  if (re == null) {
    document.getElementById('err_schema').className = "table-success";
  } else {
    document.getElementById('err_schema').className = "table-danger";
    document.getElementById('err_schema').children[1].innerHTML = re;
    isValid = false;
    display_final_result(fname, isValid, hasWarnings);
    return;
  }

  re = validator.validate_extensions();
  if (re == null) {
    document.getElementById('err_ext_schema').className = "table-success";
  } else {
    document.getElementById('err_ext_schema').className = "table-danger";
    document.getElementById('err_ext_schema').children[1].innerHTML = re;
    isValid = false;
    display_final_result(fname, isValid, hasWarnings);
    return;
  }

  //-- wrong vertex index
  re = validator.wrong_vertex_index();
  if (re == null) {
    document.getElementById('err_wrong_vertex_index').className = "table-success";
  } else {
    document.getElementById('err_wrong_vertex_index').className = "table-danger";
    document.getElementById('err_wrong_vertex_index').children[1].innerHTML = re;
    isValid = false;
  }
  re = validator.parent_children_consistency();
  if (re == null) {
    document.getElementById('err_parents_children_consistency').className = "table-success";
  } else {
    document.getElementById('err_parents_children_consistency').className = "table-danger";
    document.getElementById('err_parents_children_consistency').children[1].innerHTML = re;
    isValid = false;
  }
  re = validator.semantics_arrays();
  if (re == null) {
    document.getElementById('err_semantics_arrays').className = "table-success";
  } else {
    document.getElementById('err_semantics_arrays').className = "table-danger";
    document.getElementById('err_semantics_arrays').children[1].innerHTML = re;
    isValid = false;
  }

  if (isValid == false) {
    // console.log("falseeeee")
    display_final_result(fname, isValid, hasWarnings);
    return;
  }
  //-- WARNINGS
  re = validator.duplicate_vertices();
  if (re == null) {
    document.getElementById('war_duplicate_vertices').className = "table-success";
  } else {
    document.getElementById('war_duplicate_vertices').className = "table-warning";
    document.getElementById('war_duplicate_vertices').children[1].innerHTML = re;
    hasWarnings = true;
  }
  re = validator.extra_root_properties();
  if (re == null) {
    document.getElementById('war_extra_root_properties').className = "table-success";
  } else {
    document.getElementById('war_extra_root_properties').className = "table-warning";
    document.getElementById('war_extra_root_properties').children[1].innerHTML = re;
    hasWarnings = true;
  }    
  re = validator.unused_vertices();
  if (re == null) {
    document.getElementById('war_unused_vertices').className = "table-success";
  } else {
    document.getElementById('war_unused_vertices').className = "table-warning";
    document.getElementById('war_unused_vertices').children[1].innerHTML = re;
    hasWarnings = true;
  }     
  //-- FINAL RESULTS
  display_final_result(fname, isValid, hasWarnings);
  console.log(re);  
}

//-- executed when files are uploaded
async function handleFiles(files) {
  if (files[0] == null) {
    return;
  }
  reset_results();
  var f = files[0]; //-- read only the first file
  var reader = new FileReader();
  reader.readAsText(f);
  reader.onload = function() {
    let validator;
    try {
      validator = Validator.from_str(reader.result);
      document.getElementById('err_json_syntax').className = "table-success";
    } catch (error) {
      console.log(error);
      document.getElementById('err_json_syntax').className = "table-danger";
      document.getElementById('err_json_syntax').children[1].innerHTML = error;
      isValid = false;
      display_final_result(f.name, isValid, hasWarnings);
      return;
    }
    //-- fetch all extensions 
    
    download_all_extensions(validator, () => {
      allvalidations(validator, f.name);
    });
    
  }
  $("#fileElem").val("")
}


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


main();