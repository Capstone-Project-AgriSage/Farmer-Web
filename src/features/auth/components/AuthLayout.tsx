import type { ReactNode } from 'react'

interface AuthLayoutProps {
  showTags?: boolean
  children: ReactNode
}

export default function AuthLayout({ showTags = false, children }: AuthLayoutProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-card border border-border-subtle overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-10 overflow-hidden bg-primary-dark text-white">
          <img
            alt="Canh tác nông nghiệp công nghệ cao AgriCARE-AI"
            className="absolute inset-0 w-full h-full object-cover object-center transform scale-105 filter brightness-90 transition-transform duration-1000"
            src="https://lh3.googleusercontent.com/aida/AEtjO1XzPDIGa2bO0wTeb-qH9o0xB04yV1sz7MTLvdEDqjZ7PifIKfhiQLdXgaqJN-HpmBP87Fkiuqgch2c5EemEpPU9DwGIVax9vM7PaXEij5b6_jmxLkkWrwm5vckRFsMgg8X4JO9xhjZkTT0Gxytd8zc_ksfCLYT6XB5i34vXYVll4wHKtgwB3VQ4Q9gOUTkKpyUx-ZKzVh2zC3lGDkpEEB2NdrXh1-QhQftGYTijANaudQuHNqGK9B8iOHJv"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/85 to-primary-dark/45 backdrop-blur-[1px]"></div>
          <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
          <div className="relative z-10 my-auto py-6">
            <h2 className="text-2xl lg:text-3xl font-bold leading-snug tracking-tight text-white mb-4">
              Đồng hành cùng nhà nông &amp; đại lý số hóa mùa vụ.
            </h2>
            <p className="text-emerald-100/80 text-sm leading-relaxed mb-6 font-normal">
              Giải pháp toàn diện quản lý tồn kho, công nợ và chẩn đoán bệnh cây trồng bằng AI.
            </p>
            {showTags && (
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-100 text-xs font-medium border border-white/15">
                  <span className="material-symbols-outlined text-[14px] text-emerald-300">inventory</span>{' '}
                  Quản lý kho số
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-100 text-xs font-medium border border-white/15">
                  <span className="material-symbols-outlined text-[14px] text-emerald-300">psychology</span>{' '}
                  Trợ lý AI nông nghiệp
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white">
          <div className="max-w-md w-full mx-auto my-auto py-2">{children}</div>
        </div>
      </div>
    </div>
  )
}
