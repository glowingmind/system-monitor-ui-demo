// src/app/btop/btop.component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  inject,
  AfterViewInit,
} from '@angular/core';
import { BtopService } from '../btop';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-btop',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './btop.html', // Reference to the HTML file
  styleUrls: ['./btop.scss'], // Reference to the SCSS file
})
export class BtopComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('terminalRef') terminalRef!: ElementRef;

  private btopService = inject(BtopService);
  private terminal!: Terminal;
  private fitAddon!: FitAddon;

  constructor() {}

  ngOnInit(): void {
    this.terminal = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#000000',
      },
    });
    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);

    this.btopService.onOutput.subscribe((data) => {
      this.terminal.write(data);
    });
  }

  ngAfterViewInit(): void {
    this.terminal.open(this.terminalRef.nativeElement);
    this.fitAddon.fit();

    window.addEventListener('resize', () => {
      this.fitAddon.fit();
      this.btopService.resizeBtop(this.terminal.cols, this.terminal.rows);
    });
  }

  ngOnDestroy(): void {
    this.terminal.dispose();
  }

  startBtop() {
    this.btopService.startBtop(this.terminal.cols, this.terminal.rows);
  }

  stopBtop() {
    this.btopService.stopBtop();
    this.terminal.clear();
  }
}
