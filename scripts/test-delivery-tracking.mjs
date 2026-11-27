import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'

// F2.8 (FLOW_2 §9a): on the order page a Farmer sees the driver of a delivery that is on its way: map, name, phone and
// the last update; nothing before the trip starts or after it ends. Run against a local Vite server; every API request and
// every map tile is intercepted.
const baseUrl = process.env.TRACKING_TEST_URL || 'http://127.0.0.1:5174'
const modulePath = process.env.TRACKING_PLAYWRIGHT_MODULE
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : 'playwright')
const browser = await chromium.launch({ headless: true, channel: process.env.TRACKING_BROWSER_CHANNEL })
const token = 'tracking.farmer.test'
const id = '00000000-0000-4000-8000-000000000001'
const failures = []
let checks = 0
const pass = (message) => { checks++; console.log('PASS ' + message) }

const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')
const ago = (minutes) => new Date(Date.now() - minutes * 60_000).toISOString()
const point = (latitude, longitude, minutesAgo) => ({ latitude, longitude, accuracyMeters: 8, recordedAt: ago(minutesAgo) })
const address = { recipientName: 'Nông dân kiểm thử', recipientPhone: '0900000000', addressLine: 'Ấp 3', ward: null,
  district: 'Thới Lai', province: 'Cần Thơ', latitude: 10.0452, longitude: 105.7469 }
const order = { id, orderNumber: 'DH-THEO-DOI', source: 'FARMER_WEB', settlementType: 'FULL_PAYMENT', fulfillmentType: 'DELIVERY',
  status: 'CONFIRMED', deliveryAddress: address, subtotalAmount: 100000, totalAmount: 100000, note: null, createdAt: ago(600),
  confirmedAt: ago(500), completedAt: null, cancelledAt: null, cancelReason: null,
  items: [{ id, storeProductId: id, productPackagingId: id, sku: 'VT-01', productName: 'Phân NPK', packagingName: 'Bao 25kg',
    imageUrl: null, quantity: 2, unitPrice: 50000, lineTotalAmount: 100000, fulfilledQuantity: 0, remainingQuantity: 2 }] }
const delivery = (deliveryId, status) => ({ id: deliveryId, deliveryNumber: `DL-${deliveryId}`, status, scheduledAt: ago(300),
  dispatchedAt: ago(60), completedAt: null, assignedTo: { fullName: 'Lê Văn Tài', phoneNumber: '0909000111' },
  items: [{ orderItemId: id, productName: 'Phân NPK', packagingName: 'Bao 25kg', plannedQuantity: 2, deliveredQuantity: 0, remainingQuantity: 2 }],
  attempts: [] })
