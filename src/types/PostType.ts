export type PostType = {
  id: string;
  title: string;
  content: string;
  description: string;
  slug: string;
  thumbnail?: string;
  views: number;
  status: 'PUBLISHED' | 'ARCHIVED';
  audience: 'CLIENTS' | 'EMPLOYEES';
  createdAt: string;
  updatedAt: string;
  userId: string;
  siteId: string;
};
