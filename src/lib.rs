use cjval;
use indexmap::IndexMap;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Validator {
    v: cjval::CJValidator,
    valsumm: IndexMap<String, cjval::ValSummary>,
}

#[wasm_bindgen(catch)]
impl Validator {
    pub fn from_str(s: &str) -> Validator {
        let re = cjval::CJValidator::from_str(&s);
        let vs: IndexMap<String, cjval::ValSummary> = IndexMap::new();
        Validator { v: re, valsumm: vs }
    }

    pub fn get_input_cityjson_version(&self) -> i32 {
        self.v.get_input_cityjson_version()
    }

    pub fn get_cityjson_schema_version(&self) -> JsValue {
        let re = self.v.get_cityjson_schema_version();
        return JsValue::from_str(&re.to_string());
    }

    pub fn is_cityjsonfeature(&self) -> JsValue {
        return JsValue::from_bool(self.v.is_cityjsonfeature());
    }

    pub fn get_extensions_urls(&self) -> JsValue {
        let re = self.v.get_extensions_urls();
        if re.is_none() {
            return JsValue::NULL;
        } else {
            let s = re.unwrap().join("\n");
            return JsValue::from_str(&s.to_string());
        }
    }

    pub fn validate(&mut self) {
        self.valsumm = self.v.validate();
    }

    pub fn number_extensions(&self) -> usize {
        let re = self.v.get_extensions_urls();
        match re {
            Some(s) => return s.len(),
            None => return 0,
        }
        // return re.len();
    }

    pub fn add_one_extension_from_str(
        &mut self,
        _ext_schema_name: &str,
        ext_schema_str: &str,
    ) -> JsValue {
        let re = self.v.add_one_extension_from_str(&ext_schema_str);
        match re {
            Ok(()) => return JsValue::NULL,
            Err(e) => {
                let s = format!("{}", e);
                return JsValue::from_str(&s);
            }
        }
    }

    //-- ERRORS
    pub fn json_syntax(&self) -> Result<(), JsValue> {
        let summ = &self.valsumm["json_syntax"];
        if summ.has_errors() == false {
            return Ok(());
        }
        let s = format!("{}", summ);
        return Err(JsValue::from_str(&s.to_string()));
    }

    pub fn schema(&self) -> Result<(), JsValue> {
        let summ = &self.valsumm["schema"];
        if summ.has_errors() == false {
            return Ok(());
        }
        let s = format!("{}", summ);
        return Err(JsValue::from_str(&s.to_string()));
    }

    pub fn extensions(&self) -> Result<(), JsValue> {
        let summ = &self.valsumm["extensions"];
        if summ.has_errors() == false {
            return Ok(());
        }
        let s = format!("{}", summ);
        return Err(JsValue::from_str(&s.to_string()));
    }

    pub fn parents_children_consistency(&self) -> Result<(), JsValue> {
        let summ = &self.valsumm["parents_children_consistency"];
        if summ.has_errors() == false {
            return Ok(());
        }
        let s = format!("{}", summ);
        return Err(JsValue::from_str(&s.to_string()));
    }

    pub fn wrong_vertex_index(&self) -> Result<(), JsValue> {
        let summ = &self.valsumm["wrong_vertex_index"];
        if summ.has_errors() == false {
            return Ok(());
        }
        let s = format!("{}", summ);
        return Err(JsValue::from_str(&s.to_string()));
    }

    pub fn semantics_arrays(&self) -> Result<(), JsValue> {
        let summ = &self.valsumm["semantics_arrays"];
        if summ.has_errors() == false {
            return Ok(());
        }
        let s = format!("{}", summ);
        return Err(JsValue::from_str(&s.to_string()));
    }

    pub fn materials(&self) -> Result<(), JsValue> {
        let summ = &self.valsumm["materials"];
        if summ.has_errors() == false {
            return Ok(());
        }
        let s = format!("{}", summ);
        return Err(JsValue::from_str(&s.to_string()));
    }

    pub fn textures(&self) -> Result<(), JsValue> {
        let summ = &self.valsumm["textures"];
        if summ.has_errors() == false {
            return Ok(());
        }
        let s = format!("{}", summ);
        return Err(JsValue::from_str(&s.to_string()));
    }

    //-- WARNINGS
    pub fn duplicate_vertices(&self) -> Result<(), JsValue> {
        let summ = &self.valsumm["duplicate_vertices"];
        if summ.has_errors() == false {
            return Ok(());
        }
        let s = format!("{}", summ);
        return Err(JsValue::from_str(&s.to_string()));
    }

    pub fn extra_root_properties(&self) -> Result<(), JsValue> {
        let summ = &self.valsumm["extra_root_properties"];
        if summ.has_errors() == false {
            return Ok(());
        }
        let s = format!("{}", summ);
        return Err(JsValue::from_str(&s.to_string()));
    }

    pub fn unused_vertices(&self) -> Result<(), JsValue> {
        let summ = &self.valsumm["unused_vertices"];
        if summ.has_errors() == false {
            return Ok(());
        }
        let s = format!("{}", summ);
        return Err(JsValue::from_str(&s.to_string()));
    }
}
