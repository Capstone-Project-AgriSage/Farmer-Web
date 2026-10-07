import { useCallback, useEffect, useRef, useState } from 'react'
import { diagnosisProvider, type DiagnosisOutcome } from './data/mockDiagnosisProvider'
import type { RiceStageValue } from './model'

export type DiagnosisStatus = 'idle' | 'analyzing' | 'result' | 'error'

export interface PickedImage {
  url: string
  /** Missing for sample cases, which use a hosted picture. */
  name?: string
  size?: number
}

const isRealUpload = (image: PickedImage | null) => Boolean(image?.name)

/**
 * Everything the AI Doctor screen needs, in one place. The screen and its components only read this and call these
 * actions; where the answers come from is data/mockDiagnosisProvider.ts alone.
 */
export function useDiagnosis() {
  const [image, setImage] = useState<PickedImage | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [stage, setStage] = useState<RiceStageValue>('tillering')
  const [symptomText, setSymptomText] = useState('')
  const [status, setStatus] = useState<DiagnosisStatus>('idle')
  const [outcome, setOutcome] = useState<DiagnosisOutcome | null>(null)
  const [sampleId, setSampleId] = useState<string | null>(null)
  const [showAlternatives, setShowAlternatives] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const imageRef = useRef<PickedImage | null>(null)

  const releaseImage = useCallback((picked: PickedImage | null) => {
    if (picked && isRealUpload(picked)) URL.revokeObjectURL(picked.url)
  }, [])

  const cancelRun = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
  }, [])

  useEffect(() => {
    imageRef.current = image
  }, [image])

  useEffect(
    () => () => {
      abortRef.current?.abort()
      releaseImage(imageRef.current)
    },
    [releaseImage],
  )

  const selectFile = useCallback(
    (file: File | undefined) => {
      if (!file) return
      if (!file.type.startsWith('image/')) {
        setFileError('Chỉ nhận file ảnh (JPG, PNG). Bác chọn lại một tấm ảnh nhé.')
        return
      }
      cancelRun()
      setFileError(null)
      setImage((prev) => {
        releaseImage(prev)
        return { url: URL.createObjectURL(file), name: file.name, size: file.size }
      })
      setOutcome(null)
      setSampleId(null)
      setStatus('idle')
    },
    [cancelRun, releaseImage],
  )

  const reset = useCallback(() => {
    cancelRun()
    setImage((prev) => {
      releaseImage(prev)
      return null
    })
    setFileError(null)
    setOutcome(null)
    setSampleId(null)
    setSymptomText('')
    setShowAlternatives(false)
    setStatus('idle')
  }, [cancelRun, releaseImage])

  const analyze = useCallback(() => {
    if (!image) return
    cancelRun()
    const controller = new AbortController()
    abortRef.current = controller
    setStatus('analyzing')
    setShowAlternatives(false)
    setSampleId(null)
    diagnosisProvider
      .analyze({ stage, symptomText }, controller.signal)
      .then((next) => {
        setOutcome(next)
        setStatus('result')
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setStatus('error')
      })
  }, [image, stage, symptomText, cancelRun])

  const loadSample = useCallback(
    (id: string) => {
      const sample = diagnosisProvider.loadSample(id)
      if (!sample) return
      cancelRun()
      setFileError(null)
      setImage((prev) => {
        releaseImage(prev)
        return { url: sample.imageUrl }
      })
      setOutcome({ result: sample.result, review: sample.review })
      setSampleId(id)
      setShowAlternatives(false)
      setStatus('result')
    },
    [cancelRun, releaseImage],
  )

  return {
    image,
    fileError,
    stage,
    symptomText,
    status,
    outcome,
    sampleId,
    showAlternatives,
    selectFile,
    setStage,
    setSymptomText,
    analyze,
    loadSample,
    reset,
    toggleAlternatives: () => setShowAlternatives((v) => !v),
    sampleCases: diagnosisProvider.sampleCases(),
    historyCount: diagnosisProvider.historyCount(),
  }
}
