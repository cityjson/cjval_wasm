import init, { Validator } from './pkg/cjval_wasm.js';


const allerrors = ["err_json_syntax", 
                   "err_schema", 
                   "err_ext_schema", 
                   "err_parents_children_consistency",
                   "err_parents_children_consistency", 
                   "err_wrong_vertex_index",
                   "err_semantics_arrays", 
                   "err_materials", 
                   "err_textures", 
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
  var extension = f.name.split('.').pop().toLowerCase();
  console.log("extension: ", extension);
  document.getElementById('inputsummary').children[0].innerHTML = f.name;
  document.getElementById('inputsummary').classList.remove('invisible');
  if (extension == 'json') {
    var reader = new FileReader();
    reader.readAsText(f);
    reader.onload = function() {
      let validator;
      validator = Validator.from_str(reader.result);
      let cjv = validator.get_input_cityjson_version();
      let cjschemav = validator.get_cityjson_schema_version();
      if (cjv == 20) {
        document.getElementById('cjversion').innerHTML = "CityJSON v2.0 (schemas used: v" + cjschemav + ")";
      } else if (cjv == 11) {
        document.getElementById('cjversion').innerHTML = "v1.1 (it would be a good idea to <a href='https://www.cityjson.org/tutorials/upgrade20/'>upgrade to v2.0</a>)"; 
      } else if (cjv == 10) {
        document.getElementById('cjversion').innerHTML = "v1.0 (it would be a good idea to <a href='https://www.cityjson.org/tutorials/upgrade20/'>upgrade to v2.0</a>)";
      } else {
        document.getElementById('cjversion').innerHTML = "version <1.0 (no validation possible)";
      }
      //-- fetch all extensions 
      console.log("before download_all_extensions");
      download_all_extensions(validator, () => {
        allvalidations(validator);
      });
    }
  //-- CityJSONFeature -- CityJSONL
  } else if (extension == 'jsonl') {
    console.log("CITYJSONL");
    var table1 = document.getElementById("tab_cjf_summary");
    var reader = new FileReader();
    let validator;
    reader.onload = (event) => {
      const contents = event.target.result;
      const lines = contents.split('\n'); // Split the content into lines
      let b_metadata = false;
      var noline = 1;
      for (const line of lines) {
        if (line == "") {
          continue;
        }
        if (b_metadata == false) {
          console.log("metadata:", line);
          validator = Validator.from_str(line);
          let cjv = validator.get_input_cityjson_version();
          let cjschemav = validator.get_cityjson_schema_version();
          if (cjv == 20) {
            document.getElementById('cjversion').innerHTML = "CityJSONFeature v2.0 (schemas used: v" + cjschemav + ")";
          } else if (cjv == 11) {
            document.getElementById('cjversion').innerHTML = "CityJSONFeature v1.1 (it would be a good idea to <a href='https://www.cityjson.org/tutorials/upgrade20/'>upgrade to v2.0</a>)"; 
          } else {
            document.getElementById('cjversion').innerHTML = "CityJSONFeature version <=1.0 (no validation possible)";
          }
          let row = document.createElement("tr");
          let c1 = document.createElement("td");
          let c2 = document.createElement("td");
          c1.innerText = noline;
          row.appendChild(c1);
          row.appendChild(c2);
          table1.appendChild(row);

          try {
            validator.validate();
            var status = validator.get_status();
            var errs = validator.get_errors_string();
            if (status == 1) {
              c2.innerText = "✅";
            } else if (status == 0) {
              c2.innerText = "🟡 " + errs;
            }  else {
              c2.innerText = "❌ (first line must be a CityJSON object) | " + errs;
            }
            // console.log("status:", status);
          }
          catch(e) {
            // console.log(e);
            c2.innerText = "❌ (first line must be a CityJSON object)";
          }
          b_metadata = true;
        } else {
          console.log(line);
          let row = document.createElement("tr");
          let c1 = document.createElement("td");
          let c2 = document.createElement("td");
          c1.innerText = noline;
          row.appendChild(c1);
          row.appendChild(c2);
          table1.appendChild(row);
          try {
            var re = validator.from_str_cjfeature(line);
            validator.validate();
            var status = validator.get_status();
            if (status == 1) {
              // console.log("1:");
              c2.innerText = "✅";
            } else if (status == 0){
              var errs = validator.get_errors_string();
              // console.log("0:", errs);
              c2.innerText = "🟡 " + errs;
            } else { //-- -1
              var errs = validator.get_errors_string();
              c2.innerText = "❌ " + errs;
              // console.log("-1:", errs);
            }
          }
          catch(e) {
            c2.innerText = "❌ " + e;
            // console.log("-1:", e);
          }
        }
        noline++;
      }
    };
    reader.readAsText(f);
    // var removeTab = document.getElementById('tab_cj_summary');
    // var parentEl = removeTab.parentElement;
    // parentEl.removeChild(removeTab);
    document.getElementById("tab_cjf_summary").classList.remove('invisible');
  } else  {
    console.log("TYPE NOT SUPPORTED");
    var s = "File type not allowed (only .json and .jsonl)";
    wrong_filetype(s);
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

function wrong_filetype(s){
  document.getElementById("theresult").innerHTML = s;
  document.getElementById("theresult").classList.add("bg-danger");
  document.getElementById("tab_cj_summary").classList.remove('invisible');
  document.getElementById("theresult").classList.remove('invisible');
}

function display_final_result(isValid, hasWarnings) {
  document.getElementById("tab_cj_summary").classList.remove('invisible');
  document.getElementById("tab_cjf_summary").classList.add('invisible');
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
  let re = val.get_extensions_urls();
  if (re != null) {
    let urls = re.split('\n');
    var promises = urls.map(url => 
      fetch(url)
      .then(y => y.text())
      .catch((error) => {
        console.error('Error:', error);
      })
    );
    Promise.all(promises).then(results => {
      for (let i = 0; i < results.length; i++) {
        // console.log(results[i]);
        // console.log("results", results[i]);
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.classList.add("d-flex");
        li.classList.add("justify-content-between");
        li.classList.add("align-items-center");
        li.innerHTML = urls[i];
        const sp = document.createElement("span");
        sp.classList.add("badge");
        if (typeof results[i] === 'undefined') {
          sp.classList.add("bg-danger");
          sp.classList.add("rounded-pill");
          sp.innerHTML = "error";
          li.appendChild(sp);
          document.getElementById("theextensions").appendChild(li);
          document.getElementById('err_ext_schema').className = "table-danger";
          document.getElementById('err_ext_schema').children[1].innerHTML = "Cannot download Extension schema (maybe because of CORS, <a href='https://github.com/cityjson/cjval/issues/1'>how to fix this</a>)";
          display_final_result(false, false);
          return;
        } else if (results[i] == "404: Not Found") {
          sp.classList.add("bg-danger");
          sp.classList.add("rounded-pill");
          sp.innerHTML = "error";
          li.appendChild(sp);
          document.getElementById("theextensions").appendChild(li);
          document.getElementById('err_ext_schema').className = "table-danger";
          document.getElementById('err_ext_schema').children[1].innerHTML = "Extension schemas cannot be found.";
          display_final_result(false, false);
          return;
        } else {
          let re = val.add_one_extension_from_str(urls[i], results[i]);
          if (re == null) {
            sp.classList.add("bg-success");
            sp.classList.add("rounded-pill");
            sp.innerHTML = "ok";
            li.appendChild(sp);
            document.getElementById("theextensions").appendChild(li);
            console.log("Extension loaded successfully");
          } else {
            sp.classList.add("bg-danger");
            sp.classList.add("rounded-pill");
            sp.innerHTML = "error";
            li.appendChild(sp);
            document.getElementById("theextensions").appendChild(li);
            document.getElementById('err_ext_schema').className = "table-danger";
            let ss = `Extension: issues with parsing schema [${re}].`;
            document.getElementById('err_ext_schema').children[1].innerHTML = ss;
            // document.getElementById('err_ext_schema').children[1].innerHTML = "Extension: issues with parsing schema [${re}].";
            display_final_result(false, false);
            return;
          }
          // results[i].text().then(function(cc) {
          //   console.log("cc");
          //   // console.log(cc);
          //   let ff = val.add_one_extension_from_str(urls[i], cc);
          //   console.log(ff);
          // });
        }
      }
      _callback();
    });
    console.log("promises done.");
  }
  else {
    console.log("promise else");
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


function allvalidations(validator) {
  console.log("all validations");
  console.log("# extensions in the file: ", validator.number_extensions());
  var isValid = true;
  var hasWarnings = false;
  validator.validate();
  //-- syntax
  try {
    validator.json_syntax();
    document.getElementById('err_json_syntax').className = "table-success";
  } 
  catch(e) {
    document.getElementById('err_json_syntax').className = "table-danger";
    document.getElementById('err_json_syntax').children[1].innerHTML = e;
    isValid = false;
    display_final_result(isValid, hasWarnings);
    return;
  }
  //-- validate_schema
  try {
    validator.schema();
    document.getElementById('err_schema').className = "table-success";
  } 
  catch(e) {
    document.getElementById('err_schema').className = "table-danger";
    document.getElementById('err_schema').children[1].innerHTML = e;
    isValid = false;
    display_final_result(isValid, hasWarnings);
    return;
  }

  if (validator.get_input_cityjson_version() > 10)  {
    try {
      validator.extensions();
      document.getElementById('err_ext_schema').className = "table-success";
    } 
    catch(e) {
      document.getElementById('err_ext_schema').className = "table-danger";
      document.getElementById('err_ext_schema').children[1].innerHTML = e;
      isValid = false;
      display_final_result(isValid, hasWarnings);
      return;
    }
  } else {
    if (validator.number_extensions() > 0) {
      document.getElementById('err_ext_schema').className = "table-danger";
      document.getElementById('err_ext_schema').children[1].innerHTML = "validation of Extensions is not supported in v1.0, upgrade to v1.1";
      isValid = false;
      display_final_result(isValid, hasWarnings);
      return;
    }
  }

  //-- wrong_vertex_index
  try {
    validator.wrong_vertex_index();
    document.getElementById('err_wrong_vertex_index').className = "table-success";
  }
  catch(e) {
    document.getElementById('err_wrong_vertex_index').className = "table-danger";
    document.getElementById('err_wrong_vertex_index').children[1].innerHTML = e;
    isValid = false;
  }

  //-- parents_children_consistency
  try {
    validator.parents_children_consistency();
    document.getElementById('err_parents_children_consistency').className = "table-success";
  } 
  catch(e) {
    document.getElementById('err_parents_children_consistency').className = "table-danger";
    document.getElementById('err_parents_children_consistency').children[1].innerHTML = e;
    isValid = false;
  }

  //-- semantics_arrays
  try {
    validator.semantics_arrays();
    document.getElementById('err_semantics_arrays').className = "table-success";
  }
  catch(e) {
    document.getElementById('err_semantics_arrays').className = "table-danger";
    document.getElementById('err_semantics_arrays').children[1].innerHTML = e;
    isValid = false;
  }

  console.log("materials");
  //-- materials
  try {
    validator.materials();
    document.getElementById('err_materials').className = "table-success";
  }
  catch(e) {
    document.getElementById('err_materials').className = "table-danger";
    document.getElementById('err_materials').children[1].innerHTML = e;
    isValid = false;
  }

  //-- textures
  try {
    validator.textures();
    document.getElementById('err_textures').className = "table-success";
  }
  catch(e) {
    document.getElementById('err_textures').className = "table-danger";
    document.getElementById('err_textures').children[1].innerHTML = e;
    isValid = false;
  }

  if (isValid == false) {
    // console.log("falseeeee")
    display_final_result(isValid, hasWarnings);
    return;
  }

  //-- WARNINGS
  
  //-- duplicate_vertices
  try {
    validator.duplicate_vertices();
    document.getElementById('war_duplicate_vertices').className = "table-success";
  } catch(e) {
    document.getElementById('war_duplicate_vertices').className = "table-warning";
    document.getElementById('war_duplicate_vertices').children[1].innerHTML = e;
    hasWarnings = true;
  }

  //-- extra_root_properties
  try {
    validator.extra_root_properties();
    document.getElementById('war_extra_root_properties').className = "table-success";
  } 
  catch(e) {
    document.getElementById('war_extra_root_properties').className = "table-warning";
    document.getElementById('war_extra_root_properties').children[1].innerHTML = e;
    hasWarnings = true;
  }    

  //-- unused_vertices
  try {
    validator.unused_vertices();
    document.getElementById('war_unused_vertices').className = "table-success";
  } 
  catch(e) {
    document.getElementById('war_unused_vertices').className = "table-warning";
    document.getElementById('war_unused_vertices').children[1].innerHTML = e;
    hasWarnings = true;
  }  
  console.log("validations done.")
  display_final_result(isValid, hasWarnings);
}

main();