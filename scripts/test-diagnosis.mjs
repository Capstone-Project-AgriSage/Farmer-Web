import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { pathToFileURL } from 'node:url'

// AI diagnosis on the farmer web (AI_DIAGNOSIS.md 2.0): the AI result shows at once, CONFIDENT with treatments and
// products, UNCERTAIN with neither, FAILED with "Thử lại". Every /api request is faked: no backend, no data written.
//
//   node scripts/test-diagnosis.mjs     (starts its own Vite on DIAGNOSIS_TEST_URL, default http://127.0.0.1:5193)
//   DIAGNOSIS_PLAYWRIGHT_MODULE=<path to playwright-core/index.mjs>  DIAGNOSIS_BROWSER_CHANNEL=msedge  (optional)
const { chromium } = await import(process.env.DIAGNOSIS_PLAYWRIGHT_MODULE ? pathToFileURL(process.env.DIAGNOSIS_PLAYWRIGHT_MODULE).href : 'playwright')
const base = process.env.DIAGNOSIS_TEST_URL || 'http://127.0.0.1:5193'

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', new URL(base).port, '--strictPort'], {
  windowsHide: true,
  stdio: 'pipe',
})
await new Promise((resolve, reject) => {
  const timeout = setTimeout(() => reject(new Error('Vite startup timed out')), 20000)
  server.stdout.on('data', (data) => {
    if (data.toString().includes('Local:')) {
      clearTimeout(timeout)
      resolve()
    }
  })
  server.stderr.on('data', (data) => process.stderr.write(data))
  server.on('exit', (code) => {
    clearTimeout(timeout)
    reject(new Error(`Vite exited with ${code}`))
  })
})

const browser = await chromium.launch({ headless: true, channel: process.env.DIAGNOSIS_BROWSER_CHANNEL })
const failures = []
let checks = 0
const at = '2026-10-21T03:00:00Z'
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64')
const IMAGE = 'data:image/png;base64,' + PNG.toString('base64')

const disease = (code, name) => ({
  id: 'd-' + code, code, name, isHealthy: code === 'HEALTHY', symptoms: 'Vết hình thoi màu nâu xám.', prevention: 'Bón phân cân đối.',
})
const chemical = {
  id: 't1', type: 'CHEMICAL', title: 'Phun thuốc đặc trị đạo ôn', instructions: 'Phun theo nhãn.', precautions: 'Đeo khẩu trang.',
  rankOrder: 1, reason: null, activeIngredientName: 'Tricyclazole',
}
const cultural = { id: 't2', type: 'CULTURAL', title: 'Giữ ruộng thoáng', instructions: 'Tỉa bớt lá.', precautions: null, rankOrder: 2, reason: null, activeIngredientName: null }
const product = { storeProductId: 'sp1', productId: 'p1', name: 'Thuốc Beam 75WP', sku: 'BEAM', imageUrl: null, reason: 'Chứa hoạt chất Tricyclazole', rankOrder: 1 }

const confident = { certainty: 'CONFIDENT', hint: null, disease: disease('LEAF_BLAST', 'Leaf Blast'), reviewerComment: null, treatments: [chemical, cultural], products: [product] }
const uncertain = {
  certainty: 'UNCERTAIN', hint: 'RETAKE_PHOTO_OR_ASK_STORE', disease: disease('BACTERIAL_LEAF_BLIGHT', 'Bacterial Leaf Blight'),
  reviewerComment: null, treatments: [cultural], products: [],
}
const verified = {
  certainty: 'VERIFIED', hint: null, disease: disease('SHEATH_BLIGHT', 'Sheath Blight'), reviewerComment: 'Vết vằn điển hình ở bẹ.',
  treatments: [cultural], products: [product],
}

const caseOf = (id, status, result = null, extra = {}) => ({
  id, caseNumber: 'DG-20261021-' + id.slice(-4).toUpperCase(), status, submittedAt: at, completedAt: result ? at : null,
  farmerNote: 'Giai đoạn: Đẻ nhánh (20-35 ngày sau sạ)',
  image: { id: 'img-' + id, imageUrl: IMAGE, expiresAt: '2099-01-01T00:00:00Z', isPrimary: true, fileName: 'leaf.png', uploadedAt: at },
  result, inconclusive: null, canRetry: status === 'FAILED', ...extra,
})
const listItem = (c) => ({
  id: c.id, caseNumber: c.caseNumber, status: c.status, submittedAt: c.submittedAt, completedAt: c.completedAt,
  diseaseCode: c.result?.disease.code ?? null, diseaseName: c.result?.disease.name ?? null, certainty: c.result?.certainty ?? null,
})

