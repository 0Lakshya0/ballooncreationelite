import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Concierge } from "./concierge";
import { submitInquiry } from "@/lib/concierge.functions";
import { STATIC_INQUIRY_MESSAGE } from "@/lib/concierge-messages";
vi.mock("@/lib/concierge.functions", () => ({ submitInquiry: vi.fn() }));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
it("keeps static phone requests honest and offers a WhatsApp fallback", async () => {
  vi.mocked(submitInquiry).mockRejectedValueOnce(new Error(STATIC_INQUIRY_MESSAGE));
  const { container } = render(<Concierge occasion="Mega Birthdays" onOccasionChange={() => {}} />);
  fireEvent.submit(container.querySelector("form")!);
  expect(await screen.findByRole("alert")).toHaveTextContent(STATIC_INQUIRY_MESSAGE);
  expect(screen.getByRole("link", { name: "WhatsApp us" })).toHaveAttribute(
    "href",
    expect.stringContaining("wa.me/917489863753"),
  );
  expect(container.querySelector(".inquiry-success")).toBeNull();
});
it("does not expose arbitrary server/database errors to visitors", async () => {
  vi.mocked(submitInquiry).mockRejectedValueOnce(new Error("PRIVATE_DATABASE_DETAILS"));
  const { container } = render(<Concierge occasion="Mega Birthdays" onOccasionChange={() => {}} />);
  fireEvent.submit(container.querySelector("form")!);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "We could not send your request just now",
  );
  expect(container.textContent).not.toContain("PRIVATE_DATABASE_DETAILS");
});
