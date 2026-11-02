import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { pathToFileURL } from 'node:url'

// Input consultation on the farmer web (docs/reference/api-flows/ADVISORY.md section 5): search a problem, enter the area and the
// rice stage, read the products with dose, source and quantity, add one to the cart; the AI result links to the same advice.
// Every /api request is faked: no backend, no data written.
//
//   node scripts/test-advisory.mjs     (starts its own Vite on ADVISORY_TEST_URL, default http://127.0.0.1:5194)
//   ADVISORY_PLAYWRIGHT_MODULE=<path to playwright-core/index.mjs>  ADVISORY_BROWSER_CHANNEL=msedge  (optional)
const { chromium } = await import(process.env.ADVISORY_PLAYWRIGHT_MODULE ? pathToFileURL(process.env.ADVISORY_PLAYWRIGHT_MODULE).href : 'playwright')
const base = process.env.ADVISORY_TEST_URL || 'http://127.0.0.1:5194'

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', new URL(base).port, '--strictPort'], {
  windowsHide: true,
  stdio: 'pipe',
})
await new Promise((resolve, reject) => {
  const timeout = setTimeout(() => reject(new Error('Vite startup timed out')), 30000)
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

const browser = await chromium.launch({ headless: true, channel: process.env.ADVISORY_BROWSER_CHANNEL })
const failures = []
let checks = 0
const at = '2026-11-02T03:00:00Z'

const problems = [
  { id: 'd-LEAF_BLAST', code: 'LEAF_BLAST', name: 'Leaf Blast', problemType: 'DISEASE', summary: 'Vết hình thoi trên lá.', matchedBy: 'NAME' },
  { id: 'd-BROWN_PLANTHOPPER', code: 'BROWN_PLANTHOPPER', name: 'Rầy nâu', problemType: 'PEST', summary: 'Lúa cháy từng chòm.', matchedBy: 'NAME' },
  { id: 'd-NITROGEN_DEFICIENCY', code: 'NITROGEN_DEFICIENCY', name: 'Lúa vàng lá do thiếu đạm', problemType: 'NUTRITION', summary: null, matchedBy: 'KEYWORD' },
]
const fold = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')

const productOf = (id, name, extra = {}) => ({
  storeProductId: id, productId: 'p-' + id, name, sku: 'SKU-' + id, imageUrl: null, group: 'PROTECTION', rankOrder: 1,
  reason: 'Đăng ký phòng trừ: Khô vằn', registrationSource: 'TT 75/2025/TT-BNNMT, Phụ lục I, tr. 187',
  doseText: '0,25-0,3 lít/ha pha trong 500-600 lít nước.', applications: 1, preHarvestDays: 14, growthStages: [], stockStatus: 'ENOUGH', plan: null, ...extra,
})
const planOf = (quantity = 3, unitPrice = 85000) => ({
  baseQuantity: quantity, totalAmount: quantity * unitPrice,
  lines: [{ productPackagingId: 'pk1', packagingName: 'Chai 100 ml', quantity, unitPrice, lineAmount: quantity * unitPrice }],
})
const answerOf = (body, overrides = {}) => ({
  sessionId: 'sess-1',
  problem: { id: body.diseaseId, code: 'SHEATH_BLIGHT', name: 'Sheath Blight', problemType: 'DISEASE', description: null, symptoms: 'Vết bệnh như da hổ trên bẹ lá.', causes: null, prevention: null },
  careGuidance: [{ id: 't1', type: 'CULTURAL', title: 'Giảm đạm, làm thông thoáng ruộng', instructions: 'Ngưng bón đạm, giữ ruộng thông thoáng.', precautions: null, rankOrder: 1, reason: null }],
  areaSqm: body.areaSqm ?? null, growthStage: body.growthStage ?? null,
  protection: [productOf('sp1', 'Tilt Super 300EC', { plan: body.areaSqm ? planOf() : null })], nutrition: [], emptyReason: null,
  safetyNote: 'Đọc kỹ nhãn trước khi dùng, mang đồ bảo hộ, tuân thủ thời gian cách ly.', ...overrides,
})

const disease = (code, name, isHealthy = false) => ({ id: 'd-' + code, code, name, isHealthy, symptoms: 'Vết hình thoi.', prevention: 'Bón cân đối.' })
const resultOf = (certainty, d) => ({ certainty, hint: certainty === 'UNCERTAIN' ? 'RETAKE_PHOTO_OR_ASK_STORE' : null, disease: d, reviewerComment: null, treatments: [], products: certainty === 'CONFIDENT' ? [{ storeProductId: 'sp1', productId: 'p1', name: 'Thuốc Beam 75WP', sku: 'BEAM', imageUrl: null, reason: 'Đăng ký phòng trừ: Đạo ôn', rankOrder: 1 }] : [] })
const caseOf = (id, result) => ({
  id, caseNumber: 'DG-20261102-' + id.slice(-4).toUpperCase(), status: 'AI_COMPLETED', submittedAt: at, completedAt: at, farmerNote: null,
  image: null, result, inconclusive: null, canRetry: false,
})
const cases = {
  'case-conf': caseOf('case-conf', resultOf('CONFIDENT', disease('LEAF_BLAST', 'Leaf Blast'))),
  'case-unc1': caseOf('case-unc1', resultOf('UNCERTAIN', disease('BACTERIAL_LEAF_BLIGHT', 'Bacterial Leaf Blight'))),
  'case-heal': caseOf('case-heal', resultOf('CONFIDENT', disease('HEALTHY', 'Healthy', true))),
}

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

const FARMER = ['MY_PROFILE.READ', 'MY_CART.READ', 'MY_CART.ADD_ITEM', 'MY_ADVISORY.READ', 'MY_DIAGNOSIS.READ', 'MY_DIAGNOSIS.CREATE']

/** A page with every /api call answered from `state`. */
async function fixture({ signedIn = true, permissions = FARMER, viewport = { width: 1280, height: 900 } } = {}) {
  const context = await browser.newContext({ viewport })
  if (signedIn) await context.addInitScript(() => localStorage.setItem('agrisage.farmer_token', 'advisory.test.jwt'))
  const state = { requests: [], answer: (body) => answerOf(body), problemError: null, recommendError: null, cartError: false }
  await context.route('**/api/**', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const path = url.pathname
    if (!path.startsWith('/api/')) return route.continue()
    const json = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })
    const body = request.postData() ? JSON.parse(request.postData()) : null
    state.requests.push({ method: request.method(), path, query: Object.fromEntries(url.searchParams), body })
    if (path.startsWith('/api/realtime/')) return json({ title: 'Not available in the test' }, 404)
    if (path === '/api/me/permissions') return json({ role: 'FARMER', storeId: null, roleVersion: 1, memberVersion: null, permissions })
    if (path === '/api/auth/login') {
      return json({ accessToken: 'advisory.test.jwt', refreshToken: 'r', user: { id: 'u1', fullName: 'Nông dân kiểm thử', role: 'FARMER', phoneNumber: '0901234567' } })
    }
    if (path === '/api/me/advisory/problems') {
      if (state.problemError) return json({ title: 'Down', status: 503 }, 503)
      const text = fold(url.searchParams.get('search') ?? '')
      const type = url.searchParams.get('type')
      const rows = problems.filter((p) => (!type || p.problemType === type) && (!text || fold(p.name).includes(text) || fold(p.summary ?? '').includes(text)))
      return json({ items: rows, page: 1, pageSize: 50, totalCount: rows.length, totalPages: 1 })
    }
    if (path === '/api/me/advisory/recommendations') {
      if (state.recommendError) return json({ title: 'Not Found', status: 404 }, 404)
      return json(state.answer(body))
    }
    if (path === '/api/me/cart/items' && request.method() === 'POST') {
      if (state.cartError) return json({ title: 'Unprocessable', status: 422, detail: 'Không thêm được.' }, 422)
      return json({ id: 'cart1', items: [{ id: 'l1', storeProductId: body.storeProductId, productPackagingId: body.productPackagingId, quantity: body.quantity, productName: 'Tilt Super 300EC', packagingName: 'Chai 100 ml', sku: 'SKU', isAvailable: true, unitPrice: 85000, lineTotal: 85000 * body.quantity }], subtotalAmount: 85000 * body.quantity, priceListId: 'pl1' })
    }
    if (path === '/api/me/cart') return json({ id: null, items: [], subtotalAmount: 0, priceListId: null })
    const caseMatch = path.match(/^\/api\/me\/diagnosis-cases\/([^/]+)$/)
    if (caseMatch) return cases[caseMatch[1]] ? json(cases[caseMatch[1]]) : json({ title: 'Not Found', status: 404 }, 404)
    if (path === '/api/me/diagnosis-cases') return json({ items: [], page: 1, pageSize: 20, totalCount: 0, totalPages: 0 })
    if (path === '/api/me/profile') return json({ userId: 'u1', fullName: 'Nông dân kiểm thử', phoneNumber: '0901234567' })
    if (path.endsWith('/unread-count')) return json({ count: 0 })
    return json({ items: [], page: 1, pageSize: 20, totalCount: 0, totalPages: 0 })
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  return { context, page, state, errors }
}

const recommendCalls = (state) => state.requests.filter((r) => r.path === '/api/me/advisory/recommendations')
const problemCalls = (state) => state.requests.filter((r) => r.path === '/api/me/advisory/problems')
const noHorizontalScroll = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
const textOf = async (locator) => (await locator.innerText()).replace(/\s+/g, ' ').trim()
const PROBLEM = '/advisory/problem/d-SHEATH_BLIGHT'

try {
  await check('a guest is sent to login and comes back to the advice page', async () => {
    const { context, page } = await fixture({ signedIn: false })
    await page.goto(base + '/advisory')
    await page.waitForURL(/\/login$/)
    await page.locator('#emailInput').fill('0901234567')
    await page.locator('#passwordInput').fill('Test@12345678')
    await page.locator('button[type=submit]').click()
    await page.waitForURL(/\/advisory$/)
    await page.getByTestId('advisory-problem-LEAF_BLAST').waitFor()
    await context.close()
  })

  await check('the list shows each problem with its kind, Vietnamese names for the AI classes, and a way to the photo', async () => {
    const { context, page, state, errors } = await fixture()
    await page.goto(base + '/advisory')
    await page.getByTestId('advisory-problem-LEAF_BLAST').waitFor()
    assert.match(await textOf(page.getByTestId('advisory-problem-LEAF_BLAST')), /Đạo ôn lá.*Bệnh/)
    assert.match(await textOf(page.getByTestId('advisory-problem-BROWN_PLANTHOPPER')), /Rầy nâu.*Sâu rầy/)
    assert.equal(await page.getByTestId('advisory-photo-shortcut').getAttribute('href'), '/ai-doctor')
    assert.ok(problemCalls(state).length >= 1 && problemCalls(state).every((r) => r.query.search === undefined), 'the first load lists everything')
    assert.equal(await page.getByRole('link', { name: 'Tư vấn vật tư' }).count() > 0, true, 'the menu entry')
    assert.deepEqual(errors, [])
    await context.close()
  })

  await check('typing without accents waits for the pause, then only the matching problem is left', async () => {
    const { context, page, state } = await fixture()
    await page.goto(base + '/advisory')
    await page.getByTestId('advisory-problem-LEAF_BLAST').waitFor()
    await page.getByTestId('advisory-search').fill('ray nau')
    await page.getByTestId('advisory-problem-LEAF_BLAST').waitFor({ state: 'detached' })
    assert.equal(problemCalls(state).at(-1).query.search, 'ray nau')
    assert.equal(await page.getByTestId('advisory-problem-BROWN_PLANTHOPPER').count(), 1)
    await page.getByTestId('advisory-search').fill('zzzz')
    await page.getByTestId('advisory-empty').waitFor()
    assert.match(await textOf(page.getByTestId('advisory-empty')), /Không tìm thấy vấn đề phù hợp/)
    await context.close()
  })

  await check('the kind filter sends the type to the server', async () => {
    const { context, page, state } = await fixture()
    await page.goto(base + '/advisory')
    await page.getByTestId('advisory-problem-LEAF_BLAST').waitFor()
    await page.getByTestId('advisory-type-PEST').click()
    await page.getByTestId('advisory-problem-LEAF_BLAST').waitFor({ state: 'detached' })
    assert.equal(problemCalls(state).at(-1).query.type, 'PEST')
    assert.equal(await page.getByTestId('advisory-type-PEST').getAttribute('aria-pressed'), 'true')
    await context.close()
  })

  await check('a failed search shows the message and Thử lại loads the list', async () => {
    const { context, page, state } = await fixture()
    state.problemError = true
    await page.goto(base + '/advisory')
    await page.getByRole('alert').waitFor()
    state.problemError = null
    await page.getByRole('button', { name: 'Thử lại' }).click()
    await page.getByTestId('advisory-problem-LEAF_BLAST').waitFor()
    await context.close()
  })

  await check('picking a problem opens its advice: care, product with dose, source and pre-harvest days, no quantity yet', async () => {
    const { context, page, state } = await fixture()
    await page.goto(base + '/advisory')
    await page.getByTestId('advisory-problem-BROWN_PLANTHOPPER').click()
    await page.getByTestId('advisory-problem-header').waitFor()
    assert.equal(recommendCalls(state).at(-1).body.diseaseId, 'd-BROWN_PLANTHOPPER')
    assert.equal(recommendCalls(state).at(-1).body.areaSqm, undefined)
    assert.equal(await textOf(page.getByTestId('advisory-problem-name')), 'Khô vằn', 'the Vietnamese name of the class')
    await page.getByTestId('advisory-care').waitFor()
    const card = page.getByTestId('advisory-product-sp1')
    await card.waitFor()
    const text = await textOf(card)
    assert.match(text, /Tilt Super 300EC/)
    assert.match(text, /Đăng ký: TT 75\/2025\/TT-BNNMT, Phụ lục I, tr\. 187/)
    assert.match(text, /0,25-0,3 lít\/ha/)
    assert.match(text, /Cách ly 14 ngày/)
    assert.match(text, /Còn hàng/)
    assert.match(await textOf(page.getByTestId('advisory-noplan-sp1')), /nhập diện tích ruộng/)
    await page.getByTestId('advisory-disclaimer').waitFor()
    await context.close()
  })

  await check('3 công is sent as 3000 m², the quantity and price appear, and the area is remembered for the next visit', async () => {
    const { context, page, state } = await fixture()
    await page.goto(base + PROBLEM)
    await page.getByTestId('advisory-product-sp1').waitFor()
    await page.getByTestId('advisory-area').fill('3')
    await page.getByTestId('advisory-apply').click()
    await page.getByTestId('advisory-plan-sp1').waitFor()
    assert.equal(recommendCalls(state).at(-1).body.areaSqm, 3000)
    const plan = await textOf(page.getByTestId('advisory-plan-sp1'))
    assert.match(plan, /3 × Chai 100 ml/)
    assert.match(plan, /Ước tính 255\.000 đ/)
    assert.match(await textOf(page.getByTestId('advisory-add-sp1')), /Thêm vào giỏ · 255\.000 đ/)

    const before = recommendCalls(state).length
    await page.reload()
    await page.getByTestId('advisory-plan-sp1').waitFor()
    assert.equal(await page.getByTestId('advisory-area').inputValue(), '3')
    const after = recommendCalls(state).slice(before)
    assert.ok(after.length >= 1)
    // The dev server runs effects twice (StrictMode), so count by content: no request after the reload lacks the remembered area.
    assert.ok(after.every((r) => r.body.areaSqm === 3000), 'the remembered area is used by the first request, not added by a second one')
    await context.close()
  })

  await check('sào and ha convert to square metres; a comma is a decimal point', async () => {
    const { context, page, state } = await fixture()
    await page.goto(base + PROBLEM)
    await page.getByTestId('advisory-product-sp1').waitFor()
    await page.getByTestId('advisory-unit-sao').click()
    await page.getByTestId('advisory-area').fill('2')
    await page.getByTestId('advisory-apply').click()
    await page.getByTestId('advisory-plan-sp1').waitFor()
    assert.equal(recommendCalls(state).at(-1).body.areaSqm, 720)
    await page.getByTestId('advisory-unit-ha').click()
    await page.getByTestId('advisory-area').fill('0,5')
    await page.getByTestId('advisory-apply').click()
    await page.waitForTimeout(300)
    assert.equal(recommendCalls(state).at(-1).body.areaSqm, 5000)
    await context.close()
  })

  await check('an invalid area is refused with a message and nothing is sent', async () => {
    const { context, page, state } = await fixture()
    await page.goto(base + PROBLEM)
    await page.getByTestId('advisory-product-sp1').waitFor()
    const before = recommendCalls(state).length
    for (const bad of ['0', '1.2.3', '5000']) {
      await page.getByTestId('advisory-area').fill(bad)
      await page.getByTestId('advisory-apply').click()
      await page.getByText('Bác nhập diện tích là số lớn hơn 0').waitFor()
    }
    assert.equal(recommendCalls(state).length, before)
    await context.close()
  })

  await check('picking a rice stage sends growthStage; "Chưa rõ" clears it; no product for the stage says why', async () => {
    const { context, page, state } = await fixture()
    state.answer = (body) => (body.growthStage
      ? answerOf(body, { protection: [], emptyReason: 'NO_PRODUCT_FOR_STAGE', growthStage: body.growthStage })
      : answerOf(body))
    await page.goto(base + PROBLEM)
    await page.getByTestId('advisory-product-sp1').waitFor()
    await page.getByTestId('advisory-stage-HEADING').click()
    await page.getByTestId('advisory-empty-reason').waitFor()
    assert.equal(recommendCalls(state).at(-1).body.growthStage, 'HEADING')
    assert.match(await textOf(page.getByTestId('advisory-empty-reason')), /Chưa có sản phẩm hợp với giai đoạn/)
    await page.getByTestId('advisory-stage-any').click()
    await page.getByTestId('advisory-product-sp1').waitFor()
    assert.equal(recommendCalls(state).at(-1).body.growthStage, undefined)
    await context.close()
  })

  await check('add to cart sends each plan line the server worked out and says so', async () => {
    const { context, page, state } = await fixture()
    await page.goto(base + PROBLEM)
    await page.getByTestId('advisory-area').fill('3')
    await page.getByTestId('advisory-apply').click()
    await page.getByTestId('advisory-add-sp1').click()
    await page.getByText('Đã thêm "Tilt Super 300EC" vào giỏ hàng').waitFor()
    const adds = state.requests.filter((r) => r.method === 'POST' && r.path === '/api/me/cart/items')
    assert.equal(adds.length, 1)
    assert.deepEqual(adds[0].body, { storeProductId: 'sp1', productPackagingId: 'pk1', quantity: 3 })
    await context.close()
  })

  await check('a cart failure shows the server message and not "Đã thêm"', async () => {
    const { context, page, state } = await fixture()
    state.cartError = true
    await page.goto(base + PROBLEM)
    await page.getByTestId('advisory-area').fill('3')
    await page.getByTestId('advisory-apply').click()
    await page.getByTestId('advisory-add-sp1').click()
    await page.getByText('Không thêm được.').first().waitFor()
    assert.equal(await page.getByText('Đã thêm "Tilt Super 300EC"').count(), 0)
    await context.close()
  })

  await check('out of stock cannot be added, not enough stock warns, a product without a dose opens the product', async () => {
    const { context, page, state } = await fixture()
    state.answer = (body) => answerOf(body, {
      protection: [
        productOf('sp1', 'Tilt Super 300EC', { stockStatus: 'OUT_OF_STOCK', plan: body.areaSqm ? planOf() : null }),
        productOf('sp2', 'Amistar Top 325SC', { stockStatus: 'NOT_ENOUGH', plan: body.areaSqm ? planOf(2, 115000) : null, rankOrder: 2 }),
        productOf('sp3', 'Camilo 150SC', { preHarvestDays: null, plan: null, rankOrder: 3 }),
      ],
    })
    await page.goto(base + PROBLEM)
    await page.getByTestId('advisory-area').fill('3')
    await page.getByTestId('advisory-apply').click()
    await page.getByTestId('advisory-plan-sp2').waitFor()
    assert.equal(await page.getByTestId('advisory-add-sp1').count(), 0)
    assert.equal(await page.getByTestId('advisory-soldout-sp1').isDisabled(), true)
    assert.match(await textOf(page.getByTestId('advisory-product-sp2')), /Cửa hàng chưa đủ số lượng này/)
    assert.equal(await page.getByTestId('advisory-add-sp2').count(), 1)
    assert.equal(await page.getByTestId('advisory-add-sp3').count(), 0)
    assert.match(await textOf(page.getByTestId('advisory-noplan-sp3')), /Chưa tính được số lượng/)
    assert.equal(await page.getByTestId('advisory-open-sp3').getAttribute('href'), '/products/sp3')
    assert.doesNotMatch(await textOf(page.getByTestId('advisory-product-sp3')), /Cách ly/)
    await context.close()
  })

  await check('fertilizers are in their own group without a registration source; no approved product says to ask the store', async () => {
    const { context, page, state } = await fixture()
    state.answer = (body) => answerOf(body, {
      protection: [],
      nutrition: [productOf('sp7', 'Đạm Phú Mỹ', { group: 'NUTRITION', registrationSource: null, preHarvestDays: null, doseText: 'Chia 2-3 lần bón thúc.' })],
    })
    await page.goto(base + '/advisory/problem/d-NITROGEN_DEFICIENCY')
    await page.getByTestId('advisory-nutrition').waitFor()
    assert.equal(await page.getByTestId('advisory-protection').count(), 0)
    assert.equal(await page.getByTestId('advisory-source-sp7').count(), 0)

    state.answer = (body) => answerOf(body, { protection: [], emptyReason: 'NO_APPROVED_PRODUCT' })
    await page.goto(base + PROBLEM)
    await page.getByTestId('advisory-empty-reason').waitFor()
    assert.match(await textOf(page.getByTestId('advisory-empty-reason')), /chưa có sản phẩm gợi ý cho vấn đề này/)
    await context.close()
  })

  await check('coming from an AI case sends the case id; a failed load offers Thử lại', async () => {
    const { context, page, state } = await fixture()
    await page.goto(base + PROBLEM + '?caseId=case-conf')
    await page.getByTestId('advisory-problem-header').waitFor()
    assert.equal(recommendCalls(state).at(-1).body.diagnosisCaseId, 'case-conf')
    assert.match(await textOf(page.getByTestId('advisory-problem-header')), /Từ kết quả AI/)

    state.recommendError = true
    await page.goto(base + '/advisory/problem/d-GONE')
    await page.getByRole('alert').waitFor()
    assert.match(await textOf(page.getByRole('alert')), /Không tìm thấy vấn đề này/)
    state.recommendError = null
    await page.getByRole('button', { name: 'Thử lại' }).click()
    await page.getByTestId('advisory-product-sp1').waitFor()
    await context.close()
  })

  await check('a confident AI result links to the detailed advice with its case; uncertain and healthy do not', async () => {
    const { context, page } = await fixture()
    await page.goto(base + '/ai-doctor/cases/case-conf')
    const link = page.getByTestId('diagnosis-advisory-link')
    await link.waitFor()
    assert.equal(await link.getAttribute('href'), '/advisory/problem/d-LEAF_BLAST?caseId=case-conf')
    await link.click()
    await page.getByTestId('advisory-problem-header').waitFor()

    await page.goto(base + '/ai-doctor/cases/case-unc1')
    await page.getByTestId('diagnosis-no-products').waitFor()
    assert.equal(await page.getByTestId('diagnosis-advisory-link').count(), 0)
    await page.goto(base + '/ai-doctor/cases/case-heal')
    await page.getByTestId('diagnosis-result').waitFor()
    assert.equal(await page.getByTestId('diagnosis-advisory-link').count(), 0)
    await context.close()
  })

  await check('without MY_ADVISORY.READ there is no menu entry and the page is closed', async () => {
    const { context, page, state } = await fixture({ permissions: FARMER.filter((p) => p !== 'MY_ADVISORY.READ') })
    await page.goto(base + '/advisory')
    await page.getByText('Bác chưa được cấp quyền sử dụng chức năng này').waitFor()
    assert.equal(problemCalls(state).length, 0)
    assert.equal(await page.getByRole('link', { name: 'Tư vấn vật tư' }).count(), 0)
    await context.close()
  })

  await check('at 390 px nothing scrolls sideways and the icons are glyphs', async () => {
    const { context, page, state } = await fixture({ viewport: { width: 390, height: 844 } })
    state.answer = (body) => answerOf(body, {
      protection: [productOf('sp1', 'Tilt Super 300EC - trị khô vằn, lem lép hạt', { plan: body.areaSqm ? planOf() : null }), productOf('sp2', 'Amistar Top 325SC', { stockStatus: 'NOT_ENOUGH', plan: body.areaSqm ? planOf(2, 115000) : null })],
      nutrition: [productOf('sp7', 'Đạm Phú Mỹ (Urê hạt đục 46,3% N)', { group: 'NUTRITION', stockStatus: 'OUT_OF_STOCK', registrationSource: null, preHarvestDays: null })],
    })
    await page.goto(base + '/advisory')
    await page.getByTestId('advisory-problem-LEAF_BLAST').waitFor()
    assert.equal(await noHorizontalScroll(page), true, '/advisory')
    if (process.env.ADVISORY_SCREENSHOT_DIR) await page.screenshot({ path: process.env.ADVISORY_SCREENSHOT_DIR + '/390-advisory.png', fullPage: true })
    await page.goto(base + PROBLEM)
    await page.getByTestId('advisory-product-sp1').waitFor()
    await page.getByTestId('advisory-area').fill('3')
    await page.getByTestId('advisory-apply').click()
    await page.getByTestId('advisory-plan-sp1').waitFor()
    assert.equal(await noHorizontalScroll(page), true, '/advisory/problem/:id')
    await page.evaluate(async () => { await document.fonts.ready })
    const glyphs = await page.locator('main .material-symbols-outlined, .material-symbols-outlined').evaluateAll((els) =>
      els.every((el) => el.getBoundingClientRect().width <= parseFloat(getComputedStyle(el).fontSize) * 1.25))
    assert.equal(glyphs, true, 'an icon missing from the font subset shows its name as a wide word')
    if (process.env.ADVISORY_SCREENSHOT_DIR) await page.screenshot({ path: process.env.ADVISORY_SCREENSHOT_DIR + '/390-problem.png', fullPage: true })
    await context.close()
  })
} finally {
  await browser.close()
  server.kill()
}

console.log(`${checks} passed, ${failures.length} failed`)
if (failures.length) process.exitCode = 1
