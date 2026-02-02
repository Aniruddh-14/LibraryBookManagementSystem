import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/book.service';
import { ApiError } from '../utils/ApiError';

export class BookController {
    private bookService: BookService;

    constructor() {
        this.bookService = new BookService();
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { title, author, genre, publishedYear, availableCopies } = req.body;

            // Validation
            if (!title || !author || !genre) {
                throw new ApiError(400, 'Title, author, and genre are required');
            }
            if (typeof publishedYear !== 'number') {
                throw new ApiError(400, 'Published year must be a valid number');
            }
            if (typeof availableCopies !== 'number' || availableCopies < 0) {
                throw new ApiError(400, 'Available copies must be a non-negative number');
            }

            const book = await this.bookService.createBook({
                title,
                author,
                genre,
                publishedYear,
                availableCopies,
                isAvailable: availableCopies > 0 // will be handled by service too, but good to be explicit/consistent
            });

            res.status(201).json(book);
        } catch (error) {
            next(error);
        }
    };

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.bookService.getAllBooks(req.query);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const book = await this.bookService.getBookById(id as string);
            res.status(200).json(book);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { title, author, genre, publishedYear, availableCopies } = req.body;

            // Optional Validation if fields are present
            if (publishedYear !== undefined && typeof publishedYear !== 'number') {
                throw new ApiError(400, 'Published year must be a valid number');
            }
            if (availableCopies !== undefined && (typeof availableCopies !== 'number' || availableCopies < 0)) {
                throw new ApiError(400, 'Available copies must be a non-negative number');
            }

            const updatedBook = await this.bookService.updateBook(id as string, req.body);
            res.status(200).json(updatedBook);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            await this.bookService.deleteBook(id as string);
            res.status(204).send(); // 204 No Content
        } catch (error) {
            next(error);
        }
    };
}
