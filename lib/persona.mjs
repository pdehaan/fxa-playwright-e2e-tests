import { faker } from "@faker-js/faker";
import * as Restmail from "./restmail.mjs";
import StripeCreditCards from "./stripe-credit-cards.mjs";

const DEFAULT_EMAIL_DOMAIN = new URL(Restmail.RESTMAIL_URL).hostname;

export default class Persona {
  /**
   * @param {string} [cc_brand]
   * @param {string} [domain] 
   */
  constructor(cc_brand, domain = DEFAULT_EMAIL_DOMAIN) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email(
      firstName,
      lastName,
      domain || DEFAULT_EMAIL_DOMAIN
    );

    this._persona = {
      name: {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
      },
      email,
      password: faker.helpers.slugify(email),
      zipCode: faker.address.zipCode(),
      cc: StripeCreditCards.getRandomCard(cc_brand),
    };
  }

  valueOf() {
    return this._persona;
  }

  toJSON() {
    // Inject some stuff.
    const tmp = { ...this._persona, _faker: true };
    // Delete some stuff.
    delete tmp.cc._ccv;
    delete tmp.cc._exp;
    return tmp;
  }
}
