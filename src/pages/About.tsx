export default function About() {
  const stats = [
    { value: "10.000+", label: "Nông hộ tin dùng", icon: "people" },
    { value: "500+", label: "Đại lý đối tác", icon: "store" },
    { value: "120+", label: "Bệnh AI nhận diện", icon: "psychology" },
    { value: "98%", label: "Độ chính xác AI", icon: "verified" },
  ];

  const team = [
    { name: "TS. Nguyễn Văn An", role: "Giám đốc Kỹ thuật Nông nghiệp", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&auto=format", desc: "20 năm kinh nghiệm trong lĩnh vực bảo vệ thực vật và nông dược." },
    { name: "KS. Trần Thị Mai", role: "Trưởng nhóm AI & Data Science", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&auto=format", desc: "Chuyên gia về Computer Vision và mô hình phân loại bệnh cây trồng." },
    { name: "MBA. Lê Hùng", role: "Giám đốc Kinh doanh", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&auto=format", desc: "Xây dựng mạng lưới phân phối vật tư nông nghiệp toàn quốc." },
    { name: "KS. Phạm Thị Lan", role: "Chuyên gia Canh tác Hữu cơ", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&auto=format", desc: "Tư vấn quy trình canh tác sạch và hữu cơ cho vùng Tây Nguyên." },
  ];

  const milestones = [
    { year: "2018", title: "Thành lập AgriSage", desc: "Ra mắt nền tảng quản lý đại lý vật tư nông nghiệp đầu tiên tại Lâm Đồng." },
    { year: "2020", title: "Tích hợp AI đầu tiên", desc: "Triển khai mô hình nhận diện bệnh lá cây đầu tiên với 45 loại bệnh." },
    { year: "2022", title: "Mở rộng toàn quốc", desc: "Phủ sóng 15 tỉnh thành, phục vụ hơn 5.000 nông hộ và 200 đại lý." },
    { year: "2024", title: "AI thế hệ mới", desc: "Nâng cấp mô hình AI lên 120+ bệnh với độ chính xác 98%, tích hợp đề xuất thuốc tự động." },
  ];

  return (
    <div className="bg-surface-subtle">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-primary-dark to-primary py-16 lg:py-24 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&h=600&fit=crop&auto=format" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-emerald-200 mb-6">
            <span className="material-symbols-outlined text-[16px] text-emerald-300">info</span>
            <span>Về chúng tôi</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">
            Kiến tạo nền nông nghiệp số<br className="hidden sm:block" /> Việt Nam bền vững
          </h1>
          <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            AgriSage được thành lập với sứ mệnh đưa công nghệ số và trí tuệ nhân tạo vào tay người nông dân Việt Nam, giúp tăng năng suất, giảm chi phí và hướng đến nền nông nghiệp bền vững.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center p-6 bg-surface-subtle rounded-xl border border-border-subtle">
                <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary mx-auto mb-3">
                  <span className="material-symbols-outlined text-[24px]">{s.icon}</span>
                </div>
                <div className="text-3xl font-extrabold text-primary mb-1">{s.value}</div>
                <div className="text-sm text-text-secondary">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-surface-subtle border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary mb-3">SỨ MỆNH & TẦM NHÌN</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6">Công nghệ phục vụ người nông dân</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-primary flex-shrink-0 mt-1">
                    <span className="material-symbols-outlined text-[20px]">flag</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary mb-1">Sứ mệnh</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">Cung cấp nền tảng toàn diện giúp đại lý vật tư và nông dân quản lý sản xuất hiệu quả, minh bạch và bền vững thông qua công nghệ AI tiên tiến.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-primary flex-shrink-0 mt-1">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary mb-1">Tầm nhìn 2030</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">Trở thành hệ sinh thái nông nghiệp số hàng đầu Đông Nam Á, phục vụ 1 triệu nông hộ với AI chẩn đoán bệnh cây đạt độ chính xác 99.5%.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-primary flex-shrink-0 mt-1">
                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary mb-1">Giá trị cốt lõi</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">Tin cậy - Minh bạch - Đổi mới - Đồng hành. Chúng tôi cam kết đặt lợi ích của người nông dân và đại lý lên hàng đầu trong mọi quyết định.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=700&h=500&fit=crop&auto=format" alt="Nông nghiệp Việt Nam" className="rounded-2xl shadow-xl w-full object-cover" />
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg border border-border-subtle max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">eco</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text-primary">Nông nghiệp bền vững</div>
                    <div className="text-xs text-text-muted">Cam kết canh tác an toàn, thân thiện môi trường</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">HÀNH TRÌNH PHÁT TRIỂN</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">Từ ý tưởng đến nền tảng hàng đầu</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border-subtle" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={m.year} className="relative flex gap-6 items-start">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 z-10 font-bold text-sm border-4 border-white ${i === milestones.length - 1 ? "bg-primary text-white" : "bg-primary-light text-primary"}`}>
                    {m.year}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="font-bold text-text-primary text-base mb-1">{m.title}</h3>
                    <p className="text-sm text-text-secondary">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-surface-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">ĐỘI NGŨ CHUYÊN GIA</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">Đội ngũ dẫn dắt AgriSage</h2>
            <p className="text-text-secondary text-sm mt-3 max-w-2xl mx-auto">Kết hợp giữa chuyên gia nông nghiệp dày dạn kinh nghiệm và các kỹ sư công nghệ AI hàng đầu.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-xl border border-border-subtle overflow-hidden shadow-sm hover:shadow-md transition-all text-center">
                <div className="p-6">
                  <img src={member.img} alt={member.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-primary-light" />
                  <h3 className="font-bold text-text-primary text-sm">{member.name}</h3>
                  <div className="text-xs font-semibold text-primary mt-1 mb-3">{member.role}</div>
                  <p className="text-xs text-text-secondary leading-relaxed">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
