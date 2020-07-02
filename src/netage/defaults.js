/**
 * Sets the defaults for W3C specs
 */
export const name = "netage/defaults";
import { coreDefaults } from "../core/defaults";
import { definitionMap } from "../core/dfn-map";
import linter from "../core/linter";
import { rule as privsecSectionRule } from "./linter-rules/privsec-section";

linter.register(privsecSectionRule);

const netageDefaults = {
  lint: {
    "privsec-section": true,
  },
  pluralize: true,
  doJsonLd: false,
  license: "w3c-software-doc",
  logos: [
    {
      src: "https://docs.netage.nl/respec_resources/logo.png",
      alt: "Netage",
      height: 160,
      width: 258,
      url: "https://www.netage.nl/",
    },
  ],
  xref: true,
  prependW3C: false
};

export function run(conf) {
  if (conf.specStatus === "unofficial") return;
  // assign the defaults
  const lint =
    conf.lint === false
      ? false
      : {
          ...coreDefaults.lint,
          ...netageDefaults.lint,
          ...conf.lint,
        };
  Object.assign(conf, {
    ...coreDefaults,
    ...netageDefaults,
    ...conf,
    lint,
  });

  // TODO: eventually, we want to remove this.
  // It's here for legacy support of json-ld specs
  // see https://github.com/w3c/respec/issues/2019
  Object.assign(conf, { definitionMap });
}
