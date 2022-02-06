import axios from "axios";

export const RESTMAIL_URL = "https://restmail.net/";

export async function fetchInbox(user) {
  const url = new URL(`/mail/${user}`, RESTMAIL_URL);
  console.info(`Fetching ${url}`);
  const res = await axios.get(url.href);
  return res;
}
