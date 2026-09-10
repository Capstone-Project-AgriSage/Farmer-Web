import { useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

const REQUEST_TYPES = ['Kỹ thuật canh tác', 'Đặt vật tư', 'Sổ nợ mùa vụ', 'Khác']

export default function ContactPage() {
  useDocumentTitle('Liên hệ')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [requestType, setRequestType] = useState(REQUEST_TYPES[0])
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSent(true)
      setName('')
      setContact('')
      setRequestType(REQUEST_TYPES[0])
      setMessage('')
    }, 1000)
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Liên hệ' }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
              HỖ TRỢ NÔNG DÂN &amp; ĐẠI LÝ
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Liên Hệ Với AgriSage
            </h1>
            <p className="text-sm text-text-secondary mt-2">
              Kỹ sư nông học của chúng tôi luôn sẵn sàng hỗ trợ bà con về kỹ thuật canh tác, đặt vật
              tư và sổ nợ mùa vụ.
            </p>
          </div>
          <Link
            to="/contact/requests"
            className="inline-flex items-center justify-center gap-1.5 self-end px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-lg shadow-sm transition-all shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>Xem yêu cầu đã gửi</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-xl border border-border-subtle p-5 shadow-sm flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-[22px]">support_agent</span>
              <div>
                <div className="text-sm font-bold text-text-primary">Tổng đài kỹ sư tư vấn mùa vụ</div>
                <a href="tel:19006828" className="text-primary font-bold text-lg hover:underline">
                  1900 6828
                </a>
                <div className="text-xs text-text-muted">7:00 - 20:00 tất cả các ngày trong tuần</div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-border-subtle p-5 shadow-sm flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-[22px]">location_on</span>
              <div>
                <div className="text-sm font-bold text-text-primary">Trung tâm điều hành</div>
                <div className="text-xs text-text-secondary mt-0.5">
                  Tòa nhà AgriTech, Khu Công nghệ cao, TP. Hồ Chí Minh
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-border-subtle p-5 shadow-sm flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-[22px]">store</span>
              <div>
                <div className="text-sm font-bold text-text-primary">Chi nhánh Lâm Đồng</div>
                <div className="text-xs text-text-secondary mt-0.5">
                  142 Hùng Vương, TT. Di Linh, Tỉnh Lâm Đồng
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-border-subtle p-5 shadow-sm flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-[22px]">mail</span>
              <div>
                <div className="text-sm font-bold text-text-primary">Email hỗ trợ</div>
                <div className="text-xs text-text-secondary mt-0.5">hotro@agrisage.vn</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-sm">
              {sent ? (
                <div className="p-4 rounded-lg bg-status-success-surface border border-status-success/20 flex items-start gap-2.5 text-sm text-status-success leading-relaxed">
                  <span className="material-symbols-outlined text-[20px] flex-shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>
                    Cảm ơn bà con đã liên hệ! Kỹ sư AgriSage sẽ phản hồi trong thời gian sớm nhất.
                  </span>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Họ và tên
                    </label>
                    <input
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-primary bg-white"
                      type="text"
                      placeholder="Nguyễn Văn Nông"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Email hoặc số điện thoại
                    </label>
                    <input
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-primary bg-white"
                      type="text"
                      placeholder="0912 345 678"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Loại yêu cầu
                    </label>
                    <select
                      className="w-full px-4 py-2.5 rounded-lg border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-primary bg-white"
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                    >
                      {REQUEST_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Nội dung cần hỗ trợ
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-2.5 rounded-lg border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-primary bg-white resize-none"
                      placeholder="Mô tả tình trạng cây trồng, nhu cầu đặt vật tư hoặc câu hỏi của bà con..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    <span>{isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu hỗ trợ'}</span>
                    {!isSubmitting && <span className="material-symbols-outlined text-[18px]">send</span>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
