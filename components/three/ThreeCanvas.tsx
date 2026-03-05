"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import RotatingCube from "./RotatingCube";

export default function ThreeCanvas() {
  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border border-[var(--border-subtle)]">
      <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <directionalLight position={[-5, 5, 5]} intensity={1} />
        
        <RotatingCube />
        
        <OrbitControls enablePan={false} />
        <gridHelper args={[10, 10]} />
      </Canvas>
    </div>
  );
}
