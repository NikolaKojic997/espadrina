import { Component, signal, computed, inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { LanguageService } from './language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class App {
  langService = inject(LanguageService);
  router = inject(Router);
  
  // Track current URL
  url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => event.urlAfterRedirects)
    ),
    { initialValue: '/' }
  );

  isBookingPage = computed(() => {
    return this.url().includes('/booking');
  });

  isRestaurantPage = computed(() => {
    return this.url().includes('/restaurant');
  });

  isMenuOpen = signal(false);

  navItems = computed(() => [
    { label: this.langService.current().nav.links.home, link: '/' },
    { label: this.langService.current().nav.restaurant, link: '/restaurant' },
    { label: this.langService.current().nav.links.experience, link: '/#experience' },
    { label: this.langService.current().nav.links.wellness, link: '/#wellness' },
    { label: this.langService.current().nav.links.contact, link: '/#contact' }
  ]);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }
}
