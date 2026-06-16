require('dotenv').config();

const path = require('path');
const http = require('http');
const express = require('express');
const helmet = require('helmet');
const { Server } = require('socket.io');

const connectDB = require('./src/config/db');

const authRoutes = require('./src/routes/auth.routes');
const postRoutes = require('./src/routes/post.routes');
const messageRoutes = require('./src/routes/message.routes');
const callRoutes = require('./src/routes/call.routes');
const userRoutes = require('./src/routes/user.routes');
const notificationRoutes = require('./src/routes/notification.routes');
const groupRoutes = require('./src/routes/group.routes');
const algorithmRoutes = require('./src/routes/algorithm.routes');
const registerMessagingSocket = require('./src/socket/message.socket');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  `http://localhost:${PORT}`,
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, true); // local/dev friendly. Lock this later before production.
    },
    credentials: true
  },
  maxHttpBufferSize: 30 * 1024 * 1024
});

app.set('io', io);

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    app: 'reConnect',
    status: 'online',
    realtime: 'enabled',
    messaging: 'scratch-v1',
    time: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/algorithm', algorithmRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

registerMessagingSocket(io);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`reConnect running at http://localhost:${PORT}`);
      console.log('Messaging realtime service enabled');
    });
  })
  .catch((error) => {
    console.error('Server start failed:', error.message);
    console.error('MongoDB is probably not running or MONGO_URI is wrong.');
    process.exit(1);
  });
