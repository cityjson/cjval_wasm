use cjval;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Validator {
    v: cjval::CJValidator,
}

#[wasm_bindgen(catch)]
impl Validator {
    pub fn from_str(s: &str) -> Result<Validator, JsValue> {
        let re = cjval::CJValidator::from_str(&s);
        match re {
            Ok(x) => return Ok(Validator { v: x }),
            Err(err) => return Err(JsValue::from_str(&err)),
        }
    }

    pub fn get_input_cityjson_version(&self) -> i32 {
        self.v.get_input_cityjson_version()
    }

    pub fn get_cityjson_schema_version(&self) -> JsValue {
        let re = self.v.get_cityjson_schema_version();
        return JsValue::from_str(&re.to_string());
    }

    pub fn has_extensions(&self) -> JsValue {
        let re = self.v.has_extensions();
        if re.is_none() {
            return JsValue::NULL;
        } else {
            let s = re.unwrap().join("\n");
            return JsValue::from_str(&s.to_string());
        }
    }

    pub fn get_extensions(&self) -> usize {
        let re = self.v.get_extensions();
        return re.len();
    }

    pub fn add_one_extension_from_str(
        &mut self,
        ext_schema_name: &str,
        ext_schema_str: &str,
    ) -> JsValue {
        let re = self
            .v
            .add_one_extension_from_str(&ext_schema_name, &ext_schema_str);
        match re {
            Ok(()) => return JsValue::NULL,
            Err(e) => {
                let s = format!("{}", e);
                return JsValue::from_str(&s);
            }
        }
    }

    //-- ERRORS
    pub fn validate_schema(&self) -> JsValue {
        let re = self.v.validate_schema();
        if re.is_empty() {
            return JsValue::NULL;
        } else {
            let s = re.join("\n");
            return JsValue::from_str(&s.to_string());
        }
    }

    pub fn validate_extensions(&self) -> JsValue {
        let re = self.v.validate_extensions();
        if re.is_empty() {
            return JsValue::NULL;
        } else {
            let s = re.join("\n");
            return JsValue::from_str(&s.to_string());
        }
    }

    pub fn parent_children_consistency(&self) -> JsValue {
        let re = self.v.parent_children_consistency();
        if re.is_empty() {
            return JsValue::NULL;
        } else {
            let s = re.join("\n");
            return JsValue::from_str(&s.to_string());
        }
    }

    pub fn wrong_vertex_index(&self) -> JsValue {
        let re = self.v.wrong_vertex_index();
        if re.is_empty() {
            return JsValue::NULL;
        } else {
            let s = re.join("\n");
            return JsValue::from_str(&s.to_string());
        }
    }

    pub fn semantics_arrays(&self) -> JsValue {
        let re = self.v.semantics_arrays();
        if re.is_empty() {
            return JsValue::NULL;
        } else {
            let s = re.join("\n");
            return JsValue::from_str(&s.to_string());
        }
    }

    //-- WARNINGS
    pub fn duplicate_vertices(&self) -> JsValue {
        let re = self.v.duplicate_vertices();
        if re.is_empty() {
            return JsValue::NULL;
        } else {
            let s = re.join("\n");
            return JsValue::from_str(&s.to_string());
        }
    }

    pub fn extra_root_properties(&self) -> JsValue {
        let re = self.v.extra_root_properties();
        if re.is_empty() {
            return JsValue::NULL;
        } else {
            let s = re.join("\n");
            return JsValue::from_str(&s.to_string());
        }
    }

    pub fn unused_vertices(&self) -> JsValue {
        let re = self.v.unused_vertices();
        if re.is_empty() {
            return JsValue::NULL;
        } else {
            let s = re.join("\n");
            return JsValue::from_str(&s.to_string());
        }
    }
}
