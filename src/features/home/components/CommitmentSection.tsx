import { handleImageError } from '../../../utils/image'

const commitments = [
  {
    title: 'Tăng năng suất đạt 60-70%',
    image: '/images/commitments/nang-suat.jpg',
  },
  {
    title: 'Sản phẩm hữu cơ An Toàn Tuyệt Đối',
    image: '/images/commitments/huu-co-an-toan.jpg',
  },
  {
    title: 'Tăng giá bán nông sản 4-6 giá',
    image: '/images/commitments/gia-ban.jpg',
  },
  {
    title: 'Hỗ Trợ kỹ thuật 24/7',
    image: '/images/commitments/ho-tro.jpg',
  },
]

export default function CommitmentSection() {
  return (
    <section className="w-full py-12 bg-surface-subtle border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text-primary uppercase tracking-tight mb-2">
            CAM KẾT VỚI NGƯỜI TIÊU DÙNG
          </h2>
          <div className="text-sm sm:text-base font-bold text-text-primary tracking-wider uppercase mb-3">
            KHÔNG PHẢI LÀ TỐT - MÀ LÀ TỐT NHẤT
          </div>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-normal">
            Chúng tôi luôn tâm niệm: không ngừng cải thiện chất lượng sản phẩm, để sản phẩm ngày
            càng tốt hơn. Đáp ứng tốt nhất nhu cầu cũng như tiêu chí: Năng suất - An toàn - Tiết
            Kiệm của bà con.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 justify-items-center max-w-6xl mx-auto">
          {commitments.map((item) => (
            <div
              key={item.title}
              className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-36 md:h-36 lg:w-44 lg:h-44 xl:w-56 xl:h-56 rounded-full overflow-hidden shadow-lg border-4 border-white mx-auto group"
            >
              <img
                src={item.image}
                alt={item.title}
                onError={handleImageError}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex items-end justify-center pb-5 px-3 text-center">
                <span className="text-white font-bold text-sm sm:text-base md:text-lg leading-tight drop-shadow-md">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
