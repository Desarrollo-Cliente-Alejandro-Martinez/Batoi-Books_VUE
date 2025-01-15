<script>
    import axios from 'axios';
    import { store } from '../stores/store.js';

    const API_URL = import.meta.env.VITE_DB_URL_API;

    export default {
        name: 'AddBook',
        props: {
            id: {
                type: String,
                default: null
            }
        },
        data() {
            return {
                book: {
                    id: "",
                    moduleCode: "",
                    publisher: "",
                    price: 0,
                    pages: 0,
                    status: "new",
                    photo: "",
                    comments: "",
                    soldDate: ""
                },
                modules: []
            }
        },
        computed: {
            isEditMode() {
                return this.id !== null;
            }
        },
        watch: {
            'id'() {
                this.fetchBook();
            }
        },
        methods: {
            async saveBook() {
                try {

                    // Valida si el formulario es correcto
                    if (!this.validate()) return;
                    
                    // Comprobación si se está añadiendo o editando un libro
                    if (this.isEditMode) {
                        await axios.put(API_URL + '/books/' + this.id, this.book);
                        
                        this.$emit('book-updated', this.book);

                        store.addMessage('Libro actualizado correctamente.', 'success');
                    } else {
                        // Recoge la última ID y añade el libro mediante axios con el verbo POST
                        await this.fetchLastId();

                        const response = await axios.post(API_URL + '/books', this.book);
                        
                        // Emite a BookList el libro añadido recientemente
                        this.$emit('book-added', response.data);
                        
                        store.addMessage('Libro creado correctamente.', 'success');
                    }

                    // Resetea el formulario
                    this.resetForm();     
                    
                    // Redirección a la lista de libros
                    this.$router.push('/');

                } catch (error) {
                    console.error('Error al añadir el libro:', error);
                }
            },
            async fetchModules() {
                try {
                    const response = await axios.get(API_URL + '/modules');
                    this.modules = response.data;
                } catch (error) {
                    console.error('Error al cargar los módulos:', error);
                }
            },
            async fetchLastId() {
                try {
                    const response = await axios.get(API_URL + '/books');
                    
                    if (response.data.length > 0) {
                        const lastId = Math.max(...response.data.map(book => book.id));
                        this.book.id = lastId + 1 + "";
                    } else {
                        this.book.id = "1";
                    }
                    
                } catch (error) {
                    console.error('Error al obtener la última ID:', error);
                }
            },
            validate() {
                // Comprobación de campos vacíos
                if (!this.book.moduleCode || !this.book.publisher || !this.book.price || !this.book.pages || !this.book.status) {
                    store.addMessage('No puede haber ningún campo vacío.', 'error');
                    return false;
                }

                // Comprobación de precio negativo
                if (this.book.price <= 0) {
                    store.addMessage('El precio debe ser mayor que 0.', 'error');
                    return false;
                }

                // Comprobación de páginas negativas o iguales a 0
                if (this.book.pages <= 0) {
                    store.addMessage('Las páginas deben ser mayores que 0.', 'error');
                    return false;
                }

                // Comprobación de estado
                if (this.book.status !== 'new' && this.book.status !== 'good' && this.book.status !== 'bad') {
                    store.addMessage('El estado no coincide con los establecidos.', 'error');
                    console.log(this.book.status);
                    
                    return false;
                }

                return true;
            },
            resetForm() {
                if (this.isEditMode) {                    
                    this.fetchBook();
                } else {
                    
                    this.book = {
                        id: "",
                        moduleCode: "",
                        publisher: "",
                        price: 0,
                        pages: 0,
                        status: "new",
                        photo: "",
                        comments: "",
                        soldDate: ""
                    };
                }
            },
            async fetchBook() {
                if (this.isEditMode) {
                    try {
                        const response = await axios.get(`${API_URL}/books?id=${this.id}`);
                        this.book = response.data[0];
                    } catch (error) {
                        console.error('Error al obtener el libro:', error);
                    }
                } else {
                    this.resetForm();
                }
            },
        },
        mounted() {
            if (this.isEditMode) {
                this.fetchBook();
            }
            this.fetchModules();
        }
    }
</script>

