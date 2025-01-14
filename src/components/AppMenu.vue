<script>
    export default {
        name: 'AppMenu'
    }
</script>

<template>
    <nav>
        <ul>
            <li><a href="#list">Ver Libros</a></li>
            <li><a href="#form">Añadir Libro</a></li>
            <li><a href="#about">Acerca de</a></li>
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