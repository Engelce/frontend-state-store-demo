import "core-js/stable";
import "regenerator-runtime/runtime";

export * as immer from "immer";
export { bootstrap } from "./platform/bootstrap";
export { Module } from "./platform/Module";
export type { ModuleLocation, ModuleLifecycleListener } from "./platform/Module.tsx";
export { ajax, uri, setAjaxRequestInterceptor, setAjaxResponseInterceptor } from "./util/network";

export { register } from "./module";

export { produce } from "immer";
