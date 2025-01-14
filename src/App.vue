<script setup>
    // import { RouterLink, RouterView } from 'vue-router'
    // import HelloWorld from './components/HelloWorld.vue'

    import { ref, onMounted } from 'vue';
    import axios from 'axios';

    import AppMenu from './components/AppMenu.vue';
    import AppMessages from './components/AppMessages.vue'
    import BooksList from './components/BooksList.vue';
    import AddBook from './components/AddBook.vue';
    import AppCart from './components/AppCart.vue';
    import AppAbout from './components/AppAbout.vue';
    

    const API_URL = import.meta.env.VITE_DB_URL_API;

    const books = ref([]);

    async function fetchBooks() {
        try {
            const response = await axios.get(API_URL + '/books');
            books.value = response.data;
        } catch (error) {
            console.error('Error al obtener los libros:', error);
        }
    }

    function handleBookAdded(newBook) {
        books.value.push(newBook);
    }

    onMounted(() => {
        fetchBooks();
    });
</script>

<template>
    <header>
        <div class="tittle">
            <img src="/logoBatoi.png" class="logo" alt="Logo batoi"/>
            <h1>BatoiBooks</h1>
        </div>
        <AppMenu />
    </header>

    <AppMessages />
    <BooksList :books="books" />
    <AddBook @book-added="handleBookAdded" />
    <AppCart />
    <AppAbout />

    <!-- <RouterView /> -->
</template>

<style scoped>
    /* Estilos de todo el header */
    header {
        width: 100%;
        position: sticky;
        z-index: 1;
        top: 0;
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: repeat(2, 1fr);
        grid-template-areas: 
        "logo menu";
        background-color: #333;
    }
    
    /* Estilos del contenedor del título */
    .tittle {
        grid-area: logo;
        display: flex;
        color: white;
        padding-left: 10px;
    }

    /* Estilos del logo de batoi */
    .tittle img {
        width: 100px;
        margin: 15px;
        background-color: white;
    }

    /* Estilos del título del header */
    .tittle h1 {
        align-self: center;
        padding-left: 25px;
        font-size: 3em;
    }
</style>