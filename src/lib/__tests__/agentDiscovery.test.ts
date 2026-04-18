import { describe, expect, it } from "vitest";
import {
  AGENT_DISCOVERY_LINK_HEADER,
  createHomepageAgentDiscoveryHeaders,
} from "@/lib/agentDiscovery";

describe("agent discovery headers", () => {
  it("formats homepage Link headers with registered relations", () => {
    expect(AGENT_DISCOVERY_LINK_HEADER).toContain(
      '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"; profile="https://www.rfc-editor.org/info/rfc9727"'
    );
    expect(AGENT_DISCOVERY_LINK_HEADER).toContain(
      '</.well-known/service-doc.json>; rel="service-doc"; type="application/json"'
    );
    expect(AGENT_DISCOVERY_LINK_HEADER).toContain(
      '</llms.txt>; rel="describedby"; type="text/plain"'
    );
  });

  it("targets the root and localized homepages", () => {
    expect(createHomepageAgentDiscoveryHeaders(["en", "pl"])).toEqual([
      {
        source: "/",
        headers: [{ key: "Link", value: AGENT_DISCOVERY_LINK_HEADER }],
      },
      {
        source: "/en",
        headers: [{ key: "Link", value: AGENT_DISCOVERY_LINK_HEADER }],
      },
      {
        source: "/pl",
        headers: [{ key: "Link", value: AGENT_DISCOVERY_LINK_HEADER }],
      },
    ]);
  });
});
