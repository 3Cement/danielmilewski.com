export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingTime: string;
  relatedProjectSlugs?: string[];
  content: string;
  contentHtml: string;
}

export type PostMeta = Omit<Post, "content">;
