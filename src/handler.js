const { nanoid } = require('nanoid');
const books = require('./books');

//To add new book
const storeBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
        //If the Client does not attach the name property to the request body
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    };

    if (readPage > pageCount) {
        //If the Client attaches a readPage property value that is greater than the pageCount property value
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    };

    const id = nanoid(16);
    const finished = (pageCount === readPage) ? true : false;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };


    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0 //Check if newBook's already pushed into array

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal disimpan',
    });
    response.code(500);
    return response;
};

// const getAllBooksHandler = () => ({
//     status: 'success',
//     data: {
//         books: books.map((book) => ({
//             id: book.id,
//             name: book.name,
//             publisher: book.publisher,
//         })),
//     },
// });

const getAllBooksHandler = (request) => {

    //To Access Query Parameter
    const { name, reading, finished } = request.query;

    let filteredBooks = books;

    //Filtering book by name property (non-case sensitive)
    if (name) {
        filteredBooks = filteredBooks.filter(
            (book) => book.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    //Filtering book by reading property
    if (reading !== undefined) {
        const readingStatus = (reading === "0") ? false : true; //Converting String to Boolean
        filteredBooks = filteredBooks.filter((book) => book.reading === readingStatus);
    }

    //Filtering book by finished property
    if (finished !== undefined) {
        const isFinished = (finished === "0") ? false : true; //Converting String to Boolean
        filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
    }

    const response = {
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    };
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((b) => b.id === bookId)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        }
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
        //If the Client does not attach the name property to the request body
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    };

    if (readPage > pageCount) {
        //If the Client attaches a readPage property value that is greater than the pageCount property value
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    };

    const finished = (pageCount === readPage) ? true : false;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            finished,
            updatedAt,
        };

        //If Id's successfully 
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        });
        response.code(200);
        return response;
    };

    //If attached id can't be found by the server
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = { storeBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };