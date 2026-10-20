import { act } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { AIConciergeProvider } from "./ai-concierge";
import { SmartSearch } from "./smart-search";
vi.mock("./ai-orb", () => ({ AIOrb: () => <span>AI</span> }));
beforeEach(() => {
  localStorage.clear();
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    Response.json({ answer: "Try a soft gold arch.", provider: "groq", remaining: 49 }),
  );
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
function mount(search = false) {
  render(
    <AIConciergeProvider>
      {search && <SmartSearch areas={["Vijay Nagar"]} onLocation={() => {}} />}
    </AIConciergeProvider>,
  );
}
function open() {
  fireEvent.click(screen.getByRole("button", { name: "Open Balloon Creation AI" }));
}
it("does not spend AI allowance on mounting, opening, typing, or suggestions", () => {
  mount();
  expect(fetch).not.toHaveBeenCalled();
  open();
  fireEvent.click(screen.getByRole("button", { name: "Birthday decoration ideas" }));
  expect(screen.getByRole("textbox")).toHaveValue("Birthday decoration ideas");
  expect(fetch).not.toHaveBeenCalled();
});
it("posts once on explicit Send, renders plain text, and keeps replies after closing", async () => {
  mount();
  open();
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Suggest birthday ideas" } });
  fireEvent.click(screen.getByRole("button", { name: "Send AI question" }));
  await screen.findByText("Try a soft gold arch.");
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(screen.getByText("AI answer · Groq")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Close AI chat" }));
  open();
  expect(screen.getByText("Try a soft gold arch.")).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledTimes(1);
});
it("uses local business replies without network traffic", () => {
  mount();
  open();
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "What is the price?" } });
  fireEvent.click(screen.getByRole("button", { name: "Send AI question" }));
  expect(screen.getByText(/Estimates start ₹1,999/)).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
});
it("keeps the existing search local; custom Enter opens and sends to this same chat exactly once", async () => {
  mount(true);
  const search = screen.getByRole("textbox", { name: "Search services or locations" });
  fireEvent.change(search, { target: { value: "What is the price?" } });
  fireEvent.keyDown(search, { key: "Enter" });
  expect(fetch).not.toHaveBeenCalled();
  fireEvent.change(search, { target: { value: "Suggest an ivory theme for my party" } });
  expect(fetch).not.toHaveBeenCalled();
  fireEvent.keyDown(search, { key: "Enter" });
  await screen.findByText("Try a soft gold arch.");
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(screen.getAllByRole("dialog")).toHaveLength(1);
});
it("blocks duplicate sends while a request is in flight", async () => {
  let resolve!: (value: Response) => void;
  vi.mocked(fetch).mockImplementation(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  mount();
  open();
  const input = screen.getByRole("textbox");
  fireEvent.change(input, { target: { value: "Birthday ideas please" } });
  fireEvent.keyDown(input, { key: "Enter" });
  fireEvent.keyDown(input, { key: "Enter" });
  expect(fetch).toHaveBeenCalledTimes(1);
  await act(async () => resolve(Response.json({ answer: "Ivory balloons.", provider: "groq" })));
  await screen.findByText("Ivory balloons.");
});
it("shows actual unavailability, honours cooldown, and never fabricates an answer", async () => {
  vi.mocked(fetch).mockResolvedValue(
    Response.json(
      { error: "providers_cooling_down" },
      { status: 503, headers: { "Retry-After": "30" } },
    ),
  );
  mount();
  open();
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Birthday ideas" } });
  fireEvent.click(screen.getByRole("button", { name: "Send AI question" }));
  await screen.findByRole("alert");
  expect(screen.getByRole("button", { name: "Send AI question" })).toBeDisabled();
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(screen.queryByText("Try a soft gold arch.")).toBeNull();
});
it("can dock using the keyboard without opening chat or spending allowance", async () => {
  mount();
  const button = screen.getByRole("button", { name: "Open Balloon Creation AI" });
  fireEvent.keyDown(button, { key: "ArrowLeft" });
  await waitFor(() => expect(button).toHaveAttribute("data-side", "left"));
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(fetch).not.toHaveBeenCalled();
});

it.each([
  ["cloudflare", "AI answer · Cloudflare · Meta Llama 3.2"],
  ["zai", "AI answer · Z.ai · GLM-4.7-Flash"],
])(
  "discloses the actual %s model provider only after explicit successful Send",
  async (provider, label) => {
    vi.mocked(fetch).mockResolvedValue(
      Response.json({ answer: "Soft gold palette.", provider, remaining: 49 }),
    );
    mount();
    open();
    expect(fetch).not.toHaveBeenCalled();
    expect(screen.queryByText(label)).toBeNull();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Suggest a pastel palette" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send AI question" }));
    await screen.findByText("Soft gold palette.");
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
  },
);

it("uses the owner-approved Ask Bloon caption without changing the shared chat or spending allowance", () => {
  mount();
  expect(screen.getByText("Ask Bloon")).toBeInTheDocument();
  open();
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
});
