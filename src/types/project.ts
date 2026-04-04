export interface Project {
  slug: string;
  title: string;
  featured: boolean;
  shortProblem: string;
  shortSolution: string;
  stack: string[];
  role: string;
  outcome: string;
  overview: string;
  repo?: string;
  demo?: string;
  images?: string[];
  relatedSlugs?: string[];
  relatedPostSlugs?: string[];
  content: string;
  contentHtml: string;
}

export type ProjectMeta = Omit<Project, "content">;
