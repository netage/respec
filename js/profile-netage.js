"use strict";
// In case everything else fails, we want the error
window.addEventListener("error", ev => {
  console.error(ev.error, ev.message, ev);
});

// this is only set in a build, not at all in the dev environment
require.config({
  paths: {
    clipboard: "deps/clipboard",
    hyperhtml: "deps/hyperhtml",
    idb: "deps/idb",
    jquery: "deps/jquery",
    marked: "deps/marked",
    pluralize: "deps/pluralize",
    text: "deps/text",
    webidl2: "deps/webidl2",
  },
  shim: {
    shortcut: {
      exports: "shortcut",
    },
    highlight: {
      exports: "hljs",
    },
  },
});

define([
  // order is significant
  "./core/base-runner",
  "./core/ui",
  "./core/reindent",
  "./core/location-hash",
  "./core/l10n",
  "./netage/defaults",
  "./core/style",
  "./netage/style",
  "./netage/l10n",
  "./core/github",
  "./core/data-include",
  "./core/markdown",
  "./netage/headers",
  "./netage/abstract",
  "./core/data-transform",
  "./core/inlines",
  "./netage/conformance",
  "./core/dfn",
  "./core/pluralize",
  "./core/examples",
  "./core/issues-notes",
  "./core/requirements",
  "./core/best-practices",
  "./core/figures",
  "./core/webidl",
  "./core/data-cite",
  "./core/biblio",
  "./core/webidl-index",
  "./core/link-to-dfn",
  "./core/render-biblio",
  "./core/contrib",
  "./core/fix-headers",
  "./core/structure",
  "./netage/informative",
  "./core/id-headers",
  "./core/caniuse",
  "./ui/save-html",
  "./ui/search-specref",
  "./ui/dfn-list",
  "./ui/about-respec",
  "./core/seo",
  "./netage/seo",
  "./core/highlight",
  "./core/webidl-clipboard",
  "./core/data-tests",
  "./core/list-sorter",
  "./core/highlight-vars",
  "./core/algorithms",
  /* Linter must be the last thing to run */
  "./core/linter",
], (runner, { ui }, ...plugins) => {
  ui.show();
  domReady().then(async () => {
    try {
      await runner.runAll(plugins);
      await document.respecIsReady;
    } catch (err) {
      console.error(err);
    } finally {
      ui.enable();
    }
  });
});

async function domReady() {
  if (document.readyState === "loading") {
    await new Promise(resolve =>
      document.addEventListener("DOMContentLoaded", resolve)
    );
  }
}
