<script>

    import BookItem from './BookItem.vue';
    import { useBooksStore } from '../stores/piniaStore.js';
    import { store } from '../stores/store.js';


    export default {
        name: 'AppCart',
        components: {
            BookItem
        },
        computed: {
            cart() {
                const store = useBooksStore();
                return store.cart;
            },
            total() {
                const store = useBooksStore();
                return store.cart.reduce((total, book) => total + parseFloat(book.price), 0).toFixed(2);
            }
        },
        methods: {
            handleDeleteBookInCart(book) {
                const store = useBooksStore();
                store.removeBookFromCart(book.id);
            },
            checkout() {
                if (!confirm('¿Estas seguro que deseas realizar el pedido?')) return;

                const piniaStore = useBooksStore();
                piniaStore.clearCart();

                store.addMessage('Pedido realizado correctamente.', 'success');

                this.$router.push('/');
            },
            handleCleanCart() {
                if (!confirm('¿Estas seguro que deseas limpiar el carrito?')) return;

                const piniaStore = useBooksStore();
                piniaStore.clearCart();

                store.addMessage('Carrito limpiado correctamente.', 'info');

                this.$router.push('/');
            }
        },
    }
</script>

<template>
    <!-- Carrito vacío -->
    <div v-if="cart.length === 0" class="emtpy-cart">
        <h2>Tu carrito está vacío</h2>
        <p>Añade libros para empezar a comprar.</p>
    </div>

    <!-- Artículos en el carrito -->
    <div v-else class="contenedor">
        <div class="lista">
            <h2 class="title">Libros en el carrito</h2>

            <div id="list">
                <BookItem
                    v-for="(book, index) in cart"
                    :key="index"
                    :book="book"
                >

                    <!-- Quitar libro del carrito -->
                    <button @click="handleDeleteBookInCart(book)">
                        <span class="material-icons">remove_shopping_cart</span>
                    </button>
                </BookItem>
            </div>
        </div>
        <div class="resumen">
            <h2 class="title">Resumen</h2>

            <div class="carrito">
                <h3 class="parrafo">Total: <span class="total">{{ total }} €</span></h3>

                <div class="botones">
                    <button @click="checkout">
                        <span>Realizar pedido</span>
                    </button>
                    <button @click="handleCleanCart">
                        <span>Limpiar carrito</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .title {
        color: white;
        font-size: 2.85em;
        margin: 20px 30px;
    }

    .contenedor {
        display: grid;
        grid-template-columns: 2fr 1fr;
    }

    .resumen {
        border-left: 2px solid gray;
    }

    .carrito {
        margin: 40px 30px 0px 30px;
        background-color: grey;
        padding: 20px;
        border-radius: 10px;
    }

    .parrafo {
        color: white;
        font-size: 1.7em;
    }

    .total {
        color: greenyellow;
        font-weight: bold;
    }

    .botones {
        display: flex;
        justify-content: space-between;
        margin-top: 25px;
    }

    .emtpy-cart {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 91dvh;
        text-align: center;

        h2 {
            font-size: 5em;
            color: white;
            margin: 5px;
        }

        p {
            font-size: 2em;
            margin: 15px;
        }
    }
</style>