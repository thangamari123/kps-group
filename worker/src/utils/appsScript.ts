// Google Apps Script Web App client (Google Sheets storage for Contact Us enquiries)
//
// The Web App URL is a Worker secret (APPS_SCRIPT_URL): it is never sent to the browser and never hardcoded.
// The script accepts a flat JSON body {name, email, countryCode, phone, company, service, message}
// and answers {"success": true} once the row is written to the "KPS-WEB LEADS" sheet.
import type { Env } from '../types';

const REQUEST_TIMEOUT_MS = 15_000;

export interface SheetContactRow {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  company: string;
  service: string;
  message: string;
}

export type SheetResult = { ok: true } | { ok: false };

export function isAppsScriptConfigured(env: Env): boolean {
  return Boolean(env.APPS_SCRIPT_URL);
}

/** Only Google-hosted Apps Script URLs are accepted (localhost mocks are allowed in development only). */
function isAllowedScriptUrl(raw: string, env: Env): boolean {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol === 'https:' && url.hostname === 'script.google.com') return true;
  return env.ENVIRONMENT === 'development' && ['localhost', '127.0.0.1'].includes(url.hostname);
}

export interface SheetQuoteRow {
  enquiryType: 'Quote Request';
  submissionId: string;
  timestamp: string;
  status: 'New';
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  company: string;
  service: string;
  cargoWeight: string;
  origin: string;
  destination: string;
  cargoDetails: string;
}

/** POSTs a payload to the Web App; resolves the parsed reply only when it says {"success": true}. */
async function postToSheet(env: Env, payload: object): Promise<any | null> {
  if (!env.APPS_SCRIPT_URL || !isAllowedScriptUrl(env.APPS_SCRIPT_URL, env)) {
    console.error('Apps Script integration is not configured correctly (APPS_SCRIPT_URL).');
    return null;
  }

  try {
    const res = await fetch(env.APPS_SCRIPT_URL, {
      method: 'POST',
      // text/plain avoids a CORS preflight on Apps Script, which cannot answer OPTIONS requests.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!res.ok) {
      console.error('Apps Script returned HTTP', res.status);
      return null;
    }

    // Script errors and sign-in pages come back as HTML with HTTP 200, so JSON.parse is the real check.
    const data: any = JSON.parse(await res.text());
    if (data?.success === true) return data;
    const reason = String(data?.error || data?.message || 'unknown response').slice(0, 200);
    console.error('Apps Script did not confirm the save:', reason);
    if ((payload as any)?.enquiryType === 'Quote Request' && /^Missing required field/i.test(reason)) {
      // The Contact Us validator answered, so the deployed script has no quote handler (or routeQuoteRequest_ is not called first in doPost).
      console.error('Hint: the deployed Apps Script is still the old version. Add QuoteRequests.gs, call routeQuoteRequest_(e) first in doPost, and redeploy a new version.');
    }
    return null;
  } catch (err: any) {
    console.error('Apps Script request failed:', err?.name || '', err?.message || err);
    return null;
  }
}

/** Appends a Contact Us enquiry. Resolves `ok: true` only when the script answers {"success": true}. */
export async function saveContactToSheet(env: Env, row: SheetContactRow): Promise<SheetResult> {
  return { ok: (await postToSheet(env, row)) !== null };
}

/**
 * Appends a Request a Quote enquiry. The script must echo back the enquiry type and submission id, so a script
 * that has not been updated for quotes (and would answer a bare {"success": true}) is never mistaken for a save.
 */
export async function saveQuoteToSheet(env: Env, row: SheetQuoteRow): Promise<SheetResult> {
  const data = await postToSheet(env, row);
  if (data === null) return { ok: false };
  if (data.enquiryType !== 'Quote Request' || data.submissionId !== row.submissionId) {
    console.error('Apps Script answered success but did not confirm the quote row; is the quote handler deployed?');
    return { ok: false };
  }
  return { ok: true };
}
