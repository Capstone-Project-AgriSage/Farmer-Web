import { useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { mockDiagnosisCases } from '../../data/mockDiagnosisCases'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import type { DiagnosisCase } from '../../types'

const statusMeta: Record<DiagnosisCase['status'], { label: string; icon: string; className: string }> = {
  CONFIRMED: {
    label: 'Đã xác nhận',
    icon: 'verified',
    className: 'bg-brand-light border-brand-dark/10 text-brand-green',
  },
  CORRECTED: {
    label: 'Đã hiệu chỉnh',
    icon: 'edit_note',
    className: 'bg-brand-light border-brand-dark/10 text-brand-green',
  },
  PENDING_AGENT_REVIEW: {
    label: 'Chờ thẩm định',
    icon: 'hourglass_top',
    className: 'border-amber-600/40 text-amber-900',
  },
  INCONCLUSIVE: {
    label: 'Không kết luận',
    icon: 'report',
    className: 'border-rose-600/40 text-rose-800',
  },
}

const filters: { id: string; label: string; statuses: DiagnosisCase['status'][] }[] = [
  { id: 'ALL', label: 'Tất cả', statuses: ['CONFIRMED', 'CORRECTED', 'PENDING_AGENT_REVIEW', 'INCONCLUSIVE'] },
  { id: 'REVIEWED', label: 'Đã thẩm định', statuses: ['CONFIRMED', 'CORRECTED'] },
  { id: 'PENDING', label: 'Chờ thẩm định', statuses: ['PENDING_AGENT_REVIEW'] },
  { id: 'INCONCLUSIVE', label: 'Không kết luận', statuses: ['INCONCLUSIVE'] },
]

const isReviewed = (c: DiagnosisCase) => c.status === 'CONFIRMED' || c.status === 'CORRECTED'

export default function DiagnosisHistoryPage() {
  useDocumentTitle('Lịch sử chẩn đoán AI')

  const [filterId, setFilterId] = useState('ALL')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const activeFilter = filters.find((f) => f.id === filterId) ?? filters[0]
  const cases = mockDiagnosisCases.filter((c) => activeFilter.statuses.includes(c.status))

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Bác sĩ cây trồng AI', to: '/ai-doctor' },
          { label: 'Lịch sử chẩn đoán' },
        ]}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 bg-brand-cream">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-helvetica-neue tracking-tight text-brand-dark">
              Lịch Sử Chẩn Đoán AI
            </h1>
            <p className="text-xs sm:text-sm text-brand-dark/60 mt-1">
              {mockDiagnosisCases.length} ca bệnh đã gửi chẩn đoán
            </p>
          </div>
          <Link
            to="/ai-doctor"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-dark text-white hover:bg-brand-dark/90 tracking-wide uppercase text-sm rounded-full transition-colors self-start sm:self-auto shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
            <span>Chẩn đoán mới</span>
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const count = mockDiagnosisCases.filter((c) => f.statuses.includes(c.status)).length
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterId(f.id)}
                className={`px-3 py-1 rounded-full text-xs tracking-wide uppercase border transition-colors ${
                  filterId === f.id
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-white text-brand-dark/70 border-brand-dark/10 hover:border-brand-dark/30 hover:text-brand-dark'
                }`}
              >
                {f.label} ({count})
              </button>
            )
          })}
        </div>

        <div className="bg-white border border-brand-dark/10 divide-y divide-brand-dark/10">
          {cases.length === 0 && (
            <div className="p-8 text-center text-sm text-brand-dark/50">Không có ca chẩn đoán nào.</div>
          )}
          {cases.map((c) => {
            const meta = statusMeta[c.status]
            const isExpanded = expandedId === c.id
            const diseaseName = isReviewed(c) ? (c.verifiedDiseaseName ?? c.predictedDiseaseName) : c.predictedDiseaseName
            return (
              <div key={c.id}>
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : c.id)}
                  className="w-full p-5 md:p-6 flex items-start gap-4 text-left hover:bg-brand-light/50 transition-colors"
                >
                  <img
                    src={c.imageUrl}
                    alt={c.predictedDiseaseName}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover border border-brand-dark/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-helvetica-neue tracking-tight text-sm sm:text-base text-brand-dark">
                        {diseaseName}
                      </span>
                      <span className="text-xs font-mono text-brand-dark/50">({c.id})</span>
                    </div>
                    <div className="text-xs text-brand-dark/60 mt-1">
                      {c.cropStage} · AI tin cậy {c.aiConfidence}%
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] tracking-wide border ${meta.className}`}
                      >
                        <span className="material-symbols-outlined text-[12px]">{meta.icon}</span>
                        {meta.label}
                      </span>
                      <span className="text-[11px] text-brand-dark/50">Gửi lúc {c.createdAt}</span>
                    </div>
                  </div>
                  <span
                    className={`material-symbols-outlined text-brand-dark/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    expand_more
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-5 md:px-6 pb-6 space-y-4 text-xs">
                    <img
                      src={c.imageUrl}
                      alt={c.predictedDiseaseName}
                      className="w-full max-h-80 object-cover border border-brand-dark/10"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-brand-light border border-brand-dark/10">
                        <div className="text-brand-dark/50">AI dự đoán</div>
                        <div className="text-brand-dark mt-0.5">
                          {c.predictedDiseaseName} · {c.aiConfidence}%
                        </div>
                      </div>
                      <div className="p-3 bg-brand-light border border-brand-dark/10">
                        <div className="text-brand-dark/50">Kết luận của đại lý</div>
                        <div className="text-brand-dark mt-0.5">
                          {c.verifiedDiseaseName ?? (c.status === 'PENDING_AGENT_REVIEW' ? 'Đang chờ thẩm định' : 'Chưa kết luận')}
                        </div>
                        {c.reviewedAt && <div className="text-brand-dark/50 mt-0.5">Thẩm định lúc {c.reviewedAt}</div>}
                      </div>
                    </div>

                    {c.reviewerNote && (
                      <div className="p-3 border border-brand-dark/10 text-brand-dark/70 leading-relaxed">
                        <strong className="text-brand-dark">{c.reviewerName ?? 'Đại lý'}:</strong> {c.reviewerNote}
                      </div>
                    )}

                    {c.rejectionReason && (
                      <div className="p-3 border border-rose-600/30 bg-rose-50 text-rose-900 leading-relaxed">
                        <strong>Lý do không kết luận:</strong> {c.rejectionReason}
                      </div>
                    )}

                    {isReviewed(c) && c.recommendedProducts.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-brand-dark/50 tracking-wide uppercase">Thuốc được đề xuất</div>
                        <div className="flex flex-wrap gap-2">
                          {c.recommendedProducts.map((p) => (
                            <Link
                              key={p.slug}
                              to={`/products/${p.slug}`}
                              className="flex items-center gap-2 p-2 pr-3 border border-brand-dark/10 hover:border-brand-dark/30 transition-colors"
                            >
                              <img src={p.image} alt={p.name} className="w-10 h-10 object-contain bg-brand-light" />
                              <span className="text-brand-dark">{p.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
