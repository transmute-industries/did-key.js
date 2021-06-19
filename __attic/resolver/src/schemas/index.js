const path = require("path");
const fs = require("fs");

const loadSchema = ({ vendor, name, format, version }) => {
  return JSON.parse(
    fs
      .readFileSync(
        path.resolve(__dirname, vendor, name, format, version + ".jsonld")
      )
      .toString()
  );
};

// TODO: parse from path
module.exports = {
  self: loadSchema({
    vendor: "com.transmute.self-desc",
    name: "schema",
    format: "jsonschema",
    version: "1-0-0"
  }),
  didDocument: loadSchema({
    vendor: "com.transmute.did",
    name: "didDocument",
    format: "jsonschema",
    version: "1-0-0"
  })
};
