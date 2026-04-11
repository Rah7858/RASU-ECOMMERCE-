import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, RoundedBox, Cylinder, Torus } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// T-Shirt 3D Model
function TShirtModel({ color = "#6B8E8E" }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Body */}
        <RoundedBox args={[1.4, 1.6, 0.15]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
        </RoundedBox>
        {/* Left Sleeve */}
        <RoundedBox args={[0.5, 0.4, 0.12]} radius={0.05} position={[-0.9, 0.5, 0]}>
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
        </RoundedBox>
        {/* Right Sleeve */}
        <RoundedBox args={[0.5, 0.4, 0.12]} radius={0.05} position={[0.9, 0.5, 0]}>
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
        </RoundedBox>
        {/* Collar */}
        <Torus args={[0.2, 0.05, 16, 32]} position={[0, 0.75, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
        </Torus>
      </group>
    </Float>
  );
}

// Pants/Jeans 3D Model
function PantsModel({ color = "#2B4565" }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Waistband */}
        <RoundedBox args={[1.2, 0.3, 0.3]} radius={0.05} position={[0, 1, 0]}>
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
        </RoundedBox>
        {/* Left Leg */}
        <RoundedBox args={[0.5, 1.8, 0.25]} radius={0.05} position={[-0.32, -0.1, 0]}>
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
        </RoundedBox>
        {/* Right Leg */}
        <RoundedBox args={[0.5, 1.8, 0.25]} radius={0.05} position={[0.32, -0.1, 0]}>
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
        </RoundedBox>
      </group>
    </Float>
  );
}

// Jacket 3D Model
function JacketModel({ color = "#1A1A2E" }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Body */}
        <RoundedBox args={[1.5, 1.8, 0.25]} radius={0.1} position={[0, 0, 0]}>
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
        </RoundedBox>
        {/* Left Sleeve */}
        <RoundedBox args={[0.35, 1.3, 0.2]} radius={0.06} position={[-0.85, 0.1, 0]}>
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
        </RoundedBox>
        {/* Right Sleeve */}
        <RoundedBox args={[0.35, 1.3, 0.2]} radius={0.06} position={[0.85, 0.1, 0]}>
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
        </RoundedBox>
        {/* Collar */}
        <RoundedBox args={[1.4, 0.2, 0.15]} radius={0.04} position={[0, 0.9, 0.1]}>
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
        </RoundedBox>
      </group>
    </Float>
  );
}

// Dress 3D Model
function DressModel({ color = "#8E6B8E" }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Top */}
        <RoundedBox args={[1, 0.8, 0.15]} radius={0.06} position={[0, 0.8, 0]}>
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
        </RoundedBox>
        {/* Skirt */}
        <Cylinder args={[0.5, 1, 1.4, 32]} position={[0, -0.3, 0]}>
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} side={THREE.DoubleSide} />
        </Cylinder>
        {/* Straps */}
        <RoundedBox args={[0.1, 0.4, 0.08]} radius={0.02} position={[-0.35, 1.3, 0]}>
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
        </RoundedBox>
        <RoundedBox args={[0.1, 0.4, 0.08]} radius={0.02} position={[0.35, 1.3, 0]}>
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
        </RoundedBox>
      </group>
    </Float>
  );
}

// Shoe 3D Model
function ShoeModel({ color = "#2D2D2D" }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} rotation={[0, -0.5, 0]}>
        {/* Sole */}
        <RoundedBox args={[0.8, 0.15, 1.8]} radius={0.07} position={[0, -0.3, 0]}>
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} metalness={0.1} />
        </RoundedBox>
        {/* Upper */}
        <RoundedBox args={[0.7, 0.4, 1.2]} radius={0.1} position={[0, 0, -0.2]}>
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
        </RoundedBox>
        {/* Toe */}
        <RoundedBox args={[0.65, 0.25, 0.5]} radius={0.08} position={[0, -0.1, 0.6]}>
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
        </RoundedBox>
      </group>
    </Float>
  );
}

// Bag 3D Model
function BagModel({ color = "#8B6914" }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Body */}
        <RoundedBox args={[1.3, 1.2, 0.5]} radius={0.1}>
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
        </RoundedBox>
        {/* Handle */}
        <Torus args={[0.3, 0.04, 16, 32]} position={[0, 0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
        </Torus>
        {/* Flap */}
        <RoundedBox args={[1.2, 0.3, 0.52]} radius={0.05} position={[0, 0.35, 0]}>
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
        </RoundedBox>
      </group>
    </Float>
  );
}

