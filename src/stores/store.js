import { reactive } from 'vue';

export const store = reactive({
    messages: [],
    addMessage(message, type = 'info') {
        this.messages.push({ message, type });
    },
    clearMessages() {
        this.messages = [];
    }
});
