// Copyright 2018 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START main_body]
const {google} = require('googleapis');
const express = require('express');
const opn = require('open');
const path = require('path');
const fs = require('fs');
const {MomentApp} = require('./private/sheets-private');

const keyfile = path.join(__dirname, '/private/service-credentials.json');
const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const app = express();
app.get("/", async (req, res) => {
    // Create an oAuth2 client to authorize the API call
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

    // Get metadata of spreadsheet
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });

    res.send(metaData.data)
});

const port = 3000
app.listen(port, (req, res) => console.log(`running on ${port}`))