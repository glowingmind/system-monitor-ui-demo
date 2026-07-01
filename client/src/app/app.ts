import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BtopComponent } from "./btop/btop";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BtopComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('system-monitor-ui');
}
