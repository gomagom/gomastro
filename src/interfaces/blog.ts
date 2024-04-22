export default interface Blog {
  id: number;
  attributes: {
    title: string;
    description: string;
    content: string;
    slug: string;
    category: string;
    tags: string[];
    thumbnail: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}
