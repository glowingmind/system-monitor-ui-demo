# System Monitor UI Demo

The idea of this project is to create a simple system monitor UI that displays real-time information about the system's performance, such as CPU usage, memory usage, disk usage, and network activity. The UI will be built using modern web frameworks Express and Angular. We will use TypeScripts for both API and UI apps. It will take advantage of web tokens to provide the real-time updates. It will use the Node's `child_process` to run `btop` and send stats to the browser. Here are the snippets of the code that should be used.

```typescript
// server.ts
import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';
import { spawn } from 'child_process';

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let btopProcess;

io.on('connection', (socket) => {
  console.log('New client connected');

  // Listen for 'start-btop' event to start btop
  socket.on('start-btop', () => {
    if (!btopProcess) {
      btopProcess = spawn('btop');
      btopProcess.stdout.on('data', (data) => {
        io.emit('btop-output', data.toString());
      });
      btopProcess.stderr.on('data', (data) => {
        io.emit('btop-error', data.toString());
      });
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
    if (btopProcess) {
      btopProcess.kill();
      btopProcess = null;
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

```typescript
// btop.service.ts
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import * as child_process from 'child_process';

@Injectable({
  providedIn: 'root'
})
export class BtopService {
  private socket;
  private btopProcess;

  constructor() {
    // Initialize WebSocket connection
    this.socket = io('http://localhost:3000');

    // Listen for btop output
    this.socket.on('btop-output', (data) => {
      console.log(data);
      // Handle btop output data here, e.g., emit to a behavior subject or store it in state management.
    });
  }

  startBtop() {
    if (!this.btopProcess) {
      this.btopProcess = child_process.spawn('btop');

      this.btopProcess.stdout.on('data', (data: Buffer) => {
        const output = data.toString();
        this.socket.emit('btop-output', output);
      });

      this.btopProcess.stderr.on('data', (data: Buffer) => {
        const errorOutput = data.toString();
        this.socket.emit('btop-error', errorOutput);
      });
    }
  }

  stopBtop() {
    if (this.btopProcess) {
      this.btopProcess.kill();
      this.btopProcess = null;
    }
  }
}
```

```typescript
// btop.component.ts
import { Component, OnInit } from '@angular/core';
import { BtopService } from '../btop.service';

@Component({
  selector: 'app-btop',
  template: `
    <div>
      <button (click)="startBtop()">Start btop</button>
      <button (click)="stopBtop()">Stop btop</button>
      <pre>{{ output }}</pre>
    </div>
  `,
})
export class BtopComponent implements OnInit {
  output = '';

  constructor(private btopService: BtopService) {}

  ngOnInit(): void {
    this.btopService.socket.on('btop-output', (data: string) => {
      this.output += data;
    });
  }

  startBtop() {
    this.btopService.startBtop();
  }

  stopBtop() {
    this.btopService.stopBtop();
  }
}
```
