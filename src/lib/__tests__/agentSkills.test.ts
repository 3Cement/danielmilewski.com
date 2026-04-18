import { describe, expect, it } from "vitest";
import {
  AGENT_SKILL_DOCUMENTS,
  buildAgentSkillsIndex,
  getAgentSkill,
} from "@/lib/agentSkills";

describe("agent skills discovery", () => {
  it("builds a v0.2.0 discovery index with digests", () => {
    const index = buildAgentSkillsIndex();

    expect(index.$schema).toBe(
      "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    );
    expect(index.skills).toHaveLength(AGENT_SKILL_DOCUMENTS.length);
    for (const skill of index.skills) {
      expect(skill.type).toBe("skill-md");
      expect(skill.url).toContain(`/.well-known/agent-skills/skills/${skill.name}/SKILL.md`);
      expect(skill.digest).toMatch(/^sha256:[a-f0-9]{64}$/);
    }
  });

  it("returns the concrete SKILL.md content by slug", () => {
    const skill = getAgentSkill("site-discovery");

    expect(skill?.content).toContain("name: site-discovery");
    expect(skill?.content).toContain(`# Site Discovery`);
  });
});
