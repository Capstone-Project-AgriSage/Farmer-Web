import { useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

const REQUEST_TYPES = ['Kỹ thuật canh tác', 'Đặt vật tư', 'Sổ nợ mùa vụ', 'Khác']

export default function ContactPage() {
  useDocumentTitle('Liên hệ')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [area, setArea] = useState('')
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
      setArea('')
      setRequestType(REQUEST_TYPES[0])
      setMessage('')
    }, 1000)
  }

  return (
    <div className="bg-brand-cream text-brand-dark">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Liên hệ' }]} />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-14">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-2 font-helvetica-neue">
              Hỗ trợ nông dân &amp; đại lý
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-helvetica-neue tracking-tight text-brand-dark leading-[1.15]">
              Liên hệ với AgriSage
            </h1>
            <p className="text-base text-brand-dark/60 mt-3 leading-relaxed">
              Kỹ sư nông học của chúng tôi luôn sẵn sàng hỗ trợ bà con về kỹ thuật canh tác, đặt vật
              tư và sổ nợ mùa vụ.
            </p>
          </div>
          <Link
            to="/contact/requests"
            className="inline-flex items-center justify-center gap-1.5 self-end px-5 py-2.5 bg-brand-dark hover:bg-brand-green text-white text-xs tracking-wide uppercase rounded-full transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>Xem yêu cầu đã gửi</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          <div className="lg:col-span-5 space-y-4">
            <div className="border border-brand-dark/10 bg-white p-5 flex items-start gap-3">
              <span className="material-symbols-outlined text-brand-dark text-[22px]">support_agent</span>
              <div>
                <div className="text-sm font-medium text-brand-dark">Tổng đài kỹ sư tư vấn mùa vụ</div>
                <a href="tel:19006828" className="text-brand-dark font-helvetica-neue tracking-tight text-lg hover:text-brand-green transition-colors">
                  1900 6828
                </a>
                <div className="text-xs text-brand-dark/50 mt-0.5">7:00 - 20:00 tất cả các ngày trong tuần</div>
              </div>
            </div>
            <div className="border border-brand-dark/10 bg-white p-5 flex items-start gap-3">
              <span className="material-symbols-outlined text-brand-dark text-[22px]">location_on</span>
              <div>
                <div className="text-sm font-medium text-brand-dark">Trung tâm điều hành</div>
                <div className="text-sm text-brand-dark/60 mt-1 leading-relaxed">
                  Tòa nhà AgriTech, Khu Công nghệ cao, TP. Hồ Chí Minh
                </div>
              </div>
            </div>
            <div className="border border-brand-dark/10 bg-white p-5 flex items-start gap-3">
              <span className="material-symbols-outlined text-brand-dark text-[22px]">store</span>
              <div>
                <div className="text-sm font-medium text-brand-dark">Đại lý Vật tư Nông nghiệp Hai Thắng</div>
                <div className="text-sm text-brand-dark/60 mt-1 leading-relaxed">
                  Thị trấn Thới Lai, Huyện Thới Lai, TP. Cần Thơ (ĐBSCL)
                </div>
              </div>
            </div>
            <div className="border border-brand-dark/10 bg-white p-5 flex items-start gap-3">
              <span className="material-symbols-outlined text-brand-dark text-[22px]">mail</span>
              <div>
                <div className="text-sm font-medium text-brand-dark">Email hỗ trợ</div>
                <div className="text-sm text-brand-dark/60 mt-1">hotro@agrisage.vn</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="border border-brand-dark/10 bg-white p-6 md:p-8">
              {sent ? (
                <div className="p-4 border border-brand-dark/10 bg-brand-light flex items-start gap-2.5 text-sm text-brand-dark leading-relaxed">
                  <span className="material-symbols-outlined text-[20px] flex-shrink-0 mt-0.5 text-brand-green">
                    check_circle
                  </span>
                  <span>
                    Cảm ơn bà con đã liên hệ! Kỹ sư AgriSage sẽ phản hồi trong thời gian sớm nhất.
                  </span>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-1.5 font-helvetica-neue">
                      Họ và tên
                    </label>
                    <input
                      required
                      className="w-full px-4 py-2.5 border border-brand-dark/15 text-brand-dark text-sm focus:outline-none focus:border-brand-dark/40 bg-white"
                      type="text"
                      placeholder="Nguyễn Văn Nông"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-1.5 font-helvetica-neue">
                      Email hoặc số điện thoại
                    </label>
                    <input
                      required
                      className="w-full px-4 py-2.5 border border-brand-dark/15 text-brand-dark text-sm focus:outline-none focus:border-brand-dark/40 bg-white"
                      type="text"
                      placeholder="0912 345 678"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-1.5 font-helvetica-neue">
                      Khu vực / Địa chỉ
                    </label>
                    <input
                      required
                      className="w-full px-4 py-2.5 border border-brand-dark/15 text-brand-dark text-sm focus:outline-none focus:border-brand-dark/40 bg-white"
                      type="text"
                      placeholder="Ấp Thới Thuận, TT. Thới Lai, Cần Thơ"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-1.5 font-helvetica-neue">
                      Loại yêu cầu
                    </label>
                    <select
                      className="w-full px-4 py-2.5 border border-brand-dark/15 text-brand-dark text-sm focus:outline-none focus:border-brand-dark/40 bg-white"
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                    >
                      {REQUEST_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-1.5 font-helvetica-neue">
                      Nội dung cần hỗ trợ
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-2.5 border border-brand-dark/15 text-brand-dark text-sm focus:outline-none focus:border-brand-dark/40 bg-white resize-none"
                      placeholder="Mô tả tình trạng cây trồng, nhu cầu đặt vật tư hoặc câu hỏi của bà con..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 bg-brand-dark hover:bg-brand-green text-white text-sm tracking-wide uppercase rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
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
    </div>
  )
}
