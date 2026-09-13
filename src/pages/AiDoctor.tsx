import { useState, useRef } from "react";
import { Link } from "react-router";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";

interface DiagnosisResult {
  disease: string;
  confidence: number;
  description: string;
  severity: "high" | "medium" | "low";
  alternatives: { name: string; confidence: number }[];
  recommendedProducts: string[];
  treatment: string;
}

const mockDiagnoses: DiagnosisResult[] = [
  {
    disease: "Bệnh thán thư (Anthracnose)",
    confidence: 94,
    description: "Phát hiện bệnh thán thư do nấm Colletotrichum gloeosporioides gây ra. Vết bệnh trên lá có màu nâu đỏ, lan rộng theo hình tròn với quầng vàng bao quanh.",
    severity: "high",
    alternatives: [
      { name: "Bệnh đốm lá vi khuẩn (Xanthomonas sp.)", confidence: 4 },
      { name: "Thiếu vi lượng Magie", confidence: 2 },
    ],
    recommendedProducts: ["p1", "p3"],
    treatment: "Phun Ridomil Gold 68WG hoặc Nativo 750WG, cắt tỉa cành nhiễm bệnh và tiêu hủy. Phun 2-3 lần liên tiếp cách nhau 7-10 ngày. Tránh tưới nước lên tán lá.",
  },
  {
    disease: "Bệnh vàng lá do tuyến trùng",
    confidence: 87,
    description: "Phát hiện triệu chứng vàng lá do tuyến trùng Meloidogyne sp. tấn công bộ rễ. Rễ bị u bướu, suy giảm khả năng hấp thụ dinh dưỡng.",
    severity: "medium",
    alternatives: [
      { name: "Thiếu đạm (N)", confidence: 9 },
      { name: "Bệnh héo rũ Fusarium", confidence: 4 },
    ],
    recommendedProducts: ["p4"],
    treatment: "Tưới thuốc diệt tuyến trùng vào gốc, kết hợp bổ sung phân hữu cơ và nấm Trichoderma để phục hồi đất. Sử dụng King Root Humic để kích thích tái sinh bộ rễ.",
  },
  {
    disease: "Thiếu dinh dưỡng Kali (K)",
    confidence: 78,
    description: "Lá già xuất hiện vết vàng ở mép lá, sau khô cháy từ rìa vào trong. Đặc trưng của triệu chứng thiếu Kali trên cây trồng nhiệt đới.",
    severity: "low",
    alternatives: [
      { name: "Thiếu Magie (Mg)", confidence: 15 },
      { name: "Bệnh đốm lá Cercospora", confidence: 7 },
    ],
    recommendedProducts: ["p2"],
    treatment: "Bón bổ sung Kali Sulphate (SOP) 100-200g/gốc, chia 2-3 lần. Tưới đủ nước để cây hấp thụ dinh dưỡng. Phun phân bón lá chứa Kali để hỗ trợ nhanh.",
  },
];

const cropTypes = ["Sầu riêng", "Cà phê", "Tiêu", "Lúa", "Cà chua", "Dưa hấu", "Nho", "Xoài", "Bưởi", "Nhãn", "Khác"];

