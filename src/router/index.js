import { createRouter, createWebHistory } from 'vue-router';

// Componentes para las rutas
import BooksList from '../components/BooksList.vue';
import AddBook from '../components/AddBook.vue';
import AppCart from '../components/AppCart.vue';
import AppAbout from '../components/AppAbout.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: BooksList,
      props: (route) => ({ books: route.params.books })
    },
    {
      path: '/add-book',
      name: 'add',
      component: AddBook
    },
    {
      path: '/cart',
      name: 'cart',
      component: AppCart
    },
    {
      path: '/about',
      name: 'about',
      component: AppAbout
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: AddBook,
      props: true
    }
  ],
})

export default router;
