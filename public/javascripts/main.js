const MessageList   = document.getElementById("messages");
const MessageForm   = document.getElementById("new-message");
const FormTitle     = document.querySelector("h3");
const UsernameInput = document.querySelector("input[name='username']");
const MessageBody   = document.querySelector("textarea[name='content']");
const EditMessageId = document.querySelector("input[name='edit_message_id']");
const SubmitButton  = document.querySelector("input[type='submit']");
const UpdateButton  = document.querySelector("button[type='submit']");
const ResetButton   = document.querySelector("button[type='reset']");
const Headers       = { "Content-Type": "application/json" };

const AllMessagesButton       = document.getElementById("all");
const FlaggedMessagesButton   = document.getElementById("flagged");
const UnflaggedMessagesButton = document.getElementById("unflagged");

let AllMessageData = [];

function getAllMessages() {
  return fetch("/messages").then(response => response.json());
}

function createMessage(message) {
  fetch("/messages", {
    method: "POST",
    body: message
  })
  .then(getAllMessages)
  .then(messages => {
    AllMessageData = messages;
    resetMessageForm();
    renderMessages(messages);
  });
}

function updateMessage(message, id) {
  fetch(`/messages/${id}`, {
    method: "PATCH",
    body: message
  })
  .then(getAllMessages)
  .then(messages => {
    AllMessageData = messages;
    resetMessageForm();
    renderMessages(messages);
  });
}

function setFlagStatus(id, status) {
  fetch(`/messages/${id}`, {
    headers: Headers,
    method: "PATCH",
    body: JSON.stringify({ flagged: status })
  })
  .then(getAllMessages)
  .then(messages => {
    AllMessageData = messages;
    renderMessages(messages);
  });
}

function renderMessages(messages) {
  MessageList.innerHTML = messages.map((msg) => {
    const edit = `<i class="fa fa-pencil-square-o" data-id="${msg.id}"></i>`;
    const flag = renderFlagElement(msg);

    return `
      <li>
        <strong>${msg.username} says:</strong> ${msg.content}
        <div>
          <span> ${edit} </span><span> ${flag} </span>
        </div>
      </li>
    `
  }).join('');

  addFlagClickHandler();
  addMessageClickHandler();
}

function renderFlagElement(message) {
  if (message.flagged) {
    return `<i class="fa fa-flag" data-id="${message.id}" data-flagged="${message.flagged}"></i>`;
  } else {
    return `<i class="fa fa-flag-o" data-id="${message.id}" data-flagged="${message.flagged}"></i>`;
  }
}

function addFlagClickHandler() {
  const flags = document.querySelectorAll('i.fa.fa-flag, i.fa.fa-flag-o');

  flags.forEach(flag => {
    flag.addEventListener("click", event => {
      event.preventDefault();

      let messageId = event.currentTarget.dataset.id;
      let flagStatus = event.currentTarget.dataset.flagged === "false";

      setFlagStatus(messageId, flagStatus);
    });
  });
}

function addMessageClickHandler() {
  const editIcons = document.querySelectorAll("i.fa.fa-pencil-square-o");

  editIcons.forEach(message => {
    message.addEventListener("click", event => {
      event.preventDefault()

      let messageId       = event.currentTarget.dataset.id;
      let selectedMessage = AllMessageData.find(msg => msg.id == messageId);

      EditMessageId.value        = messageId;
      UsernameInput.value        = selectedMessage.username;
      MessageBody.value          = selectedMessage.content;
      MessageForm.classList      = "edit_message";
      FormTitle.textContent      = "Update Message";
      SubmitButton.style.display = "none";
      UpdateButton.style.display = "inline";
      ResetButton.style.display  = "inline";
    });
  });
}

function resetMessageForm() {
  EditMessageId.value        = "";
  MessageForm.classList      = "";
  FormTitle.textContent      = "Post Message";
  SubmitButton.style.display = "inline";
  UpdateButton.style.display = "none";
  ResetButton.style.display  = "none";

  MessageForm.reset();
}

MessageForm.addEventListener("submit", event => {
  event.preventDefault();

  let formData = new FormData(event.currentTarget);

  if (event.currentTarget.className == "edit_message") {
    updateMessage(formData, EditMessageId.value);
  } else {
    createMessage(formData);
  }
});

AllMessagesButton.addEventListener("click", event => {
  event.preventDefault();

  getAllMessages().then(messages => {
    AllMessageData = messages;
    renderMessages(messages);
  });
});

FlaggedMessagesButton.addEventListener("click", event => {
  event.preventDefault();

  let flaggedMessages = AllMessageData.filter(message => message.flagged);
  renderMessages(flaggedMessages);
});

UnflaggedMessagesButton.addEventListener("click", event => {
  event.preventDefault();

  let unflaggedMessages = AllMessageData.filter(message => !message.flagged);
  renderMessages(unflaggedMessages);
});

ResetButton.addEventListener("click", event => {
  event.preventDefault();
  resetMessageForm()
});

document.addEventListener('DOMContentLoaded', () => {
  getAllMessages().then(messages => {
    AllMessageData = messages;
    renderMessages(messages);
  });
}, false);
