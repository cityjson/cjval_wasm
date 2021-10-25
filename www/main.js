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

//-- executed when files are uploaded
async function handleFiles(files) {
  if (files[0] == null) {
    return;
  }
  reset_results();
  var f = files[0]; //-- read only the first file
  var reader = new FileReader();
  reader.readAsText(f);
  console.log(f);
  document.getElementById('inputsummary').children[0].innerHTML = f.name;
  document.getElementById('inputsummary').classList.remove('invisible');
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

function reset_results(){
  document.getElementById("theresult").classList.remove("alert-success"); 
  document.getElementById("theresult").classList.remove("alert-warning"); 
  document.getElementById("theresult").classList.remove("alert-danger"); 
  document.getElementById("theresult").classList.add('invisible');
  for (let i = 0; i < allerrors.length; i++) {
    let e = document.getElementById(allerrors[i]);
    e.classList.remove("table-success", "table-danger", "table-warning");
    e.children[1].innerHTML = "";
  }
}

function display_final_result(filename, isValid, hasWarnings) {
  // $("#tab-errors").show();
  document.getElementById("tab-errors").classList.remove('invisible');
  if (isValid) {
    if (!hasWarnings) {
      document.getElementById("theresult").children[0].innerHTML = "The file is 100% valid!";
      document.getElementById("theresult").classList.add("alert-success");

    } else {
      document.getElementById("theresult").children[0].innerHTML = "The file is valid but has warnings";
      document.getElementById("theresult").classList.add("alert-warning");
    }
  } else {
      document.getElementById("theresult").children[0].innerHTML = "The file is invalid";
      document.getElementById("theresult").classList.add("alert-danger");
  }
  document.getElementById("theresult").classList.remove('invisible');
}


function download_all_extensions(val, _callback) {
  console.log("has extensions?");
  let re = val.has_extensions();
  if (re != null) {
    console.log("extensions!");
    let urls = re.split('\n');
    document.getElementById('inputsummary').children[1].innerHTML += urls[0];
    var promises = urls.map(url => fetch(url).then(y => y.text()));
    console.log(promises);
    Promise.all(promises).then(results => {
      for (let i = 0; i < results.length; i++) {
        val.add_one_extension_from_str("a", results[i]);
      }
      _callback();
    });
  }
  else {
    _callback();
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







main();