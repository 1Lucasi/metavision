// Configuração do Metro: igual à padrão do Expo, mas aceitando modelos .glb
// como asset (para o require() dos órgãos em src/ar/modelos.ts).
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push("glb");

module.exports = config;
