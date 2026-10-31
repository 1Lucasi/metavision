// Registro central de camadas e órgãos.
// Nomes EXATOS dos meshes no GLB da Carol (conjunto.glb) — não renomear.
// Interação (Duda/Ogino) usa o mesmo id pra clique + bounding box.

export type LayerId = 'skin' | 'ribcage' | 'organs' | 'vessels'

export interface Layer {
  id: LayerId
  label: string
  visible: boolean // estado inicial da camada
}

export interface Organ {
  id: string // nome do mesh no GLB — igual ao que a Carol exportou
  label: string // nome exibido na UI
  layer: LayerId
  grupo: string // órgão a que pertence, p/ agrupar na UI (coração, pulmão...)
}

// Ordem = ordem de "descascar" na UI (pele primeiro, vasos por último)
export const LAYERS: Layer[] = [
  { id: 'skin', label: 'Pele', visible: true },
  { id: 'ribcage', label: 'Caixa torácica', visible: true },
  { id: 'organs', label: 'Órgãos', visible: true },
  { id: 'vessels', label: 'Vasos', visible: true },
]

// Meshes exatamente como vieram no conjunto.glb (22 peças).
export const ORGANS: Organ[] = [
  // Pulmões
  { id: 'lobo_superior_direito', label: 'Lobo superior direito', layer: 'organs', grupo: 'Pulmão direito' },
  { id: 'lobo_medio_direito', label: 'Lobo médio direito', layer: 'organs', grupo: 'Pulmão direito' },
  { id: 'lobo_inferior_direito', label: 'Lobo inferior direito', layer: 'organs', grupo: 'Pulmão direito' },
  { id: 'lobo_superior_esquerdo', label: 'Lobo superior esquerdo', layer: 'organs', grupo: 'Pulmão esquerdo' },
  { id: 'lobo_inferior_esquerdo', label: 'Lobo inferior esquerdo', layer: 'organs', grupo: 'Pulmão esquerdo' },
  // Coração
  { id: 'atrio_direito', label: 'Átrio direito', layer: 'organs', grupo: 'Coração' },
  { id: 'atrio_esquerdo', label: 'Átrio esquerdo', layer: 'organs', grupo: 'Coração' },
  { id: 'ventriculo_direito', label: 'Ventrículo direito', layer: 'organs', grupo: 'Coração' },
  { id: 'ventriculo_esquerdo', label: 'Ventrículo esquerdo', layer: 'organs', grupo: 'Coração' },
  // Fígado
  { id: 'lobo_direito', label: 'Lobo direito', layer: 'organs', grupo: 'Fígado' },
  { id: 'lobo_esquerdo', label: 'Lobo esquerdo', layer: 'organs', grupo: 'Fígado' },
  { id: 'lobo_caudado', label: 'Lobo caudado', layer: 'organs', grupo: 'Fígado' },
  // Estômago
  { id: 'estomago', label: 'Estômago', layer: 'organs', grupo: 'Estômago' },
  // Intestino delgado
  { id: 'duodeno', label: 'Duodeno', layer: 'organs', grupo: 'Intestino delgado' },
  { id: 'jejuno_ileo', label: 'Jejuno-íleo', layer: 'organs', grupo: 'Intestino delgado' },
  // Intestino grosso
  { id: 'colon_ascendente', label: 'Cólon ascendente', layer: 'organs', grupo: 'Intestino grosso' },
  { id: 'colon_transverso', label: 'Cólon transverso', layer: 'organs', grupo: 'Intestino grosso' },
  { id: 'colon_descendente', label: 'Cólon descendente', layer: 'organs', grupo: 'Intestino grosso' },
  { id: 'colon_sigmoide', label: 'Cólon sigmoide', layer: 'organs', grupo: 'Intestino grosso' },
  { id: 'apendice', label: 'Apêndice', layer: 'organs', grupo: 'Intestino grosso' },
  // Rins
  { id: 'rim_direito', label: 'Rim direito', layer: 'organs', grupo: 'Rins' },
  { id: 'rim_esquerdo', label: 'Rim esquerdo', layer: 'organs', grupo: 'Rins' },
  // Bexiga
  { id: 'bexiga', label: 'Bexiga', layer: 'organs', grupo: 'Bexiga' },
]

