// Extract curated Lucide icons from ZCode's own renderer chunks and emit a
// compact ICONS object literal for the Prism renderer shim.
//
// Usage:
//   node tools/extract-icons.js <extracted-app>/out/renderer/assets [out-file]
// The output ICONS constant replaces the one at the top of
// prism/renderer/prism.js (curate the WANT list to taste).
"use strict";
const fs = require("fs");
const path = require("path");

const ASSETS = process.argv[2];
const OUT = process.argv[3] || path.join(process.cwd(), "icons.generated.js");
if (!ASSETS) {
  console.error("usage: node tools/extract-icons.js <assets-dir> [out-file]");
  process.exit(1);
}

const WANT = [
  "code-xml", "terminal", "database", "globe", "git-branch", "palette",
  "music-2", "video", "image", "book-open", "pen-tool", "flask-conical",
  "message-square", "rocket", "sparkles", "wrench", "bug", "target", "tag",
  "house", "hard-drive", "package", "files", "calendar-days", "chart-line",
  "users", "cpu", "lightbulb", "workflow", "briefcase-business",
];

function parseShapes(src) {
  const out = [];
  const re = /\[`([a-z]+)`,\{([^[\]]*)\}\]/g;
  let m;
  while ((m = re.exec(src))) {
    const tag = m[1];
    const attrs = {};
    const are = /([a-zA-Z]+):`([^`]*)`/g;
    let a;
    while ((a = are.exec(m[2]))) attrs[a[1]] = a[2];
    out.push({ tag, attrs });
  }
  return out;
}

function toSvgInner(shapes) {
  return shapes
    .map((s) => {
      const attrs = Object.entries(s.attrs)
        .filter(([k]) => k !== "key")
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ");
      return `<${s.tag} ${attrs}/>`;
    })
    .join("");
}

const icons = {};
const missing = [];
for (const name of WANT) {
  const files = fs.readdirSync(ASSETS).filter((f) => f.startsWith(name + "-") && f.endsWith(".js"));
  let done = false;
  for (const f of files) {
    const src = fs.readFileSync(path.join(ASSETS, f), "utf8");
    const def = src.match(/,n=e\(`([a-z0-9-]+)`,/);
    if (!def || def[1] !== name) continue; // chunk is a variant, not this icon
    const shapes = parseShapes(src);
    if (!shapes.length) continue;
    icons[name] = toSvgInner(shapes);
    done = true;
    break;
  }
  if (!done) missing.push(name);
}
console.log("extracted:", Object.keys(icons).length, "missing:", missing);
const literal =
  "const ICONS = {\n" +
  Object.entries(icons)
    .map(([k, v]) => `  "${k}": "${v.replace(/"/g, "&quot;")}"`)
    .join(",\n") +
  "\n};";
fs.writeFileSync(OUT, literal + "\n");
console.log("written:", OUT, literal.length, "bytes");
