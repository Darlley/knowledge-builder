export type PostType = {
  id: string;
  title: string;
  content: string;
  description: string;
  slug: string;
  thumbnail?: string;
  status: 'PUBLISHED' | 'ARCHIVED';
  audience: 'CLIENTS' | 'EMPLOYEES';
  createdAt: string;
  updatedAt: string;
  userId: string;
  siteId: string;
};
