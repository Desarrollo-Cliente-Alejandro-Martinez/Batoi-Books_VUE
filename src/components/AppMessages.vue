<script>
    import { store } from '../stores/store.js';

    // const clearMessage = (index) => {
    //     store.messages.splice(index, 1);
    // };

    export default {
        name: 'AppMessages',
        data() {
            return {
                store: store
            };
        },
        methods: {
            clearMessage(index) {
                store.messages.splice(index, 1);
            }
        },
    };
</script>

<template>
    <div v-if="store.messages.length" class="app-messages">
        <div
            v-for="(msg, index) in store.messages"
            :key="index"
            :class="['message', msg.type]"
        >
            <span>{{ msg.message }}</span>
            <button @click="clearMessage(index)">Cerrar</button>
        </div>
    </div>
</template>

<style scoped>
    .app-messages {
        position: fixed;
        top: 130px;
        right: 20px;
        z-index: 1000;
    }

    .message {
        background: #fff;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .message.error {
        background-color: #f8d7da;
        color: #721c24;
    }

    .message.info {
        background-color: #d1ecf1;
        color: #0c5460;
    }

    .message.success {
        background: #d1e7dd;
        color: #0f5132;
        border: 1px #8bbda6 solid;
    }

    .message button {
        background: none;
        border: none;
        color: inherit;
        font-size: 16px;
        cursor: pointer;
    }
</style>