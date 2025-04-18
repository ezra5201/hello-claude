document.addEventListener('DOMContentLoaded', () => {
    // Configure AWS
    AWS.config.region = 'us-west-2'; // e.g., 'us-east-1'
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-west-2:32214b34-6ff4-4b62-b71c-cb98f2644830'
    });
    
    let currentConversationId = Date.now().toString();
    
    const messageForm = document.getElementById('message-form');
    const userInput = document.getElementById('user-input');
    const messagesContainer = document.getElementById('messages');
    
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const message = userInput.value.trim();
        if (!message) return;
        
        // Display user message
        displayMessage(message, 'user');
        userInput.value = '';
        
        try {
            // Show loading indicator
            const loadingElement = document.createElement('div');
            loadingElement.classList.add('message', 'claude-message');
            loadingElement.textContent = 'Claude is thinking...';
            messagesContainer.appendChild(loadingElement);
            
            // Call API Gateway
            const response = await fetch('https://unhvtre908.execute-api.us-west-2.amazonaws.com/test/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    conversationId: currentConversationId
                })
            });
            
            // Remove loading indicator
            messagesContainer.removeChild(loadingElement);
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            
            // Display Claude's response
            displayMessage(data.message, 'claude');
        } catch (error) {
            console.error('Error:', error);
            displayMessage('Sorry, I encountered an error processing your request.', 'claude');
        }
    });
    
    function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'claude-message');
        messageElement.textContent = message;
        messagesContainer.appendChild(messageElement);
        
        // Auto-scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});
