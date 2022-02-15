consoleColor = {
    codes: {
        red: '91',
        green: '92',
        yellow: '93',
        blue: '34',
        purple: '95',
        cyan: '96'
    },
    base(ansiCode, stringToPrint) {
        console.log(`\x1b[${ansiCode}m%s\x1b[0m`, stringToPrint)
    },
    yellow(stringToPrint) {
        this.base(this.codes.yellow, stringToPrint)
    },
    blue(stringToPrint) {
        this.base(this.codes.blue, stringToPrint)
    },
    purple(stringToPrint) {
        this.base(this.codes.purple, stringToPrint)
    },
    green(stringToPrint) {
        this.base(this.codes.green, stringToPrint)
    },
    cyan(stringToPrint) {
        this.base(this.codes.cyan, stringToPrint)
    },
    red(stringToPrint) {
        this.base(this.codes.red, stringToPrint)
    },
}

/**
 * @class
 * @classdesc Class to associate a user input to a DOM element.
 * Takes in userInput to set this.userInput in constructor.
 * User must later specify DOM Element this.dom with setDomElement(dElement) where dElement=document.getElementByID() or related method.
 * Then, the attributes this.attributesObj of this.dom can be found using setter domAttributes().
 * Lastly, a CSS Selector query can be produced using the getter attributeQuery().
 */
 class HasDomElement {
    /**
     * @constructor
     * Sets user input, no DOM Element attached yet.
     * @param {String} userInput - Value of user input to be entered in DOM Element
     */
    constructor(userInput, page) {
        this.userInput = userInput
        this.page = page
    }

    async getDOM(query) {
        var that = this
        await this.page.$(query)
        .then((dElement) => that.setDomElement(dElement))
    }

    /**
     * @method setDomElement
     * Stores the Document Object Model of selected element in this.dom. Also retrieves tagName of this.dom, stored in this.element
     * @param {Object} dElement - The Document Object Model of selected element. Retireved using document.getElementById or related methods.
     */
    setDomElement(dElement) {
        this.dom = dElement
    }

    getTag() {
        return this.page.evaluate((dElement) => dElement.tagName, this.dom)
        .then((tag) => {consoleColor.yellow(`getTag tag = \n${(tag)}`); return tag})
    }

    /**
     * @method domAttributes
     * Gets all attributes of DOM Element this.dom and stores attributes in this.attributesObj
     * Also sets this.id and this.class if these attributes exist
     */
    domAttributes() {                                            
        return this.page.evaluate( (dom) => {
            attributesObj = {}
            for (let i = 0, attr = dom.attributes; i < attr.length; i++) {
                attributesObj[attr[i].nodeName] = attr[i].value
            }
            return attributesObj
        }, this.dom)
        .then((attributesObj) => {
            consoleColor.cyan(`attributesObj then = ${JSON.stringify(attributesObj)}`)
            if ("id" in attributesObj) {
                // set id and remove from attributesObj
                var ID = attributesObj["id"]
                delete attributesObj["id"]
                consoleColor.purple(`domAttributes attributesObj = \n${JSON.stringify(attributesObj)}`)
            } 
            else { ID = null }
            if ("class" in attributesObj) {
                // split classes into array where spaces mark separate classes, delete from attributesObj
                var CLASS = attributesObj["class"].split(" ")
                delete attributesObj["class"]
                consoleColor.yellow(`domAttributes attributesObj = \n${JSON.stringify(attributesObj)}`)
            }
            else { CLASS = null }
            consoleColor.green(`domAttributes attributesObj = \n${JSON.stringify(attributesObj)}`)
            return {attributesObj, ID, CLASS}
        })
        .then(({attributesObj, ID, CLASS}) => {
            consoleColor.blue(`domAttributes attributesObj = ${JSON.stringify(attributesObj)}`)
            consoleColor.blue(`domAttributes ID = \n${(ID)}`)
            consoleColor.blue(`domAttributes CLASS = \n${(CLASS)}`)
            return {attributesObj, ID, CLASS}
        })
    }

    /**
     * @method attributeQuery
     * Outputs CSS Selector Query using attributes in this.attributesObj
     * @returns {String}
     */
    async getSelectorQuery(dElement) {
        var that = this
        return this.getTag(dElement)
        .then((tag) => {
            let query = tag
            return that.domAttributes().then(({attributesObj, ID, CLASS}) => {
        
                if (ID !== null) {
                    // if this.id property exists, then only need to use this.id to describe element
                    query = query + "#" + ID
                    return query
                }
                if (CLASS != null) {
                    query = query + "." + CLASS.join(".")
                }
                for (const attr in attributesObj) {
                    query = `${query}[${attr}="${attributesObj[attr]}"]`
                }
                return query
            })
        })
        .then((query)=> {consoleColor.cyan(`getSelectorQuery query = \n${query}`); return query})
    }

    async enterInput() {
        var that = this
        await this.getSelectorQuery()
        .then((query) => that.page.type(query, that.userInput))
    }

    async clickDOM() {
        var that = this
        await this.getSelectorQuery()
        .then(async (query) => {
            await Promise.all([
            that.page.waitForNavigation(),
            that.page.click(query)
        ])}
        )
    }
}

module.exports = {consoleColor, HasDomElement};