async function check(name, fn) {
  try {
    await fn()
    checks++
    console.log('PASS ' + name)
  } catch (error) {
    failures.push(name)
    console.error('FAIL ' + name + '\n  ' + String(error?.stack ?? error).split('\n').slice(0, 6).join('\n  '))
  }
}

/** A page with every /api call answered from `state`. `signedIn` puts a farmer token in localStorage first. */
async function fixture({ signedIn = true, viewport = { width: 1280, height: 900 }, clock = false } = {}) {
  const context = await browser.newContext({ viewport })
  if (signedIn) await context.addInitScript(() => localStorage.setItem('agrisage.farmer_token', 'diagnosis.test.jwt'))
  const state = {
    cases: {
      'case-conf': caseOf('case-conf', 'AI_COMPLETED', confident),
      'case-unc1': caseOf('case-unc1', 'AI_COMPLETED', uncertain),
      'case-fail': caseOf('case-fail', 'FAILED'),
      'case-ver1': caseOf('case-ver1', 'VERIFIED', verified),
      'case-wait': caseOf('case-wait', 'PROCESSING'),
    },
    listed: ['case-conf', 'case-unc1', 'case-fail'],
    createAnswers: [],
    retryAnswers: [],
    requests: [],
    uploads: [],
  }
  await context.route('**/api/**', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const path = url.pathname
    if (!path.startsWith('/api/')) return route.continue()
    const json = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })
    state.requests.push({ method: request.method(), path, query: Object.fromEntries(url.searchParams) })
    if (path === '/api/me/permissions') return json({ role: 'FARMER', storeId: null, roleVersion: 1, memberVersion: null,
      permissions: ['MY_PROFILE.READ', 'MY_CART.READ', 'MY_DIAGNOSIS.READ', 'MY_DIAGNOSIS.CREATE', 'MY_DIAGNOSIS.CANCEL'] })
    if (path === '/api/auth/login') {
      return json({ accessToken: 'diagnosis.test.jwt', refreshToken: 'r', user: { id: 'u1', fullName: 'Nông dân kiểm thử', role: 'FARMER', phoneNumber: '0901234567' } })
    }
    if (path.startsWith('/api/me/diagnosis-cases')) {
      assert.equal(request.headers().authorization, 'Bearer diagnosis.test.jwt')
      if (path === '/api/me/diagnosis-cases' && request.method() === 'POST') {
        state.uploads.push({ contentType: request.headers()['content-type'], body: request.postDataBuffer()?.toString('utf8') ?? '' })
        const answer = state.createAnswers.shift() ?? { status: 201, body: caseOf('case-new1', 'AI_COMPLETED', confident) }
        if (answer.body?.id) {
          state.cases[answer.body.id] = answer.body
          state.listed.unshift(answer.body.id)
        }
        return json(answer.body, answer.status)
      }
      if (path === '/api/me/diagnosis-cases') {
        const status = url.searchParams.get('status')
        const page = Number(url.searchParams.get('page') || 1)
        const pageSize = Number(url.searchParams.get('pageSize') || 20)
        const rows = state.listed.map((id) => state.cases[id]).filter((c) => !status || c.status === status).map(listItem)
        return json({ items: rows.slice((page - 1) * pageSize, page * pageSize), page, pageSize, totalCount: rows.length, totalPages: Math.ceil(rows.length / pageSize) })
      }
      const [, , , , id, action] = path.split('/')
      const c = state.cases[id]
      if (!c) return json({ title: 'Not Found', status: 404 }, 404)
      if (action === 'retry') {
        const next = state.retryAnswers.shift() ?? { status: 200, body: { ...c, status: 'AI_COMPLETED', result: confident, canRetry: false, completedAt: at } }
        if (next.status === 200) state.cases[id] = next.body
        return json(next.body, next.status)
      }
      if (action === 'cancel') {
        if (!['SUBMITTED', 'PROCESSING', 'FAILED'].includes(c.status)) return json({ title: 'Business rule', status: 422, detail: 'not allowed' }, 422)
        state.cases[id] = { ...c, status: 'CANCELLED', canRetry: false }
        return json(state.cases[id])
      }
      return json(c)
    }
    if (path === '/api/me/profile') return json({ userId: 'u1', fullName: 'Nông dân kiểm thử', phoneNumber: '0901234567' })
    if (path === '/api/me/cart') return json({ id: null, items: [], subtotalAmount: 0, priceListId: null })
    if (path.endsWith('/unread-count')) return json({ count: 0 })
    return json({ items: [], page: 1, pageSize: 20, totalCount: 0, totalPages: 0 })
  })
  const page = await context.newPage()
  if (clock) await page.clock.install()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  return { context, page, state, errors }
}

