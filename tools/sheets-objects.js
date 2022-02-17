class Header {
    constructor(name) {
        this.name = name
        this.column = null
    }

    /**
     * @param {Number} column
     */
    getColumnIndex(headersArray) {
        this.column = headersArray.indexOf(this.name)
        if (this.column == -1) {
            console.log(`Header ${this.name} is not present in table.`)
        }
        return this.column
    }
}

class Table {
    constructor(title, headers={}) {
        this.title = title;
        this.headers = headers;
    };

    addHeader(headerAlias, headerName) {
        this.headers[headerAlias] = new Header(headerName);
    };

    getHeadersIndices(headersArray) {
        for (const [_, header] of Object.entries(this.headers)) {
            header.getColumnIndex(headersArray)
        }
    }
};

class Spreadsheet {
    constructor(spreadsheetId, tables={}) {
        this.spreadsheetId =  spreadsheetId;
        this.tables = tables;
    };

    addTable(tableAlias, tableTitle, tableHeaders={}) {
        this.tables[tableAlias] = new Table(tableTitle, tableHeaders);
    };
};

module.exports = { Table, Spreadsheet };