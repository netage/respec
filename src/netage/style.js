/* jshint strict: true, browser:true, jquery: true */
// Module w3c/style
// Inserts a link to the appropriate W3C style for the specification's maturity level.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)

import { createResourceHint, linkCSS, toKeyValuePairs } from "../core/utils";
import { pub, sub } from "../core/pubsubhub";
export const name = "netage/style";

// Make a best effort to attach meta viewport at the top of the head.
// Other plugins might subsequently push it down, but at least we start
// at the right place. When ReSpec exports the HTML, it again moves the
// meta viewport to the top of the head - so to make sure it's the first
// thing the browser sees. See js/ui/save-html.js.
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
  link.href = "https://docs.netage.nl/respec_resources/styles/base.css";
  link.classList.add("removeOnSave");
  return link;
}

function createResourceHints() {
  const resourceHints = [
    {
      hint: "preload", // all specs need it, and we attach it on end-all.
      href: "https://www.w3.org/scripts/TR/2016/fixup.js",
      as: "script",
    },
    {
      hint: "preload", // all specs include on base.css.
      href: "https://docs.netage.nl/respec_resources/styles/base.css",
      as: "style",
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

export function run(conf) {
  if (!conf.specStatus) {
    const warn = "`respecConfig.specStatus` missing. Defaulting to 'base'.";
    conf.specStatus = "base";
    pub("warn", warn);
  }

  let styleFile = "";

  // Figure out which style file to use.
  switch (conf.specStatus.toUpperCase()) {
    case "NETAGE-CV":
      styleFile += "https://docs.netage.nl/respec_resources/styles/NETAGE-CV.css";
      break;
    case "NETAGE-LD":
      styleFile += "https://docs.netage.nl/respec_resources/styles/NETAGE-LD.css";
      break;
    case "NETAGE-FINAL":
      styleFile += "https://docs.netage.nl/respec_resources/styles/NETAGE-FINAL.css";
      break;
    case "NETAGE-BASIC":
      styleFile += "https://docs.netage.nl/respec_resources/styles/NETAGE-BASIC.css";
      break;
    default:
      styleFile = "https://docs.netage.nl/respec_resources/styles/NETAGE-BASIC.css";
  }
  
  
  linkCSS(document, styleFile);
  // Make sure the W3C stylesheet is the last stylesheet, as required by W3C Pub Rules.
  
  sub("beforesave", moveStyle);
}
