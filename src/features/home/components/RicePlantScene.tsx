import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, Float, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const WIRE = '#f1f8f2'
const WIRE_SOFT = '#c8e6c9'
const MODEL_URL = '/models/rice-plant.glb'
const DRACO_DECODER = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/'

function WireframeRice() {
  const root = useRef<THREE.Group>(null)
  const { scene } = useGLTF(MODEL_URL, DRACO_DECODER)

  const model = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.material = new THREE.MeshBasicMaterial({
        color: WIRE,
        wireframe: true,
        transparent: true,
        opacity: 0.92,
      })
      mesh.castShadow = false
      mesh.receiveShadow = false
    })
    return clone
  }, [scene])

  useEffect(() => {
    return () => {
      model.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (!mesh.isMesh) return
        // Chỉ dispose material tự tạo — geometry dùng chung từ cache useGLTF
        const mat = mesh.material
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
        else mat?.dispose()
      })
    }
  }, [model])

  useFrame((state) => {
    if (!root.current) return
    root.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.25
  })

  return (
    <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.2}>
      <group ref={root}>
        <Center>
          <primitive object={model} scale={1.3} />
        </Center>
        <mesh rotation={[-Math.PI / 22, 0, 0]} position={[0, -1.55, 0]}>
          <ringGeometry args={[0.18, 0.32, 36]} />
          <meshBasicMaterial color={WIRE_SOFT} wireframe transparent opacity={0.88} />
        </mesh>
      </group>
    </Float>
  )
}

export default function RicePlantScene() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [2.8, 0.2, 3.4], fov: 30, near: 0.1, far: 50 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.9} />
        <Suspense fallback={null}>
          <WireframeRice />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload(MODEL_URL, DRACO_DECODER)
