export default function ContentPagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  if (totalPages <= 1) return null
  return <nav aria-label="Phân trang" className="flex justify-center items-center gap-4 mt-8">
    <button className="border px-4 py-2 disabled:opacity-40" disabled={page <= 1} onClick={() => onChange(page - 1)}>Trang trước</button>
    <span>Trang {page} / {totalPages}</span>
    <button className="border px-4 py-2 disabled:opacity-40" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Trang sau</button>
  </nav>
}
