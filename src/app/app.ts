import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true
})
export class App {
  protected readonly title = signal('Espadrina');

  navItems = [
    { label: 'Home', link: '#' },
    { label: 'Experience', link: '#experience' },
    { label: 'Gallery', link: '#gallery' },
    { label: 'Restaurant', link: '#restaurant' },
    { label: 'Contact', link: '#contact' }
  ];
}
