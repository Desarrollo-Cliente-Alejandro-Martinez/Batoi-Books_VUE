<script setup>
    import { RouterView } from 'vue-router';
    import { onMounted } from 'vue';
    import { useBooksStore } from './stores/piniaStore';

    import AppMenu from './components/AppMenu.vue';
    import AppMessages from './components/AppMessages.vue';

    const store = useBooksStore();

    onMounted(() => {
        store.fetchModules();
        store.fetchBooks();
        store.loadCartFromLocalStorage();
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

    <RouterView 
        :books="store.books" 
        @book-added="store.addBook"
        @book-updated="store.updateBook"
    />
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