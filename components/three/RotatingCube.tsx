"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

export default function RotatingCube() {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.7;
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={clicked ? 1.5 : 1}
      onClick={() => setClicked(!clicked)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={hovered ? "#00f0ff" : "#ff00ff"}
        emissive={hovered ? "#004444" : "#440044"}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
}
