import { faker } from "@faker-js/faker";
import * as Restmail from "./restmail.mjs";
import StripeCreditCards from "./stripe-credit-cards.mjs";

const DEFAULT_EMAIL_DOMAIN = new URL(Restmail.RESTMAIL_URL).hostname;

export default class Persona {
  /**
   * @param {string} [cc_brand]
   * @param {string} [domain="restmail.net"] 
   */
  constructor(cc_brand, domain = DEFAULT_EMAIL_DOMAIN) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    // Create a fake email address roughly based on the user's random name.
    // TODO: Add more randomization if this isn't unique enough.
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
      website: email.endsWith("@restmail.net") ? `https://restmail.net/mail/${email}` : undefined,
      // Predictable password based on slugified email address (mostly strips out the "@" symbol).
      // This isn't needed for restmail, but is used when completing FxA setup.
      // NOTE: If this isn't strong enough to pass FxA password requirements, we can add special characters or something.
      password: faker.helpers.slugify(email),
      zipCode: faker.address.zipCode(),
      cc: StripeCreditCards.getRandomCard(cc_brand),
      now: new Date(),
    };
  }

  valueOf() {
    return this._persona;
  }

  toJSON() {
    // Use a custom `replacer` function to remove any keys starting with an underscore.
    let tmp = JSON.stringify(this._persona, (key, value) => {
      if (key.startsWith("_")) {
        return undefined;
      }
      return value;
    });
    tmp = JSON.parse(tmp);
    // Inject some bogus property, just for fun.
    tmp._faker = true;
    return tmp;
  }
}
