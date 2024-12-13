export interface CommentDto {
    id: string;
    userId: string;
    authorName: string;
    blogPostId: string;
    content: string;
    parentId?: string;
    replies?: CommentDto[];
    updatedDate: string;
  }
  