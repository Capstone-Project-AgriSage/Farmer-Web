import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import {
  dedup,
  prune,
  weld,
  simplify,
  draco,
  getBounds,
} from '@gltf-transform/functions'
import { MeshoptSimplifier } from 'meshoptimizer'
import draco3d from 'draco3dgltf'
import { readFileSync, writeFileSync } from 'node:fs'

const input = 'public/models/rice-plant.glb'
const output = 'public/models/rice-plant.glb'

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'draco3d.decoder': await draco3d.createDecoderModule(),
    'draco3d.encoder': await draco3d.createEncoderModule(),
  })

const document = await io.read(input)

// Strip textures & unused vertex attrs — wireframe only needs positions
for (const material of document.getRoot().listMaterials()) {
  material.setBaseColorTexture(null)
  material.setNormalTexture(null)
  material.setMetallicRoughnessTexture(null)
  material.setOcclusionTexture(null)
  material.setEmissiveTexture(null)
  material.setBaseColorFactor([1, 1, 1, 1])
  material.setMetallicFactor(0)
  material.setRoughnessFactor(1)
}

for (const texture of [...document.getRoot().listTextures()]) {
  texture.dispose()
}

for (const mesh of document.getRoot().listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    prim.setAttribute('TEXCOORD_0', null)
    prim.setAttribute('TEXCOORD_1', null)
    prim.setAttribute('TANGENT', null)
    prim.setAttribute('COLOR_0', null)
  }
}

await document.transform(
  dedup(),
  prune(),
  weld({ overwrite: true }),
  simplify({
    simplifier: MeshoptSimplifier,
    ratio: 0.06,
    error: 0.02,
  }),
  prune(),
  draco({ method: 'edgebreaker' }),
)

const bounds = getBounds(document.getRoot().listScenes()[0])
console.log('bounds', bounds)

await io.write(output, document)
const size = readFileSync(output).byteLength
console.log(`Wrote ${output} (${(size / 1024 / 1024).toFixed(2)} MB)`)

// sanity: ensure still starts with glTF
const magic = readFileSync(output).subarray(0, 4).toString()
console.log('magic', magic)
writeFileSync(
  'public/models/ATTRIBUTION.txt',
  `Rice plant GLB sourced from MakeIt3D community model:
https://makeit3d.app/m/8vs6amov

Optimized for wireframe display (textures removed, mesh simplified).
`,
)
