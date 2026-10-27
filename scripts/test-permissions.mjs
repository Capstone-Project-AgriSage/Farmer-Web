import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'

// Run against a local Vite server/preview. Browser APIs are mocked; production permissions still come from the backend.
const baseUrl = process.env.PERMISSION_TEST_URL || 'http://127.0.0.1:5174'
const modulePath = process.env.PERMISSION_PLAYWRIGHT_MODULE
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : 'playwright')
const browser = await chromium.launch({ headless: true, channel: process.env.PERMISSION_BROWSER_CHANNEL })
const token = 'permission.farmer.test'
const id = '00000000-0000-4000-8000-000000000001'
const product = { id, sku: 'VT-01', name: 'Vật tư kiểm thử', imageUrl: null, categoryId: id,
  categoryName: 'Phân bón', brandName: null, fromPrice: 100000, description: null, usageInstructions: null,
  ingredients: [], packagings: [{ id, unitName: 'Bao', symbol: 'bao', packagingName: 'Bao 25kg',
    conversionToBase: 25, isBaseUnit: false, price: 100000 }] }
const line = { id, storeProductId: id, productPackagingId: id, sku: 'VT-01', productName: product.name,
  packagingName: 'Bao 25kg', imageUrl: null, quantity: 1, unitPrice: 100000, lineTotalAmount: 100000,
  isAvailable: true, unavailableReason: null }
const cart = { id, items: [line], subtotalAmount: 100000, priceListId: id }
const profile = { farmerProfileId: id, userId: id, fullName: 'Nông dân kiểm thử', phoneNumber: '0900000000',
  email: 'farmer@example.test', gender: null, dateOfBirth: null, customerGroup: null, createdAt: '2026-10-09T00:00:00Z' }
const address = { id, recipientName: profile.fullName, recipientPhone: profile.phoneNumber, addressLine: 'Ấp kiểm thử',
  province: 'Cần Thơ', ward: 'Xã kiểm thử', district: '', addressType: 'HOME', isDefault: false, createdAt: profile.createdAt }
const order = { id, orderNumber: 'DH-KIEM-THU', status: 'PENDING_CONFIRMATION', source: 'FARMER_WEB',
  settlementType: 'FULL_PAYMENT', fulfillmentType: 'DELIVERY', totalAmount: 100000, createdAt: profile.createdAt,
  itemCount: 1, items: [{ ...line, quantity: 1, lineTotal: 100000, lineTotalAmount: 100000 }],
  deliveries: [], deliveryAddress: address, note: null }
const pageResult = (items) => ({ items, page: 1, pageSize: 20, totalCount: items.length, totalPages: items.length ? 1 : 0 })
let checks = 0

async function fixture(codes, route = '/cart', { guest = false, fail = false, mobile = false, clock = false } = {}) {
  const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 } })
  if (!guest) await context.addInitScript((value) => localStorage.setItem('agrisage.farmer_token', value), token)
  const state = { codes: [...codes], fail, rejectUpdate: false, requests: [], cart: structuredClone(cart), holdUpdate: null, updateReleased: false }
  await context.route('**/api/**', async (intercept) => {
    const request = intercept.request()
    const url = new URL(request.url())
    if (!url.pathname.startsWith('/api/')) return intercept.continue()
    const path = url.pathname
    state.requests.push({ method: request.method(), path, authorization: request.headers().authorization, body: request.postDataJSON() })
    const json = (value, status = 200) => intercept.fulfill({ status, contentType: 'application/json', body: JSON.stringify(value) })
    if (path === '/api/me/permissions') {
      assert.equal(request.headers().authorization, `Bearer ${token}`)
      return state.fail ? json({ title: 'Unavailable' }, 503)
        : json({ role: 'FARMER', storeId: null, roleVersion: 1, memberVersion: null, permissions: state.codes })
    }
    if (path === '/api/me/notifications/unread-count') return json({ count: 0 })
    if (path === '/api/me/profile') return json(profile)
    if (path === '/api/me/addresses') return json([address])
    if (path.startsWith('/api/me/cart')) {
      if (state.rejectUpdate && request.method() === 'PUT') return json({ title: 'Forbidden' }, 403)
      if (state.holdUpdate && request.method() === 'PUT') {
        const old = structuredClone(state.cart)
        await state.holdUpdate
        await json(old)
        state.updateReleased = true
        return
      }
      return json(state.cart)
    }
    if (path === '/api/me/orders') return json(pageResult([order]))
    if (path.endsWith('/payments')) return json({ orderTotal: 100000, paidAmount: 0, remainingToPay: 100000, payments: [], refunds: [] })
    if (path.endsWith('/deliveries')) return json([])
    if (path.startsWith('/api/me/orders/')) return json(order)
    if (path === '/api/catalog/categories') return json([{ id, name: 'Phân bón', isActive: true, displayOrder: 0, children: [] }])
    if (path === '/api/catalog/products') return json(pageResult([product]))
    if (path.startsWith('/api/catalog/products/')) return json(product)
    if (path === '/api/me/credit') return json({ title: 'Not found' }, 404)
    return json(pageResult([]))
  })
  const page = await context.newPage()
  if (clock) await page.clock.install()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(baseUrl + route)
  return { context, page, state, errors }
}

