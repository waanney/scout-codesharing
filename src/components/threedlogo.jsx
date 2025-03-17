import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function FourArcs({ scale }) {
  // Receive scale as a prop
  const groupRef = useRef();

  useFrame(() => {
    groupRef.current.rotation.x += 0.01;
    groupRef.current.rotation.y += 0.01;
  });

  useEffect(() => {
    groupRef.current.scale.set(scale, scale, scale);
  }, [scale]);

  const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
  const arcAngle = Math.PI * 0.45;

  const startColor = new THREE.Color(0x91ceff); // Xanh sáng hơn
  const endColor = new THREE.Color(0x1d6fc4); // Xanh đậm hơn một chút

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
                vNormal = normal;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              uniform vec3 startColor;
              uniform vec3 endColor;
              varying vec3 vPosition;
              varying vec3 vNormal;

              void main() {
                vec3 normal = normalize(vNormal);
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
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenWidth < 768; // Adjust threshold as needed

  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <FourArcs scale={isMobile ? 0.8 : 1} />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
    </Canvas>
  );
}
