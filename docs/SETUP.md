# Setup Guide

## 1. Create the required accounts

The buyer supplies and owns the accounts:
- n8n account or self-hosted n8n instance
- Gmail support account
- OpenAI account with API access
- Google account for the FAQ and activity spreadsheets

## 2. Create the Google Sheets workbook

Create one spreadsheet with two tabs.

### Tab 1: FAQ

Use the columns from `templates/faq-knowledge-base.csv`:
- `faq_id`
- `category`
- `question`
- `approved_answer`
- `keywords`
- `active`
- `last_updated`

Only put approved, current business information in this tab. Set `active` to `TRUE` for rows the workflow may use.

### Tab 2: Activity Log

Use the columns from `templates/activity-log.csv`. The workflow should append one row per processed message, including whether it was automatically answered or escalated.

## 3. Configure n8n credentials

In n8n, create:
1. Gmail OAuth2 credential, authorised by the buyer.
2. Google Sheets OAuth2 credential, authorised by the buyer.
3. OpenAI credential or HTTP Header Auth credential for the OpenAI API.

Do not send credentials through Fiverr chat. Do not store credentials in this repository.

## 4. Connect the Gmail trigger

Configure the Gmail Trigger to monitor the support inbox. Choose an appropriate polling interval and restrict it to the intended support mailbox or label.

Map the Gmail trigger output into these fields before classification:
- `messageId`
- `threadId`
- `from`
- `subject`
- `body`
- `receivedAt`

Use the Gmail message ID as the duplicate-prevention key.

## 5. Add duplicate prevention

Before processing, check the Activity Log for the incoming `messageId`. If a record already exists, stop the workflow. For higher-volume use, use a persistent data store or database with a unique constraint on `messageId`; a spreadsheet lookup alone can have race conditions.

## 6. Configure FAQ lookup

Read active FAQ rows from the `FAQ` tab. Match the incoming enquiry to the relevant category and keywords. Pass only the matching approved answer(s) to the AI response-generation step.

If no sufficiently relevant approved answer is found, escalate the email. Do not ask the AI to fill gaps from general knowledge.

## 7. Configure OpenAI

Use an OpenAI chat completion request with a concise system instruction such as:

"You write friendly, professional customer support email drafts for a UK home decor store. Use only the approved FAQ answer supplied in the input. Do not add policies, dates, guarantees, prices, stock information, order status, or refund decisions that are not explicitly present. If the supplied answer does not fully answer the question, return ESCALATE. Never promise a refund, cancellation, order change, or account change."

Use a low temperature. Parse the result and pass it through the validator in `scripts/validate-ai-response.js`.

## 8. Configure routing

- `auto_reply`: send the approved response through Gmail, then append an activity log row.
- `escalate`: do not send an automatic customer reply. Notify the configured support owner with sender, subject, category, summary, and escalation reason. Append an activity log row.

Always escalate:
- Returns and refunds
- Cancellations
- Complaints
- Order status and tracking requests unless a verified store integration is added
- Product availability requests unless a verified inventory integration is added
- Sensitive/account-related requests
- Unclear or unsupported questions

## 9. Test before activation

Follow `TESTING.md`. Keep the workflow inactive until all required tests pass. Confirm that the buyer receives escalation notifications and that the activity log records the final status correctly.
