import { v4 as uuidv4 } from 'uuid';
import { Book } from '../models/book.model';
import { BookRepository } from '../repositories/book.repository';
import { ApiError } from '../utils/ApiError';

export class BookService {
    private bookRepository: BookRepository;

    constructor() {
        this.bookRepository = new BookRepository();
    }

    async createBook(data: Omit<Book, 'id' | 'createdAt'>): Promise<Book> {
        const book: Book = {
            id: uuidv4(),
            ...data,
            isAvailable: data.availableCopies > 0, // Auto-set based on copies
            createdAt: new Date(),
        };

        return this.bookRepository.create(book);
    }

    async getAllBooks(queryParams: any) {
        let books = await this.bookRepository.findAll();

        // 1. Search (Title or Author)
        if (queryParams.search) {
            const search = queryParams.search.toLowerCase();
            books = books.filter(
                (b) =>
                    b.title.toLowerCase().includes(search) ||
                    b.author.toLowerCase().includes(search)
            );
        }

        // 2. Filter by Genre
        if (queryParams.genre) {
            books = books.filter(
                (b) => b.genre.toLowerCase() === queryParams.genre.toLowerCase()
            );
        }

        // 3. Filter by Availability
        if (queryParams.isAvailable !== undefined) {
            const isAvailable = queryParams.isAvailable === 'true';
            books = books.filter((b) => b.isAvailable === isAvailable);
        }

        // 4. Sorting
        if (queryParams.sortBy) {
            const sortBy = queryParams.sortBy as keyof Book;
            books.sort((a, b) => {
                if (a[sortBy] < b[sortBy]) return -1;
                if (a[sortBy] > b[sortBy]) return 1;
                return 0;
            });
        }

        // 5. Pagination
        const page = parseInt(queryParams.page as string) || 1;
        const limit = parseInt(queryParams.limit as string) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const totalItems = books.length;
        const totalPages = Math.ceil(totalItems / limit);
        const paginatedBooks = books.slice(startIndex, endIndex);

        return {
            totalItems,
            currentPage: page,
            totalPages,
            data: paginatedBooks,
        };
    }

    async getBookById(id: string): Promise<Book> {
        const book = await this.bookRepository.findById(id);
        if (!book) {
            throw new ApiError(404, 'Book not found');
        }
        return book;
    }

    async updateBook(id: string, updateData: Partial<Book>): Promise<Book> {
        const book = await this.bookRepository.findById(id);
        if (!book) {
            throw new ApiError(404, 'Book not found');
        }

        // Logic: if availableCopies is updated, update isAvailable
        if (updateData.availableCopies !== undefined) {
            updateData.isAvailable = updateData.availableCopies > 0;
        }

        // Logic: if isAvailable is manually set, respect it, but maybe warn if copies > 0?
        // Requirement says "isAvailable should automatically become false if availableCopies === 0." 
        // It doesn't strictly say it can't be false if copies > 0 (e.g. reserved). 
        // But let's assume strict binding for simplicity unless overridden.
        if (updateData.availableCopies === 0) {
            updateData.isAvailable = false;
        }

        const updatedBook = await this.bookRepository.update(id, updateData);
        if (!updatedBook) {
            throw new ApiError(500, 'Failed to update book');
        }
        return updatedBook;
    }

    async deleteBook(id: string): Promise<void> {
        const book = await this.bookRepository.findById(id);
        if (!book) {
            throw new ApiError(404, 'Book not found');
        }

        // Soft delete: Mark as unavailable
        await this.bookRepository.update(id, { isAvailable: false });
    }
}
