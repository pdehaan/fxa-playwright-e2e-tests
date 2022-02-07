import cheerio from "cheerio";

import * as Restmail from "./lib/restmail.mjs";
// Fetch the mock inbox from disk.
import inbox from "./restmail.inbox.mjs";

// Since the mock email inbox has two emails:
// - `"x-template-name": "subscriptionAccountFinishSetup"`
// - `"x-template-name": "subscriptionFirstInvoice"`
// ... make sure we extract and parse the correct one.
const invoiceEmail = await Restmail.getEmailByHeader(inbox, "x-template-name", "subscriptionFirstInvoice");

const {from, to, subject} = invoiceEmail.headers;
console.log({subject, from, to});
// OUTPUT: 
// ```
// {
//   "subject": "Mozilla VPN payment confirmed",
//   "from": "Firefox Accounts <verification@stage.mozaws.net>",
//   "to": "totally.fake.name@restmail.net"
// }
// ```

// NOTE: Instead of verifying the `headers`, we can also do the `subject`, `from`, and `to` properties directly:
// ```
// subject: "Mozilla VPN payment confirmed",
// from: [{
//   address: "verification@stage.mozaws.net",
//   name: "Firefox Accounts",
// }],
// to: [{
//   address: "totally.fake.name@restmail.net",
//   name: "",
// }]
// ```
// Although note that the non-header versions for `from` and `to` return arrays instead of single values,
// but also let's us verify `address` and `name` parts separately (if we want that option; probably not).


// Parse the "text" version of the email.
const textPrice = invoiceEmail.text.match(/(\$\d+\.\d{2})/g);
// NOTE: Could be fragile if the "text" version of the email ever contains more than one price.
// OUTPUT: `{ textPrice: [ '$59.88' ] }`
console.log({textPrice});

// Parse the "html" version of the email.
const $ = cheerio.load(invoiceEmail.html);
const el = $(`span[data-l10n-id="subscriptionFirstInvoice-content-charge"]`);
const htmlPrice = el.text();
// OUTPUT: `{ htmlPrice: 'Charged $59.88 on 02/07/2022' }`
console.log({htmlPrice});

// NOTE: The `data-l10n-args` attribute will look like JSON, but is a JSON-ified string.
const l10nArgs = el.attr('data-l10n-args');
// Convert the JSON-string `data-l10n-args` argument into an object.
const {invoiceTotal } = JSON.parse(l10nArgs);
// OUTPUT: `{ 'data-l10n-args.invoiceTotal': '$59.88' }`
console.log({"data-l10n-args.invoiceTotal": invoiceTotal});
