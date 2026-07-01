# System Monitor UI Demo

A simple system monitor UI that displays real-time performance metrics (CPU, memory, disk, network) using `btop` streamed via WebSockets.

The project is split into a standalone backend and a standalone frontend.

## Project Structure

```
system-monitor-ui-demo/
├── README.md
├── server/             # Express & Socket.io Backend
│   ├── server.ts
│   ├── package.json
│   └── tsconfig.json
└── client/             # Angular Frontend
    ├── src/
    ├── package.json
    └── tsconfig.json
```

## Technologies

- **Backend**: Node.js, Express, Socket.io, `node-pty` (to run `btop` in a pseudo-terminal).
- **Frontend**: Angular, `@xterm/xterm` (to render the terminal output), Socket.io-client.

## Getting Started

### Prerequisites

- `node` and `pnpm` installed.
- `btop` installed and available in your system's PATH.

### Installation

1. Clone the repository.
2. Install dependencies for both parts:

```bash
# Backend
cd server
pnpm install

# Frontend
cd ../client
pnpm install
```

### Running the Application

1. **Start the Backend**:
   ```bash
   cd server
   pnpm run build
   pnpm start
   ```
   The server will run on `http://localhost:3000`.

2. **Start the Frontend**:
   ```bash
   cd client
   pnpm start
   ```
   The UI will be available at `http://localhost:4200`.

### Features

- Real-time `btop` terminal streaming to the browser.
- Interactive terminal resizing support.
- Automatic process cleanup when clients disconnect.

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
