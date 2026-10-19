# Google Sheets integration (Apps Script Web App)

Both public forms go **browser → Cloudflare Worker → your existing Apps Script Web App → KPS-WEB LEADS spreadsheet**.
The Web App URL lives only in the Worker secret `APPS_SCRIPT_URL`; the browser never sees it.

| Form | Worker route | Enquiry type | Where it is stored |
| --- | --- | --- | --- |
| Contact Us | `POST /api/contact` | (unchanged payload) | your existing Contact Us tab, handled by your existing code |
| Request a Quote | `POST /api/quotes` | `Quote Request` | new `Quote Requests` tab, handled by `QuoteRequests.gs` |

## One-time step: add quote handling to your existing Apps Script project

Your deployed script only knows the Contact Us payload, so it must be extended once. Until this is done, quote
submissions show an error (the Worker refuses to report success unless the script echoes the quote's submission ID back),
and Contact Us keeps working.

1. Open the **existing** Apps Script project behind the KPS-WEB LEADS sheet (Extensions → Apps Script).
2. Add a new file `QuoteRequests.gs` and paste the contents of [`QuoteRequests.gs`](./QuoteRequests.gs).
3. At the very top of your existing `doPost(e)` add:
   ```js
   var quoteReply = routeQuoteRequest_(e);
   if (quoteReply) return quoteReply;
   ```
   Contact Us requests return `null` from `routeQuoteRequest_` and continue into your existing code unchanged.
4. If the project is not opened from the spreadsheet (it uses `openById`), add a Script property `SPREADSHEET_ID`.
5. **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy.** Keep the same deployment so the URL does not change.

The `Quote Requests` tab is created on the first quote with these columns:

`Submission ID | Timestamp | Enquiry Type | Status | Name | Email | Country Code | Phone | Company | Service Required | Cargo Weight / Volume | Origin | Destination | Cargo Specifications`

`Enquiry Type` is always `Quote Request` and `Status` starts as `New`.

## Worker configuration

```bash
cd worker
npx wrangler secret put APPS_SCRIPT_URL   # the Web App /exec URL
npx wrangler deploy
```

Locally put `APPS_SCRIPT_URL` in `worker/.dev.vars` (see `.dev.vars.example`).

## Behaviour notes

- Success is shown only after the script confirms the save; any failure returns an error and the visitor's input is kept.
- Submission IDs are hashes of the enquiry content, so a double-click or retry stores one row (the script also ignores an ID it already holds).
- Per-IP rate limit (5 per 10 minutes, shared by both forms), honeypot field and minimum fill time.

## Tests

`cd worker && npm test` runs both forms through the Worker against fakes of the Apps Script (the Contact Us contract, and
`QuoteRequests.gs` itself loaded in a VM with an in-memory spreadsheet).
