import { Message } from './message';
import './styles.css';

const loginView = document.getElementById('login-view');
const chatView = document.getElementById('chat-view');
const loginForm = loginView.querySelector('#login-form');
const messageForm = chatView.querySelector('#message-form');
const usernameInput = loginForm.querySelector('#username');
const messageInput = messageForm.querySelector('#message');
const loginBtn = loginForm.querySelector('#login-btn');
const logOutBtn = chatView.querySelector('#log-out-btn');
const messageBtn = chatView.querySelector('#message-btn');
const chatTitle = chatView.querySelector('#chat-title');

let username, unsubscribe;

function loginFormHandler(event) {
  event.preventDefault();

  username = usernameInput.value.trim();

  if (username.length < 4) {
    return;
  }

  usernameInput.value = '';
  loginBtn.disabled = true;
  loginView.classList.add('hidden');
  chatView.classList.remove('hidden');
  chatTitle.textContent = `Welcome back, ${username}!`;
  unsubscribe = Message.subscribe((data) =>
    Message.renderMessages(data, username)
  );
}

function logOutBtnHandler() {
  unsubscribe();

  chatView.classList.add('hidden');
  loginView.classList.remove('hidden');
}

function messageFormHandler(event) {
  event.preventDefault();

  const messageText = messageInput.value.trim();

  if (!messageText) {
    return;
  }

  const message = {
    text: messageText,
    user: username,
  };
  messageBtn.disabled = true;
  Message.create(message).then(() => {
    messageInput.value = '';
    messageBtn.disabled = false;
  });
}

loginForm.addEventListener('submit', loginFormHandler);
usernameInput.addEventListener('input', () => {
  loginBtn.disabled = !(usernameInput.value.trim().length >= 4);
});
logOutBtn.addEventListener('click', logOutBtnHandler);
messageForm.addEventListener('submit', messageFormHandler);
