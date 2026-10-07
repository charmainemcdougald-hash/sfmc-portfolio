/* Automation Studio Script Activity: read-only, current business unit.
   Configure a fictional source DE CustomerKey. No subscriber records are output. */
Platform.Load("Core", "1.1.1");

function auditAudience(proxy, customerKey, maxPages) {
    if (!/^[A-Za-z0-9_-]+$/.test(customerKey)) {
        throw new Error("Use a simple demo CustomerKey containing letters, digits, underscores or hyphens.");
    }
    var objectType = "DataExtensionObject[" + customerKey + "]";
    var columns = ["SubscriberKey", "EmailAddress", "ConsentStatus"];
    var summary = { rows: 0, missingKey: 0, invalidEmail: 0, nonOptedIn: 0, pages: 0 };
    var page = proxy.retrieve(objectType, columns);
    while (true) {
        if (!page || page.Status !== "OK" || !page.Results) {
            throw new Error("Audience retrieve failed; audit is incomplete.");
        }
        summary.pages++;
        for (var i = 0; i < page.Results.length; i++) {
            var row = {};
            var properties = page.Results[i].Properties || [];
            for (var j = 0; j < properties.length; j++) {
                row[properties[j].Name] = properties[j].Value;
            }
            summary.rows++;
            var key = String(row.SubscriberKey || "").replace(/^\s+|\s+$/g, "");
            var email = String(row.EmailAddress || "").replace(/^\s+|\s+$/g, "");
            var consent = String(row.ConsentStatus || "").toLowerCase().replace(/^\s+|\s+$/g, "");
            if (!key) { summary.missingKey++; }
            /* Lightweight hygiene check, not mailbox or RFC validation. */
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { summary.invalidEmail++; }
            if (consent !== "opted-in") { summary.nonOptedIn++; }
        }
        if (!page.HasMoreRows) { return summary; }
        if (!page.RequestID || summary.pages >= maxPages) {
            throw new Error("Pagination limit reached or request ID missing; audit is incomplete.");
        }
        page = proxy.getNextBatch(objectType, page.RequestID);
    }
}

/* Fail the activity instead of reporting partial data as a complete audit. */
var auditSummary = auditAudience(new Script.Util.WSProxy(), "DEMO_MEMBERS", 100);
Write(Stringify(auditSummary));
