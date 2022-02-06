import { inspect } from "node:util";

import { test, expect } from "@playwright/test";
import slugify from "@sindresorhus/slugify";

import Persona from "../lib/persona.mjs";
import StripeCreditCards from "../lib/stripe-credit-cards.mjs";

// NOTE: This "dev" server actually points to the "stage" FxA stack.
const VPN_PAGE_HOST =
  process.env.VPN_PAGE_HOST || "https://www-dev.allizom.org";
const VPN_PAGE_URL = new URL("/en-US/products/vpn/", VPN_PAGE_HOST).href;
const TYPE_DELAY = 100; // ms

test("unauthenticated user buying VPN subscription w/o a Firefox Account", async ({
  page,
}, workerInfo) => {
  // NOTE: I'm hardcoding this to VISA cards. I think I'm seeing cases where ZIP codes aren't always appearing.
  const user = new Persona(StripeCreditCards.VISA).valueOf();
  user.restmail = `https://restmail.net/mail/${user.email}`;
  console.info(inspect({ user }, { depth: 5 }));

  const getVpnButtonSelector = "text=Get Mozilla VPN";
  const vpnPlanLabel = `text=Get 12-month plan`;
  const newUserEmailSelector = '[data-testid="new-user-email"]';
  const newUserConfirmEmailSelector = '[data-testid="new-user-confirm-email"]';
  const confirmButtonSelector = '[data-testid="confirm"]';
  const nameSelector = '[data-testid="name"]';
  const ccNumberSelector = '[name="cardnumber"]';
  const ccExpSelector = '[placeholder="MM / YY"]';
  const ccCvvSelector = '[placeholder="CVC"]';
  const zipSelector = '[placeholder="ZIP"]';
  const submitButtonSelector = '[data-testid="submit"]';

  await page.goto(VPN_PAGE_URL);

  await page.click(getVpnButtonSelector);
  await expect(page).toHaveURL(`${VPN_PAGE_URL}#pricing`);

  await Promise.all([page.waitForNavigation(), page.click(vpnPlanLabel)]);

  // Fill in new user email address
  await page.click(newUserEmailSelector);
  await page.type(newUserEmailSelector, user.email, { delay: TYPE_DELAY });

  // Confirm new user email address
  await page.click(newUserConfirmEmailSelector);
  await page.type(newUserConfirmEmailSelector, user.email, {
    delay: TYPE_DELAY,
  });

  await page.check(confirmButtonSelector);
  await page.click(nameSelector);
  await page.type(nameSelector, user.name.fullName, { delay: TYPE_DELAY });

  // HACK: Not 100% certain why, but I think the Stripe stuff is lazy loaded. Scrolling
  // to the bottom of the page seems to force it to render. :shrug:
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  // NOTE: The iframe `name` attribute is different each time, so we have to scrape it from the page.
  // I tried filtering by URL, but looks like Stripe adds ~4 iframes.
  const privateStripeFrameName = await page.getAttribute(
    ".StripeElement iframe",
    "name"
  );
  const stripeFrame = await page.frame({ name: privateStripeFrameName });

  await stripeFrame.click(ccNumberSelector);
  await stripeFrame.type(ccNumberSelector, user.cc.number, {
    delay: TYPE_DELAY,
  });
  await stripeFrame.type(
    ccExpSelector,
    `${user.cc.exp.month} / ${user.cc.exp.year}`,
    { delay: TYPE_DELAY }
  );
  await stripeFrame.type(ccCvvSelector, user.cc.cvv, { delay: TYPE_DELAY });
  await stripeFrame.type(zipSelector, user.zipCode, { delay: TYPE_DELAY });

  // Submit the form. This should result in 2 emails to our @restmail account, which
  // https://restmail.net/ (template: GET `/mail/<user>@<my domain>`; or https://restmail.net/mail/subplat-001@restmail.net
  // Also, sounds like "by default, emails are deleted after one day.", and there is a 10-email per box maximum (which likely won't impact us; unclear on what happens on email 11 if it pushes out 1, or bounces or crashes the universe)
  await page.click(submitButtonSelector);

  // TODO: Hide the floating header which overlaps some elements in the screenshot.
  await page.screenshot({
    path: slugify(workerInfo.title) + ".png",
    fullPage: true,
  });


  // Click text=Subscription confirmation
  await page.click('text=Subscription confirmation');
  await page.screenshot({
    path: "conf.png"
  })

  // TODO: Add some more asserts to verify the form submitted successfully.
  // For example, we should wait for this to redirect and finish loading, then possibly verify we got the
  // 2 emails in restmail. I'm spot checking a couple Restmail inboxes and not seeing my emails. So there
  // is either a delay, or the form action failed after clicking submit.
});
