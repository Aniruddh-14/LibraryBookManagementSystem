export interface Book {
    id: string;
    title: string;
    author: string;
    genre: string;
    publishedYear: number;
    availableCopies: number;
    isAvailable: boolean;
    createdAt: Date;
}
