/* tslint:disable */
/* eslint-disable */
/**
*/
export class Validator {
  free(): void;
/**
*/
  extensions(): void;
/**
* @returns {number}
*/
  get_status(): number;
/**
*/
  json_syntax(): void;
/**
*/
  unused_vertices(): void;
/**
*/
  semantics_arrays(): void;
/**
* @returns {any}
*/
  get_errors_string(): any;
/**
* @returns {number}
*/
  number_extensions(): number;
/**
*/
  duplicate_vertices(): void;
/**
* @param {string} s
*/
  from_str_cjfeature(s: string): void;
/**
* @returns {any}
*/
  is_cityjsonfeature(): any;
/**
*/
  wrong_vertex_index(): void;
/**
* @returns {any}
*/
  get_extensions_urls(): any;
/**
*/
  extra_root_properties(): void;
/**
* @param {string} _ext_schema_name
* @param {string} ext_schema_str
* @returns {any}
*/
  add_one_extension_from_str(_ext_schema_name: string, ext_schema_str: string): any;
/**
* @returns {number}
*/
  get_input_cityjson_version(): number;
/**
* @returns {any}
*/
  get_cityjson_schema_version(): any;
/**
*/
  parents_children_consistency(): void;
/**
*/
  schema(): void;
/**
* @param {string} s
* @returns {Validator}
*/
  static from_str(s: string): Validator;
/**
*/
  textures(): void;
/**
*/
  validate(): void;
/**
*/
  materials(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_validator_free: (a: number) => void;
  readonly validator_add_one_extension_from_str: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly validator_duplicate_vertices: (a: number, b: number) => void;
  readonly validator_extensions: (a: number, b: number) => void;
  readonly validator_extra_root_properties: (a: number, b: number) => void;
  readonly validator_from_str: (a: number, b: number) => number;
  readonly validator_from_str_cjfeature: (a: number, b: number, c: number, d: number) => void;
  readonly validator_get_cityjson_schema_version: (a: number) => number;
  readonly validator_get_errors_string: (a: number) => number;
  readonly validator_get_extensions_urls: (a: number) => number;
  readonly validator_get_input_cityjson_version: (a: number) => number;
  readonly validator_get_status: (a: number) => number;
  readonly validator_is_cityjsonfeature: (a: number) => number;
  readonly validator_json_syntax: (a: number, b: number) => void;
  readonly validator_materials: (a: number, b: number) => void;
  readonly validator_number_extensions: (a: number) => number;
  readonly validator_parents_children_consistency: (a: number, b: number) => void;
  readonly validator_schema: (a: number, b: number) => void;
  readonly validator_semantics_arrays: (a: number, b: number) => void;
  readonly validator_textures: (a: number, b: number) => void;
  readonly validator_unused_vertices: (a: number, b: number) => void;
  readonly validator_validate: (a: number) => void;
  readonly validator_wrong_vertex_index: (a: number, b: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
