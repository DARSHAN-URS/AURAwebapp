"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

function AnimatedOrb() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
      <Sphere ref={meshRef} args={[1.6, 80, 80]}>
        <MeshDistortMaterial
          color="#3b82f6"
          attach="material"
          distort={0.38}
          speed={1.8}
          roughness={0}
          metalness={0.1}
          transparent
          opacity={0.18}
        />
      </Sphere>
      {/* Inner core glow */}
      <Sphere args={[1.1, 60, 60]}>
        <MeshDistortMaterial
          color="#6366f1"
          attach="material"
          distort={0.5}
          speed={2.2}
          roughness={0}
          metalness={0.2}
          transparent
          opacity={0.12}
        />
      </Sphere>
    </Float>
  );
}

export default function HeroOrb() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#3b82f6" />
        <directionalLight position={[-5, -3, -5]} intensity={0.4} color="#8b5cf6" />
        <pointLight position={[0, 0, 3]} intensity={0.8} color="#60a5fa" />
        <AnimatedOrb />
      </Canvas>
    </div>
  );
}
