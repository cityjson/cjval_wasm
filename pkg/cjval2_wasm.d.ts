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
* @returns {any}
*/
  validate_schema(): any;
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
  duplicate_vertices(): any;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_validator_free: (a: number) => void;
  readonly validator_from_str: (a: number, b: number) => number;
  readonly validator_validate_schema: (a: number) => number;
  readonly validator_parent_children_consistency: (a: number) => number;
  readonly validator_wrong_vertex_index: (a: number) => number;
  readonly validator_duplicate_vertices: (a: number) => number;
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
