import asyncio
from playwright.async_api import async_playwright, expect
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Navigate to the local server where the docs are being served
        await page.goto('http://localhost:8000/index.html')

        # DEBUG: Print page content
        print("--- PAGE CONTENT ---")
        print(await page.content())
        print("--------------------")

        # Click the "Prompts" navigation link
        prompts_link = page.get_by_role("link", name="Prompts")
        await prompts_link.click()

        # Wait for the prompts container to be visible
        prompts_container = page.locator("#prompts-container")
        await expect(prompts_container).to_be_visible()

        # Wait for the "Metaprompt" button to appear.
        # This confirms the GitHub API call was successful and the DOM was populated.
        # We give it a longer timeout because the API call can be slow.
        metaprompt_button = page.get_by_role("button", name="Metaprompt")
        await expect(metaprompt_button).to_be_visible(timeout=15000)

        # The original file had a special character. The GitHub API will return it as is.
        # The button name should be the filename without .txt
        relatorio_button = page.get_by_role("button", name="Prompt relatório de processos")
        await expect(relatorio_button).to_be_visible()

        # Click the metaprompt button to expand it
        await metaprompt_button.click()

        # Wait for the content to be visible
        prompt_content = prompts_container.locator(".prompt-content").first
        await expect(prompt_content).to_be_visible()

        # Take a screenshot
        await page.screenshot(path="jules-scratch/verification/verification.png")

        await browser.close()

if __name__ == "__main__":
    # The create_file_with_block tool will create parent directories
    asyncio.run(main())
