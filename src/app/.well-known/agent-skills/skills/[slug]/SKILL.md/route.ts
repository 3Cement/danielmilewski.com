import { getAgentSkill } from "@/lib/agentSkills";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-static";

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  const skill = getAgentSkill(slug);

  if (skill == null) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(skill.content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
