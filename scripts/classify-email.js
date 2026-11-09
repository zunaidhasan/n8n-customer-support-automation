/**
 * n8n Code node (JavaScript)
 * Input: one Gmail message per item. Expected fields can be mapped in the
 * Normalize Email node: messageId, threadId, from, subject, body.
 *
 * This is intentionally conservative. Returns/refunds, cancellations,
 * complaints, sensitive requests, and live order/stock enquiries are routed
 * to a human unless a separate verified store integration is implemented.
 */

const text = (value) => String(value ?? "").trim();
const email = $input.item.json;

const messageId = text(email.messageId || email.id);
const from = text(email.from || email.sender);
const subject = text(email.subject);
const body = text(email.body || email.text || email.snippet);
const combined = `${subject}\n${body}`.toLowerCase();

const rules = [
  { category: "Returns and Refunds", patterns: [/\brefund\b/, /\breturn(?:s|ing)?\b/, /\bmoney back\b/, /\breimbursement\b] },
  { category: "Cancellations", patterns: [/\bcancel(?:lation|ling|led)?\b/, /\bstop my order\b] },
  { category: "Complaints", patterns: [/\bcomplaint\b/, /\bunhappy\b/, /\bdisappointed\b/, /\bdamaged\b/, /\bwrong item\b/, /\bpoor service\b] },
  { category: "Order Status", patterns: [/\bwhere is my order\b/, /\border status\b/, /\btracking\b/, /\bhas my order\b/, /\bdispatch(?:ed)?\b] },
  { category: "Product Availability", patterns: [/\bin stock\b/, /\bout of stock\b/, /\bavailability\b/, /\bavailable again\b/, /\brestock\b] },
  { category: "Shipping and Delivery", patterns: [/\bdelivery\b/, /\bshipping\b/, /\barrive\b/, /\barrival\b/, /\bdispatch time\b] },
  { category: "Product Information", patterns: [/\bmaterial\b/, /\bdimension(?:s)?\b/, /\bsize\b/, /\bcolour\b/, /\bcolor\b/, /\bproduct details\b] },
];

let category = "General Support";
for (const rule of rules) {
  if (rule.patterns.some((pattern) => pattern.test(combined))) {
    category = rule.category;
    break;
  }
}

const alwaysEscalate = new Set([
  "Returns and Refunds",
  "Cancellations",
  "Complaints",
  "Order Status",
  "Product Availability",
]);

const hasSensitiveSignal =
  /\b(password|login|account access|personal data|data protection|chargeback|legal action|fraud|payment dispute)\b/i.test(combined);

const route = alwaysEscalate.has(category) || hasSensitiveSignal
  ? "escalate"
  : "faq_check";

return {
  json: {
    messageId,
    threadId: text(email.threadId),
    from,
    subject,
    body,
    category,
    route,
    escalationReason: hasSensitiveSignal
      ? "Sensitive or account-related content detected."
      : alwaysEscalate.has(category)
        ? `${category} enquiries require manual review under the agreed business rules.`
        : "",
    receivedAt: text(email.receivedAt || email.date || new Date().toISOString()),
  },
};
