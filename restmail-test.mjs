import { inspect } from "node:util";

import * as Restmail from "./lib/restmail.mjs";

// const { data: emails } = await Restmail.fetchInbox("Horace62@restmail.net");

const signupEmail = await getEmailByHeader(
  "Horace62@restmail.net", // Or an array of emails from a mailbox.
  "x-template-name",
  "subscriptionAccountFinishSetup"
);
console.log("signupEmail:", inspect(signupEmail, { sorted: true }));

async function getEmailByHeader(emailsOrAddress, headerName = "", headerValue = "") {
  let emails = emailsOrAddress;
  if (!Array.isArray(emailsOrAddress)) {
    const res = await Restmail.fetchInbox(emailsOrAddress);
    emails = res.data;
  }
  return emails?.find(
    (email) => email.headers[headerName] === headerValue
  );
}
