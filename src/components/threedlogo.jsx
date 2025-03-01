import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Component tạo 4 cung tròn chuẩn
function FourArcs() {
  const groupRef = useRef();

  useFrame(() => {
    groupRef.current.rotation.x += 0.01;
    groupRef.current.rotation.y += 0.01;
  });

  const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
  const arcAngle = Math.PI * 0.45;

  const startColor = new THREE.Color(0x7bc5fe);
  const endColor = new THREE.Color(0x1763b0);

  return (
    <group ref={groupRef}>
      {angles.map((angle, index) => (
        <mesh key={index} rotation={[0, 0, angle]}>
          <torusGeometry args={[1.5, 0.35, 60, 50, arcAngle]} />
          <shaderMaterial
            attach="material"
            uniforms={{
              startColor: { value: startColor },
              endColor: { value: endColor },
            }}
            vertexShader={`
                        varying vec3 vPosition;
                        varying vec3 vNormal;

                        void main() {
                            vPosition = position;
                            vNormal = normal; // Ensure normals are passed
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `}
            fragmentShader={`
                        uniform vec3 startColor;
                        uniform vec3 endColor;
                        varying vec3 vPosition;
                        varying vec3 vNormal;

                        void main() {
                            vec3 normal = normalize(vNormal); // Normalize (important for smooth shading)
                            float theta = acos(normal.y);
                            float gradientFactor = theta / ${Math.PI.toFixed(7)};

                            gl_FragColor = vec4(mix(startColor, endColor, gradientFactor), 1.0);
                        }
                    `}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ThreeDLogo() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <FourArcs />
      <OrbitControls enableZoom={false} enablePan={true} enableRotate={true} enableContextMenu={false}/>
    </Canvas>
  );
}