export default function AiDoctor() {
  const { addItem } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState("");
  const [symptom, setSymptom] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 2000));
    const random = mockDiagnoses[Math.floor(Math.random() * mockDiagnoses.length)];
    setResult(random);
    setLoading(false);
  };

  const handleAddProduct = (id: string) => {
    const p = products.find((p) => p.id === id);
    if (!p) return;
    addItem({ id: p.id, name: p.name, price: p.price, originalPrice: p.originalPrice, image: p.image, brand: p.brand, unit: p.unit });
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const confidenceColor = (c: number) => c >= 85 ? "bg-status-success" : c >= 60 ? "bg-status-warning" : "bg-status-error";
  const confidenceText = (c: number) => c >= 85 ? "text-status-success" : c >= 60 ? "text-status-warning" : "text-status-error";
  const confidenceBg = (c: number) => c >= 85 ? "bg-status-success-surface" : c >= 60 ? "bg-status-warning-surface" : "bg-status-error-surface";

  const recentCases = [
    { crop: "Sầu riêng", disease: "Thán thư", location: "Lâm Đồng", time: "2 phút trước" },
    { crop: "Cà phê", disease: "Gỉ sắt lá", location: "Đắk Lắk", time: "15 phút trước" },
    { crop: "Tiêu", disease: "Chết nhanh Phytophthora", location: "Gia Lai", time: "32 phút trước" },
  ];

  return (
    <div className="bg-surface-subtle min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-dark to-primary text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-emerald-300">psychology</span>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">TRÍ TUỆ NHÂN TẠO</div>
              <h1 className="text-2xl sm:text-3xl font-bold">Bác sĩ cây trồng AI</h1>
            </div>
          </div>
          <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
            Chụp ảnh hoặc tải ảnh lá, cành, rễ bị bệnh. Hệ thống AI sẽ phân tích và đưa ra chẩn đoán cùng phác đồ điều trị trong vài giây.
          </p>
          <div className="flex flex-wrap gap-4 mt-5">
            <div className="flex items-center gap-2 text-xs text-emerald-200">
              <span className="material-symbols-outlined text-[16px] text-emerald-300">verified</span>
              <span>98% độ chính xác</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-200">
              <span className="material-symbols-outlined text-[16px] text-emerald-300">biotech</span>
              <span>120+ loại bệnh</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-200">
              <span className="material-symbols-outlined text-[16px] text-emerald-300">bolt</span>
              <span>Kết quả trong 3 giây</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-200">
              <span className="material-symbols-outlined text-[16px] text-emerald-300">favorite</span>
              <span>Miễn phí cho nông dân</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Upload panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-border-subtle shadow-sm p-6">
              <h2 className="font-bold text-text-primary text-base mb-4">Tải ảnh cây trồng</h2>

              {/* Upload zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-colors overflow-hidden ${dragOver ? "border-primary bg-primary-light" : preview ? "border-primary bg-primary-light/30" : "border-border-strong hover:border-primary hover:bg-surface-subtle"}`}
              >
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-semibold bg-black/50 px-3 py-1.5 rounded-lg">Thay ảnh khác</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary mb-4">
                      <span className="material-symbols-outlined text-[32px]">add_a_photo</span>
                    </div>
                    <div className="text-sm font-bold text-text-primary mb-1">Chụp ảnh hoặc tải lên</div>
                    <div className="text-xs text-text-muted">Kéo thả ảnh vào đây hoặc nhấn để chọn</div>
                    <div className="text-[11px] text-text-muted mt-2">Hỗ trợ: JPG, PNG, WEBP · Tối đa 10MB</div>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

              {/* Crop select */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-text-primary mb-1.5">Loại cây trồng</label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary bg-white focus:outline-none focus:border-primary"
                >
                  <option value="">-- Chọn loại cây --</option>
                  {cropTypes.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Symptom description */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-text-primary mb-1.5">Mô tả triệu chứng (tùy chọn)</label>
                <textarea
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  rows={3}
                  className="w-full border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-primary bg-white focus:outline-none focus:border-primary resize-none"
                  placeholder="Ví dụ: Lá có vết đốm nâu, cành héo dần, xuất hiện sau trận mưa..."
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!preview || loading}
                className={`w-full mt-4 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${preview && !loading ? "bg-primary hover:bg-primary-hover text-white shadow-sm" : "bg-border-subtle text-text-muted cursor-not-allowed"}`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>AI đang phân tích...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                    <span>Phân tích bệnh ngay</span>
                  </>
                )}
              </button>
            </div>

            {/* Recent cases */}
            <div className="bg-white rounded-2xl border border-border-subtle shadow-sm p-5">
              <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
                Chẩn đoán gần đây
              </h3>
              <div className="space-y-2.5">
                {recentCases.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-text-primary">{c.crop}</span>
                      <span className="text-text-muted"> · {c.disease}</span>
                    </div>
                    <div className="text-right text-text-muted">
                      <div>{c.location}</div>
                      <div>{c.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Result panel */}
          <div className="lg:col-span-7">
            {!result && !loading && (
              <div className="bg-white rounded-2xl border border-border-subtle shadow-sm h-full flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-surface-subtle flex items-center justify-center text-text-muted mb-4">
                  <span className="material-symbols-outlined text-[40px]">document_scanner</span>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Sẵn sàng phân tích</h3>
                <p className="text-sm text-text-muted max-w-xs">Tải ảnh lên và nhấn "Phân tích bệnh ngay" để nhận kết quả chẩn đoán từ AI.</p>
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  {[
                    { icon: "image_search", label: "Nhận diện hình ảnh" },
                    { icon: "biotech", label: "Phân tích nấm bệnh" },
                    { icon: "medication", label: "Đề xuất đơn thuốc" },
                  ].map((f) => (
                    <div key={f.label} className="p-3 bg-surface-subtle rounded-lg">
                      <span className="material-symbols-outlined text-[24px] text-primary block mb-1">{f.icon}</span>
                      <span className="text-[11px] text-text-secondary">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-2xl border border-border-subtle shadow-sm h-full flex flex-col items-center justify-center p-12 text-center">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-primary-light animate-ping" />
                  <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[40px]">psychology</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">AI đang phân tích ảnh...</h3>
                <p className="text-sm text-text-muted">Đang nhận diện mầm bệnh và so sánh với cơ sở dữ liệu 120+ bệnh cây trồng</p>
                <div className="flex gap-1 mt-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Main diagnosis card */}
                <div className="bg-white rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-border-subtle flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-primary">biotech</span>
                      <h2 className="font-bold text-text-primary">Kết quả chẩn đoán AI</h2>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${confidenceBg(result.confidence)} ${confidenceText(result.confidence)}`}>
                      Tin cậy {result.confidence}%
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {preview && (
                        <img src={preview} alt="Ảnh phân tích" className="rounded-xl w-full h-48 object-cover border border-border-subtle" />
                      )}
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-text-muted mb-1">Bệnh được phát hiện</div>
                          <div className="text-lg font-extrabold text-text-primary">{result.disease}</div>
                        </div>
                        <div>
                          <div className="text-xs text-text-muted mb-1.5">Độ tin cậy AI</div>
                          <div className="h-3 bg-surface-secondary rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-1000 ${confidenceColor(result.confidence)}`} style={{ width: `${result.confidence}%` }} />
                          </div>
                          <div className={`text-xs font-bold mt-1 ${confidenceText(result.confidence)}`}>{result.confidence}%</div>
                        </div>
                        <div className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${result.severity === "high" ? "bg-status-error-surface text-status-error" : result.severity === "medium" ? "bg-status-warning-surface text-status-warning" : "bg-status-success-surface text-status-success"}`}>
                          Mức độ: {result.severity === "high" ? "Nghiêm trọng - Cần xử lý ngay" : result.severity === "medium" ? "Trung bình - Theo dõi và điều trị" : "Nhẹ - Phòng ngừa kịp thời"}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{result.description}</p>

                    {/* Alternatives */}
                    <div className="mt-4 p-4 bg-surface-subtle rounded-xl">
                      <div className="text-xs font-bold text-text-muted mb-2">Chẩn đoán thay thế</div>
                      {result.alternatives.map((a) => (
                        <div key={a.name} className="flex items-center justify-between py-1.5 border-b border-border-subtle last:border-b-0">
                          <span className="text-xs text-text-secondary">{a.name}</span>
                          <span className="text-xs font-semibold text-text-muted">{a.confidence}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Treatment */}
                <div className="bg-white rounded-2xl border border-border-subtle shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-[20px] text-primary">medical_services</span>
                    <h3 className="font-bold text-text-primary">Phác đồ điều trị</h3>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{result.treatment}</p>
                </div>

                {/* Recommended products */}
                <div className="bg-white rounded-2xl border border-border-subtle shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-[20px] text-primary">shopping_bag</span>
                    <h3 className="font-bold text-text-primary">Sản phẩm điều trị được đề xuất</h3>
                  </div>
                  <div className="space-y-3">
                    {result.recommendedProducts.map((pid) => {
                      const p = products.find((pr) => pr.id === pid);
                      if (!p) return null;
                      return (
                        <div key={pid} className="flex items-center gap-3 p-3 bg-surface-subtle rounded-xl border border-border-subtle">
                          <img src={p.image} alt={p.name} className="w-14 h-14 object-contain bg-white rounded-lg border border-border-subtle p-1" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-text-muted mb-0.5">{p.brand}</div>
                            <Link to={`/san-pham/${p.slug}`} className="text-sm font-bold text-text-primary hover:text-primary line-clamp-1">{p.name}</Link>
                            <div className="text-sm font-bold text-primary mt-0.5">{p.price.toLocaleString("vi-VN")} đ</div>
                          </div>
                          <button
                            onClick={() => handleAddProduct(pid)}
                            className={`p-2 rounded-lg text-white transition-colors flex-shrink-0 ${addedId === pid ? "bg-status-success" : "bg-primary hover:bg-primary-hover"}`}
                          >
                            <span className="material-symbols-outlined text-[18px]">{addedId === pid ? "check" : "add_shopping_cart"}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-status-info-surface rounded-xl p-4 border border-blue-200 flex gap-3">
                  <span className="material-symbols-outlined text-[20px] text-status-info flex-shrink-0 mt-0.5">info</span>
                  <p className="text-xs text-status-info leading-relaxed">
                    <strong>Lưu ý quan trọng:</strong> Kết quả AI chỉ mang tính tham khảo, không thay thế hoàn toàn tư vấn của kỹ sư nông nghiệp có chứng chỉ. Trong trường hợp bệnh nghiêm trọng hoặc có độ tin cậy &lt;70%, vui lòng liên hệ đường dây tư vấn <strong>1900 6828</strong> để được hỗ trợ trực tiếp.
                  </p>
                </div>

                <button
                  onClick={() => { setResult(null); setPreview(null); setCrop(""); setSymptom(""); }}
                  className="w-full py-3 border border-border-strong rounded-xl text-sm font-semibold text-text-secondary hover:border-primary hover:text-primary transition-colors"
                >
                  Chẩn đoán lại với ảnh khác
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