// The store's region (Mekong Delta + Ho Chi Minh City). Every tile a map loads must lie in it, at province zoom or closer.
const REGION = { south: 8.3, west: 103.8, north: 11.8, east: 107.2 }
const lon2x = (lon, z) => Math.floor(((lon + 180) / 360) * 2 ** z)
const lat2y = (lat, z) => Math.floor(((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * 2 ** z)
const inRegion = ({ z, x, y }) => z >= 9 && x >= lon2x(REGION.west, z) && x <= lon2x(REGION.east, z) && y >= lat2y(REGION.north, z) && y <= lat2y(REGION.south, z)
const tileOf = (url) => { const [z, x, y] = new URL(url).pathname.replace('.png', '').split('/').filter(Boolean).map(Number); return { z, x, y } }

/** Zooms out as far as the map allows and drags it towards the sea; the map must stop at the store's region. */
async function tryToLeaveRegion(page, mapLocator) {
  const zoomOut = mapLocator.locator('.leaflet-control-zoom-out')
  for (let i = 0; i < 10 && !(await zoomOut.evaluate((e) => e.classList.contains('leaflet-disabled'))); i++) {
    await zoomOut.click()
    await page.waitForTimeout(350)
  }
  const stopped = await zoomOut.evaluate((e) => e.classList.contains('leaflet-disabled'))
  const box = await mapLocator.boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + 5, box.y + 5, { steps: 12 })
  await page.mouse.up()
  await page.waitForTimeout(900)
  return stopped
}

const running = (minutesAgo = 0.5) => ({ deliveryId: 'd1', deliveryNumber: 'DL-d1', status: 'OUT_FOR_DELIVERY', inProgress: true,
  attemptNumber: 1, startedAt: ago(20), driver: { fullName: 'Lê Văn Tài', phoneNumber: '0909000111' },
  destination: { latitude: 10.0452, longitude: 105.7469 }, lastPoint: point(10.038, 105.76, minutesAgo),
  trail: [point(10.032, 105.775, 10), point(10.038, 105.76, minutesAgo)] })
const ended = { deliveryId: 'd1', deliveryNumber: 'DL-d1', status: 'DELIVERED', inProgress: false, attemptNumber: null,
  startedAt: null, driver: null, destination: { latitude: 10.0452, longitude: 105.7469 }, lastPoint: null, trail: [] }

async function fixture({ deliveries, tracking, clock = false, viewport = { width: 1440, height: 900 } }) {
  const context = await browser.newContext({ viewport })
  await context.addInitScript((value) => localStorage.setItem('agrisage.farmer_token', value), token)
  const state = { tracking, deliveries, requests: [], tileList: [] }
  await context.route('https://tile.openstreetmap.org/**', (route) => {
    state.tileList.push(tileOf(route.request().url()))
    return route.fulfill({ status: 200, contentType: 'image/png', body: TILE })
  })
  await context.route('**/api/**', async (intercept) => {
    const request = intercept.request()
    const url = new URL(request.url())
    if (!url.pathname.startsWith('/api/')) return intercept.continue()
    const path = url.pathname
    state.requests.push(path)
    const json = (value, status = 200) => intercept.fulfill({ status, contentType: 'application/json', body: JSON.stringify(value) })
    if (path === '/api/realtime/negotiate') return intercept.abort()
    if (request.method() !== 'GET') { failures.push(`Unexpected write ${request.method()} ${path}`); return intercept.abort() }
    if (path === '/api/me/permissions') {
      return json({ role: 'FARMER', storeId: null, roleVersion: 1, memberVersion: null, permissions: ['MY_ORDERS.READ', 'MY_DELIVERIES.READ'] })
    }
    if (path === '/api/me/notifications/unread-count') return json({ count: 0 })
    if (path === `/api/me/orders/${id}`) return json(order)
    if (path === `/api/me/orders/${id}/deliveries`) return json(state.deliveries)
    const match = path.match(/^\/api\/me\/orders\/[^/]+\/deliveries\/([^/]+)\/tracking$/)
    if (match) return json(state.tracking[match[1]] ?? ended)
    return json({ items: [], page: 1, pageSize: 20, totalCount: 0, totalPages: 0 })
  })
  const page = await context.newPage()
  page.on('pageerror', (error) => failures.push(`Page error: ${error.message}`))
  if (clock) await page.clock.install()
  return { context, page, state }
}

const trackingCalls = (state) => state.requests.filter((p) => p.endsWith('/tracking'))

try {
  // A trip on its way: map, driver, phone link, last update.
  const live = await fixture({ deliveries: [delivery('d1', 'OUT_FOR_DELIVERY')], tracking: { d1: running() } })
  await live.page.goto(`${baseUrl}/orders/${id}`)
  const card = live.page.getByTestId('driver-tracking')
  await card.waitFor()
  assert.match(await card.innerText(), /Tài xế đang giao: Lê Văn Tài/)
  assert.match(await live.page.getByTestId('driver-tracking-status').innerText(), /^Cập nhật lúc \d\d:\d\d$/)
  assert.equal(await card.getByRole('link', { name: 'Gọi tài xế' }).getAttribute('href'), 'tel:0909000111')
  await card.locator('.leaflet-container').waitFor()
  await live.page.waitForFunction(() => document.querySelectorAll('[data-testid="driver-tracking"] path.leaflet-interactive').length >= 3)
  assert.equal(await live.page.getByTestId('driver-tracking-map').evaluate((e) => getComputedStyle(e).isolation), 'isolate')
  assert.ok(await live.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1))
  pass('A trip on its way shows the driver, the route, the destination and the last update')

  // The map cannot leave the store's region: zoom out stops at a province and no tile of the open sea is loaded.
  assert.ok(await tryToLeaveRegion(live.page, live.page.getByTestId('driver-tracking-map')), 'zoom out stops at province level')
  assert.deepEqual(live.state.tileList.filter((tile) => !inRegion(tile)), [], 'no tile outside the store region')
  pass("The map stays in the store's region (no open sea, no islands)")
  await live.context.close()

  // A position older than 3 minutes is a lost signal.
  const lost = await fixture({ deliveries: [delivery('d1', 'OUT_FOR_DELIVERY')], tracking: { d1: running(10) } })
  await lost.page.goto(`${baseUrl}/orders/${id}`)
  await lost.page.getByTestId('driver-tracking-status').waitFor()
  assert.match(await lost.page.getByTestId('driver-tracking-status').innerText(), /^Mất tín hiệu từ \d\d:\d\d$/)
  pass('A position older than 3 minutes says the signal is lost')
  await lost.context.close()

  // Read again every 15 s; once the trip ends the card goes and the deliveries are read again.
  const ending = await fixture({ deliveries: [delivery('d1', 'OUT_FOR_DELIVERY')], tracking: { d1: running() }, clock: true })
  await ending.page.goto(`${baseUrl}/orders/${id}`)
  await ending.page.getByTestId('driver-tracking').waitFor()
  const before = trackingCalls(ending.state).length
  const deliveryReads = ending.state.requests.filter((p) => p.endsWith('/deliveries')).length
  ending.state.tracking = { d1: ended }
  ending.state.deliveries = [delivery('d1', 'DELIVERED')]
  await ending.page.clock.runFor(16_000)
  await ending.page.getByTestId('driver-tracking').waitFor({ state: 'detached' })
  assert.ok(trackingCalls(ending.state).length > before, 'read again after 15 s')
  assert.ok(ending.state.requests.filter((p) => p.endsWith('/deliveries')).length > deliveryReads, 'deliveries read again')
  pass('The position is read again every 15 s and the card leaves when the trip ends')
  await ending.context.close()

  // Not on its way yet (or already delivered): no tracking request, no map; on a phone width nothing overflows.
  const quiet = await fixture({ deliveries: [delivery('d1', 'ASSIGNED'), delivery('d2', 'DELIVERED')], tracking: {}, viewport: { width: 390, height: 844 } })
  await quiet.page.goto(`${baseUrl}/orders/${id}`)
  await quiet.page.getByText('DL-d1').waitFor()
  assert.equal(trackingCalls(quiet.state).length, 0)
  assert.equal(await quiet.page.locator('.leaflet-container').count(), 0)
  assert.ok(await quiet.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1))
  pass('A delivery that is not on its way asks for no position')
  await quiet.context.close()
} catch (error) {
  failures.push(error.stack || String(error))
} finally {
  await browser.close()
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
console.log(`Farmer delivery tracking checks passed (${checks})`)
