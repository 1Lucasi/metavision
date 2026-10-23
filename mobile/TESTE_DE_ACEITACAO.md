# Teste de aceitacao — WL02 Spatial AR / React Native

## Validacoes automaticas incluidas
Execute:
```powershell
npm run verify
```

O script verifica:
- arquivos obrigatorios;
- JSON de configuracao;
- versoes fixadas;
- plugin ViroReact em modo AR;
- uso do `ViroARPlaneSelector`;
- deteccao de planos horizontais;
- encaminhamento dos tres eventos de anchor;
- arraste `FixedToWorld`;
- pinch;
- rotacao.

## Aceitacao em hardware
O projeto e considerado aprovado no laboratorio quando, em Android compativel com ARCore:

1. `npm install` termina sem erro fatal;
2. `npm run verify` termina com sucesso;
3. `npm run doctor` nao apresenta incompatibilidade bloqueante;
4. `npm run prebuild` gera o projeto Android;
5. `npm run android` compila, instala e abre;
6. a camera recebe permissao;
7. planos horizontais aparecem ao movimentar o celular;
8. tocar em um plano posiciona o cubo;
9. o cubo permanece espacialmente estavel quando o celular se move;
10. o arraste reposiciona o cubo em superficie real;
11. pinch altera a escala;
12. rotacao altera a orientacao;
13. `RESET` restaura o cubo ao estado inicial.

Registre um video curto do teste antes de promover a versao para release oficial de laboratorio.
