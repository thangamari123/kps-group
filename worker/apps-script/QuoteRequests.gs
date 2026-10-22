/**
 * Request a Quote handler - add this as a NEW FILE (QuoteRequests.gs) inside your EXISTING Apps Script project.
 * Do not create a new project or spreadsheet. See README.md in this folder.
 *
 * It only handles payloads with enquiryType === "Quote Request". Everything else (the Contact Us form) returns
 * null from routeQuoteRequest_() so your existing doPost code runs exactly as before.
 *
 * Quotes are saved to a "Quote Requests" tab of the same KPS-WEB LEADS spreadsheet, so Contact Us rows and quote
 * rows never share columns. The tab and its header row are created automatically.
 *
 * If your project opens the spreadsheet with openById()/openByUrl() instead of being bound to it, either set a
 * Script property SPREADSHEET_ID, or change getQuoteSpreadsheet_() to reuse your existing opener.
 */

var QUOTE_SHEET_NAME = 'Quote Requests';
var QUOTE_HEADERS = [
  'Submission ID', 'Timestamp', 'Enquiry Type', 'Status', 'Name', 'Email', 'Country Code', 'Phone',
  'Company', 'Service Required', 'Cargo Weight / Volume', 'Origin', 'Destination', 'Cargo Specifications'
];

/**
 * Call this on the first line of your existing doPost(e):
 *   var quoteReply = routeQuoteRequest_(e);
 *   if (quoteReply) return quoteReply;
 */
function routeQuoteRequest_(e) {
  var data;
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || '');
  } catch (err) {
    return null; // not JSON: not ours
  }
  if (!data || data.enquiryType !== 'Quote Request') return null;

  try {
    var q = validateQuote_(data);
    if (!q) return quoteJson_({ success: false, error: 'invalid' });
    return quoteJson_(saveQuote_(q));
  } catch (err) {
    var detail = err && err.message ? err.message : String(err);
    console.error(detail);
    // The Worker logs this reply for the operator; it is never shown to website visitors.
    return quoteJson_({ success: false, error: 'server_error', message: detail.slice(0, 200) });
  }
}

function saveQuote_(q) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return { success: false, error: 'busy' };
  try {
    var sheet = getQuoteSheet_();
    var lastRow = sheet.getLastRow();

    // Same submission already stored (double click / retry): report it as saved without a second row.
    if (lastRow > 1) {
      var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (ids[i][0] === q.submissionId) {
          return { success: true, enquiryType: q.enquiryType, submissionId: q.submissionId, duplicate: true };
        }
      }
    }

    var target = lastRow + 1;
    var range = sheet.getRange(target, 1, 1, QUOTE_HEADERS.length);
    range.setNumberFormat('@'); // plain text so "+91", long numbers and "1/2" are stored literally
    range.setValues([[
      q.submissionId, q.timestamp, q.enquiryType, q.status, quoteGuard_(q.name), quoteGuard_(q.email),
      q.countryCode, q.phone, quoteGuard_(q.company), quoteGuard_(q.service), quoteGuard_(q.cargoWeight),
      quoteGuard_(q.origin), quoteGuard_(q.destination), quoteGuard_(q.cargoDetails)
    ]]);
    SpreadsheetApp.flush();

    // Read back: only report success if the row is really there.
    if (sheet.getRange(target, 1).getValue() !== q.submissionId) return { success: false, error: 'write_failed' };
    return { success: true, enquiryType: q.enquiryType, submissionId: q.submissionId, duplicate: false };
  } finally {
    lock.releaseLock();
  }
}

/** Defence in depth: the Worker has already validated and sanitized. */
function validateQuote_(d) {
  var q = {
    enquiryType: 'Quote Request',
    submissionId: quoteStr_(d.submissionId, 40),
    timestamp: quoteStr_(d.timestamp, 40),
    status: quoteStr_(d.status, 20) || 'New',
    name: quoteStr_(d.name, 100),
    email: quoteStr_(d.email, 254).toLowerCase(),
    countryCode: quoteStr_(d.countryCode, 6),
    phone: quoteStr_(d.phone, 20),
    company: quoteStr_(d.company, 150),
    service: quoteStr_(d.service, 80),
    cargoWeight: quoteStr_(d.cargoWeight, 80),
    origin: quoteStr_(d.origin, 150),
    destination: quoteStr_(d.destination, 150),
    cargoDetails: quoteStr_(d.cargoDetails, 1000)
  };
  if (!/^QTE-[0-9A-F]{20}$/.test(q.submissionId)) return null;
  if (isNaN(new Date(q.timestamp).getTime())) return null;
  if (q.status !== 'New') return null;
  if (q.name.length < 2) return null;
  if (!/^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/.test(q.email)) return null;
  if (!/^\+\d{1,4}$/.test(q.countryCode)) return null;
  if (!/^\d{7,15}$/.test(q.phone)) return null;
  if (!q.service || q.origin.length < 2 || q.destination.length < 2) return null;
  return q;
}

function quoteStr_(v, max) {
  return typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, ' ').trim().slice(0, max) : '';
}

/** Spreadsheet formula injection guard: text starting with = + - @ is stored with a leading apostrophe. */
function quoteGuard_(v) {
  return /^[=+\-@\t\r]/.test(v) ? "'" + v : v;
}

function getQuoteSpreadsheet_() {
  var id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  var ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('No spreadsheet: bind the script to KPS-WEB LEADS or set SPREADSHEET_ID.');
  return ss;
}

function getQuoteSheet_() {
  var ss = getQuoteSpreadsheet_();
  var sheet = ss.getSheetByName(QUOTE_SHEET_NAME) || ss.insertSheet(QUOTE_SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    // Brand-new, empty tab: write the header row. An existing tab is never cleared or overwritten.
    sheet.getRange(1, 1, 1, QUOTE_HEADERS.length).setValues([QUOTE_HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  } else {
    assertQuoteHeaders_(sheet);
  }
  return sheet;
}

/**
 * Rows are written by position, so an existing tab must already have exactly these headers in this order.
 * If not, refuse to write (nothing is changed) instead of putting values under the wrong columns.
 */
function assertQuoteHeaders_(sheet) {
  var existing = sheet.getRange(1, 1, 1, QUOTE_HEADERS.length).getValues()[0];
  for (var i = 0; i < QUOTE_HEADERS.length; i++) {
    if (String(existing[i]).trim().toLowerCase() !== QUOTE_HEADERS[i].toLowerCase()) {
      throw new Error('Quote Requests header mismatch in column ' + (i + 1) + ': expected "' + QUOTE_HEADERS[i] + '" but found "' + String(existing[i]).slice(0, 40) + '". Nothing was written.');
    }
  }
}

function quoteJson_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
