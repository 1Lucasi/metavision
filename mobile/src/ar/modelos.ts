// Mapa id do órgão -> modelo .glb (gerados por scripts/split.mjs na raiz).
// O Metro só embute assets de require() com caminho literal, por isso uma
// linha por arquivo, na mesma ordem de ORGANS em src/data/organs.ts.
export const MODELOS: Record<string, any> = {
  lobo_superior_direito: require("../../assets/modelos/lobo_superior_direito.glb"),
  lobo_medio_direito: require("../../assets/modelos/lobo_medio_direito.glb"),
  lobo_inferior_direito: require("../../assets/modelos/lobo_inferior_direito.glb"),
  lobo_superior_esquerdo: require("../../assets/modelos/lobo_superior_esquerdo.glb"),
  lobo_inferior_esquerdo: require("../../assets/modelos/lobo_inferior_esquerdo.glb"),
  atrio_direito: require("../../assets/modelos/atrio_direito.glb"),
  atrio_esquerdo: require("../../assets/modelos/atrio_esquerdo.glb"),
  ventriculo_direito: require("../../assets/modelos/ventriculo_direito.glb"),
  ventriculo_esquerdo: require("../../assets/modelos/ventriculo_esquerdo.glb"),
  lobo_direito: require("../../assets/modelos/lobo_direito.glb"),
  lobo_esquerdo: require("../../assets/modelos/lobo_esquerdo.glb"),
  lobo_caudado: require("../../assets/modelos/lobo_caudado.glb"),
  estomago: require("../../assets/modelos/estomago.glb"),
  duodeno: require("../../assets/modelos/duodeno.glb"),
  jejuno_ileo: require("../../assets/modelos/jejuno_ileo.glb"),
  colon_ascendente: require("../../assets/modelos/colon_ascendente.glb"),
  colon_transverso: require("../../assets/modelos/colon_transverso.glb"),
  colon_descendente: require("../../assets/modelos/colon_descendente.glb"),
  colon_sigmoide: require("../../assets/modelos/colon_sigmoide.glb"),
  apendice: require("../../assets/modelos/apendice.glb"),
  rim_direito: require("../../assets/modelos/rim_direito.glb"),
  rim_esquerdo: require("../../assets/modelos/rim_esquerdo.glb"),
  bexiga: require("../../assets/modelos/bexiga.glb"),
};
