const { intersects } = require("prettier")
const puppeteer = require("puppeteer")

// BUG! observation: first page.type element called on page is sometimes skipped/not entered
// ..... possible causes: use of puppeteer, src puppeteer, use of async functions

// TODO: extract workOrderInfo (with following structure) from 
// ..... Google Sheets using either AppScript or Sheets API
const workOrderInfo = {
    contact: { // all the contact info required by new work order form
        firstName: "Spoof Customer First Name",
        lastName: "Spoof Customer Last Name",
        address: {
            street: "1234 Someplace Somewhere",
            streetCont: "",
            city: "San Diego",
            country: "United States",
            state: "California",
            zip: "98765"
        },
        phone: {
            home: "",
            work: "",
            mobile: "9876543210"
        },
        email: {
            primary: "address@email.address",
            alternate: ""
        },
        birthdate: {
            day: "1",
            month: "1"
        },
        type: "None"
    }
}

// run the function
lightspeed('notmylogin', 'notmypassword', workOrderInfo)

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
    await page.goto(lightspeedLoginURL)

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
    const firstNameNameAttr = 'f_name'
    const lastNameNameAttr = 'l_name'
    const streetAddressNameAttr = 'address1'
    const streetAddressContNameAttr = 'address2'

    await page.goto(newWorkOrderURL)

    // find/create customer
    // TODO: write loop that iterates through input elements and associated workOrderInfo
    await page.waitForSelector('input' + "[name=" + firstNameNameAttr + "]")
    await page.type("input" + "[name=" + firstNameNameAttr + "]", workOrderInfo.contact.firstName)
    await page.type("input" + "[name=" + lastNameNameAttr + "]", workOrderInfo.contact.lastName)
    await page.type("input" + "[name=" + streetAddressNameAttr + "]", workOrderInfo.contact.address.street)
    await page.type("input" + "[name=" + streetAddressContNameAttr + "]", workOrderInfo.contact.address.streetCont)

    // TODO: scan workorder customer matches list for matching name and number|address|email
    //      if multiple matches, take customer with most matching fields (most data)

    // TODO: either click on matched customer or click create new customer button

    // BIGTODO: fill in work order with data from workOrderInfo
}