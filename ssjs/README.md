# Paginated audience audit
## Business problem
Before activating an audience, an operations team needs aggregate checks for missing identifiers, malformed email addresses and absent promotional opt-in.

## Design
[audience-audit.js](audience-audit.js) uses WSProxy to read a fictional data extension in the current business unit and follows RequestID pagination. It reports only aggregate counts. It performs no updates, deletes or sends. Errors propagate so an incomplete audit is not reported as complete.

## Setup
1. Create/import the sample DE using [the data guide](../sample-data/README.md).
2. Confirm its external key is DEMO_MEMBERS (different from its display name).
3. Paste the JavaScript into an Automation Studio Script Activity; do not include HTML script tags.
4. Run in a test business unit first. For the four supplied rows, expect rows=4, missingKey=0, invalidEmail=1, nonOptedIn=2, pages=1 (if returned in one page).
5. Monitor activity status. Write output is diagnostic output; it is not durable automation logging. A production implementation needs a dedicated aggregate audit-log DE and alerting.

## Local verification
Run `node tests/audience-audit.test.cjs` from the repository root. The tests mock Salesforce APIs and cover pagination, aggregate checks, retrieve failures and the page limit. They do not prove account permissions, SOAP responses or runtime compatibility; those require SFMC validation.

## Limitations
Counters can overlap: one row may fail multiple checks. ConsentStatus is a fictional business field, not All Subscribers status or authoritative consent proof. This audit does not authorize a send. It does not check duplicates. The 100-page guard bounds work and fails rather than truncating silently; very large sources need partitioning and runtime monitoring.

## References
- [Salesforce advanced WSProxy retrieves](https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/ssjs_WSProxy_advanced_retrieve.html)
