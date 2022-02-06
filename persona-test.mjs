import Persona from "./lib/persona.mjs";
// import StripeCreditCards from "./lib/stripe-credit-cards.mjs";

// Use any random Stripe credit card.
const user1 = new Persona().valueOf();
// console.log(user1.valueOf());

console.log(user1.email);

/*
  {
    name: {
      firstName: 'Melisa',
      lastName: 'Walter',
      fullName: 'Melisa Walter'
    },
    email: 'Melisa.Walter9@restmail.net',
    password: 'Melisa.Walter9restmail.net',
    zipCode: '06558',
    cc: {
      number: '6200000000000005',
      brand: 'UnionPay',
      _cvv: 'Any 3 digits',
      cvv: '414',
      _exp: 'Any future date',
      exp: { month: 7, year: 2031 }
    }
  }
*/

// Use any random VISA Stripe credit card.
// const user2 = new Persona(StripeCreditCards.VISA);
// console.log(user2.valueOf());
/*
  {
    name: { firstName: 'Saige', lastName: 'Batz', fullName: 'Saige Batz' },
    email: 'Saige_Batz6@restmail.net',
    password: 'Saige_Batz6restmail.net',
    zipCode: '21003-3461',
    cc: {
      number: '4000056655665556',
      note: 'debit',
      brand: 'Visa',
      _cvv: 'Any 3 digits',
      cvv: '958',
      _exp: 'Any future date',
      exp: { month: 2, year: 2023 }
    }
  }
*/
