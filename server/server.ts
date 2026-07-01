import express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import * as pty from 'node-pty';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

let btopProcess: pty.IPty | null = null;
const connectedClients = new Set();

io.on('connection', (socket) => {
  console.log('New client connected');
  connectedClients.add(socket.id);

  // Listen for 'start-btop' event to start btop
  socket.on('start-btop', (cols: number = 80, rows: number = 24) => {
    if (!btopProcess) {
      btopProcess = pty.spawn('btop', [], {
        name: 'xterm-color',
        cols: cols,
        rows: rows,
        cwd: process.cwd(),
        env: process.env
      });

      btopProcess.onData((data) => {
        io.emit('btop-output', data);
      });

      btopProcess.onExit(() => {
        btopProcess = null;
        io.emit('btop-exit');
      });
    }
  });

  // Handle terminal resizing
  socket.on('resize-btop', (cols: number, rows: number) => {
    if (btopProcess) {
      btopProcess.resize(cols, rows);
    }
  });

  // Listen for 'stop-btop' event to stop btop
  socket.on('stop-btop', () => {
    if (btopProcess) {
      btopProcess.kill();
      btopProcess = null;
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    connectedClients.delete(socket.id);
    if (connectedClients.size === 0 && btopProcess) {
      btopProcess.kill();
      btopProcess = null;
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