// Índice id -> órgão, pra lookup rápido no clique
export const ORGAN_BY_ID: Record<string, Organ> = Object.fromEntries(
  ORGANS.map((o) => [o.id, o]),
)

// Set com todos os ids clicáveis
export const ORGAN_IDS = new Set(ORGANS.map((o) => o.id))

export interface OrganInfo {
  localizacao: string
  funcao: string
  detalheAnatomico: string
}

// Conteúdo informativo associado aos IDs existentes dos meshes.
export const ORGAN_INFO_BY_ID: Partial<Record<string, OrganInfo>> = {
  lobo_superior_direito: {
    localizacao: 'Ocupa a parte superior do pulmão direito e inclui seu ápice.',
    funcao: 'Seus alvéolos realizam trocas de oxigênio e gás carbônico entre o ar e o sangue.',
    detalheAnatomico: 'É separado do lobo médio pela fissura horizontal.',
  },
  lobo_medio_direito: {
    localizacao: 'Fica na região anterior do pulmão direito, entre os lobos superior e inferior.',
    funcao: 'Participa da oxigenação do sangue e da eliminação de gás carbônico.',
    detalheAnatomico: 'Existe apenas no pulmão direito e fica entre as fissuras horizontal e oblíqua.',
  },
  lobo_inferior_direito: {
    localizacao: 'Ocupa principalmente a região posterior e inferior do pulmão direito, junto ao diafragma.',
    funcao: 'Realiza trocas gasosas nos alvéolos, assim como os demais lobos pulmonares.',
    detalheAnatomico: 'É separado dos lobos superior e médio pela fissura oblíqua.',
  },
  lobo_superior_esquerdo: {
    localizacao: 'Ocupa a região superior do pulmão esquerdo e inclui seu ápice.',
    funcao: 'Participa da entrada de oxigênio no sangue e da retirada de gás carbônico.',
    detalheAnatomico: 'Inclui a língula, uma projeção próxima ao coração.',
  },
  lobo_inferior_esquerdo: {
    localizacao: 'Fica principalmente na região posterior e inferior do pulmão esquerdo, junto ao diafragma.',
    funcao: 'Seus alvéolos permitem a troca de gases entre o ar e os capilares sanguíneos.',
    detalheAnatomico: 'É separado do lobo superior pela fissura oblíqua.',
  },
  atrio_direito: {
    localizacao: 'É uma das câmaras superiores do coração, situada à direita.',
    funcao: 'Recebe o sangue pobre em oxigênio que retorna do corpo, principalmente pelas veias cavas.',
    detalheAnatomico: 'Comunica-se com o ventrículo direito pela valva tricúspide.',
  },
  atrio_esquerdo: {
    localizacao: 'Fica na região superior e posterior do coração.',
    funcao: 'Recebe o sangue rico em oxigênio que retorna dos pulmões pelas veias pulmonares.',
    detalheAnatomico: 'Comunica-se com o ventrículo esquerdo pela valva mitral.',
  },
  ventriculo_direito: {
    localizacao: 'É uma das câmaras inferiores e ocupa grande parte da face anterior do coração.',
    funcao: 'Bombeia sangue pobre em oxigênio para os pulmões, através do tronco pulmonar.',
    detalheAnatomico: 'A valva pulmonar controla a saída do sangue dessa câmara.',
  },
  ventriculo_esquerdo: {
    localizacao: 'Fica à esquerda e forma a ponta do coração, chamada ápice.',
    funcao: 'Bombeia sangue rico em oxigênio para a circulação do corpo, através da aorta.',
    detalheAnatomico: 'Sua parede muscular é mais espessa que a do ventrículo direito, pois trabalha com maior pressão.',
  },
  lobo_direito: {
    localizacao: 'Fica principalmente na parte superior direita do abdome, abaixo do diafragma.',
    funcao: 'Participa do processamento de nutrientes, da produção de bile e da transformação de medicamentos e outras substâncias.',
    detalheAnatomico: 'É o maior lobo anatômico do fígado.',
  },
  lobo_esquerdo: {
    localizacao: 'Estende-se para a região central e esquerda do abdome, acima de parte do estômago.',
    funcao: 'Assim como os demais lobos, participa do metabolismo de nutrientes e da produção de bile.',
    detalheAnatomico: 'Na face anterior, o ligamento falciforme marca a divisão anatômica entre os lobos direito e esquerdo.',
  },
  lobo_caudado: {
    localizacao: 'Fica na face posterior do fígado, próximo à veia cava inferior.',
    funcao: 'Participa das funções hepáticas, incluindo o processamento de nutrientes e a produção de bile.',
    detalheAnatomico: 'Corresponde ao segmento I na divisão funcional do fígado.',
  },
  estomago: {
    localizacao: 'Fica na parte superior do abdome, principalmente à esquerda, abaixo do diafragma.',
    funcao: 'Armazena e mistura o alimento com o suco gástrico, iniciando a digestão de proteínas.',
    detalheAnatomico: 'Sua saída, chamada piloro, controla a passagem do conteúdo para o duodeno.',
  },
  duodeno: {
    localizacao: 'É a primeira parte do intestino delgado, logo após o estômago.',
    funcao: 'Recebe o conteúdo gástrico, a bile e o suco pancreático, dando continuidade à digestão.',
    detalheAnatomico: 'Tem formato semelhante à letra C e envolve a cabeça do pâncreas.',
  },
  jejuno_ileo: {
    localizacao: 'Forma alças que ocupam grande parte da região central e inferior do abdome.',
    funcao: 'Absorve grande parte dos nutrientes liberados durante a digestão.',
    detalheAnatomico: 'Reúne duas partes: o jejuno vem após o duodeno, e o íleo se conecta ao intestino grosso.',
  },
  colon_ascendente: {
    localizacao: 'Sobe pelo lado direito do abdome, a partir do ceco.',
    funcao: 'Participa da absorção de água e sais, ajudando a tornar o conteúdo intestinal mais consistente.',
    detalheAnatomico: 'Ao chegar próximo ao fígado, faz uma curva e continua como cólon transverso.',
  },
  colon_transverso: {
    localizacao: 'Atravessa a parte superior do abdome, do lado direito para o esquerdo.',
    funcao: 'Continua a absorção de água e sais e conduz o conteúdo intestinal.',
    detalheAnatomico: 'Liga o cólon ascendente ao descendente e fica suspenso pelo mesocólon transverso.',
  },
  colon_descendente: {
    localizacao: 'Desce pelo lado esquerdo do abdome.',
    funcao: 'Conduz e armazena temporariamente o conteúdo fecal antes de sua passagem ao sigmoide.',
    detalheAnatomico: 'É a continuação do cólon transverso e termina no cólon sigmoide.',
  },
  colon_sigmoide: {
    localizacao: 'Fica na parte inferior esquerda do abdome e se estende para a pelve.',
    funcao: 'Armazena e impulsiona as fezes em direção ao reto.',
    detalheAnatomico: 'Tem trajeto semelhante à letra S e conecta o cólon descendente ao reto.',
  },
  apendice: {
    localizacao: 'É ligado ao ceco, geralmente na parte inferior direita do abdome.',
    funcao: 'Contém tecido linfoide, associado à defesa imunológica do intestino.',
    detalheAnatomico: 'É um pequeno tubo com uma extremidade fechada, cuja posição pode variar entre pessoas.',
  },
  rim_direito: {
    localizacao: 'Fica na região posterior do abdome, à direita da coluna e atrás do peritônio.',
    funcao: 'Filtra o sangue e forma urina, ajudando a regular a quantidade de água e sais do corpo.',
    detalheAnatomico: 'Geralmente fica um pouco mais baixo que o rim esquerdo devido à presença do fígado.',
  },
  rim_esquerdo: {
    localizacao: 'Fica na região posterior do abdome, à esquerda da coluna e atrás do peritônio.',
    funcao: 'Filtra o sangue, elimina resíduos pela urina e participa do equilíbrio de água e sais.',
    detalheAnatomico: 'Geralmente fica um pouco mais alto que o rim direito.',
  },
  bexiga: {
    localizacao: 'Fica na pelve, atrás da sínfise púbica, na região anterior da bacia.',
    funcao: 'Armazena a urina produzida pelos rins até o momento de sua eliminação.',
    detalheAnatomico: 'Sua parede muscular se contrai durante a micção, ajudando a expulsar a urina pela uretra.',
  },
}

