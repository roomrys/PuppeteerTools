
/**
 * @class
 * @classdesc Class to associate a user input to a DOM element.
 * Takes in userInput to set this.userInput in constructor.
 * User must later specify DOM Element this.dom with setter domElement(dElement) where dElement=document.getElementByID() or related method.
 * Then, the attributes this.attributesObj of this.dom can be found using setter domAttributes().
 * Lastly, a CSS Selector query can be produced using the getter attributeQuery().
 */
 class HasDomElement {
    /**
     * @constructor
     * Sets user input, no DOM Element attached yet.
     * @param {String} userInput - Value of user input to be entered in DOM Element
     */
    constructor(userInput) {
        this.userInput = userInput
    }

    /**
     * @method getSelectorQuery
     * Returns CSS Selector query given dElement.
     * Calls domElement(), domAttributes(), and seletorQuery().
     * @param {Object} dElement - The Document Object Model of selected element. Retireved using document.getElementById or related methods.
     * @returns {String}
     */
    getSelectorQuery(dElement) {
        this.domElement = dElement
        this.domAttributes
        return this.selectorQuery
    }

    /**
     * @method domElement
     * Stores the Document Object Model of selected element in this.dom. Also retrieves tagName of this.dom, stored in this.element
     * @param {Object} dElement - The Document Object Model of selected element. Retireved using document.getElementById or related methods.
     */
    set domElement(dElement) {
        this.dom = dElement
        this.element = dElement.tagName
    }

    /**
     * @method domAttributes
     * Gets all attributes of DOM Element this.dom and stores attributes in this.attributesObj
     * Also sets this.id and this.class if these attributes exist
     */
    get domAttributes() {
        this.attributesObj = {}
        for (let i = 0, attr = this.dom.attributes; i < attr.length; i++) {
            this.attributesObj[attr[i].nodeName] = attr[i].value
        }
        if ("id" in this.attributesObj) {
            // set id and remove from attributesObj
            this.id = this.attributesObj["id"]
            delete this.attributesObj["id"]
        }
        if ("class" in this.attributesObj) {
            // split classes into array where spaces mark separate classes, delete from attributesObj
            this.class = this.attributesObj["class"].split(" ")
            delete this.attributesObj["class"]
        }
    }

    /**
     * @method attributeQuery
     * Outputs CSS Selector Query using attributes in this.attributesObj
     * @returns {String}
     */
    get selectorQuery() {
        let query = this.element
        if ("id" in this) {
            // if this.id property exists, then only need to use this.id to describe element
            query = query + "#" + this.id
            return query
        }
        if ("class" in this) {
            query = query + "." + this.class.join(".")
        }
        for (const attr in this.attributesObj) {
            query = `${query}[${attr}="${this.attributesObj[attr]}"]`
        }
        return query
    }
}

module.exports = {HasDomElement};