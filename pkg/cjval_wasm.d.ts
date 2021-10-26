/* tslint:disable */
/* eslint-disable */
/**
*/
export class Validator {
  free(): void;
/**
* @param {string} s
* @returns {Validator}
*/
  static from_str(s: string): Validator;
/**
* @returns {number}
*/
  get_input_cityjson_version(): number;
/**
* @returns {any}
*/
  has_extensions(): any;
/**
* @returns {number}
*/
  get_extensions(): number;
/**
* @param {string} ext_schema_name
* @param {string} ext_schema_str
* @returns {any}
*/
  add_one_extension_from_str(ext_schema_name: string, ext_schema_str: string): any;
/**
* @returns {any}
*/
  validate_schema(): any;
/**
* @returns {any}
*/
  validate_extensions(): any;
/**
* @returns {any}
*/
  parent_children_consistency(): any;
/**
* @returns {any}
*/
  wrong_vertex_index(): any;
/**
* @returns {any}
*/
  semantics_arrays(): any;
/**
* @returns {any}
*/
  duplicate_vertices(): any;
/**
* @returns {any}
*/
  extra_root_properties(): any;
/**
* @returns {any}
*/
  unused_vertices(): any;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_validator_free: (a: number) => void;
  readonly validator_from_str: (a: number, b: number) => number;
  readonly validator_get_input_cityjson_version: (a: number) => number;
  readonly validator_has_extensions: (a: number) => number;
  readonly validator_get_extensions: (a: number) => number;
  readonly validator_add_one_extension_from_str: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly validator_validate_schema: (a: number) => number;
  readonly validator_validate_extensions: (a: number) => number;
  readonly validator_parent_children_consistency: (a: number) => number;
  readonly validator_wrong_vertex_index: (a: number) => number;
  readonly validator_semantics_arrays: (a: number) => number;
  readonly validator_duplicate_vertices: (a: number) => number;
  readonly validator_extra_root_properties: (a: number) => number;
  readonly validator_unused_vertices: (a: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
