import { test, expect } from "@playwright/test";

test("should detect dark mode from localStorage", async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem("mode", "dark");
    });

    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-mode", "dark");
});

test("should toggle modes and recall the mode between reloads", async ({ page }) => {
    await page.goto("/");

    const html = page.locator("html");
    const lightSwitch = page.getByTestId("switch-control");

    await lightSwitch.click();
    await expect(html).toHaveAttribute("data-mode", "dark");

    await lightSwitch.click();
    await expect(html).toHaveAttribute("data-mode", "light");

    await lightSwitch.click();
    await page.goto("/");
    page.reload();
    await expect(html).toHaveAttribute("data-mode", "dark");
});

test("complete quiz run", async ({ page }) => {
    test.setTimeout(120000);
    await page.goto("/");

    await page.getByRole("textbox").fill("Test");
    await page.getByRole("button").click();

    const inputButton = page.getByRole("button").filter({ has: page.locator("svg") });
    
    for (let i = 0; i < 28; i++) {
        await expect(page.getByText(`Question ${i + 1} of 28`)).toBeVisible();

        const answerButton = page.getByRole("button").filter({ hasText: /.+/ }).first();
        await expect(answerButton).toBeVisible();

        await answerButton.click();
        await inputButton.click();
    }

    await expect(page.getByText("Welcome to")).toBeVisible();
});