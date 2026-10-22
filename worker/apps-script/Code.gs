/**
 * KPS-WEB LEADS - Web App entry points.
 *
 * Replaces the contents of the project's code.gs. This is the ONLY file that defines doPost() and doGet();
 * do not define either of them in any other file of the project.
 *
 * Depends on QuoteRequests.gs (same project), which provides routeQuoteRequest_(e) and quoteJson_(obj).
 * Contact Us no longer uses this script (it opens WhatsApp from the website), so there is no Contact Us handler here.
 */

function doPost(e) {
  // Request a Quote: handled (saved to the "Quote Requests" tab, or rejected with a reason) by QuoteRequests.gs.
  var quoteReply = routeQuoteRequest_(e);
  if (quoteReply) return quoteReply;

  // Anything else (including the retired Contact Us payload) is refused and nothing is written.
  return quoteJson_({ success: false, error: 'unsupported_request' });
}

// Health check: opening the /exec URL in a browser must not reveal or change anything.
function doGet() {
  return quoteJson_({ success: true, message: 'KPS Contact API is running' });
}
