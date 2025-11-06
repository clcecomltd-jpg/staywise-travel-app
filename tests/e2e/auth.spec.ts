import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should display auth page', async ({ page }) => {
    await page.goto('/auth')
    await expect(page.locator('h2')).toContainText('Welcome back')
  })

  test('should toggle between sign in and sign up', async ({ page }) => {
    await page.goto('/auth')

    // Should start on sign in
    await expect(page.locator('h2')).toContainText('Welcome back')

    // Click sign up link
    await page.click('text=Sign up')
    await expect(page.locator('h2')).toContainText('Create an account')

    // Click sign in link
    await page.click('text=Sign in')
    await expect(page.locator('h2')).toContainText('Welcome back')
  })

  test('should show email input', async ({ page }) => {
    await page.goto('/auth')
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()
  })

  test('should show password input', async ({ page }) => {
    await page.goto('/auth')
    const passwordInput = page.locator('input[type="password"]')
    await expect(passwordInput).toBeVisible()
  })
})
