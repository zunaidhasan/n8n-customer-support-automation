# Testing and Acceptance Checklist

Run these tests using sample emails before enabling the workflow for live customers.

| Test | Expected result |
|---|---|
| FAQ-backed delivery policy question | Auto-reply only if the active FAQ contains a clear approved answer |
| Return request | Escalated; no automatic customer reply |
| Refund request | Escalated; no automatic customer reply |
| Cancellation request | Escalated; no automatic customer reply |
| Complaint or damaged-item report | Escalated; no automatic customer reply |
| Order tracking/status question | Escalated unless a verified store integration is configured |
| Product stock/availability question | Escalated unless a verified inventory integration is configured |
| Product question with no matching FAQ | Escalated; no invented answer |
| Ambiguous email | Escalated |
| Same Gmail message processed twice | Second run is stopped or marked duplicate |
| Gmail send failure | Error is logged; do not mark as successfully answered |
| Google Sheets write failure | Execution is logged and owner is notified where configured |
| Escalation notification | Includes sender, subject, category, summary, original message, and reason |
| Activity log | Shows `AUTO_REPLIED` or `ESCALATED`, plus timestamp and message ID |

## Acceptance checklist

- [ ] Gmail OAuth connection works.
- [ ] Google Sheets connection works.
- [ ] OpenAI connection works.
- [ ] Only active FAQ rows are used.
- [ ] The model is instructed to use only supplied approved content.
- [ ] Mandatory escalation categories cannot reach the auto-reply node.
- [ ] No auto-reply is sent when an FAQ match is missing.
- [ ] Duplicate prevention works.
- [ ] Activity log records the final outcome.
- [ ] Error handling has been tested.
- [ ] Buyer has received workflow export, setup guide, and walkthrough video.
