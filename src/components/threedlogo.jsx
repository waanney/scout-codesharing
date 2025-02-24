import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Ring() {
    const torusRef = useRef();
    

    useFrame(() => {
        torusRef.current.rotation.x += 0.01;
        torusRef.current.rotation.y += 0.01;
    });

    const startColor = new THREE.Color(0x7BC5FE);
    const endColor = new THREE.Color(0x1763B0);

    return (
        <mesh ref={torusRef}>
            <torusGeometry args={[1.5, 0.4, 60, 50]} />
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
    );
}

export default function Scene() {
    const controlsRef = useRef();
    return (
        <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.2} />
            <directionalLight position={[5, 5, 5]} intensity={0.5} />
            <pointLight position={[0, 5, 0]} intensity={1} />
            <Ring />
            <OrbitControls ref={controlsRef} enableZoom={false} /> 
        </Canvas>
    );
}