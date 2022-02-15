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
    const browser = await puppeteer.launch({
        args: [
            `--proxy-server =127.0.0.1:9876`,
        ],
        headless:false, 
        slowMo: 0, 
        devtools:true})
    const page = await browser.newPage()

    // login into lightspeed from login page
    await login(page, userName, passWord)
    consoleColor.purple(page.url())

    // once logged in, create a new work order
    await createNewWorkOrder(page, workOrderInfo)
    console.log(page.url())

    // close the browser
    await browser.close()
}

async function login(page, username, password) {
    // create login objects
    const loginURL = "https://cloud.lightspeedapp.com/login.html"
    lightspeedLogin = new Login(username, password, loginURL, page)

    // go to the lightspeed login page
    consoleColor.purple(lightspeedLogin.url)
    await page.goto(lightspeedLogin.url, {waitUntil: 'networkidle0'})

    // variables that could change (CSS Selectors)
    const loginSelector = '#login-input'
    const passwordSelector = '#password-input'
    const submitSelector = '#submitButton'

    // get all dom's to interact with
    await lightspeedLogin.username.getDOM(loginSelector)
    await lightspeedLogin.password.getDOM(passwordSelector)
    await lightspeedLogin.button.getDOM(submitSelector)

    // input and submit login credentials
    await enterAllInputsParent(lightspeedLogin)

    // hit submit and wait for navigation
    await lightspeedLogin.button.clickDOM()
}

async function createNewWorkOrder(page, workOrderInfo) {
    // go to new workorder page
    const newWorkOrderURL = "https://us.merchantos.com/?name=workbench.views.beta_workorder&form_name=view&id=undefined&tab=details"
    await page.goto(newWorkOrderURL, {waitUntil: 'networkidle0'})

    // get all dom's to interact with
    const fnameSelector = '[name="f_name"]'
    const lnameSelector = '[name="l_name"]'
    const address1Selector = '[name="address1"]'

    // get all dom's to interact with
    await workOrderInfo.contact.name.first.getDOM(fnameSelector)
    await workOrderInfo.contact.name.last.getDOM(lnameSelector)
    await workOrderInfo.contact.address.street.getDOM(address1Selector)


    // find/create customer
    // TODO: write loop that iterates through input elements and associated workOrderInfo
    await enterAllInputsGrandparent(workOrderInfo.contact)

    // TODO: scan workorder customer matches list for matching name and number|address|email
    //      if multiple matches, take customer with most matching fields (most data)

    // TODO: either click on matched customer or click create new customer button

    // BIGTODO: fill in work order with data from workOrderInfo
}

async function enterAllInputsParent(HasDomParentObject) {
    for (const[_, value] of Object.entries(HasDomParentObject)) {
        if ((value.userInput != null) && (value.userInput != 'undefined') ) {
            await value.enterInput()
        }
        consoleColor.red(`login value: value.userInput = \n${value}: ${value.userInput}`)
    }
}

async function enterAllInputsGrandparent(HasDomGrandparentObject) {
    for (const[_, HasDomParentObject] of Object.entries(HasDomGrandparentObject)) {
        await enterAllInputsParent(HasDomParentObject)
    }
}