async function refresh(page, state, codes) {
  state.codes = [...codes]
  const seen = state.requests.filter((request) => request.path === '/api/me/permissions').length
  await page.evaluate(() => window.dispatchEvent(new Event('focus')))
  await page.waitForFunction(() => true)
  await waitUntil(() => state.requests.filter((request) => request.path === '/api/me/permissions').length > seen)
}
async function waitUntil(predicate) {
  for (let i = 0; i < 100; i++) { if (predicate()) return; await new Promise((resolve) => setTimeout(resolve, 20)) }
  throw new Error('Timed out waiting for permission request')
}
async function pass(name, fixture) {
  assert.deepEqual(fixture.errors, [])
  assert.equal(await fixture.page.evaluate(() => localStorage.getItem('agrisage.farmer_token')), token)
  checks++
  console.log('PASS ' + name)
}

try {
  const cartCase = await fixture(['MY_CART.READ'], '/cart', { clock: true })
  const { page, state } = cartCase
  await page.getByText(product.name, { exact: true }).waitFor()
  assert.equal(await page.getByRole('button', { name: /Tăng số lượng/ }).count(), 0)
  assert.equal(await page.getByRole('button', { name: /Xóa tất cả/ }).count(), 0)
  assert.equal(await page.getByRole('button', { name: /Tiến hành đặt hàng/ }).count(), 0)
  assert.equal(await page.locator('header a[href="/orders"]').count(), 0)
  assert.equal(await page.locator('header a[href="/account"]').count(), 0)
  assert.equal(state.requests.filter((request) => request.path === '/api/me/profile').length, 0)
  await pass('cart read-only, menu filtering and no unauthorized profile fetch', cartCase)

  await refresh(page, state, ['MY_CART.READ', 'MY_CART.UPDATE', 'MY_CART.DELETE', 'MY_ORDERS.CHECKOUT'])
  await page.getByRole('button', { name: /Tăng số lượng/ }).waitFor()
  await page.getByRole('button', { name: /Xóa tất cả/ }).waitFor()
  await page.getByRole('button', { name: /Tiến hành đặt hàng/ }).waitFor()
  await page.getByRole('button', { name: /Tăng số lượng/ }).click()
  await waitUntil(() => state.requests.some((request) => request.method === 'PUT'))
  assert.equal(state.requests.find((request) => request.method === 'PUT').body.quantity, 2)
  await pass('grants enable exact cart actions without signing in again', cartCase)

  state.codes = ['MY_CART.READ', 'MY_CART.DELETE']
  state.rejectUpdate = true
  await page.getByRole('button', { name: /Tăng số lượng/ }).click()
  await page.getByRole('button', { name: /Tăng số lượng/ }).waitFor({ state: 'detached' })
  await pass('backend 403 refreshes permissions and hides revoked action', cartCase)

  state.codes = ['MY_CART.READ']
  const reads = state.requests.filter((request) => request.path === '/api/me/permissions').length
  await page.clock.fastForward(15_100)
  assert.equal(state.requests.filter((request) => request.path === '/api/me/permissions').length, reads, 'no idle permission polling')
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('agrisage-realtime-change', { detail: { topic: 'permissions' } })))
  await page.getByRole('button', { name: /Xóa tất cả/ }).waitFor({ state: 'detached' })
  await pass('idle view makes no permission polls and realtime applies revocation', cartCase)
  await page.goto(baseUrl + '/orders')
  await page.getByRole('heading', { name: /chưa được cấp quyền/ }).waitFor()
  assert.equal(state.requests.filter((request) => request.path === '/api/me/orders').length, 0)
  await pass('direct protected route is denied before loading business data', cartCase)
  await cartCase.context.close()

  const homeCase = await fixture(['MY_CART.READ'], '/')
  await homeCase.page.getByRole('region', { name: 'Tài khoản của bạn' }).waitFor()
  const member = homeCase.page.getByRole('region', { name: 'Tài khoản của bạn' })
  assert.equal(await member.locator('a[href="/orders"]').count(), 0)
  assert.equal(await member.locator('a[href="/debt"]').count(), 0)
  assert.equal(await member.locator('a[href="/cart"]').count(), 1)
  assert.equal(await homeCase.page.locator('footer a[href="/debt"]').count(), 0)
  assert.equal(homeCase.state.requests.some((request) => request.path === '/api/me/orders'
    || request.path === '/api/me/debt' || request.path === '/api/me/credit'), false)
  await pass('homepage summaries and footer honor permissions before fetching data', homeCase)
  await homeCase.context.close()

  const raceCase = await fixture(['MY_CART.READ', 'MY_CART.UPDATE'])
  await raceCase.page.getByText(product.name, { exact: true }).waitFor()
  let releaseUpdate
  raceCase.state.holdUpdate = new Promise((resolve) => { releaseUpdate = resolve })
  await raceCase.page.getByRole('button', { name: /Tăng số lượng/ }).click()
  await waitUntil(() => raceCase.state.requests.some((request) => request.method === 'PUT'))
  await refresh(raceCase.page, raceCase.state, [])
  await raceCase.page.getByRole('heading', { name: /chưa được cấp quyền/ }).waitFor()
  raceCase.state.cart.items[0].productName = 'Dữ liệu giỏ hàng mới'
  await refresh(raceCase.page, raceCase.state, ['MY_CART.READ'])
  await raceCase.page.getByText('Dữ liệu giỏ hàng mới', { exact: true }).waitFor()
  releaseUpdate()
  await waitUntil(() => raceCase.state.updateReleased)
  await raceCase.page.getByText('Dữ liệu giỏ hàng mới', { exact: true }).waitFor()
  assert.equal(await raceCase.page.getByText(product.name, { exact: true }).count(), 0)
  await pass('late cart mutation cannot restore data cleared by permission revocation', raceCase)
  await raceCase.context.close()

  const orderCase = await fixture(['MY_ORDERS.READ', 'MY_ORDERS.CANCEL'], '/orders')
  await orderCase.page.getByRole('button', { name: 'Hủy đơn', exact: true }).waitFor()
  await refresh(orderCase.page, orderCase.state, ['MY_ORDERS.READ'])
  await orderCase.page.getByRole('button', { name: 'Hủy đơn', exact: true }).waitFor({ state: 'detached' })
  await refresh(orderCase.page, orderCase.state, [])
  await orderCase.page.getByRole('heading', { name: /chưa được cấp quyền/ }).waitFor()
  await pass('order cancel and current route react to separate revocations', orderCase)
  await orderCase.context.close()

  const accountCase = await fixture(['MY_PROFILE.READ'], '/account')
  await accountCase.page.getByRole('heading', { name: 'Tài khoản của tôi' }).waitFor()
  assert.equal(await accountCase.page.getByRole('button', { name: 'Chỉnh sửa', exact: true }).count(), 0)
  assert.equal(await accountCase.page.getByRole('button', { name: /Thêm địa chỉ/ }).count(), 0)
  assert.equal(await accountCase.page.getByRole('button', { name: 'Xóa', exact: true }).count(), 0)
  await refresh(accountCase.page, accountCase.state, ['MY_PROFILE.READ', 'MY_PROFILE.UPDATE', 'MY_PROFILE.CREATE_ADDRESS', 'MY_PROFILE.DELETE', 'MY_PROFILE.SET_DEFAULT_ADDRESS'])
  await accountCase.page.getByRole('button', { name: /Thêm địa chỉ/ }).click()
  await accountCase.page.getByRole('dialog').waitFor()
  await refresh(accountCase.page, accountCase.state, ['MY_PROFILE.READ'])
  await accountCase.page.getByRole('dialog').waitFor({ state: 'detached' })
  await pass('profile and address permissions hide controls and an open revoked editor', accountCase)
  await accountCase.context.close()

  const paymentCase = await fixture(['MY_ORDERS.READ'], '/orders/' + id)
  await paymentCase.page.getByRole('heading', { name: order.orderNumber, exact: true }).waitFor()
  assert.equal(paymentCase.state.requests.filter((request) => request.path.endsWith('/payments') || request.path.endsWith('/deliveries')).length, 0)
  await refresh(paymentCase.page, paymentCase.state, ['MY_ORDERS.READ', 'MY_PAYMENTS.READ'])
  await waitUntil(() => paymentCase.state.requests.some((request) => request.path.endsWith('/payments')))
  assert.equal(await paymentCase.page.getByRole('button', { name: /qua payOS/ }).count(), 0)
  await refresh(paymentCase.page, paymentCase.state, ['MY_ORDERS.READ', 'MY_PAYMENTS.READ', 'MY_PAYMENTS.CREATE'])
  await paymentCase.page.getByRole('button', { name: /qua payOS/ }).waitFor()
  await pass('payment data and pay action have distinct live permissions', paymentCase)
  await paymentCase.context.close()

  const checkoutCase = await fixture(['MY_CART.READ', 'MY_ORDERS.CHECKOUT'], '/checkout')
  await checkoutCase.page.getByText('Bác chưa được cấp quyền sử dụng phương thức thanh toán. Vui lòng liên hệ cửa hàng để được hỗ trợ.').waitFor()
  assert.equal(await checkoutCase.page.getByRole('button', { name: /Xác nhận đặt hàng ngay/ }).count(), 0)
  assert.equal(await checkoutCase.page.getByText('Chọn từ sổ địa chỉ', { exact: true }).count(), 0)
  assert.equal(checkoutCase.state.requests.some((request) => request.path === '/api/me/profile'
    || request.path === '/api/me/addresses' || request.path === '/api/me/credit'), false)
  await refresh(checkoutCase.page, checkoutCase.state, ['MY_CART.READ', 'MY_ORDERS.CHECKOUT', 'MY_PAYMENTS.CREATE'])
  await checkoutCase.page.getByRole('button', { name: /Xác nhận đặt hàng ngay/ }).waitFor()
  await pass('checkout requires payment authority and avoids ungranted credit/address reads', checkoutCase)
  await checkoutCase.context.close()

  const failCase = await fixture([], '/cart', { fail: true })
  await failCase.page.getByRole('heading', { name: 'Chưa tải được quyền truy cập' }).waitFor()
  assert.equal(failCase.state.requests.filter((request) => request.path === '/api/me/cart').length, 0)
  failCase.state.fail = false
  failCase.state.codes = ['MY_CART.READ']
  await failCase.page.getByRole('button', { name: 'Tải lại quyền' }).click()
  await failCase.page.getByText(product.name, { exact: true }).waitFor()
  await pass('unavailable permissions fail closed and retry recovers', failCase)
  await failCase.context.close()

  const mobileCase = await fixture(['MY_CART.READ'], '/cart', { mobile: true })
  await mobileCase.page.getByRole('button', { name: /Mở.*menu|Mở.*điều hướng/i }).click()
  assert.equal(await mobileCase.page.locator('header a[href="/orders"]').count(), 0)
  assert.equal(await mobileCase.page.locator('header a[href="/debt"]').count(), 0)
  assert.equal(await mobileCase.page.locator('header a[href="/account"]').count(), 0)
  await refresh(mobileCase.page, mobileCase.state, [])
  await mobileCase.page.locator('header a[href="/cart"]').waitFor({ state: 'detached' })
  await pass('mobile menu follows the same permissions', mobileCase)
  await mobileCase.context.close()

  const guestCase = await fixture([], '/products/' + id, { guest: true })
  await guestCase.page.getByRole('button', { name: /Thêm vào giỏ/ }).waitFor()
  await guestCase.page.getByRole('button', { name: /Thêm vào giỏ/ }).click()
  await guestCase.page.getByText('Bác vui lòng đăng nhập để mua hàng.', { exact: true }).waitFor()
  assert.equal(guestCase.state.requests.some((request) => request.path.startsWith('/api/me/')), false)
  assert.deepEqual(guestCase.errors, [])
  checks++
  console.log('PASS guests retain public catalog and sign-in prompt')
  await guestCase.context.close()
  console.log(`${checks} dynamic permission browser checks passed.`)
} finally {
  await browser.close()
}
