// require() de um .glb devolve o id numérico do asset gerado pelo Metro.
declare module "*.glb" {
  const asset: number;
  export default asset;
}