// Watch 3D Model
function WatchModel({ color = "#C0C0C0" }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Watch Face */}
        <Cylinder args={[0.5, 0.5, 0.12, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
        </Cylinder>
        {/* Watch Screen */}
        <Cylinder args={[0.42, 0.42, 0.02, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.06]}>
          <meshStandardMaterial color="#1a1a2e" roughness={0.1} metalness={0.9} />
        </Cylinder>
        {/* Strap Top */}
        <RoundedBox args={[0.35, 0.08, 0.9]} radius={0.02} position={[0, 0, 0.55]}>
          <meshStandardMaterial color="#3d2914" roughness={0.6} metalness={0.1} />
        </RoundedBox>
        {/* Strap Bottom */}
        <RoundedBox args={[0.35, 0.08, 0.9]} radius={0.02} position={[0, 0, -0.55]}>
          <meshStandardMaterial color="#3d2914" roughness={0.6} metalness={0.1} />
        </RoundedBox>
      </group>
    </Float>
  );
}

// Hoodie 3D Model
function HoodieModel({ color = "#4A5568" }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Body */}
        <RoundedBox args={[1.5, 1.7, 0.2]} radius={0.1}>
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.05} />
        </RoundedBox>
        {/* Hood */}
        <RoundedBox args={[0.6, 0.5, 0.25]} radius={0.1} position={[0, 1, 0]}>
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.05} />
        </RoundedBox>
        {/* Left Sleeve */}
        <RoundedBox args={[0.4, 1.2, 0.18]} radius={0.06} position={[-0.85, 0, 0]}>
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.05} />
        </RoundedBox>
        {/* Right Sleeve */}
        <RoundedBox args={[0.4, 1.2, 0.18]} radius={0.06} position={[0.85, 0, 0]}>
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.05} />
        </RoundedBox>
        {/* Pocket */}
        <RoundedBox args={[0.8, 0.35, 0.03]} radius={0.04} position={[0, -0.45, 0.12]}>
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.05} />
        </RoundedBox>
      </group>
    </Float>
  );
}

// Loading Component
function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
      />
    </div>
  );
}

interface Product3DViewerProps {
  subcategory: string;
  color?: string;
  className?: string;
}

export function Product3DViewer({ subcategory, color, className = "" }: Product3DViewerProps) {
  // Map subcategory to 3D model
  const getModel = () => {
    const lowerSubcat = subcategory.toLowerCase();
    
    if (lowerSubcat.includes('shirt') || lowerSubcat.includes('t-shirt') || lowerSubcat.includes('polo') || lowerSubcat.includes('top') || lowerSubcat.includes('blouse') || lowerSubcat.includes('kurta') || lowerSubcat.includes('camisole')) {
      return <TShirtModel color={color} />;
    }
    if (lowerSubcat.includes('jean') || lowerSubcat.includes('pant') || lowerSubcat.includes('trouser') || lowerSubcat.includes('cargo') || lowerSubcat.includes('chino') || lowerSubcat.includes('short') || lowerSubcat.includes('jogger') || lowerSubcat.includes('legging') || lowerSubcat.includes('salwar')) {
      return <PantsModel color={color} />;
    }
    if (lowerSubcat.includes('jacket') || lowerSubcat.includes('blazer') || lowerSubcat.includes('coat') || lowerSubcat.includes('outerwear') || lowerSubcat.includes('sweater') || lowerSubcat.includes('cardigan') || lowerSubcat.includes('sherwani')) {
      return <JacketModel color={color} />;
    }
    if (lowerSubcat.includes('dress') || lowerSubcat.includes('saree') || lowerSubcat.includes('kurti') || lowerSubcat.includes('skirt') || lowerSubcat.includes('gown') || lowerSubcat.includes('lehenga')) {
      return <DressModel color={color} />;
    }
    if (lowerSubcat.includes('shoe') || lowerSubcat.includes('sneaker') || lowerSubcat.includes('boot') || lowerSubcat.includes('loafer') || lowerSubcat.includes('heel') || lowerSubcat.includes('sandal') || lowerSubcat.includes('footwear') || lowerSubcat.includes('slipper') || lowerSubcat.includes('juti')) {
      return <ShoeModel color={color} />;
    }
    if (lowerSubcat.includes('bag') || lowerSubcat.includes('backpack') || lowerSubcat.includes('tote') || lowerSubcat.includes('clutch') || lowerSubcat.includes('handbag') || lowerSubcat.includes('purse') || lowerSubcat.includes('duffel')) {
      return <BagModel color={color} />;
    }
    if (lowerSubcat.includes('watch') || lowerSubcat.includes('smartwatch')) {
      return <WatchModel color={color} />;
    }
    if (lowerSubcat.includes('hoodie') || lowerSubcat.includes('sweatshirt')) {
      return <HoodieModel color={color} />;
    }
    
    // Default to T-shirt for unknown categories
    return <TShirtModel color={color || "#6B8E8E"} />;
  };

  return (
    <motion.div 
      className={`relative w-full h-full min-h-[200px] ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <directionalLight position={[-5, 5, 5]} intensity={0.4} />
          <pointLight position={[0, 5, 0]} intensity={0.5} />
          
          {getModel()}
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
          <Environment preset="studio" />
        </Canvas>
      </Suspense>
      
      {/* Interactive hint */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground/60 pointer-events-none"
      >
        Drag to rotate
      </motion.div>
    </motion.div>
  );
}
