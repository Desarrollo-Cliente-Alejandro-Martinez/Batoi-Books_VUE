<script>
    import { RouterLink } from 'vue-router';

    export default {
        name: 'AppMenu'
    }
</script>

<template>
    <nav>
        <ul>
            <li><RouterLink to="/">Ver Libros</RouterLink></li>
            <li><RouterLink to="/add-book">Añadir Libro</RouterLink></li>
            <li><RouterLink to="/cart">Carrito </RouterLink></li>
            <li><RouterLink to="/about">Acerca de</RouterLink></li>
        </ul>
    </nav>
</template>

<style scoped>
    nav {
        grid-area: menu;
        justify-self: right;
        align-self: center;
        padding-right: 10px;
    }

    nav ul {
        list-style-type: none;
        gap: 10px;
    }

    nav ul li {
        display: inline-block;
        padding: 10px;
    }

    nav ul li a {
        text-decoration: none;
        color: #FFA726;
        font-size: 1.4em;
        transition: box-shadow 0.2s ease, color 0.2s ease;
    }

    nav ul li:hover a {
        color: #da8300;
        box-shadow: 0px 2px 0px #da8300;
    }
</style>