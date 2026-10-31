import React, { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import SpatialScene from "./src/ar/SpatialScene";
import {
  GROUP_INFO_BY_NAME,
  ORGANS,
  ORGAN_BY_ID,
  ORGAN_INFO_BY_ID,
  type Organ,
  type OrganInfo,
} from "./src/data/organs";
import { useStore } from "./src/store";

// Giro por botão: o rotate de dois dedos quase nunca acerta o órgão
// (o Viro testa o ponto médio entre os dedos, que cai fora da malha).
const PASSO_GIRO = 30;

// Grupos na ordem de ORGANS, cada um com suas partes. Órgãos escondidos
// (coração atrás dos pulmões, rins atrás do intestino) só são alcançáveis por aqui.
const GRUPOS = ORGANS.reduce<{ nome: string; partes: Organ[] }[]>((acc, o) => {
  const grupo = acc.find((g) => g.nome === o.grupo);
  if (grupo) grupo.partes.push(o);
  else acc.push({ nome: o.grupo, partes: [o] });
  return acc;
}, []);

// Mesmas seções do OrganInfoOverlay da versão web. Rola se o texto for longo,
// e tocar no título recolhe para liberar a vista da cena.
function Descricao({ titulo, grupo, info }: { titulo: string; grupo?: string; info: OrganInfo }) {
  const [aberta, setAberta] = useState(true);
  return (
    <View style={styles.descricao}>
      <Pressable onPress={() => setAberta((v) => !v)} style={styles.descricaoTopo}>
        <View style={{ flex: 1 }}>
          {grupo && <Text style={styles.descricaoGrupo}>{grupo}</Text>}
          <Text style={styles.descricaoTitulo}>{titulo}</Text>
        </View>
        <Text style={styles.descricaoSeta}>{aberta ? "▾" : "▸"}</Text>
      </Pressable>
      {aberta && (
        <ScrollView style={styles.descricaoTexto}>
          <Text style={styles.secao}>Localização</Text>
          <Text style={styles.text}>{info.localizacao}</Text>
          <Text style={styles.secao}>Função</Text>
          <Text style={styles.text}>{info.funcao}</Text>
          <Text style={styles.secao}>Detalhe anatômico</Text>
          <Text style={styles.text}>{info.detalheAnatomico}</Text>
        </ScrollView>
      )}
    </View>
  );
}

// Ícone de menu: três barras desenhadas com View.
function IconeMenu() {
  return (
    <View style={styles.iconeMenu}>
      <View style={styles.barra} />
      <View style={styles.barra} />
      <View style={styles.barra} />
    </View>
  );
}

function MenuOrgaos({ onEscolher }: { onEscolher: () => void }) {
  const grupoAtivo = useStore((s) => s.grupoAtivo);
  const orgaosSelecionados = useStore((s) => s.orgaosSelecionados);
  const abrirGrupo = useStore((s) => s.abrirGrupo);
  const alternarOrgao = useStore((s) => s.alternarOrgao);

  return (
    <ScrollView style={styles.menu} contentContainerStyle={styles.menuConteudo}>
      {GRUPOS.map((g) => (
        <View key={g.nome}>
          <Pressable
            onPress={() => {
              abrirGrupo(g.nome);
              onEscolher();
            }}
            style={({ pressed }) => [styles.itemGrupo, pressed && styles.botaoPressionado]}
          >
            <Text
              style={[
                styles.itemTexto,
                grupoAtivo === g.nome && orgaosSelecionados.length === 0 && styles.itemAtivo,
              ]}
            >
              {g.nome}
            </Text>
          </Pressable>
          {g.partes.length > 1 &&
            g.partes.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => {
                  abrirGrupo(g.nome); // limpa a seleção e abre o grupo
                  alternarOrgao(p.id);
                  onEscolher();
                }}
                style={({ pressed }) => [styles.itemParte, pressed && styles.botaoPressionado]}
              >
                <Text style={[styles.itemParteTexto, orgaosSelecionados.includes(p.id) && styles.itemAtivo]}>
                  {p.label}
                </Text>
              </Pressable>
            ))}
        </View>
      ))}
    </ScrollView>
  );
}

function BotaoHud({
  rotulo,
  onPress,
  desativado = false,
}: {
  rotulo: string;
  onPress: () => void;
  desativado?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={desativado}
      style={({ pressed }) => [
        styles.botao,
        pressed && styles.botaoPressionado,
        desativado && styles.botaoDesativado,
      ]}
    >
      <Text style={styles.botaoTexto}>{rotulo}</Text>
    </Pressable>
  );
}

