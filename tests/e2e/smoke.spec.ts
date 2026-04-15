import { expect, test, type Page } from "@playwright/test";

const testGaMeasurementId = "G-TESTE2E01";

async function rejectAnalyticsIfBannerVisible(page: Page) {
  const rejectButton = page.getByRole("button", {
    name: /Only necessary|Tylko niezbędne/i,
  });

  if (await rejectButton.isVisible().catch(() => false)) {
    await rejectButton.click();
  }
}

test("home page renders trust signals", async ({ page }) => {
  await page.goto("/en");
  await rejectAnalyticsIfBannerVisible(page);

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /I build reliable backend systems/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: /Built in environments where software has to stay reliable/i,
    }),
  ).toBeVisible();
  await expect(page.getByText("Energy Aspects")).toBeVisible();
});

test("language switcher moves from EN to PL", async ({ page }) => {
  await page.goto("/en");
  await rejectAnalyticsIfBannerVisible(page);

  await page.getByRole("link", { name: "Przełącz na polski" }).click();

  await expect(page).toHaveURL(/\/pl$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Buduję solidne systemy backendowe/i,
    }),
  ).toBeVisible();
});

test("project and blog detail pages render", async ({ page }) => {
  await page.goto("/en/projects/investtracker");
  await rejectAnalyticsIfBannerVisible(page);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /InvestTracker/i,
    }),
  ).toBeVisible();

  await page.goto("/en/blog/automation-business-value");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /What Makes Automation Projects Actually Valuable for Businesses/i,
    }),
  ).toBeVisible();
});

test("contact form submits in smoke mode", async ({ page }) => {
  await page.goto("/en/contact");
  await rejectAnalyticsIfBannerVisible(page);
  const form = page.locator("form");

  await form.getByLabel("Name").fill("Jane Doe");
  await form.getByLabel("Email").fill("jane@example.com");
  await form.getByLabel("Company").fill("Acme");
  await form.getByLabel("Subject").fill("Backend help needed");
  await form
    .getByLabel("Message")
    .fill("I need help with a backend project and API integration next month.");

  await form.getByRole("button", { name: "Send inquiry" }).click();

  await expect(page.getByRole("status")).toContainText(
    "Message sent. I'll reply by email when I can.",
  );
});

test("cookie banner can reject analytics and reopen from the footer", async ({ page }) => {
  await page.goto("/en");
  const bannerTitle = page.getByText("Analytics cookies", { exact: true });

  await expect(bannerTitle).toBeVisible();
  await page.getByRole("button", { name: "Only necessary" }).click();
  await expect(bannerTitle).toBeHidden();

  await expect(
    page.locator('script[src*="googletagmanager.com/gtag/js"]'),
  ).toHaveCount(0);

  await page.getByRole("button", { name: "Cookie settings" }).click();
  await expect(bannerTitle).toBeVisible();
});

test("cookie banner stores accepted consent and hides after confirmation", async ({ page }) => {
  await page.goto("/en");
  const bannerTitle = page.getByText("Analytics cookies", { exact: true });

  await expect(bannerTitle).toBeVisible();
  await page.getByRole("button", { name: "Accept analytics" }).click();
  await expect(bannerTitle).toBeHidden();

  await expect.poll(() =>
    page.evaluate(
      (storageKey) => window.localStorage.getItem(storageKey),
      "dm_analytics_consent",
    ),
  ).toBe("accepted");

  await expect(
    page.locator(`script[src*="googletagmanager.com/gtag/js?id=${testGaMeasurementId}"]`),
  ).toHaveCount(0);
});
