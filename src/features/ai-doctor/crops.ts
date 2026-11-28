// The backend crop catalog (CropCatalog, AI_DIAGNOSIS.md 2.2, 2.4), in its display order. A problem without a crop is rice.
export const CROP_LABEL: Record<string, string> = {
  RICE: 'Lúa',
  DURIAN: 'Sầu riêng',
  COFFEE: 'Cà phê',
  CORN: 'Bắp (ngô)',
  MANGO: 'Xoài',
  DRAGON_FRUIT: 'Thanh long',
}
export const CROP_CODES = Object.keys(CROP_LABEL)
export const RICE = 'RICE'
export const DRAGON_FRUIT = 'DRAGON_FRUIT'

export const cropLabel = (code: string | null | undefined) => CROP_LABEL[code || RICE] ?? code ?? 'Lúa'
/** The crop a case was sent for: the server's name, else the catalog's (rice for an old case). */
export const caseCrop = (c: { cropType?: string; cropName?: string }) => c.cropName || cropLabel(c.cropType)
/** The part of the plant to photograph: a branch (stem) for dragon fruit, whose model reads stems (AI_DIAGNOSIS.md §16), a leaf otherwise. */
export const partWord = (code: string | null | undefined) => (code === DRAGON_FRUIT ? 'cành' : 'lá')
/** "lá lúa", "lá sầu riêng", "cành thanh long": inside a sentence. */
export const leafOf = (code: string | null | undefined) => `${partWord(code)} ${cropLabel(code).toLowerCase()}`

// The crop the farmer chose last, shared by the photo diagnosis and the advice search, remembered on this browser only.
const KEY = 'agrisage.last_crop'

export function readLastCrop(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function rememberCrop(code: string | null) {
  try {
    if (code) localStorage.setItem(KEY, code)
    else localStorage.removeItem(KEY)
  } catch {
    // Private mode or blocked storage: the choice is simply not remembered.
  }
}
