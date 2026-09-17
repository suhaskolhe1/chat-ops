let socket;
let token;
let currentUser;
let currentRoom;
let typingTimeout;
let oldestMessageDate = null;

const messagesDiv = document.getElementById('messages');
const authForm = document.getElementById('auth-form');
const chatRoom = document.getElementById('chat-room');
const errorDiv = document.getElementById('auth-error');

async function login(e) {
  if (e) e.preventDefault();
  
  const userId = document.getElementById('username').value.trim();
  const roomId = document.getElementById('room').value.trim();
  
  if (!userId || !roomId) {
    errorDiv.innerText = 'Both User ID and Room ID are required.';
    return;
  }

  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    
    if (!res.ok) throw new Error('Authentication failed');
    
    const data = await res.json();
    token = data.token;
    currentUser = userId;
    currentRoom = roomId;
    
    initSocket();
  } catch (err) {
    errorDiv.innerText = err.message;
  }
}

function initSocket() {
  socket = io({
    auth: { token }
  });

  socket.on('connect', () => {
    authForm.classList.add('hidden');
    chatRoom.classList.remove('hidden');
    document.getElementById('current-room').innerText = currentRoom;
    document.getElementById('current-user').innerText = currentUser;
    
    socket.emit('join_room', currentRoom);
    setupMessageView();
    loadMessages();
    
    setInterval(() => {
      if (socket.connected) {
        socket.emit('ping_presence');
      }
    }, 30000);
  });

  socket.on('connect_error', (err) => {
    errorDiv.innerText = err.message;
    socket.disconnect();
  });

  socket.on('new_message', (msg) => appendMessage(msg, true));
  socket.on('user_joined', (data) => appendSystemMessage(`${data.userId} joined the room`));
  socket.on('user_left', (data) => appendSystemMessage(`${data.userId} left the room`));

  socket.on('presence_update', (data) => {
    const indicator = document.getElementById('typing-indicator');
    if (data.status === 'typing') {
      indicator.innerText = `${data.userId} is typing...`;
    } else if (data.status === 'offline') {
      indicator.innerText = `${data.userId} went offline`;
      setTimeout(() => {
        if (indicator.innerText.includes('offline')) indicator.innerText = '';
      }, 3000);
    } else {
      indicator.innerText = '';
    }
  });
}

function setupMessageView() {
  const loadBtn = document.getElementById('load-more-btn');
  messagesDiv.innerHTML = '';
  messagesDiv.appendChild(loadBtn);
  loadBtn.classList.remove('hidden');
  loadBtn.innerText = 'Load previous messages';
  oldestMessageDate = null;
}

async function loadMessages() {
  let url = `/api/rooms/${currentRoom}/messages?limit=15`;
  const isFirstLoad = !oldestMessageDate;
  
  if (oldestMessageDate) {
    url += `&before=${encodeURIComponent(oldestMessageDate)}`;
  }
  
  try {
    const res = await fetch(url);
    const history = await res.json();
    const loadBtn = document.getElementById('load-more-btn');
    
    if (history.length > 0) {
      oldestMessageDate = history[history.length - 1].created_at;
      history.forEach(msg => appendMessage(msg, false));
      
      if (isFirstLoad) {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
    } else {
      if (loadBtn) loadBtn.innerText = 'No more messages';
    }
  } catch (err) {
    console.error('Failed to fetch messages:', err);
  }
}

function appendMessage(msg, isNewMessage = true) {
  const div = document.createElement('div');
  div.className = `message ${msg.sender_id === currentUser ? 'self' : ''}`;
  
  const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  div.innerHTML = `
    ${msg.sender_id !== currentUser ? `<strong>${msg.sender_id}</strong>` : ''}
    ${msg.content} 
    <small>${time}</small>
  `;
  
  if (isNewMessage) {
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } else {
    const loadBtn = document.getElementById('load-more-btn');
    messagesDiv.insertBefore(div, loadBtn.nextSibling);
  }
}

function appendSystemMessage(text) {
  const div = document.createElement('div');
  div.className = 'system-message';
  div.innerText = text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById('msg-input');
  const content = input.value.trim();
  if (!content) return;

  socket.emit('send_message', { roomId: currentRoom, content });
  input.value = '';
  
  socket.emit('typing_stop', currentRoom);
  clearTimeout(typingTimeout);
}

function handleEnter(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
}

function handleTyping() {
  socket.emit('typing_start', currentRoom);
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('typing_stop', currentRoom);
  }, 1000);
}

function leaveRoom() {
  if (socket) {
    socket.emit('leave_room', currentRoom);
    socket.disconnect();
  }
  
  authForm.classList.remove('hidden');
  chatRoom.classList.add('hidden');
  errorDiv.innerText = '';
  document.getElementById('msg-input').value = '';
}

// Event Listeners
document.getElementById('auth-form').addEventListener('submit', login);
document.getElementById('msg-input').addEventListener('input', handleTyping);
document.getElementById('msg-input').addEventListener('keypress', handleEnter);
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('leave-btn').addEventListener('click', leaveRoom);
document.getElementById('load-more-btn').addEventListener('click', loadMessages);
