/**
 * n8n Code node (JavaScript)
 * Run after AI response generation and FAQ lookup.
 *
 * Expected input:
 * {
 *   category, route, faqMatch, faqAnswer, aiReply, from, subject, messageId
 * }
 *
 * This validator is a second safety gate. Do not rely on the language model
 * alone to enforce business rules.
 */

const data = $input.item.json;
const category = String(data.category || "General Support");
const aiReply = String(data.aiReply || "").trim();
const faqAnswer = String(data.faqAnswer || "").trim();
const faqMatch = data.faqMatch === true || data.faqMatch === "true";

const blockedCategories = new Set([
  "Returns and Refunds",
  "Cancellations",
  "Complaints",
  "Order Status",
  "Product Availability",
]);

const unsafe = blockedCategories.has(category);
const canAutoReply = !unsafe && faqMatch && faqAnswer.length > 0 && aiReply.length > 0;

return {
  json: {
    ...data,
    finalRoute: canAutoReply ? "auto_reply" : "escalate",
    finalEscalationReason: canAutoReply
      ? ""
      : (unsafe
          ? `${category} enquiries must be handled manually.`
          : "No approved FAQ answer or valid AI response was available."),
    safeToSend: canAutoReply,
  },
};
