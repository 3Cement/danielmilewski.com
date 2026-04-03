import { expect, test } from "@playwright/test";

test("home page renders trust signals", async ({ page }) => {
  await page.goto("/en");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Senior Python Developer/i,
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

  await page.getByRole("link", { name: "Przełącz na polski" }).click();

  await expect(page).toHaveURL(/\/pl$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Senior Python Developer — systemy backendowe/i,
    }),
  ).toBeVisible();
});

test("project and blog detail pages render", async ({ page }) => {
  await page.goto("/en/projects/investtracker");
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
