export interface User {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    emailVerified: Date | null;
  }
  
  export interface Post {
    id: string;
    content: string;
    imageUrl: string | null;
    author: {
      id: string;
      email: string;
      name: string | null;
    };
    comments: Comment[];
    createdAt: Date;
    _count?: {
      comments: number;
    };
  }
  
  export interface Comment {
    id: string;
    content: string;
    author: {
      id: string;
      email: string;
      name: string | null;
    };
    createdAt: Date;
    replies: Comment[] | null; 
    parentId: string | null;
  }