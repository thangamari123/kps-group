# Google Sheets integration (Apps Script Web App)

Both public forms go **browser → Cloudflare Worker → your existing Apps Script Web App → KPS-WEB LEADS spreadsheet**.
The Web App URL lives only in the Worker secret `APPS_SCRIPT_URL`; the browser never sees it.

| Form | Worker route | Enquiry type | Where it is stored |
| --- | --- | --- | --- |
| Contact Us | none (opens WhatsApp from the browser) | n/a | not saved to the sheet; the `/api/contact` Worker route still exists but the form no longer calls it |
| Request a Quote | `POST /api/quotes` | `Quote Request` | new `Quote Requests` tab, handled by `QuoteRequests.gs` |

## One-time step: install the two script files in your existing Apps Script project

The project needs exactly two files. `Code.gs` is the only place that defines `doPost` and `doGet`.

1. Open the **existing** Apps Script project behind the KPS-WEB LEADS sheet (Extensions → Apps Script).
2. Replace the whole contents of `code.gs` with [`Code.gs`](./Code.gs) (it routes quotes first via `routeQuoteRequest_(e)`).
3. Make the quote file contain [`QuoteRequests.gs`](./QuoteRequests.gs) (Apps Script adds `.gs` to file names itself, so a file shown as
   `QuoteRequests.gs.gs` is fine). Do not add a second `doPost` or `doGet` anywhere.
4. If the project is not opened from the spreadsheet (it uses `openById`), add a Script property `SPREADSHEET_ID`.
5. **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy.** Keep the same deployment so the URL does not change.

Contact Us no longer goes through this script, so requests that are not quotes are refused (`unsupported_request`) and write nothing.

### Check the deployment without writing any data

```bash
curl -sL -H "Content-Type: text/plain" --data '{"enquiryType":"Quote Request"}' "<your Web app /exec URL>"
```

- `{"success":false,"error":"invalid"}` → the quote handler is live (nothing is written for an invalid payload).
- `{"success":false,"message":"Missing required field: …"}` (e.g. `name`) → the deployment is still the old code: the new version was not
  deployed, or `code.gs` was not replaced with `Code.gs` from this folder. Quote submissions will keep failing with an error.

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
