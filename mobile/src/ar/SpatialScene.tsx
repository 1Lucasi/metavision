import React, { useRef, useState } from "react";
import {
  ViroAmbientLight,
  ViroARPlaneSelector,
  ViroARScene,
  ViroBox,
  ViroMaterials,
  ViroText,
} from "@reactvision/react-viro";

ViroMaterials.createMaterials({
  wl02Blue: {
    diffuseColor: "#1976D2",
    lightingModel: "Lambert",
  },
  wl02Red: {
    diffuseColor: "#D32F2F",
    lightingModel: "Lambert",
  },
});

const MIN_SCALE = 0.5;
const MAX_SCALE = 3.0;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export default function SpatialScene() {
  const selectorRef = useRef<any>(null);
  const baseScaleRef = useRef(1);
  const baseRotationRef = useRef(0);

  const [objectKey, setObjectKey] = useState(0);
  const [scaleValue, setScaleValue] = useState(1);
  const [rotationY, setRotationY] = useState(0);
  const [planeSelected, setPlaneSelected] = useState(false);

  const resetObject = () => {
    baseScaleRef.current = 1;
    baseRotationRef.current = 0;
    setScaleValue(1);
    setRotationY(0);
    setObjectKey((value) => value + 1);
  };

  const handlePinch = (pinchState: number, scaleFactor: number) => {
    const next = clamp(baseScaleRef.current * scaleFactor, MIN_SCALE, MAX_SCALE);
    setScaleValue(next);
    if (pinchState === 3) {
      baseScaleRef.current = next;
    }
  };

  const handleRotate = (rotateState: number, rotationFactor: number) => {
    const next = baseRotationRef.current + rotationFactor;
    setRotationY(next);
    if (rotateState === 3) {
      baseRotationRef.current = next;
    }
  };

  return (
    <ViroARScene
      anchorDetectionTypes={["PlanesHorizontal"]}
      onAnchorFound={(anchor) => selectorRef.current?.handleAnchorFound(anchor)}
      onAnchorUpdated={(anchor) => selectorRef.current?.handleAnchorUpdated(anchor)}
      onAnchorRemoved={(anchor) =>
        anchor && selectorRef.current?.handleAnchorRemoved(anchor)
      }
    >
      <ViroAmbientLight color="#FFFFFF" intensity={300} />

      <ViroARPlaneSelector
        ref={selectorRef}
        alignment="Horizontal"
        useActualShape={true}
        hideOverlayOnSelection={true}
        onPlaneSelected={() => setPlaneSelected(true)}
      >
        <ViroBox
          key={`object-${objectKey}`}
          width={0.12}
          height={0.12}
          length={0.12}
          position={[0, 0.06, 0]}
          scale={[scaleValue, scaleValue, scaleValue]}
          rotation={[0, rotationY, 0]}
          materials={["wl02Blue"]}
          dragType="FixedToWorld"
          onDrag={() => {}}
          onPinch={handlePinch}
          onRotate={handleRotate}
        />

        <ViroBox
          width={0.07}
          height={0.02}
          length={0.07}
          position={[0.18, 0.011, 0]}
          materials={["wl02Red"]}
          onClick={resetObject}
        />

        <ViroText
          text="RESET"
          position={[0.18, 0.025, 0]}
          rotation={[-90, 0, 0]}
          scale={[0.025, 0.025, 0.025]}
          width={3}
          height={1}
          style={{ fontSize: 22, color: "#FFFFFF", textAlign: "center" }}
          ignoreEventHandling={true}
        />

        <ViroText
          text={planeSelected ? "Arraste • Pinch • Rotacione" : ""}
          position={[0, 0.18, 0]}
          transformBehaviors={["billboardY"]}
          scale={[0.04, 0.04, 0.04]}
          width={6}
          height={1}
          style={{ fontSize: 20, color: "#FFFFFF", textAlign: "center" }}
          ignoreEventHandling={true}
        />
      </ViroARPlaneSelector>
    </ViroARScene>
  );
}
