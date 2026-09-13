import { Link } from "react-router";
import { useState } from "react";
import { CartItem, useCart } from "../context/CartContext";

function formatPrice(n: number) {
  return n.toLocaleString("vi-VN") + " đ";
}

type CheckoutStep = "cart" | "shipping" | "done";
type PayMethod = "vietqr" | "cod" | "credit";
type OrderSnapshot = {
  items: CartItem[];
  count: number;
  total: number;
  grandTotal: number;
  payMethod: PayMethod;
};

function BreadcrumbBar() {
  return (
    <div className="border-b border-border-subtle bg-white/70">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 text-xs sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-text-muted">
          <span className="material-symbols-outlined text-[15px]">home</span>
          <span>Trang chủ</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span>Giỏ hàng</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="font-black text-text-primary">Đặt hàng & Thanh toán</span>
        </div>
        <div className="hidden items-center gap-1 text-primary sm:flex">
          <span className="material-symbols-outlined text-[15px]">lock</span>
          Thanh toán bảo mật SSL 256-bit
        </div>
      </div>
    </div>
  );
}

function CheckoutSteps({ step }: { step: CheckoutStep }) {
  const done = step === "done";
  const shipping = step === "shipping" || done;

  const itemClass = (active: boolean) => `flex shrink-0 items-center gap-2 whitespace-nowrap ${active ? "text-primary" : "text-text-muted"}`;
  const circleClass = (active: boolean) =>
    `flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${active ? "bg-primary text-white" : "bg-surface-secondary text-text-muted"}`;

  return (
    <div className="overflow-x-auto border-b border-border-subtle bg-white">
      <div className="mx-auto flex h-16 min-w-[760px] max-w-4xl items-center justify-center px-4">
        <div className="flex w-full items-center gap-4 text-xs font-black">
          <div className={itemClass(true)}>
            <span className={circleClass(true)}>
              <span className="material-symbols-outlined text-[17px]">check</span>
            </span>
            <span>1. Giỏ hàng</span>
          </div>
          <div className="h-0.5 flex-1 rounded-full bg-primary" />
          <div className={itemClass(shipping)}>
            <span className={circleClass(shipping)}>
              {done ? <span className="material-symbols-outlined text-[17px]">check</span> : "2"}
            </span>
            <span>2. Giao nhận & Thanh toán</span>
          </div>
          <div className={`h-0.5 flex-1 rounded-full ${done ? "bg-primary" : "bg-border-subtle"}`} />
          <div className={itemClass(done)}>
            <span className={circleClass(done)}>
              {done ? <span className="material-symbols-outlined text-[17px]">check</span> : "3"}
            </span>
            <span>3. Hoàn tất</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartTable({ items, removeItem, updateQty }: { items: CartItem[]; removeItem: (id: string) => void; updateQty: (id: string, qty: number) => void }) {
  return (
    <section className="overflow-x-auto rounded-lg border border-border-subtle bg-white shadow-sm">
      <div className="grid min-w-[760px] grid-cols-[1fr_105px_105px_120px_24px] gap-4 border-b border-border-subtle bg-[#f8fcf6] px-4 py-2.5 text-[10px] font-black uppercase tracking-wide text-text-muted">
        <div>Sản phẩm vật tư</div>
        <div className="text-right">Đơn giá</div>
        <div className="text-center">Số lượng</div>
        <div className="text-right">Thành tiền</div>
        <div />
      </div>
      <div className="min-w-[760px] divide-y divide-border-subtle">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-[1fr_105px_105px_120px_24px] items-center gap-4 px-4 py-3">
            <div className="flex min-w-0 gap-3">
              <Link to={`/san-pham/${item.id}`} className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-white p-1.5">
                <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
              </Link>
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                  <span className="rounded-full bg-primary-light px-2 py-0.5 text-primary">{item.brand}</span>
                  <span className="text-text-muted">{item.unit}</span>
                </div>
                <Link to={`/san-pham/${item.id}`} className="line-clamp-2 text-sm font-black leading-snug text-primary hover:text-primary-hover">
                  {item.name}
                </Link>
                <div className="mt-1 text-xs text-text-muted">Quy cách: {item.unit} | Hàng chính hãng</div>
              </div>
            </div>
            <div className="text-right text-sm font-black text-text-primary">{formatPrice(item.price)}</div>
            <div className="flex justify-center">
              <div className="flex h-7 items-center overflow-hidden rounded-full border border-border-subtle bg-white">
                <button onClick={() => updateQty(item.id, item.quantity - 1)} className="flex h-full w-8 items-center justify-center text-sm font-black text-text-secondary hover:bg-surface-subtle">-</button>
                <span className="w-8 text-center text-sm font-black">{item.quantity}</span>
                <button onClick={() => updateQty(item.id, item.quantity + 1)} className="flex h-full w-8 items-center justify-center text-sm font-black text-text-secondary hover:bg-surface-subtle">+</button>
              </div>
            </div>
            <div className="text-right text-sm font-black text-primary">{formatPrice(item.price * item.quantity)}</div>
            <button onClick={() => removeItem(item.id)} className="justify-self-end text-text-muted hover:text-status-error" aria-label={`Xóa ${item.name}`}>
              <span className="material-symbols-outlined text-[17px]">delete</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function OrderSummary({ items, count, total, grandTotal, button, compact = false }: { items: CartItem[]; count: number; total: number; grandTotal: number; button?: React.ReactNode; compact?: boolean }) {
  return (
    <section className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-black">{compact ? "Đơn hàng của bạn" : "Tóm tắt đơn hàng"}</h2>
        <span className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-bold text-text-muted">({count} sản phẩm)</span>
      </div>

      {compact && (
        <div className="mb-4 divide-y divide-border-subtle border-y border-border-subtle">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-3">
              <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg border border-border-subtle object-contain p-1" />
              <div className="min-w-0 flex-1">
                <div className="line-clamp-1 text-sm font-black">{item.name}</div>
                <div className="text-xs text-text-muted">Số lượng: x{item.quantity} {item.unit.toLowerCase()}</div>
              </div>
              <div className="text-sm font-black">{formatPrice(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3 text-sm">
        <div className="flex justify-between gap-3">
          <span className="text-text-secondary">Tạm tính ({count} sản phẩm):</span>
          <span className="font-black">{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between gap-3 text-primary">
          <span>Giảm giá Voucher mùa vụ:</span>
          <span className="font-black">-50.000 đ</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-text-secondary">Phí vận chuyển xe tải tận vườn:</span>
          <span className="font-black text-primary">Miễn phí</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-text-secondary">Thuế VAT (Hóa đơn đỏ điện tử):</span>
          <span className="font-black text-text-muted">Đã bao gồm</span>
        </div>
      </div>

      <div className="mt-5 border-t border-border-subtle pt-4">
        <div className="flex items-end justify-between">
          <span className="text-sm font-black">Tổng tiền thanh toán:</span>
          <span className="text-2xl font-black text-primary">{formatPrice(grandTotal)}</span>
        </div>
        <div className="mt-1 text-right text-xs font-bold text-primary">Tiết kiệm 50.000 đ cho mùa vụ này</div>
      </div>

      {button}
    </section>
  );
}

function CheckoutCard({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border-subtle bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3 border-b border-border-subtle pb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light text-sm font-black text-primary">{number}</span>
        <h2 className="text-lg font-black">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function CheckoutPage({
  items,
  count,
  total,
  grandTotal,
  shipping,
  setShipping,
  payMethod,
  setPayMethod,
  processing,
  onPlaceOrder,
}: {
  items: CartItem[];
  count: number;
  total: number;
  grandTotal: number;
  shipping: { name: string; phone: string; address: string; note: string };
  setShipping: React.Dispatch<React.SetStateAction<{ name: string; phone: string; address: string; note: string }>>;
  payMethod: PayMethod;
  setPayMethod: React.Dispatch<React.SetStateAction<PayMethod>>;
  processing: boolean;
  onPlaceOrder: () => void;
}) {
  return (
    <>
      <BreadcrumbBar />
      <CheckoutSteps step="shipping" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="space-y-6 lg:col-span-7">
          <CheckoutCard number={1} title="Thông tin người nhận & Địa chỉ vườn">
            <div className="mb-5 grid gap-3 sm:grid-cols-2">
              <button className="rounded-lg border-2 border-primary bg-primary-light/40 p-4 text-left">
                <div className="flex items-center gap-2 text-sm font-black text-primary">
                  <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                  Giao tận vườn / Trang trại
                </div>
                <div className="mt-1 text-xs text-text-muted">Xe tải hoặc bán tải đưa vào tận nơi</div>
              </button>
              <button className="rounded-lg border border-border-subtle p-4 text-left">
                <div className="flex items-center gap-2 text-sm font-black">
                  <span className="material-symbols-outlined text-[18px]">storefront</span>
                  Nhận tại kho Di Linh
                </div>
                <div className="mt-1 text-xs text-text-muted">142 Hùng Vương, TT. Di Linh</div>
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-black">
                Họ và tên người nhận
                <input value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })} className="mt-1 w-full rounded-lg border border-border-subtle bg-[#f8fcf6] px-3 py-2.5 text-sm font-medium outline-none focus:border-primary" placeholder="Nguyễn Văn Hùng" />
              </label>
              <label className="text-xs font-black">
                Số điện thoại liên hệ
                <input value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} className="mt-1 w-full rounded-lg border border-border-subtle bg-[#f8fcf6] px-3 py-2.5 text-sm font-medium outline-none focus:border-primary" placeholder="0918 234 567" />
              </label>
              {["Tỉnh / Thành phố", "Huyện / Thị xã", "Xã / Thị trấn"].map((label, index) => (
                <label key={label} className="text-xs font-black">
                  {label}
                  <select className="mt-1 w-full rounded-lg border border-border-subtle bg-[#f8fcf6] px-3 py-2.5 text-sm font-medium outline-none focus:border-primary">
                    <option>{["Lâm Đồng", "Huyện Di Linh", "Xã Đinh Lạc"][index]}</option>
                  </select>
                </label>
              ))}
              <label className="text-xs font-black sm:col-span-2">
                Địa chỉ cụ thể / Vị trí vườn sầu riêng
                <input value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} className="mt-1 w-full rounded-lg border border-border-subtle bg-[#f8fcf6] px-3 py-2.5 text-sm font-medium outline-none focus:border-primary" placeholder="Số 45 Thôn Tân Lạc..." />
              </label>
              <label className="text-xs font-black sm:col-span-2">
                Ghi chú dặn dò lái xe tải giao hàng
                <textarea value={shipping.note} onChange={(e) => setShipping({ ...shipping, note: e.target.value })} rows={3} className="mt-1 w-full rounded-lg border border-border-subtle bg-[#f8fcf6] px-3 py-2.5 text-sm font-medium outline-none focus:border-primary" placeholder="Đường bê tông xe tải vào được..." />
              </label>
            </div>
          </CheckoutCard>

          <CheckoutCard number={2} title="Phương thức vận chuyển vật tư">
            <div className="space-y-3">
              <div className="rounded-lg border-2 border-primary bg-primary-light/30 p-4">
                <div className="flex items-center justify-between text-sm font-black">
                  <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-primary">radio_button_checked</span> Xe tải giao tận vườn AgriExpress</span>
                  <span className="text-primary">0 đ</span>
                </div>
                <p className="mt-1 pl-7 text-xs text-text-muted">Chuyên chở phân bón, bao nặng 50kg, hỗ trợ bốc xếp xuống tận kho vườn.</p>
              </div>
              <div className="rounded-lg border border-border-subtle p-4">
                <div className="flex items-center justify-between text-sm font-black">
                  <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-text-muted">radio_button_unchecked</span> Giao hỏa tốc xe ba gác</span>
                  <span>+45.000 đ</span>
                </div>
              </div>
            </div>
          </CheckoutCard>

          <CheckoutCard number={3} title="Phương thức thanh toán">
            <div className="space-y-3">
              <button onClick={() => setPayMethod("vietqr")} className={`w-full rounded-lg border p-4 text-left ${payMethod === "vietqr" ? "border-primary bg-primary-light/30" : "border-border-subtle"}`}>
                <div className="flex items-center justify-between text-sm font-black">
                  <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-primary">{payMethod === "vietqr" ? "radio_button_checked" : "radio_button_unchecked"}</span> Chuyển khoản VietQR / Napas 247</span>
                  <span className="material-symbols-outlined text-[18px] text-primary">qr_code_2</span>
                </div>
                {payMethod === "vietqr" && (
                  <div className="mt-4 grid gap-4 rounded-lg bg-white/70 p-4 sm:grid-cols-[150px_1fr]">
                    <div className="rounded-lg border border-border-subtle bg-white p-3 text-center">
                      <div className="flex h-28 items-center justify-center rounded-md bg-primary-light">
                        <span className="material-symbols-outlined text-[58px] text-primary">qr_code_2</span>
                      </div>
                      <div className="mt-2 text-xs font-black text-primary">VietQR Napas247</div>
                    </div>
                    <div className="space-y-2 text-sm">
                      {[
                        ["Ngân hàng:", "Vietcombank (VCB)"],
                        ["Chủ tài khoản:", "CTCP NÔNG NGHIỆP SỐ AGRISAGE"],
                        ["Số tiền:", formatPrice(grandTotal)],
                        ["Nội dung CK:", "AGR8842"],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between border-b border-border-subtle pb-2">
                          <span className="text-text-muted">{label}</span>
                          <strong>{value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </button>
              {[
                ["cod", "Thanh toán tiền mặt khi nhận hàng (COD)", "payments"],
                ["credit", "Sổ nợ mùa vụ AgriCredit", "credit_score"],
              ].map(([key, label, icon]) => (
                <button key={key} onClick={() => setPayMethod(key as PayMethod)} className={`flex w-full items-center justify-between rounded-lg border p-4 text-left text-sm font-black ${payMethod === key ? "border-primary bg-primary-light/30" : "border-border-subtle"}`}>
                  <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-text-muted">{payMethod === key ? "radio_button_checked" : "radio_button_unchecked"}</span>{label}</span>
                  <span className="material-symbols-outlined text-[18px] text-primary">{icon}</span>
                </button>
              ))}
            </div>
          </CheckoutCard>
        </div>

        <aside className="lg:col-span-5">
          <div className="sticky top-20">
            <OrderSummary
              compact
              items={items}
              count={count}
              total={total}
              grandTotal={grandTotal}
              button={
                <button onClick={onPlaceOrder} disabled={processing} className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-base font-black uppercase text-white shadow-sm hover:bg-primary-hover disabled:opacity-70">
                  <span className="material-symbols-outlined text-[20px]">verified_user</span>
                  {processing ? "Đang xử lý..." : "Xác nhận đặt hàng ngay"}
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              }
            />
          </div>
        </aside>
      </div>
    </>
  );
}

function SuccessPage({ order }: { order: OrderSnapshot | null }) {
  const total = order?.grandTotal ?? 2600000;
  const payLabel = order?.payMethod === "cod" ? "Tiền mặt" : order?.payMethod === "credit" ? "AgriCredit" : "VietQR Napas";

  return (
    <>
      <BreadcrumbBar />
      <CheckoutSteps step="done" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="relative min-h-[430px] overflow-hidden rounded-2xl border border-border-subtle bg-white px-5 py-8 text-center shadow-sm">
          <div className="absolute -right-16 -top-24 h-52 w-52 rounded-full bg-primary-light/70" />
          <div className="absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-primary-light/70" />
          <div className="relative mx-auto max-w-[680px]">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-light">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                <span className="material-symbols-outlined text-[30px]">check</span>
              </div>
            </div>
            <div className="mb-2 inline-flex rounded-full bg-primary-light px-4 py-1 text-[11px] font-black uppercase tracking-wide text-primary">Xác nhận thành công - đã ghi nhận vào kho Di Linh</div>
            <h1 className="text-[27px] font-black leading-tight text-text-primary">Cảm ơn Bác nông dân Nguyễn Văn Hùng!</h1>
            <p className="mx-auto mt-2 max-w-[620px] text-sm leading-relaxed text-text-secondary">
              Đơn hàng <strong className="text-primary">#AGR-8842</strong> của Bác đã được tiếp nhận thành công trên hệ sinh thái AgriSage.
              Bộ phận kho vận đang xuất bao bì và chuẩn bị điều xe tải giao vật tư đến tận vườn.
            </p>

            <div className="mx-auto mt-6 h-px max-w-[620px] bg-border-subtle" />

            <div className="mx-auto mt-5 grid max-w-[620px] gap-3 sm:grid-cols-4">
              {[
                ["Mã đơn hàng", "#AGR-8842"],
                ["Tổng thanh toán", formatPrice(total)],
                ["Phương thức", payLabel],
                ["Dự kiến giao", "Sáng mai (trước 11h)"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-[#f2f8f1] p-3.5 text-left">
                  <div className="text-[10px] font-black uppercase text-text-muted">{label}</div>
                  <div className="mt-2 text-sm font-black text-primary">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-border-subtle bg-white px-5 text-sm font-black text-text-secondary shadow-sm hover:border-primary hover:text-primary">
                <span className="material-symbols-outlined text-[18px]">print</span>
                In phiếu giao nhận & hóa đơn
              </button>
              <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-black text-white shadow-sm hover:bg-primary-hover">
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                Theo dõi xe giao hàng
              </button>
            </div>
            <Link to="/san-pham" className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg border border-primary bg-white px-5 text-sm font-black text-primary hover:bg-primary-light">
              <span className="material-symbols-outlined text-[17px]">storefront</span>
              Tiếp tục mua hàng
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

export default function Cart() {
  const { items, removeItem, updateQty, total, clear, count } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [shipping, setShipping] = useState({ name: "Nguyễn Văn Hùng", phone: "0918 234 567", address: "Số 45 Thôn Tân Lạc, gần dốc ngã ba vườn sầu riêng Chú Năm", note: "Đường bê tông xe tải 5 tấn vào được tận sân kho, vui lòng liên hệ Chú Năm trước khi xuất bến 30 phút." });
  const [payMethod, setPayMethod] = useState<PayMethod>("vietqr");
  const [processing, setProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderSnapshot | null>(null);

  const voucherDiscount = total > 0 ? 50000 : 0;
  const grandTotal = Math.max(0, total - voucherDiscount);

  const handlePlaceOrder = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setCompletedOrder({ items, count, total, grandTotal, payMethod });
    setProcessing(false);
    setCheckoutStep("done");
    clear();
  };

  if (checkoutStep === "done") {
    return (
      <div className="min-h-screen bg-[#f3faf2] text-text-primary">
        <SuccessPage order={completedOrder} />
      </div>
    );
  }

  if (checkoutStep === "shipping") {
    return (
      <div className="min-h-screen bg-[#f3faf2] text-text-primary">
        <CheckoutPage
          items={items}
          count={count}
          total={total}
          grandTotal={grandTotal}
          shipping={shipping}
          setShipping={setShipping}
          payMethod={payMethod}
          setPayMethod={setPayMethod}
          processing={processing}
          onPlaceOrder={handlePlaceOrder}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3faf2] text-text-primary">
      <BreadcrumbBar />
      <CheckoutSteps step="cart" />

      {items.length === 0 ? (
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <span className="material-symbols-outlined text-[72px] text-text-muted">shopping_cart</span>
          <h1 className="mt-4 text-2xl font-black">Giỏ hàng đang trống</h1>
          <p className="mt-2 text-sm text-text-muted">Hãy thêm sản phẩm vào giỏ để tiếp tục đặt hàng.</p>
          <Link to="/san-pham" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-black text-white hover:bg-primary-hover">
            <span className="material-symbols-outlined text-[18px]">store</span>
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h1 className="flex items-center gap-2 text-xl font-black">
              <span className="material-symbols-outlined text-[23px] text-primary">shopping_basket</span>
              Giỏ hàng của bạn
              <span className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-bold text-text-muted">({count} sản phẩm)</span>
            </h1>
            <button onClick={clear} className="flex items-center gap-1 text-xs font-bold text-status-error hover:underline">
              <span className="material-symbols-outlined text-[15px]">delete</span>
              Xóa tất cả
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-5 lg:col-span-8">
              <CartTable items={items} removeItem={removeItem} updateQty={updateQty} />
              <section className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
                <h2 className="mb-3 text-sm font-black uppercase text-text-muted">Mã ưu đãi mùa vụ / Voucher AgriSage</h2>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex min-h-11 flex-1 items-center gap-2 rounded-lg border border-border-subtle bg-[#f8fcf6] px-3 text-sm font-black text-primary">
                    <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                    VUMUA2024
                  </div>
                  <button className="rounded-lg bg-primary px-5 py-3 text-sm font-black text-white hover:bg-primary-hover">Áp dụng</button>
                  <Link to="/san-pham" className="inline-flex items-center justify-center gap-1 rounded-lg px-4 py-3 text-sm font-black text-primary hover:bg-primary-light">
                    <span className="material-symbols-outlined text-[17px]">arrow_back</span>
                    Tiếp tục chọn mua vật tư nông nghiệp
                  </Link>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Mã "VUMUA2024" đã áp dụng: Giảm 50.000 đ cho đơn hàng mùa mưa
                </div>
              </section>
            </div>

            <aside className="space-y-5 lg:col-span-4">
              <OrderSummary
                items={items}
                count={count}
                total={total}
                grandTotal={grandTotal}
                button={
                  <button onClick={() => setCheckoutStep("shipping")} className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-xs font-black uppercase text-white hover:bg-primary-hover">
                    Tiến hành đặt hàng & thanh toán
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                }
              />
              <section className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[22px] text-primary">support_agent</span>
                  <div className="flex-1">
                    <div className="text-sm font-black">Kỹ sư tư vấn liều lượng & phối trộn</div>
                    <div className="text-xs text-text-muted">Miễn phí đơn thuốc bảo vệ thực vật trước khi giao</div>
                  </div>
                  <a href="tel:19006828" className="text-sm font-black text-primary">1900 6828</a>
                </div>
              </section>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
