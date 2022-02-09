const { intersects } = require("prettier")
const puppeteer = require("puppeteer")
const { lightspeedPrivate } = require("./private.js")
const { Contact } = require("./lightspeed-objects.js")


// TODO: extract workOrderInfo from Google Sheets using either AppScript or Sheets API
let workOrderInfo = {contact: new Contact(firstName="Spoof Customer First Name", lastName="Spoof Customer Last Name")};
workOrderInfo.contact.setAddress(street="1234 Someplace Somewhere", streetCont="", city="San Diego", country="United States", state="California", zip="98765");
workOrderInfo.contact.setPhone(home="", work="", mobile="9876543210");
workOrderInfo.contact.setEmail(primary="address@email.address");
workOrderInfo.contact.setEct(birthMonth="01", birthDay="01");

// run the function
lightspeed(lightspeedPrivate.username, lightspeedPrivate.password, workOrderInfo)

// -----------------------------------------------------------------------
// all the fun!...ctions--------------------------------------------------
// -----------------------------------------------------------------------
async function lightspeed(userName, passWord, workOrderInfo) {
    // open the browser
    const browser = await puppeteer.launch({headless:false, slowMo: 50, devtools:true})
    const page = await browser.newPage()

    // login into lightspeed from login page
    await login(page, userName, passWord)
    console.log(page.url())
    await page.waitForTimeout(1000)

    // once logged in, create a new work order
    await createNewWorkOrder(page, workOrderInfo)
    console.log(page.url())
    await page.waitForTimeout(5000)

    // close the browser
    await browser.close()
}

async function login(page, lightspeedLogin, lightspeedPassword) {
    // variables that may change as lightspeed updates their webpage
    const lightspeedLoginURL = "https://cloud.lightspeedapp.com/login.html"
    const loginElementID = '#login-input'
    const passwordElementID = '#password-input'
    const submitElementID = '#submitButton'

    // go to the lightspeed login page
    await page.goto(lightspeedLoginURL, {waitUntil: 'networkidle2'})

    // input and submit login credentials
    await page.waitForSelector('input' + loginElementID)
    await page.type(loginElementID, lightspeedLogin)
    await page.waitForSelector('input' + passwordElementID)
    await page.type(passwordElementID, lightspeedPassword)
    await page.waitForSelector('button' + submitElementID)
    await Promise.all([
        page.waitForNavigation(),
        page.click(submitElementID)
    ]);
}

async function createNewWorkOrder(page, workOrderInfo) {
    // variables that may change as lightspeed updates their webpage
    // TODO: use query selector all to get all input elements on this page
    // TODO: pair query selector inputs with workOrderInfo values
    const newWorkOrderURL = "https://us.merchantos.com/?name=workbench.views.beta_workorder&form_name=view&id=undefined&tab=details"

    await page.goto(newWorkOrderURL, {waitUntil: 'networkidle2'})

    // find/create customer
    // TODO: write loop that iterates through input elements and associated workOrderInfo
    for (const [_, value] of Object.entries(contactDOMs.contact)) {
        for (const [_, innerValue] of Object.entries(value)) {
            console.log(`${innerValue.getAttributeQuery()}`)
            await page.type(`${innerValue.getAttributeQuery()}`, workOrderInfo.contact[''])
        }
    }
    await page.type(workOrderInfo.contact.name.first.getAttributeQuery(first), workOrderInfo.contact.name.first.userInput)
    await page.type(workOrderInfo.contact.name.first.getAttributeQuery(last), workOrderInfo.contact.name.first.userInput)
    await page.type(workOrderInfo.contact.name.first.getAttributeQuery(street), workOrderInfo.address.street.userInput)
    await page.type(workOrderInfo.contact.name.first.getAttributeQuery(streetCont), workOrderInfo.address.streetCont.userInput)

    // TODO: scan workorder customer matches list for matching name and number|address|email
    //      if multiple matches, take customer with most matching fields (most data)

    // TODO: either click on matched customer or click create new customer button

    // BIGTODO: fill in work order with data from workOrderInfo
}