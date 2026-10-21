import { useCallback, useEffect, useRef, useState } from 'react'
import { DIAGNOSIS_IMAGE_TYPES, DIAGNOSIS_MAX_BYTES, describeDiagnosisError, diagnosisApi } from '../../api/diagnosisApi'
import type { MyDiagnosisCase } from '../../api/types'
import { useAuth } from '../../context/AuthContext'
import { buildDiagnosisNote, type RiceStageValue } from './model'

export type DiagnosisStatus = 'idle' | 'analyzing' | 'result' | 'error'

export interface PickedImage {
  url: string
  name: string
  size: number
  file: File
}

/**
 * Everything the AI Doctor screen needs, in one place: the photo, the note, and the case the backend answers with.
 * The AI runs inside the upload request (AI_DIAGNOSIS.md 2.0), so the answer already carries the result, or FAILED.
 */
export function useDiagnosis() {
  const { isAuthenticated } = useAuth()
  const [image, setImage] = useState<PickedImage | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [stage, setStage] = useState<RiceStageValue>('tillering')
  const [symptomText, setSymptomText] = useState('')
  const [status, setStatus] = useState<DiagnosisStatus>('idle')
  const [diagnosisCase, setDiagnosisCase] = useState<MyDiagnosisCase | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [retryError, setRetryError] = useState<string | null>(null)
  const [retrying, setRetrying] = useState(false)
  const [historyCount, setHistoryCount] = useState<number | null>(null)
  const imageRef = useRef<PickedImage | null>(null)
  // Answers of a run the farmer has since replaced (new photo, reset) are dropped.
  const runRef = useRef(0)

  useEffect(() => {
    imageRef.current = image
  }, [image])

  useEffect(
    () => () => {
      if (imageRef.current) URL.revokeObjectURL(imageRef.current.url)
    },
    [],
  )

  useEffect(() => {
    if (!isAuthenticated) return
    let live = true
    diagnosisApi.list({ page: 1, pageSize: 1 }).then(
      (page) => {
        if (live) setHistoryCount(page.totalCount)
      },
      () => {},
    )
    return () => {
      live = false
    }
  }, [isAuthenticated])

  const clearCase = useCallback(() => {
    runRef.current += 1
    setDiagnosisCase(null)
    setSubmitError(null)
    setRetryError(null)
    setRetrying(false)
    setStatus('idle')
  }, [])

  const selectFile = useCallback((file: File | undefined) => {
    if (!file) return
    if (!DIAGNOSIS_IMAGE_TYPES.includes(file.type)) {
      setFileError('Chỉ nhận ảnh JPEG, PNG hoặc WebP. Bác chọn lại một tấm ảnh nhé.')
      return
    }
    if (file.size === 0 || file.size > DIAGNOSIS_MAX_BYTES) {
      setFileError(file.size === 0 ? 'Ảnh bị lỗi. Bác chọn ảnh khác nhé.' : 'Ảnh quá lớn (tối đa 5 MB). Bác chọn ảnh nhỏ hơn hoặc chụp lại.')
      return
    }
    setFileError(null)
    setImage((prev) => {
      if (prev) URL.revokeObjectURL(prev.url)
      return { url: URL.createObjectURL(file), name: file.name, size: file.size, file }
    })
    clearCase()
  }, [clearCase])

  const reset = useCallback(() => {
    setImage((prev) => {
      if (prev) URL.revokeObjectURL(prev.url)
      return null
    })
    setFileError(null)
    setSymptomText('')
    clearCase()
  }, [clearCase])

  const analyze = useCallback(() => {
    if (!image || !isAuthenticated) return
    const run = ++runRef.current
    setStatus('analyzing')
    setSubmitError(null)
    setRetryError(null)
    diagnosisApi
      .create(image.file, buildDiagnosisNote(stage, symptomText))
      .then((created) => {
        if (run !== runRef.current) return
        setDiagnosisCase(created)
        setStatus('result')
        setHistoryCount((n) => (n === null ? n : n + 1))
      })
      .catch((err: unknown) => {
        if (run !== runRef.current) return
        setSubmitError(describeDiagnosisError(err, 'create'))
        setStatus('error')
      })
  }, [image, isAuthenticated, stage, symptomText])

  const retry = useCallback(() => {
    if (!diagnosisCase) return
    const run = runRef.current
    setRetrying(true)
    setRetryError(null)
    diagnosisApi
      .retry(diagnosisCase.id)
      .then((next) => {
        if (run === runRef.current) setDiagnosisCase(next)
      })
      .catch((err: unknown) => {
        if (run === runRef.current) setRetryError(describeDiagnosisError(err, 'retry'))
      })
      .finally(() => {
        if (run === runRef.current) setRetrying(false)
      })
  }, [diagnosisCase])

  return {
    isAuthenticated,
    image,
    fileError,
    stage,
    symptomText,
    status,
    diagnosisCase,
    submitError,
    retryError,
    retrying,
    historyCount: isAuthenticated ? historyCount : null,
    selectFile,
    setStage,
    setSymptomText,
    analyze,
    retry,
    reset,
  }
}
