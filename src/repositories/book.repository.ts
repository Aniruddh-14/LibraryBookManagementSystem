import { Book } from '../models/book.model';

export class BookRepository {
    // In-memory array to store books
    private static books: Book[] = [];

    /**
     * Create a new book
     */
    async create(book: Book): Promise<Book> {
        BookRepository.books.push(book);
        return book;
    }

    /**
     * Find all books with optional filtering
     * Note: The repository handles raw data access. 
     * Complex searching/filtering should ideally be passed down as criteria 
     * or handled in service if repo is dumb. 
     * For in-memory, we can implement basic filtering here or return all.
     * To keep repo clean, we'll return all and let service filter, 
     * OR accept a filter predicate. Let's support returning all for now.
     */
    async findAll(): Promise<Book[]> {
        return BookRepository.books;
    }

    /**
     * Find book by ID
     */
    async findById(id: string): Promise<Book | null> {
        const book = BookRepository.books.find(b => b.id === id);
        return book || null;
    }

    /**
     * Update book by ID
     */
    async update(id: string, updateData: Partial<Book>): Promise<Book | null> {
        const index = BookRepository.books.findIndex(b => b.id === id);
        if (index === -1) return null;

        const updatedBook = { ...BookRepository.books[index], ...updateData };
        BookRepository.books[index] = updatedBook;
        return updatedBook;
    }

    /**
     * Delete book (Soft Delete implicit as per requirements? 
     * No, requirements say "Soft Delete Book (mark as unavailable instead of removing)". 
     * That implies an update operation really, but we might have a specific delete method 
     * if we followed strict CRUD naming, but strictly implementing "Soft Delete" usually means 
     * setting a flag. The requirement says "mark as unavailable". 
     * I will implement a strict delete method just in case, but the feature 'Soft Delete' 
     * will be handled via update in service usually, or we can make a specific method here.
     * Let's make a generic delete that actually removes for internal use if needed, 
     * or creating a separate boolean flag `isDeleted`?
     * The Book model doesn't have `isDeleted`. It has `isAvailable`. 
     * "mark as unavailable instead of removing". 
     * So we should just use `update` to set `isAvailable = false`.
     * However, often a repo has a delete method. I'll stick to what is needed.
     * Actually, let's just use update for soft delete. 
     * BUT, for a "delete" endpoint, the valid Repo operation is `delete`. 
     * Since we must soft delete, I will simply NOT implement a hard delete method 
     * to prevent accidental deletion, or implement it but Service will just call update.
     * Let's strictly follow "Repositories: Handle data access". 
     * I'll expose a findBy methods to help with search in-memory.
     */

    // Helper for search/filter implemented in Service usually for in-memory, 
    // but efficient data access might need repo support.
    // Since it's an array, returning all to service is fine for small datasets.
}
