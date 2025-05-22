import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree, Canvas, extend } from '@react-three/fiber';
import { Points, BufferGeometry, PointMaterial } from '@react-three/drei';

// Extend Three.js elements
extend({ BufferGeometry, PointMaterial });

interface ParticleFieldProps {
  viewport: {
    width: number;
    height: number;
  };
}

const ParticleField = () => {
  const { viewport } = useThree();
  const points = useRef<THREE.Points>(null);
  const particleCount = 2000;

  useEffect(() => {
    if (!points.current) return;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * viewport.width * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 2;
      positions[i * 3 + 2] = Math.random() * 500 - 250;
      speeds[i] = Math.random() * 0.2 + 0.1;
      sizes[i] = Math.random() * 2 + 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    points.current.geometry = geometry;
  }, [viewport]);

  useFrame((_state: THREE.Object3D, _delta: number) => {
    if (!points.current) return;

    const positions = points.current.geometry.attributes.position.array as Float32Array;
    const speeds = points.current.geometry.attributes.speed.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 2] -= speeds[i];

      if (positions[i * 3 + 2] < -250) {
        positions[i * 3 + 2] = 250;
      }
    }

    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={points}>
      <BufferGeometry />
      <PointMaterial
        size={2}
        sizeAttenuation={true}
        color="#1C45F4"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 z-0 bg-[#0F0F1A]">
      <Canvas
        camera={{ position: [0, 0, 100], fov: 60 }}
        style={{ position: 'absolute' }}
      >
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default ParticleBackground; 