const pick = (page, name = 'leaf.png', mimeType = 'image/png', buffer = PNG) =>
  page.locator('input[type=file]').first().setInputFiles({ name, mimeType, buffer })
const sendButton = (page) => page.getByRole('button', { name: 'Gửi ảnh để AI chẩn đoán' })
const textOf = async (locator) => (await locator.innerText()).replace(/\s+/g, ' ').trim()
const noHorizontalScroll = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
/** Material Symbols draw a ligature about 1em wide; an icon missing from the subset shows its name as a wide word. */
const iconsAreGlyphs = async (locator) => {
  await locator.page().evaluate(async () => { await document.fonts.ready })
  return locator
    .locator('.material-symbols-outlined')
    .evaluateAll((els) => els.every((el) => el.getBoundingClientRect().width <= parseFloat(getComputedStyle(el).fontSize) * 1.25))
}

async function signIn(page) {
  await page.locator('#emailInput').fill('0901234567')
  await page.locator('#passwordInput').fill('Test@12345678')
  await page.locator('button[type=submit]').click()
}

try {
  await check('guest fills the form, is asked to sign in, and comes back to the AI doctor after logging in', async () => {
    const { context, page, state, errors } = await fixture({ signedIn: false })
    await page.goto(base + '/ai-doctor')
    await page.getByRole('heading', { name: 'Bác Sĩ Cây Trồng AI' }).waitFor()
    assert.equal(await page.getByRole('link', { name: /^Lịch sử/ }).count(), 0, 'a guest has no history link')
    await pick(page)
    await page.getByAltText('Ảnh lá lúa đã chọn').waitFor()
    await page.getByRole('button', { name: 'Đăng nhập để gửi ảnh' }).click()
    await page.waitForURL(/\/login$/)
    await signIn(page)
    await page.waitForURL(/\/ai-doctor$/)
    await page.getByRole('link', { name: 'Lịch sử (3 ca)' }).waitFor()
    assert.equal(state.uploads.length, 0, 'nothing is sent before the farmer signs in')
    assert.deepEqual(errors, [])
    await context.close()
  })

  await check('a protected diagnosis page sends a guest to login and back to that case', async () => {
    const { context, page } = await fixture({ signedIn: false })
    await page.goto(base + '/ai-doctor/cases/case-conf')
    await page.waitForURL(/\/login$/)
    await signIn(page)
    await page.waitForURL(/\/ai-doctor\/cases\/case-conf$/)
    await page.getByTestId('case-number').waitFor()
    await context.close()
  })

  await check('only JPEG, PNG or WebP up to 5 MB is accepted', async () => {
    const { context, page } = await fixture()
    await page.goto(base + '/ai-doctor')
    await pick(page, 'a.gif', 'image/gif')
    await page.getByText('Chỉ nhận ảnh JPEG, PNG hoặc WebP').waitFor()
    assert.equal(await sendButton(page).isDisabled(), true)
    await pick(page, 'big.jpg', 'image/jpeg', Buffer.alloc(5 * 1024 * 1024 + 1))
    await page.getByText('Ảnh quá lớn (tối đa 5 MB)').waitFor()
    await context.close()
  })

  await check('CONFIDENT: multipart upload with the note; result at once with treatments, ingredient and products; no probability', async () => {
    const { context, page, state, errors } = await fixture()
    await page.goto(base + '/ai-doctor')
    await page.getByRole('link', { name: 'Lịch sử (3 ca)' }).waitFor()
    await pick(page)
    await page.getByRole('radio', { name: /Làm đòng/ }).click()
    await page.getByLabel('Mô tả triệu chứng ngoài ruộng').fill('Lá vàng từ chóp')
    await sendButton(page).click()
    const result = page.getByTestId('diagnosis-result')
    await result.waitFor()

    const upload = state.uploads[0]
    assert.match(upload.contentType, /^multipart\/form-data; boundary=/)
    assert.match(upload.body, /name="image"; filename="leaf.png"/)
    assert.match(upload.body, /name="note"\r\n\r\nGiai đoạn: Làm đòng \(40-55 ngày sau sạ\)\. Triệu chứng: Lá vàng từ chóp/)

    assert.match(await textOf(page.getByTestId('diagnosis-certainty')), /Kết quả từ AI$/)
    assert.equal(await textOf(page.getByTestId('diagnosis-disease')), 'Đạo ôn lá')
    await result.getByText('Hoạt chất: Tricyclazole').waitFor()
    await result.getByText('Thuốc / hoá chất').waitFor()
    await result.getByText('có thể chưa chính xác', { exact: false }).waitFor()
    assert.doesNotMatch(await result.innerText(), /%|xác suất|độ tin cậy/i, 'the farmer never sees a probability')
    const products = page.getByTestId('diagnosis-products')
    assert.equal(await products.getByRole('link', { name: /Thuốc Beam 75WP/ }).getAttribute('href'), '/products/sp1')
    assert.equal(await result.getByRole('link', { name: 'Xem chi tiết ca' }).getAttribute('href'), '/ai-doctor/cases/case-new1')
    assert.equal(await page.getByRole('button', { name: 'Đã gửi ảnh này' }).isDisabled(), true, 'the same photo is not sent twice')
    await page.getByRole('link', { name: 'Lịch sử (4 ca)' }).waitFor()
    assert.equal(await iconsAreGlyphs(result), true, 'icons render as glyphs')
    assert.equal(await iconsAreGlyphs(products), true, 'icons render as glyphs')
    assert.deepEqual(errors, [])
    await context.close()
  })

  await check('UNCERTAIN: "có thể là", retake advice, no chemical treatment and no product', async () => {
    const { context, page, state } = await fixture()
    state.createAnswers.push({ status: 201, body: caseOf('case-unc2', 'AI_COMPLETED', uncertain) })
    await page.goto(base + '/ai-doctor')
    await pick(page)
    await sendButton(page).click()
    const result = page.getByTestId('diagnosis-result')
    await result.waitFor()
    assert.match(await textOf(page.getByTestId('diagnosis-certainty')), /AI chưa chắc chắn, có thể là$/)
    assert.equal(await textOf(page.getByTestId('diagnosis-disease')), 'Bạc lá')
    await page.getByTestId('diagnosis-uncertain').waitFor()
    assert.equal(await result.getByText('Thuốc / hoá chất').count(), 0)
    assert.equal(await page.getByTestId('diagnosis-products').count(), 0)
    await page.getByTestId('diagnosis-no-products').waitFor()
    await page.getByTestId('diagnosis-uncertain').getByRole('button', { name: 'Chụp lại' }).click()
    await sendButton(page).waitFor()
    assert.equal(await page.getByTestId('diagnosis-result').count(), 0, 'retake goes back to an empty form')
    assert.equal(await sendButton(page).isDisabled(), true)
    await context.close()
  })

  await check('FAILED: "Thử lại" shows the 503 message, then the result once the AI is back', async () => {
    const { context, page, state } = await fixture()
    state.createAnswers.push({ status: 201, body: caseOf('case-fai2', 'FAILED') })
    state.retryAnswers.push({ status: 503, body: { title: 'Service Unavailable', status: 503 } })
    await page.goto(base + '/ai-doctor')
    await pick(page)
    await sendButton(page).click()
    await page.getByTestId('diagnosis-failed').waitFor()
    await page.getByRole('button', { name: 'Thử lại' }).click()
    await page.getByText('Dịch vụ AI đang bận. Bác thử lại sau ít phút.').waitFor()
    await page.getByRole('button', { name: 'Thử lại' }).click()
    await page.getByTestId('diagnosis-disease').waitFor()
    assert.equal(state.requests.filter((r) => r.path.endsWith('/case-fai2/retry')).length, 2)
    await page.getByTestId('diagnosis-products').waitFor()
    await context.close()
  })

  await check('upload rejected (429): Vietnamese message, the photo stays for another try', async () => {
    const { context, page, state } = await fixture()
    state.createAnswers.push({ status: 429, body: { title: 'Too Many Requests', status: 429 } })
    await page.goto(base + '/ai-doctor')
    await pick(page)
    await sendButton(page).click()
    await page.getByText('Bác gửi hơi nhanh', { exact: false }).waitFor()
    await page.getByAltText('Ảnh lá lúa đã chọn').waitFor()
    await page.getByRole('button', { name: 'Gửi lại' }).click()
    await page.getByTestId('diagnosis-result').waitFor()
    await context.close()
  })

  await check('history: real list with disease, uncertain mark and status; filter and "Xem thêm" call the API', async () => {
    const { context, page, state } = await fixture()
    for (let n = 0; n < 21; n++) {
      const id = 'case-x' + String(n).padStart(3, '0')
      state.cases[id] = caseOf(id, 'AI_COMPLETED', confident)
      state.listed.push(id)
    }
    await page.goto(base + '/ai-doctor/history')
    await page.getByText('24 ca', { exact: true }).waitFor()
    const confRow = page.getByTestId('diagnosis-row-case-conf')
    await confRow.getByText('Đạo ôn lá', { exact: true }).waitFor()
    await confRow.getByText('Đã có kết quả', { exact: true }).waitFor()
    assert.match(await textOf(confRow), /DG-20261021-CONF · 10:00 21\/10\/26/, 'case number and Vietnam time, as on the notifications page')
    await page.getByTestId('diagnosis-row-case-unc1').getByText('Có thể là Bạc lá (AI chưa chắc)').waitFor()
    await page.getByTestId('diagnosis-row-case-fail').getByText('Chưa phân tích được').waitFor()
    assert.equal(await page.getByTestId('diagnosis-row-case-fail').getAttribute('href'), '/ai-doctor/cases/case-fail')
    assert.equal(await page.locator('[data-testid^="diagnosis-row-"]').count(), 20)
    await page.getByRole('button', { name: 'Xem thêm' }).click()
    await page.waitForFunction(() => document.querySelectorAll('[data-testid^="diagnosis-row-"]').length === 24)
    // StrictMode (dev) runs the first effect twice, so page 1 may be asked twice; "Xem thêm" asks page 2 once.
    const pages = state.requests.filter((r) => r.path === '/api/me/diagnosis-cases').map((r) => r.query.page)
    assert.deepEqual([...new Set(pages)], ['1', '2'])
    assert.equal(pages.filter((p) => p === '2').length, 1)
    await page.getByRole('button', { name: 'Chưa phân tích được' }).click()
    await page.getByText('1 ca', { exact: true }).waitFor()
    assert.equal(state.requests.at(-1).query.status, 'FAILED')
    await page.getByRole('button', { name: 'Đã huỷ' }).click()
    await page.getByText('Không có ca "Đã huỷ".').waitFor()
    assert.equal(await iconsAreGlyphs(page.locator('main, body').first()), true, 'icons render as glyphs')
    await context.close()
  })

  await check('case page: FAILED case retries, an analysing case can be cancelled, a missing case says so', async () => {
    const { context, page, state } = await fixture()
    await page.goto(base + '/ai-doctor/cases/case-fail')
    await page.getByTestId('diagnosis-failed').waitFor()
    assert.equal(await page.getByRole('button', { name: 'Huỷ ca chẩn đoán' }).count(), 1)
    await page.getByRole('button', { name: 'Thử lại' }).click()
    await page.getByTestId('diagnosis-disease').waitFor()
    assert.equal(await page.getByRole('button', { name: 'Huỷ ca chẩn đoán' }).count(), 0, 'a case with a result cannot be cancelled')
    assert.equal(await textOf(page.getByTestId('case-status')), 'Đã có kết quả')

    page.on('dialog', (dialog) => dialog.accept())
    await page.goto(base + '/ai-doctor/cases/case-wait')
    await page.getByText('AI đang phân tích ảnh').waitFor()
    await page.getByRole('button', { name: 'Huỷ ca chẩn đoán' }).click()
    await page.getByText('Đã huỷ ca chẩn đoán.').waitFor()
    assert.equal(await textOf(page.getByTestId('case-status')), 'Đã huỷ')
    assert.equal(state.requests.filter((r) => r.path.endsWith('/case-wait/cancel')).length, 1)

    await page.goto(base + '/ai-doctor/cases/case-none')
    await page.getByText('Không tìm thấy ca chẩn đoán.').waitFor()
    await context.close()
  })

  await check('case page stays idle and updates an analysing case on realtime events and reconnect', async () => {
    const { context, page, state } = await fixture({ clock: true })
    await page.goto(base + '/ai-doctor/cases/case-wait')
    await page.getByText('AI đang phân tích ảnh').waitFor()
    const initialReads = state.requests.filter((r) => r.path === '/api/me/diagnosis-cases/case-wait').length
    await page.clock.runFor(16000)
    assert.equal(state.requests.filter((r) => r.path === '/api/me/diagnosis-cases/case-wait').length, initialReads, 'no idle polling')
    state.cases['case-wait'] = { ...state.cases['case-wait'], status: 'AI_COMPLETED', result: confident, completedAt: at }
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('agrisage-realtime-change', { detail: { topic: 'diagnosis' } })))
    await page.getByTestId('diagnosis-disease').waitFor()
    const polls = state.requests.filter((r) => r.path === '/api/me/diagnosis-cases/case-wait').length
    await page.clock.runFor(11000)
    assert.equal(state.requests.filter((r) => r.path === '/api/me/diagnosis-cases/case-wait').length, polls, 'no polling once there is a result')
    state.cases['case-wait'] = { ...state.cases['case-wait'], status: 'CANCELLED', result: null }
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('agrisage-realtime-change', { detail: { topic: 'resync' } })))
    await page.getByTestId('case-status').filter({ hasText: 'Đã huỷ' }).waitFor()
    await context.close()
  })

  await check('old store-confirmed case: "Cửa hàng đã xác nhận", the store comment and its products', async () => {
    const { context, page } = await fixture()
    await page.goto(base + '/ai-doctor/cases/case-ver1')
    assert.match(await textOf(page.getByTestId('diagnosis-certainty')), /Cửa hàng đã xác nhận$/)
    await page.getByText('Nhận xét của cửa hàng').waitFor()
    await page.getByText('Vết vằn điển hình ở bẹ.').waitFor()
    await page.getByText('Cửa hàng đã chọn các sản phẩm này cho ca của bác.').waitFor()
    assert.equal(await page.getByText('có thể chưa chính xác', { exact: false }).count(), 0)
    await context.close()
  })

  await check('phone width (390 px): AI doctor result, history and case page have no sideways scroll', async () => {
    const { context, page } = await fixture({ viewport: { width: 390, height: 844 } })
    await page.goto(base + '/ai-doctor')
    await pick(page)
    await sendButton(page).click()
    await page.getByTestId('diagnosis-result').waitFor()
    assert.equal(await noHorizontalScroll(page), true, '/ai-doctor')
    if (process.env.DIAGNOSIS_SCREENSHOT_DIR) await page.screenshot({ path: process.env.DIAGNOSIS_SCREENSHOT_DIR + '/390-ai-doctor.png', fullPage: true })
    await page.goto(base + '/ai-doctor/history')
    await page.getByTestId('diagnosis-row-case-unc1').waitFor()
    assert.equal(await noHorizontalScroll(page), true, '/ai-doctor/history')
    if (process.env.DIAGNOSIS_SCREENSHOT_DIR) await page.screenshot({ path: process.env.DIAGNOSIS_SCREENSHOT_DIR + '/390-history.png', fullPage: true })
    await page.goto(base + '/ai-doctor/cases/case-unc1')
    await page.getByTestId('diagnosis-uncertain').waitFor()
    assert.equal(await noHorizontalScroll(page), true, '/ai-doctor/cases/:id')
    if (process.env.DIAGNOSIS_SCREENSHOT_DIR) await page.screenshot({ path: process.env.DIAGNOSIS_SCREENSHOT_DIR + '/390-case-uncertain.png', fullPage: true })
    await context.close()
  })
} finally {
  await browser.close()
  server.kill()
}

console.log(`${checks} passed, ${failures.length} failed`)
if (failures.length) process.exitCode = 1
