export default interface Blog {
  id: number;
  attributes: {
    title: string;
    description: string;
    content: string;
    slug: string;
    category: any;
    tags: any;
    thumbnail: any;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}
