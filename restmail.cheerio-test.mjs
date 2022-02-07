import cheerio from "cheerio";

import inbox from "./restmail.inbox.mjs";
import * as Restmail from "./lib/restmail.mjs";

// for (const email of inbox) {
//   console.log(email.headers);
// }

const invoiceEmail = await Restmail.getEmailByHeader(inbox, "x-template-name", "subscriptionFirstInvoice");

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

const {invoiceTotal } = JSON.parse(el.attr('data-l10n-args'));
// OUTPUT: `{ 'data-l10n-args.invoiceTotal': '$59.88' }`
console.log({"data-l10n-args.invoiceTotal": invoiceTotal});
