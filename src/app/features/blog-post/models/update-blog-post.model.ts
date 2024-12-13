export interface UpdateBlogPost{
    title: string;
    shortDescription: string;
    content: string;
    featuredImageUrl: string;
    publishedDate: Date;
    authorId: string;
    isVisible: boolean;
    categories: string[];
}