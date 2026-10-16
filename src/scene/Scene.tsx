import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { CameraControls, Center } from '@react-three/drei'
import { Box3, Object3D } from 'three'
import { useStore } from '../store'
import { Model } from './Model'

function Rig() {
  const controls = useRef<CameraControls>(null)
  const orgaosSelecionados = useStore((s) => s.orgaosSelecionados)

  // Enquadramento inicial: foca a cena inteira assim que monta.
  useEffect(() => {
    const cc = controls.current
    if (!cc) return
    const scene = cc.camera.parent
    if (scene) {
      const box = new Box3().setFromObject(scene)
      if (!box.isEmpty()) cc.fitToBox(box, false, framePadding)
    }
  }, [])

  // Reenquadra sempre que a seleção muda.
  // - vazio -> cena inteira
  // - 1+ órgãos -> caixa que ENVOLVE todos os selecionados (ex: coração inteiro)
  useEffect(() => {
    const cc = controls.current
    if (!cc) return
    const scene = cc.camera.parent
    if (!scene) return

    if (orgaosSelecionados.length === 0) {
      const box = new Box3().setFromObject(scene)
      if (!box.isEmpty()) cc.fitToBox(box, true, framePadding)
      return
    }

    // Une as bounding boxes de todos os órgãos marcados num box só.
    const alvo = new Set(orgaosSelecionados)
    const box = new Box3()
    scene.traverse((n: Object3D) => {
      if (!alvo.has(n.name)) return
      // Garante a matriz world atual (o <Center> reposiciona o modelo no load)
      // antes de somar este órgão à caixa de enquadramento.
      n.updateWorldMatrix(true, false)
      box.expandByObject(n)
    })
    if (!box.isEmpty()) cc.fitToBox(box, true, framePadding)
  }, [orgaosSelecionados])

  return <CameraControls ref={controls} minDistance={0.05} maxDistance={5} />
}

const framePadding = {
  paddingTop: 0.3,
  paddingBottom: 0.3,
  paddingLeft: 0.3,
  paddingRight: 0.3,
}

export function Scene() {
  return (
    <Canvas camera={{ position: [0, 0.3, 1], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={['#0f1419']} />
      {/* Iluminação local — sem HDR externo, pra funcionar offline e não quebrar a cena */}
      <ambientLight intensity={0.8} />
      <hemisphereLight args={['#ffffff', '#444444', 0.6]} />
      <directionalLight position={[2, 4, 3]} intensity={1.3} />
      <directionalLight position={[-2, 1, -2]} intensity={0.5} />
      <directionalLight position={[0, 2, -4]} intensity={0.4} />

      {/* Center: o GLB vem com base em Y=0; centraliza na origem p/ orbitar certo */}
      <Center>
        <Model />
      </Center>

      <Rig />
    </Canvas>
  )
}
