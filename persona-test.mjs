import Persona from "./lib/persona.mjs";
import StripeCreditCards from "./lib/stripe-credit-cards.mjs";

// Use any random Stripe credit card.
// NOTE: The credit card type argument is optional. Default will return a random
// Visa, Mastercard, American Express, or Discover card (or maybe Diners Club, JCB, or UnionPay).
const user1 = new Persona(StripeCreditCards.VISA);
console.log(user1.valueOf());
/* OUTPUT: This is an raw object.
  {
    name: {
      firstName: 'Rollin',
      lastName: 'Turner',
      fullName: 'Rollin Turner'
    },
    email: 'Rollin.Turner18@restmail.net',
    website: 'https://restmail.net/mail/Rollin.Turner18@restmail.net',
    password: 'Rollin.Turner18restmail.net',
    zipCode: '60112',
    cc: {
      number: '4242424242424242',
      brand: 'Visa',
      _cvv: 'Any 3 digits',
      cvv: '529',
      _exp: 'Any future date',
      exp: { month: 6, year: 24 }
    }
  }
*/

console.log(JSON.stringify(user1, null, 2));
/* OUTPUT: This is a string (and note it removed the `cc._cvv` and `cc._exp` properties).
  {
    "name": {
      "firstName": "Rollin",
      "lastName": "Turner",
      "fullName": "Rollin Turner"
    },
    "email": "Rollin.Turner18@restmail.net",
    "website": "https://restmail.net/mail/Rollin.Turner18@restmail.net",
    "password": "Rollin.Turner18restmail.net",
    "zipCode": "60112",
    "cc": {
      "number": "4242424242424242",
      "brand": "Visa",
      "cvv": "529",
      "exp": {
        "month": 6,
        "year": 24
      }
    },
    "_faker": true
  }
*/
