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
      let cjv = validator.get_input_cityjson_version();
      console.log(cjv);
      if (cjv == 11){
        document.getElementById('cjversion').innerHTML = "v1.1";
      } else if (cjv == 10) {
        document.getElementById('cjversion').innerHTML = "v1.0 (it would be a good idea to upgrade to v1.1)";
      } else {
        document.getElementById('cjversion').innerHTML = "version <1.0 (no validation possible)";
      }
    } catch (error) {
      console.log(error);
      document.getElementById('err_json_syntax').className = "table-danger";
      document.getElementById('err_json_syntax').children[1].innerHTML = error;
      isValid = false;
      display_final_result(isValid, hasWarnings);
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
  const myNode = document.getElementById("theextensions");
  myNode.innerHTML = '';
  document.getElementById("theresult").classList.remove("bg-success"); 
  document.getElementById("theresult").classList.remove("bg-warning"); 
  document.getElementById("theresult").classList.remove("bg-danger"); 
  document.getElementById("theresult").classList.add('invisible');
  for (let i = 0; i < allerrors.length; i++) {
    let e = document.getElementById(allerrors[i]);
    e.classList.remove("table-success", "table-danger", "table-warning");
    e.children[1].innerHTML = "";
  }
}

function display_final_result(isValid, hasWarnings) {
  // $("#tab-errors").show();
  document.getElementById("tab-errors").classList.remove('invisible');
  if (isValid) {
    if (!hasWarnings) {
      document.getElementById("theresult").innerHTML = "The file is 100% valid!";
      document.getElementById("theresult").classList.add("bg-success");

    } else {
      document.getElementById("theresult").innerHTML = "The file is valid but has warnings";
      document.getElementById("theresult").classList.add("bg-warning");
    }
  } else {
      document.getElementById("theresult").innerHTML = "The file is invalid";
      document.getElementById("theresult").classList.add("bg-danger");
  }
  document.getElementById("theresult").classList.remove('invisible');
}


function download_all_extensions(val, _callback) {
  let re = val.has_extensions();
  if (re != null) {
    let urls = re.split('\n');
    // const promises = [];
    // for (let i = 0; i < urls.length; i++) {
    //   let a = 
    //     fetch(urls[i])
    //     .then(y => y.text())
    //     .catch((error) => {
    //       console.error('Error:', error);
    //     }
    //   );
    //   promises.push(a);
    // }
    var promises = urls.map(url => 
      fetch(url)
      .then(y => y.text())
      .catch((error) => {
        console.error('Error:', error);
        alert("Error: cannot dowload Extension (Cross-Origin Request Blocked)");
      })
    );
    console.log(promises);
    Promise.all(promises).then(results => {
      for (let i = 0; i < results.length; i++) {
        if (results[i] == "404: Not Found") {
          console.log("404:", urls[i]);
          const li = document.createElement("li");
          li.classList.add("list-group-item");
          li.classList.add("d-flex");
          li.classList.add("justify-content-between");
          li.classList.add("align-items-center");
          li.innerHTML = urls[i];
          const sp = document.createElement("span");
          sp.classList.add("badge");
          sp.classList.add("bg-danger");
          sp.classList.add("rounded-pill");
          sp.innerHTML = "error";
          li.appendChild(sp);
          document.getElementById("theextensions").appendChild(li);
          display_final_result(false, false);
          return;
        } else {
          const li = document.createElement("li");
          li.classList.add("list-group-item");
          li.classList.add("d-flex");
          li.classList.add("justify-content-between");
          li.classList.add("align-items-center");
          li.innerHTML = urls[i];
          const sp = document.createElement("span");
          sp.classList.add("badge");
          sp.classList.add("bg-success");
          sp.classList.add("rounded-pill");
          sp.innerHTML = "ok";
          li.appendChild(sp);
          document.getElementById("theextensions").appendChild(li);
          val.add_one_extension_from_str(urls[i], results[i]);
        }
      }
      _callback();
    });
  }
  else {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.classList.add("d-flex");
    li.classList.add("justify-content-between");
    li.classList.add("align-items-center");
    li.innerHTML = "none";
    document.getElementById("theextensions").appendChild(li);
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
    display_final_result(isValid, hasWarnings);
    return;
  }

  if (validator.get_input_cityjson_version() == 11) {
    re = validator.validate_extensions();
    if (re == null) {
      document.getElementById('err_ext_schema').className = "table-success";
    } else {
      document.getElementById('err_ext_schema').className = "table-danger";
      document.getElementById('err_ext_schema').children[1].innerHTML = re;
      isValid = false;
      display_final_result(isValid, hasWarnings);
      return;
    }
  } else {
    if (validator.get_extensions() > 0) {
      document.getElementById('err_ext_schema').className = "table-danger";
      document.getElementById('err_ext_schema').children[1].innerHTML = "validation of Extensions is not supported in v1.0, upgrade to v1.1";
      isValid = false;
      display_final_result(isValid, hasWarnings);
      return;
    }
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
    display_final_result(isValid, hasWarnings);
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
  display_final_result(isValid, hasWarnings);
  console.log(re);  
}







main();