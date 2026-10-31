// Gerado por scripts/centros.mjs — não editar à mão.
// Caixa de cada modelo em metros, no espaço do conjunto (escala 1).
export type Caixa = { min: [number, number, number]; max: [number, number, number] };

export const CAIXAS: Record<string, Caixa> = {
  apendice: { min: [-0.0877,0.1366,-0.0258], max: [-0.0181,0.1547,0.0132] },
  atrio_direito: { min: [-0.0361,0.442,-0.0172], max: [0.0089,0.5418,0.0572] },
  atrio_esquerdo: { min: [-0.0231,0.4592,-0.0411], max: [0.0663,0.5344,0.0452] },
  bexiga: { min: [-0.0368,0.0253,-0.0514], max: [0.0391,0.0782,0.0325] },
  colon_ascendente: { min: [-0.1146,0.1164,-0.0237], max: [-0.0608,0.3125,0.0345] },
  colon_descendente: { min: [-0.018,0.0645,-0.0701], max: [0.1183,0.3328,0.0279] },
  colon_sigmoide: { min: [-0.0255,0,-0.0812], max: [0.0361,0.1226,-0.0318] },
  colon_transverso: { min: [-0.0879,0.2622,-0.0036], max: [0.1016,0.3345,0.0735] },
  duodeno: { min: [-0.0649,0.2411,-0.0037], max: [0.0331,0.3395,0.048] },
  estomago: { min: [-0.028,0.3142,-0.0279], max: [0.1063,0.4313,0.0849] },
  jejuno_ileo: { min: [-0.0819,0.0773,0.0095], max: [0.1011,0.286,0.0716] },
  lobo_caudado: { min: [-0.0331,0.3682,-0.0049], max: [0.012,0.4429,0.0309] },
  lobo_direito: { min: [-0.1143,0.3023,-0.0661], max: [-0.0168,0.4575,0.0893] },
  lobo_esquerdo: { min: [-0.0455,0.3352,-0.0179], max: [0.0951,0.4537,0.0929] },
  lobo_inferior_direito: { min: [-0.1309,0.3659,-0.0933], max: [-0.0008,0.5495,0.0853] },
  lobo_inferior_esquerdo: { min: [0.0178,0.3623,-0.0925], max: [0.1309,0.5597,0.0922] },
  lobo_medio_direito: { min: [-0.1238,0.4093,-0.0575], max: [-0.0045,0.5158,0.0933] },
  lobo_superior_direito: { min: [-0.1184,0.4876,-0.0823], max: [-0.006,0.627,0.0764] },
  lobo_superior_esquerdo: { min: [0.0079,0.4151,-0.0806], max: [0.1245,0.6284,0.0928] },
  rim_direito: { min: [-0.0868,0.2378,-0.0429], max: [-0.0297,0.3423,0.0043] },
  rim_esquerdo: { min: [0.0336,0.2555,-0.048], max: [0.0911,0.3615,-0.0074] },
  ventriculo_direito: { min: [-0.021,0.4351,0.0047], max: [0.0621,0.5279,0.0718] },
  ventriculo_esquerdo: { min: [0.0031,0.4329,-0.0251], max: [0.0831,0.523,0.0625] },
};
