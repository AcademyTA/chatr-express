const MessageList = document.getElementById('messages')
const MessageForm = document.getElementById('new-message')

const Headers = {'Content-Type': 'application/json'}

function getAllMessages() {
  fetch('/messages')
    .then(response => response.json())
    .then(renderMessages)
}

function createMessage(message) {
  fetch('/messages', {
    method: 'POST',
    body: message
  })
}

function renderMessages(messages) {
  MessageList.innerHTML = messages.map((msg) => {
    return `
      <li><strong>${msg.username} says:</strong> ${msg.content}</li>
    `
  }).join('')
}

MessageForm.addEventListener('submit', (event) => {
  event.preventDefault()

  let formData = new FormData(event.currentTarget)

  createMessage(formData)
})

document.addEventListener('DOMContentLoaded', () => {
  getAllMessages()
}, false);
