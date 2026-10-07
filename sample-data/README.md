# Fictional data setup
Create a local data extension named **Demo_Members** with external key **DEMO_MEMBERS**.

| Field | Type | Length | Required | Primary key |
| --- | --- | --- | --- | --- |
| SubscriberKey | Text | 50 | Yes | Yes |
| EmailAddress | Text | 254 | No | No |
| FirstName | Text | 100 | No | No |
| Language | Text | 10 | No | No |
| MemberTier | Text | 20 | No | No |
| ConsentStatus | Text | 20 | No | No |

EmailAddress intentionally uses Text so the audit can demonstrate malformed input. If sendable, relate SubscriberKey to Subscribers on Subscriber Key. Import members.csv with a header row. Preview only; do not send to the fictional addresses. For an actual test send use controlled, valid addresses and your account's approved test procedure.

A missing SubscriberKey cannot be imported under this schema; that defensive SSJS branch is exercised with a mock test. Choose account-appropriate retention settings; no retention policy is provisioned by the code.
