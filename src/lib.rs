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

    pub fn validate_schema(&self) -> JsValue {
        let re = self.v.validate_schema();
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

    pub fn duplicate_vertices(&self) -> JsValue {
        let re = self.v.duplicate_vertices();
        if re.is_empty() {
            return JsValue::NULL;
        } else {
            let s = re.join("\n");
            return JsValue::from_str(&s.to_string());
        }
    }
}
