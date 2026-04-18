import { describe, expect, it } from "vitest";
import { GET as getIndex } from "@/app/.well-known/agent-skills/index.json/route";
import { GET as getSkill } from "@/app/.well-known/agent-skills/skills/[slug]/SKILL.md/route";

describe("GET /.well-known/agent-skills/index.json", () => {
  it("returns a skills index with schema and digests", async () => {
    const response = await getIndex();
    const body = await response.json();

    expect(response.headers.get("Content-Type")).toContain("application/json");
    expect(body.$schema).toBe(
      "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    );
    expect(body.skills).toHaveLength(2);
    expect(body.skills[0].digest).toMatch(/^sha256:[a-f0-9]{64}$/);
  });
});

describe("GET /.well-known/agent-skills/skills/[slug]/SKILL.md", () => {
  it("returns markdown skill content", async () => {
    const response = await getSkill(new Request("http://localhost"), {
      params: Promise.resolve({ slug: "mcp-discovery" }),
    });
    const body = await response.text();

    expect(response.headers.get("Content-Type")).toContain("text/markdown");
    expect(body).toContain("name: mcp-discovery");
    expect(body).toContain("`resources/list`");
  });
});
