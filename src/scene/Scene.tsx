import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { CameraControls, Center } from '@react-three/drei'
import { Box3, Object3D } from 'three'
import { useStore } from '../store'
import { Model } from './Model'

function Rig() {
  const controls = useRef<CameraControls>(null)
  const organoSelecionado = useStore((s) => s.organoSelecionado)

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

  // Passos 4/5/6: bounding box do órgão + anima câmera até ele.
  // Passo 7: null -> reenquadra a cena inteira.
  useEffect(() => {
    const cc = controls.current
    if (!cc) return
    const scene = cc.camera.parent
    if (!scene) return

    if (!organoSelecionado) {
      const box = new Box3().setFromObject(scene)
      if (!box.isEmpty()) cc.fitToBox(box, true, framePadding)
      return
    }

    let target: Object3D | null = null
    scene.traverse((n) => {
      if (n.name === organoSelecionado) target = n
    })
    if (target) {
      const t = target as Object3D
      // Mede a box ignorando visibilidade/timing: torna visível só pra medir,
      // força a matriz world (o <Center> move o modelo no mesmo frame), restaura.
      const prev = t.visible
      t.visible = true
      t.updateWorldMatrix(true, false)
      const box = new Box3().setFromObject(t)
      t.visible = prev
      if (!box.isEmpty()) cc.fitToBox(box, true, framePadding)
    }
  }, [organoSelecionado])

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
