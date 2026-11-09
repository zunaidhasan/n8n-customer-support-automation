# Workflow Logic

## High-level flow

Gmail Trigger
→ Normalize email fields
→ Duplicate check
→ Conservative classification
→ FAQ lookup (only for eligible categories)
→ OpenAI response draft using approved FAQ content
→ Safety validation
→ Conditional routing

### Automatic response path

1. The email category is eligible for automation.
2. An active FAQ row provides a relevant approved answer.
3. OpenAI drafts a reply using only that answer.
4. The validator confirms the FAQ match and response are present.
5. Gmail sends the reply.
6. Google Sheets records `AUTO_REPLIED`.

### Manual escalation path

1. The category is restricted, the email is sensitive, no FAQ match exists, or the AI response fails validation.
2. No automatic customer reply is sent.
3. Gmail sends an internal notification to the configured support owner.
4. Google Sheets records `ESCALATED` and the reason.

## Mandatory escalation categories

- Returns and Refunds
- Cancellations
- Complaints
- Order Status
- Product Availability
- Sensitive or account-related requests
- Unsupported or ambiguous enquiries

Order status and stock availability can be automated only after a separate, tested integration with the store's actual order and inventory data is approved and added.

## Activity log fields

- `message_id`
- `received_at`
- `customer_email`
- `subject`
- `category`
- `summary`
- `response_status`
- `escalation_reason`
- `processed_at`

## Reliability notes

- Use Gmail message ID for idempotency.
- Avoid sending an automatic reply if any required node fails.
- Log failures separately and notify the owner if a workflow execution fails.
- Keep the original email content available in the escalation notification.
- Do not include full payment details or unnecessary personal data in logs.
