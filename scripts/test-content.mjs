import assert from 'node:assert/strict'
import { readFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

// Production-build UI contracts, with intercepted APIs and no live data writes.
const { chromium } = await import(process.env.UI_PLAYWRIGHT_MODULE ? pathToFileURL(process.env.UI_PLAYWRIGHT_MODULE).href : 'playwright')
const browser = await chromium.launch({ headless: true, channel: process.env.UI_BROWSER_CHANNEL })
const base = 'http://content.test'
const at = '2026-11-12T10:00:00Z'
const article = { id: 'a1', slug: 'ky-thuat-lua', title: 'Kỹ thuật lúa', summary: 'Tóm tắt từ API', content: 'Nội dung thật từ API\nDòng thứ hai', thumbnailUrl: base + '/article-image.jpg', status: 'PUBLISHED', authorId: 'admin', authorName: 'Kỹ sư AgriSage', publishedAt: at, createdAt: at, updatedAt: at }
const contact = { id: 'c1', requestNumber: 'CR-20261112-0001', contactName: 'Nguyễn Văn A', contactPhone: '0912345678', contactEmail: null, subject: 'Kỹ thuật canh tác', message: 'Cần hỗ trợ canh tác.', status: 'RESOLVED', resolutionNote: 'Đã hướng dẫn bà con canh tác.', resolvedAt: at, createdAt: at, updatedAt: at }
const paged = items => ({ items, page: 1, pageSize: 9, totalCount: items.length, totalPages: 1 })
let activePage
async function fixture(authenticated = false, permissions = ['MY_CONTACT_REQUESTS.READ'], mobile = false) {
  const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 } })
  if (authenticated) await context.addInitScript(() => localStorage.setItem('agrisage.farmer_token', 'content.test.token'))
  const state = { failSubmit: false, missingArticle: false, writes: [] }
  await context.route(`${base}/**`, async route => {
    const name = new URL(route.request().url()).pathname
    if (name === '/article-image.jpg') return route.fulfill({ body: await readFile('public/images/misc/hero-rice-field.jpg'), contentType: 'image/jpeg' })
    const file = name.startsWith('/assets/') ? name.slice(1) : 'index.html'
    const contentType = file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html'
    await route.fulfill({ body: await readFile(path.join('dist', file)), contentType })
  })
  await context.route('**/api/**', async route => {
    const req = route.request(), url = new URL(req.url()), name = url.pathname, method = req.method()
    const json = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })
    if (name === '/api/me/permissions') return json({ role: 'FARMER', permissions, roleVersion: 1, memberVersion: null, storeId: null })
    if (name.includes('/realtime/')) return json({}, 404)
    if (name.endsWith('/unread-count')) return json({ count: 0 })
    if (name === '/api/articles') return json(paged(state.missingArticle ? [] : [article]))
    if (name.startsWith('/api/articles/')) return state.missingArticle ? json({ title: 'Not found' }, 404) : json(article)
    if (name === '/api/contact-requests' && method === 'POST') {
      state.writes.push(req.postDataJSON())
      return state.failSubmit ? json({ title: 'Unavailable' }, 503) : json({ ...contact, ...req.postDataJSON(), status: 'OPEN', resolutionNote: null }, 201)
    }
    if (name === '/api/me/contact-requests') return json(paged([contact]))
    return json(paged([]))
  })
  const page = await context.newPage()
  page.setDefaultTimeout(8000)
  activePage = page
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  return { context, page, state, errors }
}

try {
  const { context, page, state, errors } = await fixture()
  await page.goto(base + '/knowledge')
  await page.getByRole('heading', { name: 'Kỹ thuật lúa', exact: true }).waitFor()
  assert.equal(await page.getByText('Tóm tắt từ API', { exact: true }).count(), 1)
  assert.equal(await page.locator('img[src$="article-image.jpg"]').count(), 1)
  await page.getByRole('link').filter({ has: page.getByRole('heading', { name: 'Kỹ thuật lúa', exact: true }) }).click()
  await page.getByText('Nội dung thật từ API', { exact: false }).waitFor()
  assert.equal(await page.locator('img[src$="article-image.jpg"]').count(), 1)
  assert.equal(await page.getByText('Kỹ sư AgriSage', { exact: false }).count(), 1)
  await mkdir('artifacts/content', { recursive: true })
  await page.screenshot({ path: 'artifacts/content/article-desktop.png', fullPage: true })
  state.missingArticle = true
  await page.evaluate(() => window.dispatchEvent(new Event('focus')))
  await page.getByRole('heading', { name: 'Không tìm thấy bài viết hoặc bài viết đã ngừng xuất bản.', exact: true }).waitFor()
  assert.equal(await page.getByText('Nội dung thật từ API', { exact: false }).count(), 0)
  console.log('PASS API article list/detail and hidden publication refresh')

  await page.goto(base + '/contact')
  await page.getByPlaceholder('Nguyễn Văn Nông', { exact: true }).fill('Nguyễn Văn A')
  await page.getByPlaceholder('0912 345 678', { exact: true }).fill('0912345678')
  await page.getByPlaceholder('Ấp Thới Thuận, TT. Thới Lai, Cần Thơ', { exact: true }).fill('Thới Lai')
  await page.locator('textarea').fill('Cần hỗ trợ canh tác.')
  state.failSubmit = true
  await page.getByRole('button', { name: 'Gửi yêu cầu hỗ trợ', exact: true }).click()
  await page.getByRole('alert').filter({ hasText: 'Dịch vụ tạm gián đoạn' }).waitFor()
  assert.equal(await page.getByText('Đã nhận yêu cầu', { exact: false }).count(), 0)
  state.failSubmit = false
  await page.getByRole('button', { name: 'Gửi yêu cầu hỗ trợ', exact: true }).click()
  await page.getByText('Đã nhận yêu cầu CR-20261112-0001.', { exact: false }).waitFor()
  assert.equal(state.writes[1].contactPhone, '0912345678')
  assert.equal(state.writes[1].subject, 'Kỹ thuật canh tác')
  assert.equal(state.writes[1].message, 'Cần hỗ trợ canh tác.\n\nKhu vực / Địa chỉ: Thới Lai')
  assert.equal(Object.hasOwn(state.writes[1], 'userId'), false)
  assert.deepEqual(errors, [])
  await context.close()
  console.log('PASS submit failure, retry, real receipt and server-owned user identity')

  const mine = await fixture(true, ['MY_CONTACT_REQUESTS.READ'], true)
  await mine.page.goto(base + '/contact/requests')
  await mine.page.getByText('Đã hướng dẫn bà con canh tác.', { exact: true }).waitFor()
  assert.equal(await mine.page.getByText('Đã giải quyết', { exact: true }).count(), 1)
  assert.equal(await mine.page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false)
  await mine.page.screenshot({ path: 'artifacts/content/contact-history-mobile.png', fullPage: true })
  await mine.context.close()
  console.log('PASS farmer history status, staff reply and mobile layout')
  const denied = await fixture(true, [])
  await denied.page.goto(base + '/contact/requests')
  await denied.page.getByText('Bác chưa được cấp quyền', { exact: false }).waitFor()
  assert.equal(await denied.page.getByText('Đã hướng dẫn bà con canh tác.', { exact: true }).count(), 0)
  await denied.context.close()
  console.log('PASS history permission gate')
} catch (error) {
  console.log(await activePage.locator('body').innerText())
  throw error
} finally { await browser.close() }
