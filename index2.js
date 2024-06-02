import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
 
// use the RecaptchaPlugin with the specified provider (2captcha) and token
puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: '2captcha',
      token: 'f0161f9d56cc00385cba94282637aec1' 
    },
    visualFeedback: true // enable visual feedback (colorize reCAPTCHAs)
  })
)
 
// launch a headless browser instance
puppeteer.launch({ headless: true }).then(async browser => {
  // create a new page
  const page = await browser.newPage()
 
  // navigate to a page containing a reCAPTCHA challenge
  await page.goto('https://2captcha.com/demo/normal')
 
  // automatically solve the reCAPTCHA challenge
  await page.solveRecaptchas()
 
  // wait for the navigation and click the submit button
  await Promise.all([
    page.waitForNavigation(),
    page.click(`input[id="simple-captcha-field"]`)
  ])
 
  // take a screenshot of the response page
  await page.screenshot({ path: 'response.png', fullPage: true })
 
  // close the browser
  await browser.close()
})
