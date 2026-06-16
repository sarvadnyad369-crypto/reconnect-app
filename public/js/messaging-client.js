(function () {
  function getToken() {
    return (
      localStorage.getItem('token') ||
      localStorage.getItem('reconnect_token') ||
      localStorage.getItem('authToken') ||
      localStorage.getItem('jwt') ||
      localStorage.getItem('accessToken') ||
      ''
    );
  }

  async function api(path, options = {}) {
    const token = getToken();
    const headers = Object.assign(
      { 'Content-Type': 'application/json' },
      options.headers || {}
    );

    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(path, {
      ...options,
      headers,
      body: options.body && typeof options.body !== 'string'
        ? JSON.stringify(options.body)
        : options.body
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'Messaging request failed');
    }
    return data;
  }

  const listeners = {};
  let socket = null;

  function fire(event, payload) {
    (listeners[event] || []).forEach(fn => {
      try { fn(payload); } catch (error) { console.error(error); }
    });
  }

  function on(event, fn) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);
    return () => {
      listeners[event] = listeners[event].filter(item => item !== fn);
    };
  }

  function connect() {
    const token = getToken();
    if (!token || typeof io === 'undefined') return null;
    if (socket?.connected) return socket;

    socket = io({ auth: { token } });

    socket.on('messaging:ready', data => fire('ready', data));
    socket.on('message:new', data => fire('message:new', data));
    socket.on('message:edited', data => fire('message:edited', data));
    socket.on('message:deleted', data => fire('message:deleted', data));
    socket.on('message:reaction', data => fire('message:reaction', data));
    socket.on('message:read', data => fire('message:read', data));
    socket.on('typing:start', data => fire('typing:start', data));
    socket.on('typing:stop', data => fire('typing:stop', data));
    socket.on('presence:update', data => fire('presence:update', data));
    socket.on('connect_error', err => fire('error', err.message));

    return socket;
  }

  async function sendRealtime(conversationId, text, extra = {}) {
    const s = connect();
    if (!s?.connected) {
      return sendMessage(conversationId, { text, ...extra });
    }

    return new Promise((resolve, reject) => {
      s.emit('message:send', { conversationId, text, ...extra }, (response) => {
        if (!response?.success) return reject(new Error(response?.message || 'Could not send message'));
        resolve(response);
      });
    });
  }

  function startTyping(conversationId) {
    connect()?.emit('typing:start', { conversationId });
  }

  function stopTyping(conversationId) {
    connect()?.emit('typing:stop', { conversationId });
  }

  function joinConversation(conversationId) {
    connect()?.emit('conversation:join', conversationId);
  }

  function getStatus() {
    return api('/api/messages/status');
  }

  function listConversations(limit = 30) {
    return api(`/api/messages/conversations?limit=${encodeURIComponent(limit)}`);
  }

  function openDirectChat(userId) {
    return api('/api/messages/conversations/direct', {
      method: 'POST',
      body: { userId }
    });
  }

  function createGroup(title, participantIds) {
    return api('/api/messages/conversations/group', {
      method: 'POST',
      body: { title, participantIds }
    });
  }

  function getMessages(conversationId, limit = 40) {
    return api(`/api/messages/conversations/${conversationId}/messages?limit=${encodeURIComponent(limit)}`);
  }

  function sendMessage(conversationId, body) {
    return api(`/api/messages/conversations/${conversationId}/messages`, {
      method: 'POST',
      body
    });
  }

  function editMessage(messageId, text) {
    return api(`/api/messages/${messageId}`, {
      method: 'PATCH',
      body: { text }
    });
  }

  function deleteMessage(messageId, mode = 'me') {
    return api(`/api/messages/${messageId}?mode=${encodeURIComponent(mode)}`, {
      method: 'DELETE'
    });
  }

  function react(messageId, emoji) {
    return api(`/api/messages/${messageId}/reactions`, {
      method: 'POST',
      body: { emoji }
    });
  }

  function markRead(conversationId) {
    return api(`/api/messages/conversations/${conversationId}/read`, {
      method: 'POST'
    });
  }

  function search(q, conversationId = '') {
    const params = new URLSearchParams({ q });
    if (conversationId) params.set('conversationId', conversationId);
    return api(`/api/messages/search?${params.toString()}`);
  }

  window.reConnectMessaging = {
    connect,
    on,
    getToken,
    getStatus,
    listConversations,
    openDirectChat,
    createGroup,
    getMessages,
    sendMessage,
    sendRealtime,
    editMessage,
    deleteMessage,
    react,
    markRead,
    search,
    startTyping,
    stopTyping,
    joinConversation
  };
})();
