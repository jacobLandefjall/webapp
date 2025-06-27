import { apiKey, baseURL } from "../utils.js";
import { io } from "https://cdn.jsdelivr.net/npm/socket.io-client@4.7.5/+esm";

export default class ChatForm extends HTMLElement {
    constructor() {
        super();
        this.username = null;
        this.socket = null;
    }

    connectedCallback() {
        this.innerHTML = `
                <header class="header">
                    <lager-title title="Jacob's lager-app"></lager-title>
                </header>

            <div id="username-form" class="username-form">
                <input type="text" id="username-input" placeholder="Fyll i användarnamn" required>
                <button id="username-submit">Gå med</button>
            </div>
            
        <div id="chat-container" class="hidden">
            <h2>Lager Chatt</h2>
            <div id="messages" class="messages"></div>
            
            <div class="input-container">
                <textarea class="message-textarea" id="message-textarea" placeholder="Skriv här..."></textarea>
                <button class="message-button" id="message-button">Skicka</button>
            </div>
        </div>
        `;

        this.init();
    }

    init() {
        // Store socket instance on the component
    
        // Om den finns, skapa socket
        this.socket = io("https://lager-chat.emilfolino.se");


        // Use this.querySelector to find elements within the component
        const usernameForm = this.querySelector("#username-form");
        const usernameInput = this.querySelector("#username-input");
        const usernameSubmit = this.querySelector("#username-submit");
        const chatContainer = this.querySelector("#chat-container");
        const textarea = this.querySelector("#message-textarea");
        const button = this.querySelector("#message-button");
        const messages = this.querySelector("#messages");

        // Handle username submission
        usernameSubmit.addEventListener("click", (event) => {
            event.preventDefault();

            if (usernameInput.value.trim()) {
                this.username = usernameInput.value.trim();
                usernameForm.classList.add("hidden");
                chatContainer.classList.remove("hidden");
            }
        });

        // Enter key event for username submit
        usernameInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                usernameSubmit.click();
            }
        });

        // Handle message submission
        button.addEventListener("click", (event) => {
            event.preventDefault();

            if (textarea.value.trim() && this.username) {
                const messageData = {
                    name: this.username,
                    message: textarea.value.trim()
                };
                
                try {
                    // Use this.socket instead of socket
                    this.socket.emit('chat message', JSON.stringify(messageData));
                    textarea.value = '';
                } catch (error) {
                    console.error("Error sending message:", error);
                }
            }
        });

        // Enter key to send message
        textarea.addEventListener("keypress", (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                button.click();
            }
        });

        // Handle incoming messages
        this.socket.on('chat message', (data) => {
            try {
                const message = typeof data === 'string' ? JSON.parse(data) : data;
                
                // Validate message structure
                if (message && typeof message === 'object' && 
                    'name' in message && 'message' in message) {
                    
                    const item = document.createElement('div');
                    item.classList.add('message');
                    
                    const nameElement = document.createElement('span');
                    nameElement.classList.add('message-username');
                    nameElement.textContent = `${message.name}: `;
                    
                    const textElement = document.createElement('span');
                    textElement.classList.add('message-text');
                    textElement.textContent = message.message;
                    
                    item.append(nameElement, textElement);
                    messages.append(item);
                } else {
                    console.warn("Received malformed message:", message);
                }
            } catch (error) {
                console.error("Error processing message:", error, "Original data:", data);
            }
        });

        // Handle socket connection errors
        this.socket.on('connect_error', (error) => {
            console.error("Connection error:", error);
            this.showError("Connection error. Please try again later.");
        });

        this.socket.on('disconnect', (reason) => {
            if (reason === 'io server disconnect') {
                console.warn("Disconnected from server.");
                this.showError("Please refresh the page.");
            }
        });
    }

    // Display error message
    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.classList.add('error-message');
        errorElement.textContent = message;
        
        const messages = this.querySelector("#messages");
        if (messages) {
            messages.prepend(errorElement);
            
            // Remove after 5 seconds
            setTimeout(() => {
                if (errorElement.parentNode === messages) {
                    messages.removeChild(errorElement);
                }
            }, 5000);
        }
    }
}