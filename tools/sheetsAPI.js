'use strict';

const {google} = require('googleapis');
const express = require('express');
const path = require('path');
const fs = require('fs');
const {MomentApp} = require('./private/sheets-private');

const keyfile = path.join(__dirname, '/private/service-credentials.json');
const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const app = express();
app.get("/", async (req, res) => {
    // Create an GoogleAuth client to authorize the API call
    const auth = new google.auth.GoogleAuth({
        keyFile: keyfile,
        scopes: scopes
    });

    // Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({
        version: "v4",
        auth: client
    });

    const spreadsheetId = MomentApp.spreadsheetId;
    const tableTitle = MomentApp.customersTable;

    // Get metadata of spreadsheet
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });

    // Read rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: tableTitle
    });

    res.send(getRows.data);
    res.set(response)
});

const port = 3000
app.listen(port, (req, res) => console.log(`running on ${port}`))