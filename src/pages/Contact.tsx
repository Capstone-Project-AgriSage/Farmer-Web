import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const contacts = [
    { icon: "support_agent", label: "Tổng đài tư vấn", value: "1900 6828", sub: "7:00 - 20:00 tất cả các ngày", href: "tel:19006828" },
    { icon: "email", label: "Email hỗ trợ", value: "support@agrisage.vn", sub: "Phản hồi trong vòng 2 giờ", href: "mailto:support@agrisage.vn" },
    { icon: "location_on", label: "Trung tâm điều hành", value: "Tòa nhà AgriTech, Khu CNC TP.HCM", sub: "Thứ 2 - Thứ 7: 8:00 - 17:30", href: "#" },
    { icon: "store", label: "Chi nhánh Lâm Đồng", value: "142 Hùng Vương, Di Linh, Lâm Đồng", sub: "Thứ 2 - CN: 7:00 - 20:00", href: "#" },
  ];

  const subjects = [
    "Tư vấn sản phẩm",
    "Hỗ trợ kỹ thuật canh tác",
    "Đăng ký đại lý",
    "Báo lỗi phần mềm",
    "Hỗ trợ đặt hàng",
    "Khác",
  ];

  return (
    <div className="bg-surface-subtle min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-dark to-primary text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">LIÊN HỆ</div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">Đội ngũ AgriSage luôn sẵn sàng hỗ trợ</h1>
          <p className="text-emerald-100/90 text-sm max-w-xl">Kỹ sư nông nghiệp và đội ngũ kỹ thuật của chúng tôi sẵn sàng tư vấn cho bạn từ 7 giờ sáng đến 8 giờ tối mỗi ngày.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact info */}
          <div className="lg:col-span-4 space-y-4">
            {contacts.map((c) => (
              <a key={c.label} href={c.href} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-border-subtle shadow-sm hover:shadow-md hover:border-primary transition-all group">
                <div className="w-11 h-11 rounded-lg bg-primary-light flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[22px]">{c.icon}</span>
                </div>
                <div>
                  <div className="text-xs text-text-muted font-medium mb-0.5">{c.label}</div>
                  <div className="text-sm font-bold text-text-primary">{c.value}</div>
                  <div className="text-xs text-text-muted mt-0.5">{c.sub}</div>
                </div>
              </a>
            ))}

            {/* Live chat indicator */}
            <div className="bg-primary rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse"></span>
                <span className="text-sm font-bold">Chat trực tuyến với kỹ sư</span>
              </div>
              <p className="text-xs text-emerald-100/90 mb-3">Kết nối ngay với kỹ sư nông nghiệp đang trực tuyến. Phản hồi trong dưới 2 phút.</p>
              <button className="w-full py-2 bg-white text-primary-dark text-xs font-bold rounded-lg hover:bg-emerald-50 transition-colors">
                Bắt đầu chat ngay
              </button>
            </div>

            {/* Social */}
            <div className="bg-white rounded-xl border border-border-subtle shadow-sm p-4">
              <div className="text-xs font-bold text-text-muted mb-3">Kết nối với AgriSage</div>
              <div className="flex gap-2">
                {[
                  { label: "Facebook", icon: "👥" },
                  { label: "Zalo OA", icon: "💬" },
                  { label: "YouTube", icon: "▶️" },
                  { label: "TikTok", icon: "🎵" },
                ].map((s) => (
                  <button key={s.label} className="flex-1 flex flex-col items-center gap-1 p-2 bg-surface-subtle rounded-lg hover:bg-primary-light hover:text-primary transition-colors text-xs font-medium text-text-secondary">
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-border-subtle shadow-sm p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-status-success-surface flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-[40px] text-status-success">check_circle</span>
                  </div>
                  <h2 className="text-xl font-bold text-text-primary mb-2">Gửi thành công!</h2>
                  <p className="text-text-secondary text-sm mb-6">Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 2 giờ làm việc.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", subject: "", message: "" }); }} className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-hover transition-colors">
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-text-primary mb-6">Gửi yêu cầu hỗ trợ</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-text-primary mb-1.5">Họ và tên *</label>
                        <input
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary bg-white focus:outline-none focus:border-primary"
                          placeholder="Nguyễn Văn An"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-text-primary mb-1.5">Số điện thoại *</label>
                        <input
                          required
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary bg-white focus:outline-none focus:border-primary"
                          placeholder="0912 345 678"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1.5">Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary bg-white focus:outline-none focus:border-primary"
                        placeholder="example@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1.5">Chủ đề *</label>
                      <select
                        required
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary bg-white focus:outline-none focus:border-primary"
                      >
                        <option value="">-- Chọn chủ đề --</option>
                        {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1.5">Nội dung *</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary bg-white focus:outline-none focus:border-primary resize-none"
                        placeholder="Mô tả chi tiết vấn đề bạn cần hỗ trợ..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Đang gửi...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">send</span>
                          <span>Gửi yêu cầu</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* FAQ */}
            <div className="mt-6 bg-white rounded-2xl border border-border-subtle shadow-sm p-6">
              <h3 className="font-bold text-text-primary text-base mb-4">Câu hỏi thường gặp</h3>
              <div className="space-y-3">
                {[
                  { q: "Làm thế nào để đặt hàng với số lượng lớn?", a: "Liên hệ hotline 1900 6828 hoặc gửi email để được tư vấn giá đặc biệt và hỗ trợ hạn mức tín dụng cho đơn hàng lớn." },
                  { q: "AgriSage có giao hàng toàn quốc không?", a: "Có, chúng tôi giao hàng toàn quốc. Khu vực Tây Nguyên và ĐBSCL có dịch vụ giao tận vườn trong 2-4 giờ." },
                  { q: "Bác sĩ AI có mất phí không?", a: "Hoàn toàn miễn phí cho bà con nông dân. Bạn có thể sử dụng không giới hạn số lần chẩn đoán." },
                  { q: "Làm thế nào để trở thành đại lý AgriSage?", a: "Điền form đăng ký đại lý hoặc gọi hotline. Đội ngũ kinh doanh sẽ liên hệ trong vòng 24 giờ." },
                ].map((faq, i) => (
                  <details key={i} className="group border border-border-subtle rounded-lg">
                    <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-semibold text-text-primary hover:text-primary transition-colors list-none">
                      {faq.q}
                      <span className="material-symbols-outlined text-[18px] text-text-muted group-open:rotate-180 transition-transform">expand_more</span>
                    </summary>
                    <div className="px-4 pb-3 text-sm text-text-secondary leading-relaxed">{faq.a}</div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
