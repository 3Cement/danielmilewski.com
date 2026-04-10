import { describe, expect, it } from "vitest";
import { GET } from "@/app/llms.txt/route";

describe("GET /llms.txt", () => {
  it("returns plain text instructions for AI crawlers", async () => {
    const response = await GET();
    const body = await response.text();

    expect(response.headers.get("Content-Type")).toContain("text/plain");
    expect(body).toContain("# Daniel Milewski");
    expect(body).toContain("## Featured projects");
    expect(body).toContain("## Recent writing");
    expect(body).toContain("https://danielmilewski.com/en/projects/investtracker");
  });
});
