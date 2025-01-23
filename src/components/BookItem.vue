<script>

    import { useBooksStore } from '../stores/piniaStore.js';
    import { computed } from 'vue';

    export default {
        name: 'BookItem',
        props: {
            book: {
                type: Object,
                required: true
            }
        },
        setup(props) {
            const store = useBooksStore();

            const moduleDescription = computed(() => store.getModuleDescription(props.book.moduleCode));
            const isInCart = computed(() => store.isInCart(props.book.id));

            const addToCart = () => store.addBookToCart(props.book);
            const removeFromCart = () => store.removeBookFromCart(props.book.id);

            return { moduleDescription, isInCart, addToCart, removeFromCart};
        },
        computed: {
            bookStatus() {
                if (this.book.status === 'new') return 'blue';
                if (this.book.status === 'good') return 'green';
                return 'red';
            },
            soldClass() {
                return this.book.soldDate === '' ? 'green' : 'red';
            }
        },
    };
</script>

<template>
    <div class="card">
        <img
            :src="book.photo ? book.photo : '/default.jpeg'"
            :alt="'Libro:' + book.id"
            class="card-image"
        >
        <div class="card-details">
            <h3 class="card-title">{{ moduleDescription }} | ID: {{ book.id }}</h3>
            <h4 class="card-publisher">
                <span class="label">Editorial:</span>
                <span class="name">{{ book.publisher }}</span>
            </h4>
            <p class="card-pages">Páginas: {{ book.pages }}</p>
            <p class="card-condition">
                Estado:
                <span :class="bookStatus">
                    {{ book.status === 'new' ? 'Nuevo' : (book.status === 'good') ? 'Bueno' : 'Malo' }}
                </span>
            </p>
            <p class="card-sold" :class="soldClass">
                {{ book.soldDate === '' ? 'En venta' : 'Vendido el ' + book.soldDate }}
            </p>
            <p class="card-comments">
                {{ book.comments || 'Sin comentarios adicionales' }}
            </p>
            <h4 class="card-price" :class="soldClass">
                {{ parseFloat(book.price).toFixed(2) }} €
            </h4>

        </div>
        <div class="buttons">
            <slot class="buttons"></slot>
        </div>
    </div>
</template>

<style scoped>
    .card {
        display: flex;
        flex-direction: column;
        background-color: gray;
        padding: 20px;
        border-radius: 10px;
        transition: transform 0.3s ease;
        height: 100%;

        img {
            width: 100%;
            margin-bottom: 20px;
        }

        .card-title {
            font-size: 2.2em;
            font-weight: bold;
            color: #FFA726;
            text-align: center;
            text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
            margin-bottom: 10px;
            padding: 5px;
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            transition: transform 0.3s ease, color 0.3s ease;
        }
        
        .card-publisher {
            margin-bottom: 10px;

            .label {
                font-weight: bold;
                display: block;
                font-size: 1.2em;
                color: #d6d6d6;
            }

            .name {
                display: block;
                font-size: 1.6em;
                color: #333;
            }
        }

        .card-pages {
            font-size: 1.3em;
            font-weight: bold;
        }

        .card-condition {
            font-size: 1.3em;
            margin-bottom: 10px;
            font-weight: bold;
        }

        .card-sold {
            font-size: 1.6em;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .card-comments {
            padding: 10px;
            background-color: #313131;
            border-radius: 10px;
        }

        .card-price {
            font-size: 1.8em;
            text-align: right;
            margin-top: 12px;
            font-weight: bold;
        }
    }
    
    .card:hover {
        transform: scale(1.05);
        cursor: pointer;
    }

    .buttons {
        display: flex;
        justify-content: space-around;
        margin-top: auto;
        padding-top: 10px;
    }
</style>