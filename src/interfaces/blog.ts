export interface Blog {
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

export interface AstroBlog {
  id: string;
  slug: string;
  data: {
    title: string;
    tags: string[];
    category: string;
    published: Date;
    image: string;
    description: string;
    content: string;
    draft: boolean;
    nextSlug: string;
    nextTitle: string;
    prevSlug: string;
    prevTitle: string;
  };

}

export interface Category {
  id: number;
  attributes: {
    name: string;
    createdAt: string;
    updatedAt: string;
    blogs: any;
  };
}

export interface AstroCategory {
  id: string;
  name: string;
}

export interface Info {
  id: number;
  attributes: {
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface AstroInfo {
  id: number;
  data: {
    title: string;
    content: string;
  };
}
