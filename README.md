# AI Customer Support Automation (n8n)

A starter repository for the agreed Fiverr project: Gmail-based customer support automation using n8n, OpenAI, and Google Sheets.

## What it does

- Monitors incoming Gmail support emails.
- Classifies and summarises each enquiry with OpenAI.
- Uses an approved FAQ/policy spreadsheet as the source of business information.
- Sends automatic replies only for supported, low-risk questions.
- Escalates returns, refunds, cancellations, complaints, sensitive requests, unsupported questions, and enquiries requiring live order or inventory data.
- Logs processing outcomes in Google Sheets.
- Includes duplicate-processing guidance, error handling guidance, setup notes, and test cases.

## Important scope and safety rules

1. **Returns and refunds are always escalated** for this project.
2. Cancellations, complaints, sensitive/account-related requests, and unsupported enquiries are always escalated.
3. Live order status and current stock availability are escalated unless a separate store-platform integration is added.
4. The AI must use only approved FAQ rows. If no relevant approved answer is found, the email is escalated.
5. The workflow must never issue refunds, cancel orders, edit orders, or change customer account information.
6. Do not place Gmail passwords, OpenAI API keys, OAuth tokens, or other secrets in this repository.

## Repository contents

- `workflow/n8n-workflow-blueprint.json`: workflow structure and node configuration reference for importing/building in n8n. Review and connect credentials and spreadsheet IDs before activation.
- `scripts/classify-email.js`: Code node logic for conservative routing.
- `scripts/validate-ai-response.js`: Code node logic to reject unsupported or unsafe automatic replies.
- `templates/faq-knowledge-base.csv`: starter FAQ sheet structure.
- `templates/activity-log.csv`: activity log structure.
- `docs/SETUP.md`: account, credential, and workflow setup.
- `docs/WORKFLOW-LOGIC.md`: routing rules and data flow.
- `docs/TESTING.md`: test cases and acceptance checklist.
- `.env.example`: names of configuration values, with no real secrets.

## Before production use

This repository is a project handover starter, not proof that the buyer's external accounts are connected. The buyer must authorise Gmail, configure OpenAI credentials, connect Google Sheets, set the spreadsheet and sheet identifiers, and run the tests in `docs/TESTING.md`. Activate the workflow only after successful tests.

## Suggested n8n setup

Use a current supported n8n version. Create credentials in n8n's Credentials area:
- Gmail OAuth2
- Google Sheets OAuth2
- OpenAI API key (or HTTP Header Auth for the OpenAI HTTP Request node)

Use the credential manager. Never paste secrets into workflow notes, Code nodes, CSV files, or Fiverr messages.
