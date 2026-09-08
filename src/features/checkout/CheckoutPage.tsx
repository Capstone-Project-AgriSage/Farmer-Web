import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatVnd } from '../../data/format'
import { useCart } from '../../context/CartContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { handleImageError } from '../../utils/image'

const VOUCHER_DISCOUNT = 50000

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  useDocumentTitle('Thanh toán đơn hàng')
  const [deliveryMode, setDeliveryMode] = useState<'garden' | 'pickup'>('garden')
  const [shippingMethod, setShippingMethod] = useState<'truck' | 'express'>('truck')
  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'cod' | 'credit'>('vietqr')
  const [copiedField, setCopiedField] = useState<'account' | 'memo' | null>(null)

  const copyToClipboard = (field: 'account' | 'memo', value: string) => {
    const markCopied = () => {
      setCopiedField(field)
      setTimeout(() => setCopiedField((f) => (f === field ? null : f)), 1500)
    }

    const fallbackCopy = () => {
      const textarea = document.createElement('textarea')
      textarea.value = value
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      try {
        document.execCommand('copy')
        markCopied()
      } catch {
        // Clipboard access unavailable in this environment; ignore silently.
      }
      document.body.removeChild(textarea)
    }

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(value).then(markCopied, fallbackCopy)
    } else {
      fallbackCopy()
    }
  }

  const discount = items.length > 0 ? VOUCHER_DISCOUNT : 0
  const shippingFee = shippingMethod === 'express' ? 45000 : 0
  const total = subtotal - discount + shippingFee

  const handleConfirm = () => {
    clearCart()
    navigate('/order-success')
  }

  return (
    <>
      <div className="w-full bg-surface-secondary border-b border-border-subtle py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
              <Link className="hover:text-primary transition-colors flex items-center gap-1" to="/">
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span>Trang chủ</span>
              </Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <Link className="hover:text-primary transition-colors" to="/cart">
                Giỏ hàng
              </Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-text-primary font-semibold">Đặt hàng &amp; Thanh toán</span>
            </nav>
            <div className="text-xs text-text-muted flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-status-success">lock</span>
              <span>Thanh toán bảo mật SSL 256-bit</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-white border-b border-border-subtle py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-status-success text-white flex items-center justify-center text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-text-primary">1. Giỏ hàng</span>
            </div>
            <div className="flex-1 h-0.5 bg-status-success mx-3 sm:mx-6"></div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold ring-4 ring-emerald-50">
                2
              </div>
              <span className="text-xs sm:text-sm font-bold text-primary">2. Giao nhận &amp; Thanh toán</span>
            </div>
            <div className="flex-1 h-0.5 bg-border-subtle mx-3 sm:mx-6"></div>
            <div className="flex items-center gap-2 text-text-muted">
              <div className="w-7 h-7 rounded-full bg-surface-secondary border border-border-subtle flex items-center justify-center text-xs font-medium">
                3
              </div>
              <span className="text-xs sm:text-sm font-medium">3. Hoàn tất</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            {/* BLOCK 1: Recipient info */}
            <div className="bg-white rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-primary flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h2 className="text-base font-bold text-text-primary">Thông tin người nhận &amp; Địa chỉ vườn</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <label
                  onClick={() => setDeliveryMode('garden')}
                  className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
                    deliveryMode === 'garden' ? 'border-2 border-primary bg-emerald-50/50' : 'border border-border-subtle bg-white hover:bg-surface-subtle transition-colors'
                  }`}
                >
                  <input readOnly checked={deliveryMode === 'garden'} className="text-primary focus:ring-0 w-4 h-4" name="delivery_mode" type="radio" />
                  <div>
                    <div className={`text-xs flex items-center gap-1 ${deliveryMode === 'garden' ? 'font-bold text-primary' : 'font-semibold text-text-primary'}`}>
                      <span className="material-symbols-outlined text-[16px]">agriculture</span>
                      Giao tận vườn / Trang trại
                    </div>
                    <p className="text-[11px] text-text-muted">Xe tải hoặc bán tải đưa vào tận nơi</p>
                  </div>
                </label>
                <label
                  onClick={() => setDeliveryMode('pickup')}
                  className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                    deliveryMode === 'pickup' ? 'border-2 border-primary bg-emerald-50/50' : 'border border-border-subtle bg-white hover:bg-surface-subtle'
                  }`}
                >
                  <input readOnly checked={deliveryMode === 'pickup'} className="text-primary focus:ring-0 w-4 h-4" name="delivery_mode" type="radio" />
                  <div>
                    <div className="text-xs font-semibold text-text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">store</span>
                      Nhận tại kho Di Linh
                    </div>
                    <p className="text-[11px] text-text-muted">142 Hùng Vương, TT. Di Linh</p>
                  </div>
                </label>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1.5">
                      Họ và tên người nhận <span className="text-status-error">*</span>
                    </label>
                    <input
                      className="w-full px-3.5 py-2 text-xs font-medium bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-primary"
                      type="text"
                      defaultValue="Nguyễn Văn Hùng"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1.5">
                      Số điện thoại liên hệ <span className="text-status-error">*</span>
                    </label>
                    <input
                      className="w-full px-3.5 py-2 text-xs font-medium bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-primary"
                      type="tel"
                      defaultValue="0918 234 567"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1.5">
                      Tỉnh / Thành phố <span className="text-status-error">*</span>
                    </label>
                    <select className="w-full px-3 py-2 text-xs font-medium bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-primary">
                      <option>Lâm Đồng</option>
                      <option>Đắk Lắk</option>
                      <option>Đồng Nai</option>
                      <option>Gia Lai</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1.5">
                      Huyện / Thị xã <span className="text-status-error">*</span>
                    </label>
                    <select className="w-full px-3 py-2 text-xs font-medium bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-primary">
                      <option>Huyện Di Linh</option>
                      <option>Huyện Đức Trọng</option>
                      <option>TP. Bảo Lộc</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1.5">
                      Xã / Thị trấn <span className="text-status-error">*</span>
                    </label>
                    <select className="w-full px-3 py-2 text-xs font-medium bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-primary">
                      <option>Xã Đinh Lạc</option>
                      <option>Xã Gia Hiệp</option>
                      <option>Thị trấn Di Linh</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1.5">
                    Địa chỉ cụ thể / Vị trí vườn sầu riêng <span className="text-status-error">*</span>
                  </label>
                  <input
                    className="w-full px-3.5 py-2 text-xs font-medium bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-primary"
                    type="text"
                    defaultValue="Số 45 Thôn Tân Lạc (gần dốc ngã ba vườn sầu riêng Chú Năm)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-text-muted">local_shipping</span>
                    Ghi chú dặn dò lái xe tải giao hàng
                  </label>
                  <textarea
                    className="w-full px-3.5 py-2 text-xs font-medium bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-primary"
                    rows={2}
                    defaultValue="Đường bê tông xe tải 5 tấn vào được tận sân kho, vui lòng liên hệ Chú Năm trước khi xuất bến 30 phút."
                  />
                </div>
              </div>
            </div>

            {/* BLOCK 2: Shipping method */}
            <div className="bg-white rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2.5 pb-4 border-b border-border-subtle mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-primary flex items-center justify-center font-bold text-sm">2</div>
                <h2 className="text-base font-bold text-text-primary">Phương thức vận chuyển vật tư</h2>
              </div>
              <div className="space-y-3">
                <label
                  onClick={() => setShippingMethod('truck')}
                  className={`relative flex items-start justify-between p-4 rounded-xl cursor-pointer ${
                    shippingMethod === 'truck' ? 'border-2 border-primary bg-emerald-50/40' : 'border border-border-subtle hover:bg-surface-subtle transition-colors'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input readOnly checked={shippingMethod === 'truck'} className="text-primary focus:ring-0 mt-0.5 w-4 h-4" name="shipping_method" type="radio" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-text-primary">Xe tải giao tận vườn AgriExpress</span>
                        <span className="px-2 py-0.5 rounded bg-status-success text-white font-bold text-[10px]">MIỄN PHÍ</span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">
                        Chuyên chở phân bón, bao nặng 50kg, hỗ trợ bốc xếp xuống tận kho vườn.
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-[11px] text-primary font-semibold">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        Dự kiến giao: Sáng mai (trước 11h)
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-status-success uppercase sm:text-sm">0 đ</span>
                </label>
                <label
                  onClick={() => setShippingMethod('express')}
                  className={`relative flex items-start justify-between p-4 rounded-xl cursor-pointer transition-colors ${
                    shippingMethod === 'express' ? 'border-2 border-primary bg-emerald-50/40' : 'border border-border-subtle hover:bg-surface-subtle'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input readOnly checked={shippingMethod === 'express'} className="text-primary focus:ring-0 mt-0.5 w-4 h-4" name="shipping_method" type="radio" />
                    <div>
                      <span className="text-xs font-bold text-text-primary">Giao hỏa tốc xe ba gác / Bán tải cơ động</span>
                      <p className="text-xs text-text-secondary mt-1">
                        Giao nhanh trong 2 - 4 giờ cho trường hợp cần phun trừ bệnh khẩn cấp.
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-text-muted">
                        <span className="material-symbols-outlined text-[14px]">bolt</span>
                        Giao ngay trong ngày
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-text-primary">+45.000 đ</span>
                </label>
              </div>
            </div>

            {/* BLOCK 3: Payment method */}
            <div className="bg-white rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2.5 pb-4 border-b border-border-subtle mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-primary flex items-center justify-center font-bold text-sm">3</div>
                <h2 className="text-base font-bold text-text-primary">Phương thức thanh toán</h2>
              </div>
              <div className="space-y-4">
                <div className={`rounded-xl p-4 bg-white ${paymentMethod === 'vietqr' ? 'border-2 border-primary' : 'border border-border-subtle'}`}>
                  <label onClick={() => setPaymentMethod('vietqr')} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input readOnly checked={paymentMethod === 'vietqr'} className="text-primary focus:ring-0 w-4 h-4" name="payment_method" type="radio" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-text-primary">Chuyển khoản VietQR / Napas 247</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-primary font-bold text-[10px]">Khuyên dùng</span>
                        </div>
                        <p className="text-[11px] text-text-muted mt-0.5">
                          Quét mã mọi ứng dụng ngân hàng, hệ thống tự động duyệt tức thì sau 5 giây
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-primary text-[22px]">qr_code_2</span>
                  </label>
                  {paymentMethod === 'vietqr' && (
                    <div className="mt-4 pt-4 border-t border-border-subtle bg-surface-subtle rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
                      <div className="flex-shrink-0 bg-white p-3 rounded-xl border border-border-subtle shadow-sm flex flex-col items-center">
                        <div className="w-36 h-36 bg-white border border-border-subtle rounded-lg flex items-center justify-center relative overflow-hidden p-1">
                          <img
                            alt="VietQR Thanh toán AgriSage"
                            className="w-full h-full object-contain"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuALx-dVVzRnd72-ROkUelIQqlcBUHtPe-3DzHWyRw77ufNGnWzWAIrsM6PFWAuFnV1rtfELNZYQfQhvrAR4Q69tVVB3VQD2MfcvhZx4Dj-hQIkyHYdpZgTlIJSMEkK-tAMYAg2Fg2LSwpZtPJBgK8pIBIQS8WYNst_HvcQoiH0HjT-_BGK8EstV07FRKN4w5QZGz5ul9w-3IwWgvSh9fWvE86YovMWC_wSiR6PEAcBqgbRdw73R4x1XRg"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-primary mt-1.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse"></span>
                          VietQR Napas247
                        </span>
                      </div>
                      <div className="flex-1 space-y-2 text-xs w-full">
                        <div className="flex items-center justify-between py-1 border-b border-border-subtle">
                          <span className="text-text-muted">Ngân hàng:</span>
                          <span className="font-bold text-text-primary">Vietcombank (VCB)</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-border-subtle">
                          <span className="text-text-muted">Chủ tài khoản:</span>
                          <span className="font-bold text-text-primary uppercase">CTCP NÔNG NGHIỆP SỐ AGRISAGE</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-border-subtle">
                          <span className="text-text-muted">Số tài khoản:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-primary text-sm">19006828999</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard('account', '19006828999')}
                              className="text-[10px] text-primary hover:underline font-semibold"
                              title="Sao chép số TK"
                            >
                              {copiedField === 'account' ? 'Đã copy' : 'Copy'}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-border-subtle">
                          <span className="text-text-muted">Số tiền:</span>
                          <span className="font-bold text-primary text-sm">{formatVnd(total)}</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-text-muted">Nội dung CK:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-text-primary bg-white px-2 py-0.5 rounded border border-border-subtle">
                              AGR8842
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard('memo', 'AGR8842')}
                              className="text-[10px] text-primary hover:underline font-semibold"
                              title="Sao chép cú pháp"
                            >
                              {copiedField === 'memo' ? 'Đã copy' : 'Copy'}
                            </button>
                          </div>
                        </div>
                        <div className="p-2 rounded bg-status-success-surface text-status-success text-[11px] font-medium flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[14px]">verified</span>
                          Đơn hàng sẽ tự động xác nhận và chuẩn bị xuất kho ngay khi nhận tiền.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`rounded-xl p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'cod' ? 'border-2 border-primary' : 'border border-border-subtle hover:bg-surface-subtle'
                  }`}
                >
                  <label className="flex items-start justify-between cursor-pointer">
                    <div className="flex items-start gap-3">
                      <input readOnly checked={paymentMethod === 'cod'} className="text-primary focus:ring-0 mt-0.5 w-4 h-4" name="payment_method" type="radio" />
                      <div>
                        <span className="text-xs font-bold text-text-primary">Thanh toán tiền mặt khi nhận hàng (COD)</span>
                        <p className="text-xs text-text-secondary mt-1">
                          Bác nông dân được mở thùng kiểm tra bao bì nguyên niêm phong, hạn dùng và
                          tem chống giả Syngenta/Bayer trước khi trả tiền cho tài xế xe tải.
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-text-muted text-[22px]">payments</span>
                  </label>
                </div>
                <div
                  onClick={() => setPaymentMethod('credit')}
                  className={`rounded-xl p-4 cursor-pointer transition-colors bg-surface-secondary/40 ${
                    paymentMethod === 'credit' ? 'border-2 border-primary' : 'border border-border-subtle hover:bg-surface-subtle'
                  }`}
                >
                  <label className="flex items-start justify-between cursor-pointer">
                    <div className="flex items-start gap-3">
                      <input readOnly checked={paymentMethod === 'credit'} className="text-primary focus:ring-0 mt-0.5 w-4 h-4" name="payment_method" type="radio" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-text-primary">Sổ nợ mùa vụ AgriCredit</span>
                          <span className="px-2 py-0.5 rounded bg-status-success-surface text-status-success font-bold text-[10px]">
                            0% Lãi suất
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary mt-1">
                          Hạn mức ghi nợ trả sau mùa thu hoạch nông sản. Áp dụng cho hội viên đại lý
                          và nông hộ liên kết.
                        </p>
                        <div className="mt-2 text-[11px] text-text-secondary flex items-center gap-2">
                          <span>
                            Hạn mức khả dụng: <strong className="text-primary font-bold">50.000.000 đ</strong>
                          </span>
                          <span className="text-status-success font-medium">• Đủ điều kiện thanh toán</span>
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-primary text-[22px]">credit_score</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5 sticky top-20">
            <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <span>Đơn hàng của bạn</span>
                  <span className="text-xs font-semibold text-text-muted bg-surface-secondary px-2 py-0.5 rounded-full">
                    ({items.length} sản phẩm)
                  </span>
                </h2>
                <Link to="/cart" className="text-xs text-primary hover:underline font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">edit</span> Sửa
                </Link>
              </div>
              <div className="divide-y divide-border-subtle max-h-72 overflow-y-auto pr-1 space-y-1">
                {items.map((item) => (
                  <div key={item.product.slug} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-12 h-12 rounded-lg border border-border-subtle bg-surface-subtle p-1 flex-shrink-0 flex items-center justify-center">
                        <img
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                          src={item.product.image}
                          onError={handleImageError}
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-text-primary line-clamp-1">{item.product.name}</h4>
                        <span className="text-[11px] text-text-muted">
                          Số lượng: <strong>x{item.quantity}</strong>
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-text-primary flex-shrink-0">
                      {formatVnd(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-status-success/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-status-success font-semibold">
                  <span className="material-symbols-outlined text-[16px]">loyalty</span>
                  <span>Voucher "VUMUA2024"</span>
                </div>
                <span className="font-bold text-status-success">-{formatVnd(discount)}</span>
              </div>
              <div className="space-y-2.5 text-xs text-text-secondary pt-2 border-t border-border-subtle">
                <div className="flex items-center justify-between">
                  <span>Tạm tính ({items.length} sản phẩm):</span>
                  <span className="font-semibold text-text-primary">{formatVnd(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-status-success">
                  <span>Giảm giá Voucher mùa vụ:</span>
                  <span className="font-bold">-{formatVnd(discount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Phí vận chuyển:</span>
                  <span className="font-bold text-status-success uppercase">
                    {shippingFee === 0 ? 'Miễn phí' : formatVnd(shippingFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Thuế VAT (Hóa đơn đỏ điện tử):</span>
                  <span className="text-text-muted font-medium">Đã bao gồm</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border-subtle">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm font-bold text-text-primary">Tổng tiền thanh toán:</span>
                  <span className="text-2xl font-extrabold text-primary tracking-tight">{formatVnd(total)}</span>
                </div>
                <div className="text-right text-[11px] text-status-success font-medium flex items-center justify-end gap-1">
                  <span className="material-symbols-outlined text-[13px]">trending_down</span>
                  Tiết kiệm {formatVnd(discount)} cho mùa vụ này
                </div>
              </div>
              <button
                onClick={handleConfirm}
                type="button"
                className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover text-white font-bold text-base rounded-xl transition-all shadow-md hover:shadow-floating flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
                <span>XÁC NHẬN ĐẶT HÀNG NGAY</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
              <div className="space-y-2 pt-2 border-t border-border-subtle text-[11px] text-text-secondary">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[15px] text-status-success flex-shrink-0 mt-0.5">verified</span>
                  <span>Cam kết 100% vật tư chính hãng, tem quét QR nguồn gốc rõ ràng.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[15px] text-status-success flex-shrink-0 mt-0.5">sync</span>
                  <span>Đổi trả miễn phí trong 7 ngày nếu bao bể rách do vận chuyển.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[15px] text-status-success flex-shrink-0 mt-0.5">support_agent</span>
                  <span>
                    Kỹ sư nông học hỗ trợ kỹ thuật pha thuốc 24/7 qua <strong>1900 6828</strong>.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
