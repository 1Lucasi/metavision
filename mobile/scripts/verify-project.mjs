import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const required = [
  "package.json",
  "app.json",
  "App.tsx",
  "index.ts",
  "src/ar/SpatialScene.tsx",
  "README.md",
  "TESTE_DE_ACEITACAO.md",
];

let ok = true;
for (const relative of required) {
  const full = path.join(root, relative);
  if (!fs.existsSync(full)) {
    console.error(`[ERRO] Arquivo ausente: ${relative}`);
    ok = false;
  } else {
    console.log(`[OK] ${relative}`);
  }
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const app = JSON.parse(fs.readFileSync(path.join(root, "app.json"), "utf8"));

const expected = {
  expo: "57.0.23",
  react: "19.2.3",
  "react-native": "0.86.3",
  "@reactvision/react-viro": "2.57.3",
};
for (const [name, version] of Object.entries(expected)) {
  if (pkg.dependencies?.[name] !== version) {
    console.error(`[ERRO] ${name}: esperado ${version}, encontrado ${pkg.dependencies?.[name]}`);
    ok = false;
  } else {
    console.log(`[OK] ${name}@${version}`);
  }
}

const source = fs.readFileSync(path.join(root, "src/ar/SpatialScene.tsx"), "utf8");
const checks = [
  ["ViroARPlaneSelector", "seletor de planos"],
  ['anchorDetectionTypes={["PlanesHorizontal"]}', "deteccao horizontal"],
  ["handleAnchorFound", "encaminhamento de anchor found"],
  ["handleAnchorUpdated", "encaminhamento de anchor updated"],
  ["handleAnchorRemoved", "encaminhamento de anchor removed"],
  ['dragType="FixedToWorld"', "arraste no mundo real"],
  ["onPinch", "gesto pinch"],
  ["onRotate", "gesto de rotacao"],
];
for (const [needle, description] of checks) {
  if (!source.includes(needle)) {
    console.error(`[ERRO] Nao encontrado: ${description}`);
    ok = false;
  } else {
    console.log(`[OK] ${description}`);
  }
}

const plugin = app.expo?.plugins?.find?.((entry) => Array.isArray(entry) && entry[0] === "@reactvision/react-viro");
if (!plugin || plugin[1]?.android?.xRMode !== "AR") {
  console.error("[ERRO] Plugin ViroReact nao esta configurado em modo AR.");
  ok = false;
} else {
  console.log("[OK] Plugin ViroReact configurado em modo AR.");
}

if (!ok) process.exit(1);
console.log("\nEstrutura e configuracao do WL02 React Native: OK.");
