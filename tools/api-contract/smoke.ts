// Compile-only proof that frontend consumers can use generated contract types.
import type { components, operations, paths } from "../../.contract-artifacts/schema";

type Summary = components["schemas"]["TicketSummary"];
type Detail = paths["/api/tickets/{id}"]["get"]["responses"][200]["content"]["application/json"];
type Review = operations["reviewTicket"]["requestBody"]["content"]["application/json"];
type Page = operations["listTickets"]["responses"][200]["content"]["application/json"];

const approve: Review = {
  decision: "APPROVE",
  category: "LIGHTING_ELECTRICAL",
  priority: "HIGH",
  expected_version: 1,
};
const reject: Review = { decision: "REJECT", reason: "示例驳回原因", expected_version: 1 };
const empty: Page = { items: [], next_cursor: null };

// These invalid cases must be rejected by the generated TypeScript types.
// @ts-expect-error APPROVE must contain category and priority.
const invalidApproval: Review = { decision: "APPROVE", expected_version: 1 };
// @ts-expect-error REJECT must contain a reason.
const invalidRejection: Review = { decision: "REJECT", expected_version: 1 };
// @ts-expect-error A cursor is a string or null, never a numeric offset.
const invalidPage: Page = { items: [], next_cursor: 10 };

function readDetail(detail: Detail): Summary {
  detail.timeline.forEach((item) => {
    if (item.kind === "EVENT") item.type;
    else item.body;
  });
  detail.report_photos.forEach((photo) => photo.download_url);
  detail.assignments.forEach((assignment) => assignment.technician.id);
  detail.allowed_actions.includes("CONFIRM");
  // @ts-expect-error No private storage key is exposed by the contract.
  detail.report_photos[0]?.storage_key;
  return detail;
}

void [approve, reject, empty, invalidApproval, invalidRejection, invalidPage, readDetail];
