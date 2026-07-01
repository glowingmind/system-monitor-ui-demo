// src/app/btop.service.ts
import { Injectable, signal, WritableSignal, EventEmitter } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class BtopService {
  private socket: Socket;
  public readonly onOutput = new EventEmitter<string>();

  constructor() {
    // Initialize WebSocket connection
    this.socket = io('http://localhost:3000');

    this.socket.on('btop-output', (data: string) => {
      this.onOutput.emit(data);
    });
  }

  public startBtop(cols: number = 80, rows: number = 24) {
    this.socket.emit('start-btop', cols, rows);
  }

  public resizeBtop(cols: number, rows: number) {
    this.socket.emit('resize-btop', cols, rows);
  }

  public stopBtop() {
    this.socket.emit('stop-btop');
  }
}
