use cjval;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Validator {
    v: cjval::CJValidator,
}

#[wasm_bindgen]
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
}
