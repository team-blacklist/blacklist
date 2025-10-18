import { test, expect } from "@playwright/test"

const APP_URL = process.env.APP_URL ?? "http://localhost:3000"
const ENDPOINT = process.env.ENDPOINT ?? "/test-website"

test.describe("Network inspection", () => {
  test("submits target site and inspects /test-website POST 200", async ({
    browser,
  }) => {
    // Optional: record a HAR for offline inspection
    const context = await browser.newContext({
      recordHar: { path: "artifacts/network.har", content: "embed" },
    })
    const page = await context.newPage()

    // Helper for compact logging
    function logCompact(title: string, obj: Record<string, any>) {
      const pretty = JSON.stringify(obj, null, 2)
      console.log(`\n=== ${title} ===\n${pretty}\n========================\n`)
    }

    // (Optional) log all interesting requests/responses
    page.on("request", (req) => {
      const url = req.url()
      if (url.includes(ENDPOINT)) {
        console.log(`→ [${req.method()}] ${url}`)
        logCompact("Request Headers", req.headers())
        const postData = req.postData()
        if (postData) console.log("Request Body:", postData.slice(0, 500))
      }
    })

    page.on("response", async (res) => {
      const url = res.url()
      if (url.includes(ENDPOINT)) {
        console.log(`← [${res.status()}] ${url}`)
        const headers = res.headers()
        logCompact("Response Headers", headers)
      }
    })

    // 1️⃣ Go to your frontend page
    await page.goto(APP_URL)

    // 2️⃣ Fill URL and check consent
    await page.getByPlaceholder("https://example.com").fill("https://test.com")
    await page.getByRole("checkbox").check()

    // 3️⃣ Click "Start Testing" and wait for backend response
    const response = await Promise.all([
      page.waitForResponse(
        (r) => {
          const url = r.url()
          const isEndpoint =
            url.endsWith(ENDPOINT) ||
            url.includes(`${ENDPOINT}?`) ||
            url.includes(`://localhost:3001${ENDPOINT}`)
          return (
            isEndpoint && r.request().method() === "POST" && r.status() === 200
          )
        },
        { timeout: 15000 }
      ),
      page.getByRole("button", { name: /start testing/i }).click(),
    ]).then(([res]) => res)

    // 4️⃣ Check response OK and log everything
    expect(response.ok()).toBeTruthy()

    const ct = response.headers()["content-type"] ?? ""
    logCompact("Final Response Headers", response.headers())

    let body: any
    if (ct.includes("application/json")) {
      body = await response.json()
    } else {
      body = await response.text()
    }

    console.log("[/test-website body]", body)

    // 5️⃣ Optional assertion
    // expect(body).toMatchObject({ ok: true });

    // 6️⃣ Close context (flush HAR)
    await context.close()
  })
})
