<script>

    import BookItem from './BookItem.vue';
    import { useBooksStore } from '../stores/piniaStore.js';
    import { store } from '../stores/store.js';


    export default {
        name: 'BooksList',
        emits: ['bookAdded', 'bookUpdated'],
        components: {
            BookItem
        },
        props: {
            books: {
                type: Array,
                required: true,
                default: () => []
            }
        },
        computed: {
            totalBooks() {
                return this.books.length;
            }
        },
        methods: {
            handleAddToCart(book) {
                const stores = useBooksStore();
                
                if (stores.isInCart(book.id)) {
                    alert('Este libro ya está en el carrito.');
                } else {
                    stores.addBookToCart(book);
                    store.addMessage('Libro añadido al carrito correctamente al carrito.', 'success');
                }            
            },
            handleEdit(book) {
                this.$router.push({ name: 'edit', params: { id: book.id } });
            },
            handleDelete(book) {
                if (confirm('¿Estás seguro que deseas eliminar el libro? Esta opción es permanente y no se puede deshacer.')) {

                    const index = this.books.findIndex((b) => b.id === book.id);

                    const piniaStore = useBooksStore();
                    piniaStore.deleteBook(book.id, index);
                }
            },
            isOnCart(bookId) {
                const store = useBooksStore();
                return store.isInCart(bookId);
            }
        }
    };
</script>

<template>
    <!-- Libros -->
    <div id="list">
        <BookItem
            v-for="(book, index) in this.books"
            :key="index"
            :book="book"
        >
        
            <!-- Add to cart -->
            <button @click="handleAddToCart(book)" :disabled="isOnCart(book.id)" :class="{'disabled-btn': isOnCart(book.id)}">
                <span class="material-icons">add_shopping_cart</span>
            </button>

            <!-- Edit -->
            <button @click="handleEdit(book)">
                <span class="material-icons">edit</span>
            </button>

            <!-- Delete -->
            <button @click="handleDelete(book)">
                <span class="material-icons">delete</span>
            </button>
        </BookItem>
    </div>

    <!-- Total de libros -->
    <div id="total-books">
        <div class="divisor"></div>
        <p>Total de libros listados: {{ totalBooks }}</p>
    </div>

</template>

<style scoped>
    #total-books {
        display: flex;
        flex-direction: column;
        align-content: center;
        flex-wrap: wrap;
        padding-bottom: 25px;

        .divisor {
            width: 85%;
            border-top: 1px solid white;
            padding-top: 10px;
        }

        p {
            color: white;
            font-size: 2.2em;
            font-weight: bold;
            text-align: center;
        }
    }
</style>