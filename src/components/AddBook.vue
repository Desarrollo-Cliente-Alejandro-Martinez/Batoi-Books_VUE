<script>
    import axios from 'axios';
    import { store } from '../stores/store.js';
    import { Form, Field, ErrorMessage } from "vee-validate";
    import * as yup from 'yup';

    const API_URL = import.meta.env.VITE_DB_URL_API;

    export default {
        name: 'AddBook',
        props: {
            id: {
                type: String,
                default: null
            }
        },
        components: {
            Form,
            Field,
            ErrorMessage
        },
        data() {
            const mySchema = yup.object().shape({
                moduleCode: yup.string()
                            .required('El módulo es obligatorio'),
                publisher: yup.string()
                            .required('La editorial es obligatoria'),
                price: yup.number()
                            .typeError('Debe de ser un número')
                            .min(0, 'El precio no puede ser negativo')
                            .required('El precio es obligatorio'),
                pages: yup.number()
                            .typeError('Debe de ser un número')
                            .min(1, 'Debe haber al menos 1 página')
                            .required('El número de páginas es obligatorio'),
                status: yup.string()
                            .oneOf(['new', 'good', 'bad'], 'Selecciona un estado válido')
                            .required('El estado es obligatorio'),
                comments: yup.string()
                            .max(500, 'Máximo 500 caracteres')
            });
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
                modules: [],
                mySchema
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
                    store.addMessage('Ha habido un error inesperado y no se ha podido crear le libro. Inténtalo más tarde.', 'error');
                }
            },
            async fetchModules() {
                try {
                    const response = await axios.get(API_URL + '/modules');
                    this.modules = response.data;
                } catch (error) {
                    store.addMessage('Ha habido un error inesperado y no se han podido obtener los módulos. Inténtalo más tarde.', 'error');
                }
            },
            async fetchLastId() {
                try {
                    const response = await axios.get(API_URL + '/books');
                    
                    this.book.id = response.data.length > 0
                        ? (Math.max(...response.data.map(book => book.id)) + 1).toString()
                        : "1";

                } catch (error) {
                    store.addMessage('Ha habido un error inesperado y no se han podido obtener el último ID utilizado. Inténtalo más tarde.', 'error');
                }
            },
            async fetchBook() {
                if (this.isEditMode) {
                    try {
                        const response = await axios.get(`${API_URL}/books?id=${this.id}`);
                        this.book = response.data[0];
                    } catch (error) {
                        store.addMessage('Ha habido un error inesperado y no se ha podido obtener el libro a editar. Inténtalo más tarde.', 'error');
                    }
                }
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
                        store.addMessage('Ha habido un error inesperado y no se ha podido obtener el libro a editar. Inténtalo más tarde.', 'error');
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
        <Form id="bookForm" @submit="saveBook" @reset="resetForm" :validation-schema="mySchema">
            <h1 id="title-form">{{ isEditMode ? 'Editar libro' : 'Añadir libro' }}</h1>

            <!-- ID -->
            <div v-if="isEditMode" id="campoID" class="input-container" hidden>
                <label for="id">ID:</label>
                <input type="number" id="id" v-model="book.id" disabled>
            </div>

            <!-- Módulo -->
            <div class="input-container">
                <label for="id-module">Módulo:</label>
                <Field as="select" name="moduleCode" id="id-module" v-model="book.moduleCode">
                    <option value="">- Selecciona un módulo -</option>
                    <option v-for="module in modules" :key="module.id" :value="module.code">
                        {{ module.cliteral }}
                    </option>
                </Field>
                <ErrorMessage name="moduleCode" class="error-message" />
            </div>

            <!-- Publisher -->
            <div class="input-container">
                <label for="publisher">Editorial:</label>
                <Field type="text" name="publisher" id="publisher" v-model.trim="book.publisher" />
                <ErrorMessage name="publisher" class="error-message" />
            </div>

            <!-- Precio -->
            <div class="input-container">
                <label for="price">Precio:</label>
                <Field type="number" name="price" id="price" v-model.number="book.price" step="0.01" min="0" />
                <ErrorMessage name="price" class="error-message" />
            </div>

            <!-- Páginas -->
            <div class="input-container">
                <label for="pages">Páginas:</label>
                <Field type="number" name="pages" id="pages" v-model.number="book.pages" min="0" />
                <ErrorMessage name="pages" class="error-message" />
            </div>

            <!-- Estado (Radio Buttons) -->
            <div class="input-container">
                <label>Estado:</label>
                <div class="radio-buttons">
                    <label>
                        <Field type="radio" name="status" value="new" v-model="book.status" checked />
                        Nuevo
                    </label>
                    <label>
                        <Field type="radio" name="status" value="good" v-model="book.status" />
                        Bueno
                    </label>
                    <label>
                        <Field type="radio" name="status" value="bad" v-model="book.status" />
                        Malo
                    </label>
                </div>
                <ErrorMessage name="status" class="error-message" />
            </div>

            <!-- Comentarios -->
            <div class="input-container">
                <label for="comments">Comentarios:</label>
                <Field as="textarea" name="comments" id="comments" v-model.trim="book.comments" />
                <ErrorMessage name="comments" class="error-message" />
            </div>

            <!-- Botones -->
            <div class="form-buttons">
                <button type="submit" id="submitButton">{{ isEditMode ? 'Guardar cambios' : 'Añadir' }}</button>
                <button type="reset" id="resetButton">Reset</button>
            </div>
        </Form>

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

    .error-message {
        background-color: #ebcece;
        color: #991b1b;
        padding: 16px;
        margin-bottom: 10px;
        border: 1px solid #991b1b;
        border-radius: 0.5rem;
        /* display: flex; */
        /* align-items: center; */
        grid-column: 1 / 3;
    }
</style>