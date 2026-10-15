import { Plugin } from "obsidian";
import { spawn } from "node:child_process";

const xdgOpen = "/usr/bin/xdg-open";
const hasScheme = /^[a-z][a-z0-9+.-]*:/i;

export default class XdgOpenLinks extends Plugin {
  onload() {
    const originalOpen = window.open;

    const openViaXdg = (url: string) => {
      const child = spawn(xdgOpen, [url], {
        detached: true,
        stdio: "ignore",
      });

      child.unref();
    };

    const patchedOpen = ((url?: string | URL, target?: string, features?: string) => {
      const href = typeof url === "string" ? url : url?.toString();

      if (href && hasScheme.test(href)) {
        openViaXdg(href);
        return null;
      }

      return originalOpen.call(window, url, target, features);
    }) as typeof window.open;

    window.open = patchedOpen;

    this.register(() => {
      if (window.open === patchedOpen) {
        window.open = originalOpen;
      }
    });
  }
}