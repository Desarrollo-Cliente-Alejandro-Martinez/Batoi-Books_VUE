import { defineStore } from 'pinia';
import axios from 'axios';
import { store } from '../stores/store.js';


const API_URL = import.meta.env.VITE_DB_URL_API;


export const useBooksStore = defineStore('books', {
    state: () => ({
        books: [],
        cart: [],
        modules: []
    }),
    getters: {
        getModuleDescription: (state) => (moduleCode) => {
            const module = state.modules.find(mod => mod.code === moduleCode);
            return module ? module.cliteral : 'Módulo desconocido';
        },
        cartTotal: (state) => {
            return state.cart.reduce((total, book) => total + parseFloat(book.price), 0).toFixed(2);
        },
        isInCart: (state) => (bookId) => {
            return state.cart.some((book) => book.id === bookId);
        },
        cartCount: (state) => state.cart.length
    },
    actions: {
        // Obtener todos los libros de la BD
        async fetchBooks() {
            try {
                const response = await axios.get(API_URL + '/books');
                this.books = response.data;
            } catch (error) {
                store.addMessage('Ha habido un error inesperado y no se han podido obtener los libros. Inténtalo más tarde.', 'error');
            }
        },
        // Obtener todos los módulos de la BD
        async fetchModules() {
            try {
                const response = await axios.get(import.meta.env.VITE_DB_URL_API + '/modules');
                this.modules = response.data;
            } catch (error) {
                store.addMessage('Ha habido un error inesperado y no se han podido obtener los módulos. Inténtalo más tarde.', 'error');
            }
        },
        // Añadir un libro nuevo
        addBook(newBook) {
            this.books.push(newBook);
        },
        async deleteBook(bookId, index) {
            try {
                await axios.delete(`${API_URL}/books/${bookId + ''}`);
                this.removeBookFromCart(bookId);
                this.books.splice(index, 1);
                store.addMessage('Libro eliminado correctamente.', 'info');
            } catch (error) {
                store.addMessage('Ha habido un error eliminando el libro.', 'error');
            }
        },
        // Actualizar un libro existente
        updateBook(updatedBook) {

            const index = this.books.findIndex(book => book.id === updatedBook.id);

            if (index !== -1) {
                this.books[index] = updatedBook;
            }

            this.updateBookInCart(updatedBook);
        },
        // Añadir un libro al carrito
        addBookToCart(book) {
            if (!this.isInCart(book.id)) {
                this.cart.push(book);
                this.saveCartToLocalStorage();
            }
        },
        updateBookInCart(newBook) {
            this.cart = this.cart.map(book =>
                book.id === newBook.id
                    ? newBook
                    : book
            );
        },
        // Eliminar un libro del carrito
        removeBookFromCart(bookId) {
            this.cart = this.cart.filter((book) => book.id !== bookId);
            this.saveCartToLocalStorage();
        },
        // Limpiar carrito
        clearCart() {
            this.cart = [];
            this.saveCartToLocalStorage();
        },
        // Guardar el estado actual del carrito
        saveCartToLocalStorage() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },
        // Cargar el carrito
        loadCartFromLocalStorage() {
            const cart = localStorage.getItem('cart');
            if (cart) {
                this.cart = JSON.parse(cart);
            }
        },
    },
});
