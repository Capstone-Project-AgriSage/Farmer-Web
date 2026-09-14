import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { formatVnd } from '../../data/format'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { confidenceTone } from '../ai-doctor/diagnosisScenarios'

const creditLimit = 50000000

type DebtStatus = 'Bình thường' | 'Sắp đến hạn' | 'Đến hạn' | 'Quá hạn' | 'Đã thanh toán'

interface DebtEntry {
  orderCode: string
  date: string
  dueDate: string
  amount: number
  status: DebtStatus
}

const debtLedger: DebtEntry[] = [
  { orderCode: '#DH-2024-8842', date: '08/10/2024', dueDate: '08/02/2025', amount: 2600000, status: 'Sắp đến hạn' },
  { orderCode: '#DH-2024-8703', date: '30/08/2024', dueDate: '30/12/2024', amount: 890000, status: 'Đã thanh toán' },
  { orderCode: '#DH-2024-8560', date: '15/07/2024', dueDate: '15/11/2024', amount: 1200000, status: 'Đã thanh toán' },
]

function debtStatusClass(status: DebtStatus) {
  switch (status) {
    case 'Quá hạn':
      return 'bg-status-error-surface text-status-error'
    case 'Đến hạn':
    case 'Sắp đến hạn':
      return 'bg-status-warning-surface text-status-warning'
    case 'Đã thanh toán':
      return 'bg-status-success-surface text-status-success'
    default:
      return 'bg-surface-secondary text-text-secondary'
  }
}

const creditUsed = debtLedger
  .filter((entry) => entry.status !== 'Đã thanh toán')
  .reduce((sum, entry) => sum + entry.amount, 0)
const creditPercent = Math.round((creditUsed / creditLimit) * 100)

const orderHistory = [
  {
    code: '#DH-2024-8842',
    date: '08/10/2024',
    status: 'Đang giao',
    statusClass: 'bg-status-info-surface text-status-info',
    total: 2600000,
    itemsSummary: 'Ridomil Gold 68WG, Đầu Trâu NPK, Humic King Root, Nativo 750WG',
  },
  {
    code: '#DH-2024-8791',
    date: '22/09/2024',
    status: 'Hoàn thành',
    statusClass: 'bg-status-success-surface text-status-success',
    total: 1450000,
    itemsSummary: 'Score 250EC, Đạm Phú Mỹ Hạt Đục',
  },
  {
    code: '#DH-2024-8703',
    date: '30/08/2024',
    status: 'Hoàn thành',
    statusClass: 'bg-status-success-surface text-status-success',
    total: 890000,
    itemsSummary: 'Anvil 5SC, Phân Hữu Cơ Úc Bounce Back',
  },
]

interface DiagnosisHistoryEntry {
  date: string
  crop: string
  diseaseName: string
  confidence: number
  severity: 'Nhẹ' | 'Trung bình' | 'Nặng'
}

const diagnosisHistory: DiagnosisHistoryEntry[] = [
  {
    date: '05/10/2024',
    crop: 'Lúa',
    diseaseName: 'Đạo ôn lá (đốm hình thoi)',
    confidence: 88,
    severity: 'Nặng',
  },
  {
    date: '22/09/2024',
    crop: 'Lúa',
    diseaseName: 'Rầy nâu chích hút giai đoạn đẻ nhánh',
    confidence: 76,
    severity: 'Trung bình',
  },
  {
    date: '30/08/2024',
    crop: 'Lúa',
    diseaseName: 'Vàng lùn, lùn xoắn lá',
    confidence: 58,
    severity: 'Nhẹ',
  },
]

const tabs = [
  { id: 'overview', label: 'Tổng quan', icon: 'dashboard' },
  { id: 'credit', label: 'Sổ nợ mùa vụ', icon: 'credit_score' },
  { id: 'orders', label: 'Lịch sử đơn hàng', icon: 'receipt_long' },
  { id: 'diagnosis', label: 'Lịch sử chẩn đoán AI', icon: 'psychology' },
] as const

type TabId = (typeof tabs)[number]['id']

function isTabId(value: string | null): value is TabId {
  return tabs.some((tab) => tab.id === value)
}

const latestOrder = orderHistory[0]
const latestDiagnosis = diagnosisHistory[0]

export default function AccountPage() {
  useDocumentTitle('Tài khoản của tôi')
  const [searchParams] = useSearchParams()
  const requestedTab = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<TabId>(isTabId(requestedTab) ? requestedTab : 'overview')

  return (
    <>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Tài khoản của tôi' }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-sm text-center">
              <div className="w-20 h-20 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto text-2xl font-bold">
                NH
              </div>
              <h1 className="text-lg font-bold text-text-primary mt-3">Nguyễn Văn Hùng</h1>
              <p className="text-xs text-text-muted mt-0.5">
                Nông hộ liên kết · Xã Đinh Lạc, Huyện Di Linh, Lâm Đồng
              </p>
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border-subtle text-left text-xs">
                <div>
                  <span className="text-text-muted block">Số điện thoại</span>
                  <span className="font-semibold text-text-primary">0918 234 567</span>
                </div>
                <div>
                  <span className="text-text-muted block">Thành viên từ</span>
                  <span className="font-semibold text-text-primary">Tháng 03/2023</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
              <div className="flex border-b border-border-subtle bg-surface-subtle overflow-x-auto text-xs sm:text-sm font-semibold">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3.5 px-5 sm:px-6 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary bg-white'
                        : 'border-transparent text-text-secondary hover:text-primary hover:bg-white/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {activeTab === 'overview' && (
                <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-border-subtle p-4 space-y-2">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <span className="material-symbols-outlined text-primary text-[18px]">credit_score</span>
                      <span className="text-xs font-bold uppercase tracking-wider">Dư nợ hiện tại</span>
                    </div>
                    <div className="text-lg font-extrabold text-text-primary">{formatVnd(creditUsed)}</div>
                    <div className="text-[11px] text-text-muted">
                      Trong hạn mức {formatVnd(creditLimit)} ({creditPercent}%)
                    </div>
                    <button
                      onClick={() => setActiveTab('credit')}
                      className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
                    >
                      Xem chi tiết
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>

                  <div className="rounded-xl border border-border-subtle p-4 space-y-2">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <span className="material-symbols-outlined text-primary text-[18px]">receipt_long</span>
                      <span className="text-xs font-bold uppercase tracking-wider">Đơn hàng gần nhất</span>
                    </div>
                    <div className="text-sm font-bold text-text-primary font-mono">{latestOrder.code}</div>
                    <div className="text-[11px] text-text-muted">
                      {latestOrder.status} · {formatVnd(latestOrder.total)}
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
                    >
                      Xem chi tiết
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>

                  <div className="rounded-xl border border-border-subtle p-4 space-y-2">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
                      <span className="text-xs font-bold uppercase tracking-wider">Chẩn đoán AI gần nhất</span>
                    </div>
                    <div className="text-sm font-bold text-text-primary line-clamp-1">{latestDiagnosis.diseaseName}</div>
                    <div className="text-[11px] text-text-muted">
                      {latestDiagnosis.crop} · Độ tin cậy {latestDiagnosis.confidence}%
                    </div>
                    <button
                      onClick={() => setActiveTab('diagnosis')}
                      className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
                    >
                      Xem chi tiết
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'credit' && (
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-text-primary">Hạn mức tín dụng mùa vụ</h2>
                    <span className="px-2 py-0.5 rounded bg-status-success-surface text-status-success text-[10px] font-bold">
                      0% Lãi suất
                    </span>
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between text-xs text-text-secondary mb-1.5">
                      <span>
                        Đã sử dụng: <strong className="text-text-primary">{formatVnd(creditUsed)}</strong>
                      </span>
                      <span>
                        Hạn mức: <strong className="text-text-primary">{formatVnd(creditLimit)}</strong>
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-surface-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full ${creditPercent >= 80 ? 'bg-status-warning' : 'bg-primary'}`}
                        style={{ width: `${Math.min(100, creditPercent)}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-text-muted mt-1.5">
                      Đã dùng {creditPercent}% hạn mức · Thanh toán sau mùa thu hoạch
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border-subtle">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-3">
                      Chi tiết các khoản ghi nợ
                    </h3>
                    <div className="space-y-2.5">
                      {debtLedger.map((entry) => (
                        <div
                          key={entry.orderCode}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl border border-border-subtle bg-surface-subtle/50"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-text-primary text-xs">{entry.orderCode}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${debtStatusClass(entry.status)}`}>
                                {entry.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-text-muted mt-1">
                              Ghi nợ ngày {entry.date} · Hạn thanh toán {entry.dueDate}
                            </div>
                          </div>
                          <div className="text-sm font-extrabold text-primary flex-shrink-0">
                            {formatVnd(entry.amount)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="divide-y divide-border-subtle">
                  {orderHistory.map((order) => (
                    <div key={order.code} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-text-primary text-sm">{order.code}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${order.statusClass}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary mt-1 max-w-md">{order.itemsSummary}</p>
                        <span className="text-[11px] text-text-muted">Đặt ngày {order.date}</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-extrabold text-primary">{formatVnd(order.total)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'diagnosis' && (
                <div className="divide-y divide-border-subtle">
                  {diagnosisHistory.map((entry, i) => {
                    const tone = confidenceTone(entry.confidence)
                    return (
                      <div key={i} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-lg ${tone.badgeBg} ${tone.text} flex items-center justify-center flex-shrink-0`}>
                            <span className="material-symbols-outlined text-[20px]">psychology</span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-text-primary">{entry.diseaseName}</div>
                            <div className="text-xs text-text-secondary mt-0.5">
                              Cây trồng: {entry.crop} · Mức độ: {entry.severity}
                            </div>
                            <span className="text-[11px] text-text-muted">Chẩn đoán ngày {entry.date}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 space-y-1.5">
                          <div className={`text-xs font-bold ${tone.text}`}>
                            Độ tin cậy {entry.confidence}%
                          </div>
                          <Link
                            to="/ai-doctor"
                            className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
                          >
                            Chẩn đoán lại
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
