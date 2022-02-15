const { intersects } = require("prettier")
const puppeteer = require("puppeteer")
const { lightspeedPrivate } = require("./private.js")
const { Contact, Login } = require("./lightspeed-objects.js")
const { consoleColor } = require("./utility.js")


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
    consoleColor.purple(page.url())
    await page.waitForTimeout(1000)

    // // once logged in, create a new work order
    // await createNewWorkOrder(page, workOrderInfo)
    // console.log(page.url())
    // await page.waitForTimeout(5000)

    // close the browser
    await browser.close()
}

async function login(page, username, password) {
    // variables that may change as lightspeed updates their webpage
    const loginURL = "https://cloud.lightspeedapp.com/login.html"
    lightspeedLogin = new Login(username, password, loginURL, page)

    // go to the lightspeed login page
    consoleColor.purple(lightspeedLogin.url)
    await page.goto(lightspeedLogin.url, {waitUntil: 'networkidle2'})
    const usernameDOM = await page.$('#login-input')
    const passwordDOM = await page.$('#password-input')
    const submitDOM = await page.$('#submitButton')

    // input and submit login credentials
    await lightspeedLogin.username.getSelectorQuery(usernameDOM)
    .then((query) => page.type(query, lightspeedLogin.username.userInput))
    await lightspeedLogin.password.getSelectorQuery(passwordDOM)
    .then((query) => page.type(query, lightspeedLogin.password.userInput))

    // hit submit and wait for navigation
    await lightspeedLogin.password.getSelectorQuery(submitDOM)
    .then(async (query) => {
        await Promise.all([
        page.waitForNavigation(),
        page.click(query)
    ])}
    )
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
            consoleColor.purple(`${innerValue.getAttributeQuery()}`)
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