# Localized member email
## Business problem
A fictional membership program needs personalized English and Spanish email content without blank greetings or broken HTML when profile fields are missing.

## Design
The content block reads send-context attributes with AttributeValue, normalizes language and tier, and defaults unsupported languages to English. Unknown tiers receive standard content. FirstName is escaped for an HTML text node. Translation copy is deliberately fixed to keep the first demo understandable.

## Setup
1. Create the sendable Demo_Members data extension described in [the data guide](../sample-data/README.md).
2. Import [members.csv](../sample-data/members.csv).
3. Paste [member-email.html](member-email.html) into an HTML content block in Content Builder.
4. Insert the block into an email with your account's approved unsubscribe, physical-address and other required footer elements.
5. Preview each sample record. This block alone is not a complete send-ready email.

## Acceptance checks (pending SFMC execution)
| SubscriberKey | Expected greeting | Content |
| --- | --- | --- |
| demo-001 | Hello, Maya! | English Gold |
| demo-002 | Hola, Luis! | Spanish standard |
| demo-003 | Hello! | English standard |
| demo-004 | Hello, A&lt;B &amp; C! in HTML source | English standard; displayed name A<B & C |

Check supported/unsupported language, blank name, unknown tier, mobile layout and special characters. The SSJS local tests do not execute AMPscript.

## Tradeoffs and next iteration
Two fixed languages keep translation review manageable. A larger implementation could use a localization data extension and reusable Content Builder blocks, with a documented missing-translation policy. Add separate subject and preheader blocks before expanding the template.

## References
- [Salesforce AttributeValue](https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-utilities/mc-ampscript-reference-utilities-attribute-value.html)
