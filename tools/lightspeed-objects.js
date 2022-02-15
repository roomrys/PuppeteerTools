const { consoleColor, HasDomElement } = require("./utility.js")

/**
 * @class
 * @classdesc Class for all objects of type name.
 */
 class Name {
    /**
     * @constructor
     * Creates instance of HasDomElement for all input parameters.
     * @param {String} first - User specified first name
     * @param {String} last - User specified last name
     */
    constructor(first, last) {
        this.first = new HasDomElement(first);
        this.last = new HasDomElement(last);
    }
}

/**
 * @class
 * @classdesc Class for all objects of type address.
 */
class Address {
    /**
     * @constructor
     * Creates instance of HasDomElement for all input parameters.
     * @param {String} street - Street address, i.e. 12345 Somewhere Someplace
     * @param {String} streetCont - Street address continued, second line of street address if needed
     * @param {String} city -  City
     * @param {String} country - Country, no abbreviations
     * @param {String} state - State, no abbreviations
     * @param {String} zip - Zip code
     */
    constructor(street, streetCont, city, country, state, zip) {
        this.street = new HasDomElement(street);
        this.streetCont = new HasDomElement(streetCont);
        this.city = new HasDomElement(city);
        this.country = new HasDomElement(country);
        this.state = new HasDomElement(state);
        this.zip = new HasDomElement(zip);
    }
}

/**
 * @class
 * @classdesc Class for all objects of type phone.
 */
class Phone {
    /**
     * @constructor
     * Creates instance of HasDomElement for all input parameters.
     * @param {String} home - Home phone number
     * @param {String} work - Work phone number
     * @param {String} mobile - Mobile phone number
     */
    constructor(home, work='', mobile='') {
        this.home = new HasDomElement(home);
        this.work = new HasDomElement(work);
        this.mobile = new HasDomElement(mobile);
    }
}

/**
 * @class
 * @classdesc Class for all objects of type email.
 */
class Email {
    /**
     * Creates instance of HasDomElement for all input parameters.
     * @param {String} primary - Primary email address
     * @param {String} alternate - Alternate email address
     */
    constructor(primary, alternate='') {
        this.primary = new HasDomElement(primary);
        this.alternate = new HasDomElement(alternate);
    }
}

/**
 * @class
 * @classdesc Enum for Customer Type.
 * @readonly
 * @enum {String}
 */
class CustomerType {
    static None = new CustomerType('None')
    static Employee = new CustomerType('Employee')
    static MomentRacingRoad = new CustomerType('Moment Racing: Road')
    static MomentRacingClubTri = new CustomerType('Moment Racing: Club Tri')
    static TeamInTraining = new CustomerType('Team in Training')
    static ExecsAssociation = new CustomerType('Execs Association')
    static VIP = new CustomerType('VIP')
    static MomentRacingEliteTri = new CustomerType('Moment Racing: Elite Tri')
    static MomentRacingPro = new CustomerType('Moment Racing: Pro')
    static MtbShopRideLeaders = new CustomerType('Mtb shop ride leaders')
    static MomentMtbTeamMember = new CustomerType('Moment MTB team member')

    /**
     * @constructor
     * Creates values of CustomerType enum.
     * @param {String} value - Value of enum.
     */
    constructor(value){
        this.value = value
    }
}

/**
 * @class
 * @classdesc Class that includes instances of Birthdate and CustomerType.
 */
class Etc {
    /**
     * @constructor
     * Creates instance of HasDomElement for formatted birthdate and CustomerType.None
     * @param {String} birthMonth - Month of birth
     * @param {String} birthDay - Day of birth
     */
    constructor(birthMonth, birthDay) {
        this.birthdate = new HasDomElement(`2000-${birthMonth}-${birthDay}`)
        this.customerType = new HasDomElement(CustomerType.None)
    }

    /**
     * @method setCustomerType - Sets this.customerType if suggestedCustomerType is valid
     * @param {String} suggestedCustomerType - Customer Type to set.
     */
    set setCustomerType(suggestedCustomerType) {
        if (CustomerType[suggestedCustomerType] instanceof CustomerType) {
            // only set this.customerType if suggestion is in CustomerType enum.
            this.customerType.userInput = CustomerType[suggestedCustomerType]
        }
        else {
            console.log(`${suggestedCustomerType} is not an instance of CustomerType`)
            console.log(`this.cutomerType = ${this.customerType}`)
        }
    }
}

/**
 * @class
 * @classdesc Class for all objects of type contact.
 */
class Contact {
    /**
     * @constructor
     * Creates an instance of Name to set this.name property.
     * @param {String} first - User specified first name
     * @param {String} last - User specified last name
     */
    constructor(firstName, lastName, url) {
        this.name = new Name(firstName, lastName);
        this.url = url
    }

    /**
     * @method setAddress Creates an instance of Address to set this.address property.
     * @param {String} street - Street address, i.e. 12345 Somewhere Someplace
     * @param {String} streetCont - Street address continued, second line of street address if needed
     * @param {String} city -  City
     * @param {String} country - Country, no abbreviations
     * @param {String} state - State, no abbreviations
     * @param {String} zip - Zip code
     */
    setAddress(street, streetCont, city, country, state, zip) {
        this.address = new Address(street, streetCont, city, country, state, zip)
    }

    /**
     * @method setPhone Creates an instance of Phone to set this.phone property.
     * @param {String} home - Home phone number
     * @param {String} work - Work phone number
     * @param {String} mobile - Mobile phone number
     */
    setPhone(home, work='', mobile='') {
        this.phone = new Phone(home, work, mobile)
    }

    /**
     * @method setEmail Creates an instance of Email to set this.email property.
     * @param {String} primary - Primary email address
     * @param {String} alternate - Alternate email address
     */
    setEmail(primary, alternate='') {
        this.email = new Email(primary, alternate)
    }

    /**
     * @method setEtc Creates an instance of Etc to set this.etc property.
     * @param {String} birthMonth - Month of birth
     * @param {String} birthDay - Day of birth
     */
    setEct(birthMonth, birthDay) {
        this.etc = new Etc(birthMonth, birthDay)
    }
}

class Login {
    constructor(username, password, url, page) {
        this.username = new HasDomElement(username, page)
        this.password = new HasDomElement(password, page)
        this.button = new HasDomElement('')
        this.url = url
    }
}

module.exports = { Contact, Login }