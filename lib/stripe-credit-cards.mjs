import { faker } from "@faker-js/faker";

/**
 * @typedef {Object} CardExpiry
 * @property {number} month Credit card expiry month.
 * @property {number} year Credit card expiry year.
 */

/**
 * @typedef {Object} Card
 * @property {String} number
 * @property {String} [note]
 * @property {String} brand
 * @property {String} cvv
 * @property {CardExpiry} exp
 */

/**
 * @typedef {Object} StripeCard
 * @property {String} number
 * @property {String} [note]
 * @property {String} brand
 */

export default class StripeCreditCards {
  static get AMERICAN_EXPRESS() {
    return "American Express";
  }
  static get DINERS_CLUB() {
    return "Diners Club";
  }
  static get DISCOVER() {
    return "Discover";
  }
  static get JCB() {
    return "JCB";
  }
  static get MASTERCARD() {
    return "Mastercard";
  }
  static get UNIONPAY() {
    return "UnionPay";
  }
  static get VISA() {
    return "Visa";
  }

  /**
   * @return {Map<String, StripeCard>}
   */
  static get stripeCards() {
    // https://stripe.com/docs/testing
    return [
      [
        this.VISA,
        [
          { number: "4242424242424242" },
          { number: "4000056655665556", note: "debit" },
          { number: "4000002760003184", note: "authentication required" },
        ],
      ],
      [
        this.MASTERCARD,
        [
          { number: "5555555555554444" },
          { number: "2223003122003222", note: "2-series" },
          { number: "5200828282828210", note: "debit" },
          { number: "5105105105105100", note: "prepaid" },
        ],
      ],
      [
        this.AMERICAN_EXPRESS,
        [{ number: "378282246310005" }, { number: "371449635398431" }],
      ],
      [
        this.DISCOVER,
        [{ number: "6011111111111117" }, { number: "6011000990139424" }],
      ],
      [
        this.DINERS_CLUB,
        [
          { number: "3056930009020004" },
          { number: "36227206271667", note: "14 digit card" },
        ],
      ],
      [this.JCB, [{ number: "3566002020360505" }]],
      [this.UNIONPAY, [{ number: "6200000000000005" }]],
    ].reduce((acc, [brand = "", cards = []]) => {
      acc.set(
        brand,
        cards.map((card) => Object.assign(card, { brand }))
      );
      return acc;
    }, new Map());
  }

  /**
   * @param {number} [years]
   * @returns {CardExpiry}
   */
  static getRandomExp(years = 5) {
    const cc_date = faker.date.future(years);
    // NOTE: JavaScript months are zero based.
    const cc_exp_month = cc_date.getMonth() + 1;
    // Convert to 2-digit year.
    const cc_exp_year = cc_date.getYear() - 100;
    return {
      month: cc_exp_month,
      year: cc_exp_year,
    };
  }

  /**
   * @param {string} [brand] A credit card vendor (ie: Visa, Mastercard, American Express, etc).
   * @returns {Card} A random Stripe test card number, ccv, and expiry month/year.
   */
  static getRandomCard(brand) {
    let cards = [];

    if (!brand) {
      // If we aren't looking for a specific credit card brand, fetch any random card.
      cards = Array.from(this.stripeCards.values());
    } else {
      // Filter the credit cards by the specified brand (ie: Visa, Mastercard, Amex, Discover, etc).
      cards = this.stripeCards.get(brand);
    }

    return {
      ...faker.random.arrayElement(cards.flat()),
      _cvv: "Any 3 digits",
      cvv: faker.finance.creditCardCVV(),
      _exp: "Any future date",
      exp: this.getRandomExp(),
    };
  }
}
