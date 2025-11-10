
'use client';

import { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Icosahedron, Dodecahedron, Octahedron, TorusKnot, Sphere, Box, Cone, Cylinder, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';

function Particles() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const positions = new Float32Array(10000 * 3);
    for (let i = 0; i < 10000; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
        const positions = ref.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 2] += delta * 0.1;
            if (positions[i + 2] > 5) {
                positions[i + 2] = -5;
            }
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

const SHAPE_GEOMETRIES = [
  Icosahedron, Dodecahedron, Octahedron, TorusKnot, Sphere, Box, Cone, Cylinder, Torus
];

function FloatingShape({ initialPosition, scale, rotationSpeed, velocity, color, materialProps }: { initialPosition: THREE.Vector3, scale: number, rotationSpeed: { x: number, y: number }, velocity: THREE.Vector3, color: string, materialProps: any }) {
    const ref = useRef<THREE.Mesh>(null!);
    
    const Geometry = useMemo(() => SHAPE_GEOMETRIES[Math.floor(Math.random() * SHAPE_GEOMETRIES.length)], []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x += delta * rotationSpeed.x;
            ref.current.rotation.y += delta * rotationSpeed.y;

            ref.current.position.x += velocity.x * delta;
            ref.current.position.y += velocity.y * delta;
            ref.current.position.z += velocity.z * delta;

            const boundary = 6;
            if (ref.current.position.x > boundary) ref.current.position.x = -boundary;
            if (ref.current.position.x < -boundary) ref.current.position.x = boundary;
            if (ref.current.position.y > boundary) ref.current.position.y = -boundary;
            if (ref.current.position.y < -boundary) ref.current.position.y = boundary;
            if (ref.current.position.z > boundary) ref.current.position.z = -boundary;
            if (ref.current.position.z < -boundary) ref.current.position.z = boundary;
        }
    });

    return (
        <Geometry ref={ref} args={[1, 1]} position={initialPosition} scale={scale}>
            <meshStandardMaterial 
                color={color}
                {...materialProps}
            />
        </Geometry>
    )
}

function FloatingShapes() {
    const themeColors = ['#008080', '#32CD32', '#4F86F7', '#F5A623', '#D0021B', '#BD10E0', '#FF69B4', '#FFA500'];

    const shapes = useMemo(() => {
        return new Array(20).fill(0).map(() => {
            const isColored = Math.random() > 0.4;
            const color = isColored ? themeColors[Math.floor(Math.random() * themeColors.length)] : "#ffffff";
            
            return {
                initialPosition: new THREE.Vector3(
                    (Math.random() - 0.5) * 12, 
                    (Math.random() - 0.5) * 12, 
                    (Math.random() - 0.5) * 12
                ),
                scale: 0.2 + Math.random() * 0.4,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.2,
                    y: (Math.random() - 0.5) * 0.2
                },
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.3,
                    (Math.random() - 0.5) * 0.3,
                    (Math.random() - 0.5) * 0.3
                ),
                color: color,
                materialProps: {
                    roughness: Math.random() * 0.6, 
                    metalness: 0.5 + Math.random() * 0.5, 
                    emissive: color,
                    emissiveIntensity: isColored ? 0.5 : 0.2,
                    wireframe: Math.random() > 0.8
                }
            }
        });
    }, [themeColors]);

    return (
        <group>
            {shapes.map((shape, index) => (
                <FloatingShape 
                    key={index} 
                    initialPosition={shape.initialPosition}
                    scale={shape.scale}
                    rotationSpeed={shape.rotationSpeed}
                    velocity={shape.velocity}
                    color={shape.color}
                    materialProps={shape.materialProps}
                />
            ))}
        </group>
    );
}

export function MotionBackground() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }
    
    return (
    <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }} style={{ background: 'transparent' }} gl={{ alpha: true }}>
            <ambientLight intensity={4} />
            <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={4} />
            <Suspense fallback={null}>
                <Particles />
                <FloatingShapes />
            </Suspense>
        </Canvas>
    </div>
    )
}
