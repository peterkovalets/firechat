import {
  Timestamp,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from './firebase';

export class Message {
  static create(message) {
    return addDoc(collection(db, 'messages'), {
      ...message,
      createdAt: Timestamp.now(),
    }).catch((error) => {
      console.error('Error adding document: ', error);
    });
  }

  static subscribe(callback) {
    const q = query(collection(db, 'messages'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        const message = { id: doc.id, ...doc.data() };
        messages.push(message);
      });
      callback(messages);
    });
    return unsubscribe;
  }

  static renderMessages(messages, username) {
    const html = messages.length
      ? messages
          .map((msg) =>
            toMessageHTML(msg.text, msg.user, msg.createdAt, username)
          )
          .join('')
      : `<h3 class="no-messages">There's no messages yet. Be the first!</h3>`;
    const chatBox = document.getElementById('chat-box');

    chatBox.innerHTML = html;
  }
}

function toMessageHTML(text, user, createdAt, currentUser) {
  const date = new Date(createdAt.seconds * 1000);
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  };
  const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);

  return `
    <div class="message message--${
      user === currentUser ? 'current' : 'different'
    }-user">
      <div class="message__info">
        <p class="message__username">${user}</p>
        <div class="message__date">${formattedDate}</div>
      </div>
      <div class="message__content">${text}</div>
    </div>
  `;
}
