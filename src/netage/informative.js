// Module w3c/informative
// Mark specific sections as informative, based on CSS
import hyperHTML from "hyperhtml";
export const name = "netage/informative";

export function run() {
  Array.from(document.querySelectorAll("section.informative"))
    .map(informative => informative.querySelector("h2, h3, h4, h5, h6"))
    .filter(heading => heading)
    .forEach(heading => {
      heading.after(hyperHTML`<p><em>This section is non-normative.</em></p>`);
    });
}
