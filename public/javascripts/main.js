const MessageList = document.getElementById('messages')
const MessageForm = document.getElementById('new-message')
const Headers     = {'Content-Type': 'application/json'}

const AllMessagesButton       = document.getElementById('all')
const FlaggedMessagesButton   = document.getElementById('flagged')
const UnflaggedMessagesButton = document.getElementById('unflagged')

let AllMessageData = []

function getAllMessages() {
  return fetch('/messages').then(response => response.json())
}

function createMessage(message) {
  fetch('/messages', {
    method: 'POST',
    body: message
  })
}

function setFlagStatus(id, status) {
  fetch(`/messages/${id}`, {
    headers: Headers,
    method: 'PATCH',
    body: JSON.stringify({ flagged: status })
  }).then(() => {
    getAllMessages()
      .then((messages) => {
        AllMessageData = messages
        renderMessages(messages)
      })
  })
}

function renderMessages(messages) {
  MessageList.innerHTML = messages.map((msg) => {
    let flag = renderFlagElement(msg)

    return `
      <li><strong>${msg.username} says:</strong> ${msg.content} ${flag}</li>
    `
  }).join('')

  addFlagClickHandler()
}

function renderFlagElement(message) {
  if (message.flagged) {
    return `<i class="fa fa-flag" data-id="${message.id}" data-flagged="${message.flagged}"></i>`
  } else {
    return `<i class="fa fa-flag-o" data-id="${message.id}" data-flagged="${message.flagged}"></i>`
  }
}

function addFlagClickHandler() {
  const flags = document.querySelectorAll('i.fa')

  flags.forEach((flag) => {
    flag.addEventListener('click', (event) => {
      event.preventDefault()

      let messageId  = event.currentTarget.dataset.id
      let flagStatus = event.currentTarget.dataset.flagged === 'false'

      setFlagStatus(messageId, flagStatus)
    })
  })
}

MessageForm.addEventListener('submit', (event) => {
  event.preventDefault()

  let formData = new FormData(event.currentTarget)

  createMessage(formData)
})

AllMessagesButton.addEventListener('click', (event) => {
  event.preventDefault()

  getAllMessages()
    .then((messages) => {
      AllMessageData = messages
      renderMessages(messages)
    })
})

FlaggedMessagesButton.addEventListener('click', (event) => {
  event.preventDefault()

  flaggedMessages = AllMessageData.filter(message => message.flagged)
  renderMessages(flaggedMessages)
})

UnflaggedMessagesButton.addEventListener('click', (event) => {
  event.preventDefault()

  unflaggedMessages = AllMessageData.filter(message => !message.flagged)
  renderMessages(unflaggedMessages)
})

document.addEventListener('DOMContentLoaded', () => {
  getAllMessages()
    .then((messages) => {
      AllMessageData = messages
      renderMessages(messages)
    })
}, false);
