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
  get_cityjson_schema_version(): any;
/**
* @returns {any}
*/
  is_cityjsonfeature(): any;
/**
* @returns {any}
*/
  get_extensions_urls(): any;
/**
*/
  validate(): void;
/**
* @returns {number}
*/
  number_extensions(): number;
/**
* @param {string} _ext_schema_name
* @param {string} ext_schema_str
* @returns {any}
*/
  add_one_extension_from_str(_ext_schema_name: string, ext_schema_str: string): any;
/**
*/
  json_syntax(): void;
/**
*/
  schema(): void;
/**
*/
  extensions(): void;
/**
*/
  parents_children_consistency(): void;
/**
*/
  wrong_vertex_index(): void;
/**
*/
  semantics_arrays(): void;
/**
*/
  materials(): void;
/**
*/
  textures(): void;
/**
*/
  duplicate_vertices(): void;
/**
*/
  extra_root_properties(): void;
/**
*/
  unused_vertices(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_validator_free: (a: number) => void;
  readonly validator_from_str: (a: number, b: number) => number;
  readonly validator_get_input_cityjson_version: (a: number) => number;
  readonly validator_get_cityjson_schema_version: (a: number) => number;
  readonly validator_is_cityjsonfeature: (a: number) => number;
  readonly validator_get_extensions_urls: (a: number) => number;
  readonly validator_validate: (a: number) => void;
  readonly validator_number_extensions: (a: number) => number;
  readonly validator_add_one_extension_from_str: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly validator_json_syntax: (a: number) => void;
  readonly validator_schema: (a: number) => void;
  readonly validator_extensions: (a: number) => void;
  readonly validator_parents_children_consistency: (a: number) => void;
  readonly validator_wrong_vertex_index: (a: number) => void;
  readonly validator_semantics_arrays: (a: number) => void;
  readonly validator_materials: (a: number) => void;
  readonly validator_textures: (a: number) => void;
  readonly validator_duplicate_vertices: (a: number) => void;
  readonly validator_extra_root_properties: (a: number) => void;
  readonly validator_unused_vertices: (a: number) => void;
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
