// @ts-check
/* jshint strict: true, browser:true, jquery: true */
// Module w3c/style
// Inserts a link to the appropriate W3C style for the specification's maturity level.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)

import { createResourceHint, linkCSS, toKeyValuePairs } from "../core/utils.js";
import { pub, sub } from "../core/pubsubhub.js";
export const name = "w3c/style";
function attachFixupScript(doc, version) {
  const script = doc.createElement("script");
  if (location.hash) {
    script.addEventListener(
      "load",
      () => {
        window.location.href = location.hash;
      },
      { once: true }
    );
  }
  script.src = `https://www.w3.org/scripts/TR/${version}/fixup.js`;
  doc.body.appendChild(script);
}

/**
 * Make a best effort to attach meta viewport at the top of the head.
 * Other plugins might subsequently push it down, but at least we start
 * at the right place. When ReSpec exports the HTML, it again moves the
 * meta viewport to the top of the head - so to make sure it's the first
 * thing the browser sees. See js/ui/save-html.js.
 */
function createMetaViewport() {
  const meta = document.createElement("meta");
  meta.name = "viewport";
  const contentProps = {
    width: "device-width",
    "initial-scale": "1",
    "shrink-to-fit": "no",
  };
  meta.content = toKeyValuePairs(contentProps).replace(/"/g, "");
  return meta;
}

function createBaseStyle() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://www.w3.org/StyleSheets/TR/2016/base.css";
  link.classList.add("removeOnSave");
  return link;
}

function selectStyleVersion(styleVersion) {
  let version = "";
  switch (styleVersion) {
    case null:
    case true:
      version = "2016";
      break;
    default:
      if (styleVersion && !isNaN(styleVersion)) {
        version = styleVersion.toString().trim();
      }
  }
  return version;
}

function createResourceHints() {
  const resourceHints = [
    {
      hint: "preconnect", // for W3C styles and scripts.
      href: "https://www.netage.nl",
    },
    {
      hint: "preload", // all specs need it, and we attach it on end-all.
      href: "https://www.w3.org/scripts/TR/2016/fixup.js",
      as: "script",
    },
    {
      hint: "preload", // all specs include on base.css.
      href: "https://www.w3.org/StyleSheets/TR/2016/base.css",
      as: "style",
    },
    {
      hint: "preload", // all specs show the logo.
      href: "https://cloudbox.netage.nl/f/53b55b7650994d1f8528/?dl=1",
      as: "image",
    },
  ]
    .map(createResourceHint)
    .reduce((frag, link) => {
      frag.appendChild(link);
      return frag;
    }, document.createDocumentFragment());
  return resourceHints;
}
// Collect elements for insertion (document fragment)
const elements = createResourceHints();

// Opportunistically apply base style
elements.appendChild(createBaseStyle());
if (!document.head.querySelector("meta[name=viewport]")) {
  // Make meta viewport the first element in the head.
  elements.prepend(createMetaViewport());
}

document.head.prepend(elements);

function styleMover(linkURL) {
  return exportDoc => {
    const w3cStyle = exportDoc.querySelector(`head link[href="${linkURL}"]`);
    exportDoc.querySelector("head").append(w3cStyle);
  };
}

export function run(conf) {
  if (!conf.specStatus) {
    const warn = "`respecConfig.specStatus` missing. Defaulting to 'NETAGE-BASIC'.";
    conf.specStatus = "NETAGE-BASIC";
    pub("warn", warn);
  }

  let styleFile = "";

  // Figure out which style file to use.
  switch (conf.specStatus.toUpperCase()) {
    case "NETAGE-CV":
      styleFile += "https://netage.github.io/respec_resources/styles/NETAGE-CV.css";
      break;
    case "NETAGE-LD":
      styleFile += "https://netage.github.io/respec_resources/styles/NETAGE-LD.css";
      break;
    case "NETAGE-FINAL":
      styleFile += "https://netage.github.io/respec_resources/styles/NETAGE-FINAL.css";
      break;
    case "NETAGE-BASIC":
      styleFile += "https://netage.github.io/respec_resources/styles/NETAGE-BASIC.css";
      break;
    default:
      styleFile = "https://netage.github.io/respec_resources/styles/NETAGE-BASIC.css";
  }
  console.log(styleFile);
  if (!conf.noToc) {
    sub(
      "end-all",
      () => {
        attachFixupScript(document, "2016");
      },
      { once: true }
    );
  }
  //const finalStyleURL = `../netage_resources/styles/${styleFile}`;
  linkCSS(document, styleFile);
}
