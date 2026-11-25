import { useEffect, useState } from 'react'
import { exchangesApi, type Exchange, type Exchangeable, type ExchangeRequest } from '../../api/exchangesApi'
import { api } from '../../api/client'

type Product = { id: string; name: string }
type Packaging = { id: string; packagingName: string | null; unitName: string | null; conversionToBase: number; price: number | null }
type Replacement = { storeProductId: string; productPackagingId: string; quantity: number; name: string }
const input = 'border border-slate-300 rounded-lg px-3 py-2 w-full bg-white text-slate-900'
export default function ExchangeRequestForm({ orderId, onCreated }: { orderId: string; onCreated: (exchange: Exchange) => void }) {
 const [source, setSource] = useState<Exchangeable | null>(null)
 const [quantities, setQuantities] = useState<Record<string, number>>({})
 const [reason, setReason] = useState('')
 const [search, setSearch] = useState('')
 const [products, setProducts] = useState<Product[]>([])
 const [product, setProduct] = useState<Product | null>(null)
 const [packagings, setPackagings] = useState<Packaging[]>([])
 const [packaging, setPackaging] = useState('')
 const [quantity, setQuantity] = useState(1)
 const [replacements, setReplacements] = useState<Replacement[]>([])
 const [error, setError] = useState('')
 const [revision, setRevision] = useState(0)
 const [busy, setBusy] = useState(false)
 const [searchBusy, setSearchBusy] = useState(false)
 useEffect(() => {
  let active = true
  exchangesApi.exchangeable(orderId).then(r => { if (active) setSource(r) }).catch(e => { if (active) setError(e.message) })
  return () => { active = false }
 }, [orderId, revision])
 const searchProducts = async () => {
  setSearchBusy(true); setError('')
  try { const r = await api<{ items: Product[] }>(`/api/catalog/products?search=${encodeURIComponent(search)}&pageSize=20`); setProducts(r.items) }
  catch(e) { setError(e instanceof Error ? e.message : 'Không tải được sản phẩm') }
  finally { setSearchBusy(false) }
 }
 const choose = async (id: string) => {
  setProduct(null); setPackagings([]); setPackaging(''); setSearchBusy(true)
  try { const p = await api<Product & { packagings: Packaging[] }>(`/api/catalog/products/${id}`); setProduct(p); setPackagings(p.packagings); setPackaging(p.packagings[0]?.id ?? '') }
  catch(e) { setError(e instanceof Error ? e.message : 'Không tải được quy cách') }
  finally { setSearchBusy(false) }
 }
 const submit = async () => {
  if (!source || busy) return
  const items: ExchangeRequest['items'] = []
  source.items.forEach(i => i.sources.forEach((s, index) => {
   const q = quantities[`${i.orderItemId}:${index}`] ?? 0
   if (q > 0) items.push({ orderItemId: i.orderItemId, returnedBaseQuantity: q, reasonCode: 'OTHER', deliveryItemLotAllocationId: s.deliveryItemLotAllocationId, originalStockMovementItemId: s.originalStockMovementItemId })
  }))
  if (!items.length || !replacements.length || !reason.trim()) { setError('Chọn hàng thu hồi, hàng thay thế và nhập lý do đổi.'); return }
  if (source.items.some(i => i.sources.reduce((sum, _, index) => sum + (quantities[`${i.orderItemId}:${index}`] ?? 0), 0) > i.returnableBaseQuantity)) { setError('Tổng số lượng đổi vượt quá số lượng còn được đổi.'); return }
  setBusy(true); setError('')
  const data = { orderId, reason: reason.trim(), items, replacements: replacements.map(({ storeProductId, productPackagingId, quantity: q }) => ({ storeProductId, productPackagingId, quantity: q })) }
  const json = JSON.stringify(data)
  const storageKey = `exchange-request:${orderId}`
  try {
   let attempt: { json: string; key: string } | null = null
   try { attempt = JSON.parse(sessionStorage.getItem(storageKey) ?? 'null') } catch { /* a new attempt */ }
   if (attempt?.json !== json) attempt = { json, key: crypto.randomUUID() }
   sessionStorage.setItem(storageKey, JSON.stringify(attempt))
   const result = await exchangesApi.create({ ...data, requestKey: attempt!.key })
   sessionStorage.removeItem(storageKey); onCreated(result)
  } catch(e) { setError(e instanceof Error ? e.message : 'Không tạo được yêu cầu đổi hàng') }
  finally { setBusy(false) }
 }
 return <div className="space-y-5 text-slate-900">
  {error && <p role="alert" className="bg-rose-50 text-rose-800 rounded-lg p-3">{error}</p>}
  {!source ? error ? <button type="button" className="border rounded-lg px-4 py-2" onClick={() => { setError(''); setRevision(revision + 1) }}>Tải lại điều kiện đổi hàng</button> : <p>Đang tải điều kiện đổi hàng...</p> : <>
   <h2 className="font-semibold text-lg">Hàng thu hồi từ {source.orderNumber}</h2>
   <p className="text-sm text-slate-600">Nhập số lượng theo đơn vị cơ sở. Các yêu cầu trả/đổi đang xử lý đã được trừ khỏi số còn lại.</p>
   {source.items.map(i => <fieldset key={i.orderItemId} disabled={busy} className="border rounded-xl p-4 space-y-3">
    <legend className="font-semibold px-2">{i.productName}</legend>
    <p className="text-sm">Đã mua: {i.fulfilledBaseQuantity} · Đã trả/đang trả đổi: {i.alreadyReturnedBaseQuantity} · Còn được đổi: {i.returnableBaseQuantity}</p>
    {i.sources.filter(s => s.returnableBaseQuantity > 0).length === 0 && <p>Không còn số lượng đủ điều kiện đổi.</p>}
    {i.sources.map((s, index) => s.returnableBaseQuantity > 0 && <label key={`${s.inventoryLotId}:${index}`} className="grid sm:grid-cols-2 gap-2 items-center">
     <span>Lô {s.lotNumber ?? 'không mã'} · Tối đa {Math.min(s.returnableBaseQuantity, i.returnableBaseQuantity)}</span>
     <input aria-label={`Số lượng đổi ${i.productName}, lô ${s.lotNumber ?? index + 1}`} className={input} type="number" min="0" max={Math.min(s.returnableBaseQuantity, i.returnableBaseQuantity)} step="1" value={quantities[`${i.orderItemId}:${index}`] ?? 0} onChange={e => setQuantities({ ...quantities, [`${i.orderItemId}:${index}`]: Math.max(0, Math.floor(Number(e.target.value))) })} />
    </label>)}
   </fieldset>)}
   <h2 className="font-semibold text-lg">Sản phẩm thay thế</h2>
   <div className="flex gap-2"><input className={input} aria-label="Tên sản phẩm thay thế" placeholder="Tìm tên sản phẩm" value={search} onChange={e => setSearch(e.target.value)} disabled={busy} /><button type="button" className="border rounded-lg px-4 shrink-0" disabled={searchBusy || busy} onClick={searchProducts}>Tìm kiếm</button></div>
   <label className="block">Sản phẩm<select aria-label="Sản phẩm thay thế" className={input} value={product?.id ?? ''} disabled={searchBusy || busy} onChange={e => { if (e.target.value) void choose(e.target.value) }}><option value="">Chọn sản phẩm</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
   {product && <div className="flex flex-wrap gap-3 items-end"><label className="flex-1">Quy cách<select aria-label="Quy cách thay thế" className={input} value={packaging} onChange={e => setPackaging(e.target.value)} disabled={busy}>{packagings.map(p => <option key={p.id} value={p.id}>{p.packagingName ?? p.unitName} ({p.conversionToBase} đơn vị cơ sở)</option>)}</select></label><label>Số lượng<input className={input} type="number" min="1" step="1" value={quantity} disabled={busy} onChange={e => setQuantity(Math.max(1, Math.floor(Number(e.target.value))))} /></label><button type="button" className="border px-4 py-2 rounded-lg" disabled={busy || !packaging} onClick={() => {
    const existing = replacements.find(i => i.storeProductId === product.id && i.productPackagingId === packaging)
    const p = packagings.find(p => p.id === packaging)
    setReplacements(existing ? replacements.map(i => i === existing ? { ...i, quantity: i.quantity + quantity } : i) : [...replacements, { storeProductId: product.id, productPackagingId: packaging, quantity, name: `${product.name} — ${p?.packagingName ?? p?.unitName}` }])
   }}>Thêm</button></div>}
   {replacements.map((i, index) => <div key={`${i.storeProductId}:${i.productPackagingId}`} className="flex justify-between gap-3 border-b py-2"><span>{i.name} × {i.quantity}</span><button type="button" disabled={busy} onClick={() => setReplacements(replacements.filter((_, n) => n !== index))} className="text-rose-700">Bỏ dòng</button></div>)}
   <label className="block">Lý do đổi hàng<textarea className={input} maxLength={1000} rows={3} value={reason} disabled={busy} onChange={e => setReason(e.target.value)} /></label>
   <p className="text-sm text-slate-600">Giá hàng thay thế được cửa hàng xác định khi gửi yêu cầu. Tiền chênh lệch được chốt sau khi kiểm tra hàng và đối trừ công nợ.</p>
   <button type="button" className="bg-emerald-800 text-white rounded-lg px-5 py-3 disabled:opacity-50" disabled={busy || !reason.trim() || !replacements.length} onClick={submit}>{busy ? 'Đang gửi...' : 'Gửi yêu cầu đổi hàng'}</button>
  </>}
 </div>
}
