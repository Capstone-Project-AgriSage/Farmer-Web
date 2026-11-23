import Pagination from './Pagination'

export default function ContentPagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  return <Pagination page={page} totalPages={totalPages} onChange={onChange} className="mt-8" />
}
