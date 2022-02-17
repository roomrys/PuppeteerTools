// 'use strict';

const {google} = require('googleapis');
const express = require('express');
const path = require('path');
const fs = require('fs');
const { Spreadsheet } = require('./sheets-objects');
const { Contact } = require("./lightspeed-objects.js");
const { MomentAppPrivate } = require("./private/sheets-private.js")

let MomentApp = new Spreadsheet(MomentAppPrivate.spreadsheetId)
MomentApp.addTable("customers", "Customers");
MomentApp.tables.customers.addHeader("firstName", "First Name");
MomentApp.tables.customers.addHeader("nickName", "Nickname");
MomentApp.tables.customers.addHeader("lastName", "Last Name");
MomentApp.tables.customers.addHeader("title", "Title");
MomentApp.tables.customers.addHeader("company", "Company");
MomentApp.tables.customers.addHeader("birthMonth", "BirthMonth");
MomentApp.tables.customers.addHeader("birthDay", "BirthDay");
MomentApp.tables.customers.addHeader("primaryDiscpline", "Primary Discipline");
MomentApp.tables.customers.addHeader("signInEmail", "Sign-In Email");
MomentApp.tables.customers.addHeader("contactEmail", "Contact Email");
MomentApp.tables.customers.addHeader("phone", "Phone");
MomentApp.tables.customers.addHeader("contactPreference", "Contact Preference");
MomentApp.tables.customers.addHeader("shippingAddress", "Shipping Address");
MomentApp.tables.customers.addHeader("primaryStore", "Primary Store");

const keyfile = path.join(__dirname, '/private/service-credentials.json');
const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const app = express();

// middleware
app.use(authClient)

// routes
app.get("/getTable/id=:sheetsID/title=:tableTitle", authClient, async (req, res) => {

    const spreadsheetId = req.params.sheetsID;
    const tableTitle = req.params.tableTitle;
    const auth = req.auth

    // Get metadata of spreadsheet
    const metaData = await req.googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });

    // Read rows from spreadsheet
    const getRows = await req.googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: tableTitle
    });
    
    const headers = getRows.data.values[0];
    console.log(MomentApp.tables.customers.headers.signInEmail.getColumnIndex(headers))
    
    MomentApp.tables.customers.getHeadersIndices(headers)

    res.send(getRows.data.values[0])

    // let contactInfo = new Contact(firstName="first", lastName="Spoof Customer Last Name");
    // contactInfo.setAddress(street="1234 Someplace Somewhere", streetCont="", city="San Diego", country="United States", state="California", zip="98765");
    // contactInfo.setPhone(home="", work="", mobile="9876543210");
    // contactInfo.setEmail(primary="address@email.address");
    // contactInfo.setEct(birthMonth="01", birthDay="01");

    // res.json(contactInfo);
});


// functions
async function authClient(req, res, next) {
    // Create an GoogleAuth client to authorize the API call
    req.auth = new google.auth.GoogleAuth({
        keyFile: keyfile,
        scopes: scopes
    });

    // Create client instance for auth
    req.client = await req.auth.getClient();

    // Instance of Google Sheets API
    req.googleSheets = google.sheets({
        version: "v4",
        auth: req.client
    });

    next();
};

function getHeadersColumnIdx() {

}

// start server
const port = 3000
app.listen(port, (req, res) => console.log(`running on ${port}`))