<script>
    import BookItem from './BookItem.vue';
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
                console.log('Añadir al carrito:', book);
            },
            handleEdit(book) {
                this.$router.push({ name: 'edit', params: { id: book.id } });
            },
            handleDelete(book) {
                if (confirm('¿Estás seguro que deseas eliminar el libro? Esta opción es permanente y no se puede deshacer.')) {
                    const index = this.books.findIndex((b) => b.id === book.id);
                    if (index !== -1) {
                        this.books.splice(index, 1);
                    }
                    store.addMessage('Libro eliminado correctamente.', 'info');
                }
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
            @addToCart="handleAddToCart"
            @edit="handleEdit"
            @delete="handleDelete"
        />
    </div>

    <!-- Total de libros -->
    <div id="total-books">
        <div class="divisor"></div>
        <p>Total de libros listados: {{ totalBooks }}</p>
    </div>

</template>

<style scoped>
    #list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        margin: 40px 30px 0px 30px;
        padding-bottom: 30px;
    }

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