// Textos gerais dos grupos; os nomes não são IDs de meshes.
export const GROUP_INFO_BY_NAME: Partial<Record<string, OrganInfo>> = {
  'Pulmão direito': {
    localizacao: 'Fica no lado direito do tórax, ao lado do coração e acima do diafragma.',
    funcao: 'Realiza trocas gasosas: permite a entrada de oxigênio no sangue e a eliminação de gás carbônico.',
    detalheAnatomico: 'É dividido em três lobos: superior, médio e inferior, separados pelas fissuras horizontal e oblíqua.',
  },
  'Pulmão esquerdo': {
    localizacao: 'Fica no lado esquerdo do tórax, ao lado do coração e acima do diafragma.',
    funcao: 'Realiza trocas gasosas entre o ar dos alvéolos e o sangue dos capilares pulmonares.',
    detalheAnatomico: 'Possui dois lobos, superior e inferior, e uma incisura cardíaca que acomoda parte do coração.',
  },
  'Coração': {
    localizacao: 'Fica no tórax, entre os pulmões, atrás do esterno e acima do diafragma, com maior parte à esquerda da linha média.',
    funcao: 'Bombeia o sangue para os pulmões e para o restante do corpo, mantendo a circulação de oxigênio e nutrientes.',
    detalheAnatomico: 'Possui quatro câmaras: dois átrios, que recebem sangue, e dois ventrículos, que o bombeiam para fora do coração.',
  },
  'Fígado': {
    localizacao: 'Fica principalmente na parte superior direita do abdome, abaixo do diafragma, estendendo-se para a região central e esquerda.',
    funcao: 'Processa nutrientes, produz bile e proteínas do sangue e transforma medicamentos e outras substâncias.',
    detalheAnatomico: 'Sua divisão anatômica inclui os lobos direito, esquerdo, caudado e quadrado; o modelo atual representa três deles.',
  },
  'Intestino delgado': {
    localizacao: 'Estende-se do estômago ao intestino grosso, com alças que ocupam grande parte da região central e inferior do abdome.',
    funcao: 'Realiza grande parte da digestão dos alimentos e da absorção dos nutrientes.',
    detalheAnatomico: 'É dividido em duodeno, jejuno e íleo. Sua superfície interna possui vilosidades que ampliam a área de absorção.',
  },
  'Intestino grosso': {
    localizacao: 'Contorna grande parte das alças do intestino delgado e termina no canal anal.',
    funcao: 'Absorve água e sais do conteúdo intestinal e participa da formação e eliminação das fezes.',
    detalheAnatomico: 'Inclui ceco, cólon, reto e canal anal. O apêndice é uma pequena estrutura ligada ao ceco.',
  },
  'Rins': {
    localizacao: 'Ficam na região posterior do abdome, um de cada lado da coluna, atrás do peritônio.',
    funcao: 'Filtram o sangue, formam urina e ajudam a regular a quantidade de água, sais e a acidez do organismo.',
    detalheAnatomico: 'São dois órgãos em formato de feijão. Geralmente, o rim direito fica um pouco abaixo do esquerdo devido à presença do fígado.',
  },
}