export default function App() {
  const corpoNaMesa = useStore((s) => s.corpoNaMesa);
  const grupoAtivo = useStore((s) => s.grupoAtivo);
  const orgaosSelecionados = useStore((s) => s.orgaosSelecionados);
  const girar = useStore((s) => s.girar);
  const voltar = useStore((s) => s.voltar);
  const resetar = useStore((s) => s.resetar);
  const [menuAberto, setMenuAberto] = useState(false);

  const nivel =
    grupoAtivo === null
      ? "Toque num órgão"
      : orgaosSelecionados.length > 0
        ? orgaosSelecionados.map((id) => ORGAN_BY_ID[id]?.label ?? id).join(", ")
        : `${grupoAtivo} · toque numa parte`;

  // Uma parte isolada usa o texto dela; o órgão inteiro usa o do grupo, ou o
  // da única parte (estômago, bexiga não têm texto de grupo).
  const parteUnica = orgaosSelecionados.length === 1 ? ORGAN_BY_ID[orgaosSelecionados[0]] : undefined;
  const partesDoGrupo = ORGANS.filter((o) => o.grupo === grupoAtivo);
  const descricao =
    grupoAtivo === null
      ? null
      : parteUnica
        ? { titulo: parteUnica.label, grupo: grupoAtivo, info: ORGAN_INFO_BY_ID[parteUnica.id] }
        : orgaosSelecionados.length === 0
          ? {
              titulo: grupoAtivo,
              info:
                GROUP_INFO_BY_NAME[grupoAtivo] ??
                (partesDoGrupo.length === 1 ? ORGAN_INFO_BY_ID[partesDoGrupo[0].id] : undefined),
            }
          : null;

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        initialScene={{ scene: SpatialScene }}
        style={styles.ar}
      />

      {!corpoNaMesa && (
        <SafeAreaView pointerEvents="none" style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>WL02 — Spatial AR</Text>
            <Text style={styles.text}>
              Mova o celular para detectar uma mesa ou piso e toque no plano para posicionar o corpo.
            </Text>
          </View>
        </SafeAreaView>
      )}

      {corpoNaMesa && (
        <View style={styles.topo}>
          <Pressable
            onPress={() => setMenuAberto((v) => !v)}
            style={({ pressed }) => [styles.botaoMenu, pressed && styles.botaoPressionado]}
          >
            <IconeMenu />
          </Pressable>
          {menuAberto && <MenuOrgaos onEscolher={() => setMenuAberto(false)} />}
        </View>
      )}

      {corpoNaMesa && (
        <View style={styles.hud}>
          {descricao?.info ? (
            <Descricao
              key={descricao.titulo} // reabre ao trocar de órgão
              titulo={descricao.titulo}
              grupo={descricao.grupo}
              info={descricao.info}
            />
          ) : (
            <Text style={styles.nivel}>{nivel}</Text>
          )}
          <View style={styles.botoes}>
            <BotaoHud rotulo="↺" onPress={() => girar(PASSO_GIRO)} />
            <BotaoHud rotulo="↻" onPress={() => girar(-PASSO_GIRO)} />
            <BotaoHud rotulo="Voltar" onPress={voltar} desativado={grupoAtivo === null} />
            <BotaoHud rotulo="Reset" onPress={resetar} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  ar: { flex: 1 },
  overlay: { position: "absolute", left: 0, right: 0, top: 0 },
  card: {
    margin: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.64)",
  },
  title: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
  text: { color: "#FFFFFF", marginTop: 4, fontSize: 14, lineHeight: 20 },
  hud: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 32,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.64)",
  },
  nivel: { color: "#FFFFFF", fontSize: 15, textAlign: "center", marginBottom: 10 },
  botoes: { flexDirection: "row", gap: 8 },
  botao: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#D32F2F",
  },
  botaoPressionado: { opacity: 0.7 },
  botaoDesativado: { opacity: 0.35 },
  botaoTexto: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  topo: { position: "absolute", left: 16, top: 48 },
  botaoMenu: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.64)",
  },
  iconeMenu: { width: 24, height: 18, justifyContent: "space-between" },
  barra: { height: 3, borderRadius: 2, backgroundColor: "#FFFFFF" },
  menu: {
    marginTop: 8,
    width: 240,
    maxHeight: 420,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  menuConteudo: { paddingVertical: 8 },
  itemGrupo: { paddingVertical: 10, paddingHorizontal: 16 },
  itemTexto: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  itemParte: { paddingVertical: 7, paddingLeft: 32, paddingRight: 16 },
  itemParteTexto: { color: "#DDDDDD", fontSize: 14 },
  itemAtivo: { color: "#FF6B6B" },
  descricao: { marginBottom: 10 },
  descricaoTopo: { flexDirection: "row", alignItems: "center" },
  descricaoGrupo: { color: "#BBBBBB", fontSize: 12 },
  descricaoTitulo: { color: "#FFFFFF", fontSize: 17, fontWeight: "700" },
  descricaoSeta: { color: "#FFFFFF", fontSize: 18, paddingLeft: 12 },
  descricaoTexto: { maxHeight: 200, marginTop: 4 },
  secao: { color: "#FF6B6B", fontSize: 13, fontWeight: "700", marginTop: 8 },
});
