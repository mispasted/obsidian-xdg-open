var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => XdgOpenLinks
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var import_node_child_process = require("node:child_process");
var xdgOpen = "/usr/bin/xdg-open";
var hasScheme = /^[a-z][a-z0-9+.-]*:/i;
var XdgOpenLinks = class extends import_obsidian.Plugin {
  onload() {
    const originalOpen = window.open;
    const openViaXdg = (url) => {
      const child = (0, import_node_child_process.spawn)(xdgOpen, [url], {
        detached: true,
        stdio: "ignore"
      });
      child.unref();
    };
    const patchedOpen = ((url, target, features) => {
      const href = typeof url === "string" ? url : url == null ? void 0 : url.toString();
      if (href && hasScheme.test(href)) {
        openViaXdg(href);
        return null;
      }
      return originalOpen.call(window, url, target, features);
    });
    window.open = patchedOpen;
    this.register(() => {
      if (window.open === patchedOpen) {
        window.open = originalOpen;
      }
    });
  }
};
