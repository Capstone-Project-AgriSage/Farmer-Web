// The ONLY file the diagnosis screens use to reach sample data. There is no diagnosis API yet; when there is one, replace the
// bodies of these functions (keeping the signatures) and the screens do not change.
import { mockDiagnosisCases } from '../../../data/mockDiagnosisCases'
import { products } from '../../../data/mockProducts'
import type { Product } from '../../../types'
import { diagnosisScenarios } from '../diagnosisScenarios'
import type { DiagnosisScenario, RiceStageValue } from '../model'

export interface AnalyzeInput {
  stage: RiceStageValue
  symptomText: string
}

/** What the dealer (or the lack of one) says about a result. */
export interface DiagnosisReview {
  /** A dealer has confirmed or corrected the case, so commercial products are open. */
  verified: boolean
  /** Not enough to conclude: no treatment plan or products are shown. */
  inconclusive: boolean
  reviewerName?: string
  reviewerNote?: string
  products: Product[]
}

export interface DiagnosisOutcome {
  result: DiagnosisScenario
  review: DiagnosisReview
}

export interface SampleCase {
  id: string
  label: string
}

const INCONCLUSIVE_BELOW = 70
const SIMULATED_DELAY_MS = 1500

function reviewForFreshResult(result: DiagnosisScenario): DiagnosisReview {
  const inconclusive = result.confidence < INCONCLUSIVE_BELOW
  return {
    verified: false,
    inconclusive,
    products: inconclusive ? [] : products.filter((p) => p.diseaseTags?.includes(result.diseaseTag)),
  }
}

export const diagnosisProvider = {
  /** Runs a diagnosis. Rejects with an AbortError when the signal fires. The sample answer depends on the growth stage only. */
  analyze(input: AnalyzeInput, signal: AbortSignal): Promise<DiagnosisOutcome> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        const result = diagnosisScenarios[input.stage]
        resolve({ result, review: reviewForFreshResult(result) })
      }, SIMULATED_DELAY_MS)
      signal.addEventListener('abort', () => {
        clearTimeout(timer)
        reject(new DOMException('Aborted', 'AbortError'))
      })
    })
  },

  /** Previously reviewed cases the farmer can open as a demo. */
  sampleCases(): SampleCase[] {
    return mockDiagnosisCases.map((c) => ({ id: c.id, label: c.predictedDiseaseName }))
  },

  historyCount(): number {
    return mockDiagnosisCases.length
  },

  loadSample(id: string): (DiagnosisOutcome & { imageUrl: string }) | null {
    const sample = mockDiagnosisCases.find((c) => c.id === id)
    if (!sample) return null
    const result: DiagnosisScenario = {
      diseaseId: sample.predictedDiseaseId as DiagnosisScenario['diseaseId'],
      diseaseName: sample.verifiedDiseaseName ?? sample.predictedDiseaseName,
      pathogen: 'Tác nhân đã được đại lý kiểm chứng',
      confidence: sample.aiConfidence,
      severity: 'Trung bình',
      symptomsDetected: ['Vết bệnh đặc trưng trên phiến lá lúa', 'Hình ảnh thực tế từ đồng ruộng Thới Lai, Cần Thơ'],
      treatmentSteps: [
        'Giữ mực nước ruộng 3-5cm, tránh ngập úng hoặc cạn nứt',
        'Không bón đạm khi ruộng đang nhiễm bệnh',
        'Phun hoạt chất được thẩm định viên khuyến cáo',
      ],
      alternatives: [],
      diseaseTag: sample.predictedDiseaseId,
    }
    const verified = sample.status === 'CONFIRMED' || sample.status === 'CORRECTED'
    return {
      imageUrl: sample.imageUrl,
      result,
      review: {
        verified,
        inconclusive: sample.status === 'INCONCLUSIVE',
        reviewerName: sample.reviewerName,
        reviewerNote: sample.reviewerNote,
        products: verified ? sample.recommendedProducts : [],
      },
    }
  },
}