<template>
    <div id="form">
        <form id="bookForm" @submit.prevent="saveBook" @reset="resetForm">
            <h1 id="title-form">{{ isEditMode ? 'Editar libro' : 'Añadir libro' }}</h1>

            <!-- ID -->
            <div v-if="isEditMode" id="campoID" class="input-container" hidden>
                <label for="id">ID:</label>
                <input type="number" id="id" v-model="book.id" disabled>
            </div>

            <!-- Módulo -->
            <div class="input-container">
                <label for="id-module">Módulo:</label>
                <select id="id-module" v-model="book.moduleCode" required>
                    <option value="">- Selecciona un módulo -</option>
                    <option v-for="module in modules" :key="module.id" :value="module.code">
                        {{ module.cliteral }}
                    </option>
                </select>
            </div>

            <!-- Publisher -->
            <div class="input-container">
                <label for="publisher">Editorial:</label>
                <input type="text" id="publisher" v-model.trim="book.publisher" required>
            </div>

            <!-- Precio -->
            <div class="input-container">
                <label for="price">Precio:</label>
                <input type="number" id="price" v-model.number="book.price" step="0.01" min="0" required>
            </div>

            <!-- Páginas -->
            <div class="input-container">
                <label for="pages">Páginas:</label>
                <input type="number" id="pages" v-model.number="book.pages" min="0" required>
            </div>

            <!-- Estado (Radio Buttons) -->
            <div class="input-container">
                <label>Estado:</label>
                <div class="radio-buttons">
                    <label>
                        <input type="radio" name="status" value="new" v-model="book.status" checked required>
                        Nuevo
                    </label>
                    <label>
                        <input type="radio" name="status" value="good" v-model="book.status" required>
                        Bueno
                    </label>
                    <label>
                        <input type="radio" name="status" value="bad" v-model="book.status" required>
                        Malo
                    </label>
                </div>
            </div>

            <!-- Comentarios -->
            <div class="input-container">
                <label for="comments">Comentarios:</label>
                <textarea id="comments" v-model.trim="book.comments"></textarea>
            </div>

            <!-- Botones -->
            <div class="form-buttons">
                <button type="submit" id="submitButton">{{ isEditMode ? 'Guardar cambios' : 'Añadir' }}</button>
                <button type="reset" id="resetButton">Reset</button>
            </div>
        </form>

        <div id="errores"></div>
    </div>
</template>

<style scoped>
    /* Estilo del título */
    #title-form {
        color: #FFA726;
        text-transform: uppercase;
    }


    /* Estilos del formulario */
    #form {
        margin: 30px;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        grid-template-areas: 
            "bookForm";
        gap: 30px
    }

    #bookForm {
        grid-area: bookForm;
    }



    .input-container {
        display: grid;
        grid-template-columns: 1fr 3fr;
        gap: 15px;
        min-height: 55px;
        margin-bottom: 5px;

        label {
            min-width: 130px;
            align-self: center;
            text-align: left;
            font-weight: bold;
            font-size: 1.3em;
            color: white;
        }
    }


    input[type="text"],
    input[type="number"],
    select {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
        border: solid 1px #000;
        border-radius: 10px;
        min-height: 50px;
        
        font-size: 1.2em;
        font-weight: bold;
    }

    textarea {
        max-width: fit-content;
        min-width: 100%;
        padding: 8px;
        box-sizing: border-box;

        resize: vertical;
        max-height: 114px;
        min-height: 64px;

        border: solid 1px #000;
        border-radius: 10px;

        font-size: 1.2em;
        font-weight: bold;
    }


    /* Estilos para los radio buttons */
    .radio-buttons {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 9px;

        label {
            display: flex;
            align-items: center;
            background-color: #444;
            color: white;
            padding: 10px 15px;
            border-radius: 10px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }

        label:hover {
            background-color: #555;
        }

        input[type="radio"] {
            margin-right: 10px;
            accent-color: #FF5722;
        }

        input[type="radio"]:checked + label {
            color: #FFA726;
            font-weight: bold;
        }
    }


    .form-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-top: 10px;
        min-height: 55px;

        font-size: 1.5em;
    }



    #bookForm {
        background-color: grey;
        padding: 20px;
        border-radius: 10px;
    }
</style>