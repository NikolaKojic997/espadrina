import { Component, signal, HostListener, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LanguageService } from './language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true
})
export class App {
  private platformId = inject(PLATFORM_ID);
  protected readonly title = signal('Espadrina');
  langService = inject(LanguageService);
  isMenuOpen = signal(false);
  heroScale = signal(1);
  riverReveal = signal(0);
  luxuryProgress = signal(0);
  foodProgress = signal(0);
  spaProgress = signal(0);
  poolProgress = signal(0);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    const scrollY = window.scrollY;
    
    // Hero zoom logic
    const heroScale = 1 + (scrollY / 1000) * 0.3;
    this.heroScale.set(Math.min(Math.max(heroScale, 1), 1.3));

    // River reveal logic
    const riverSection = document.querySelector('.timeless-flow');
    if (riverSection) {
      const rect = riverSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionHeight = rect.height;
      const currentPos = viewportHeight - rect.top;
      let progress = (currentPos - viewportHeight * 0.2) / (sectionHeight * 0.8);
      progress = Math.min(Math.max(progress, 0), 1);
      this.riverReveal.set(progress * 100);
    }

    // Luxury section logic
    const luxurySection = document.querySelector('.luxury-escape');
    if (luxurySection) {
      const rect = luxurySection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight;
      const end = viewportHeight * 0.1;
      let progress = (start - rect.top) / (start - end);
      progress = Math.min(Math.max(progress, 0), 1);
      this.luxuryProgress.set(progress);
    }

    // Food section logic
    const foodSection = document.querySelector('.timeless-food');
    if (foodSection) {
      const rect = foodSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight;
      const end = viewportHeight * 0.2;
      let progress = (start - rect.top) / (start - end);
      progress = Math.min(Math.max(progress, 0), 1);
      this.foodProgress.set(progress);
    }

    // SPA section logic
    const spaSection = document.querySelector('.personal-spa');
    if (spaSection) {
      const rect = spaSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight;
      const end = viewportHeight * 0.2;
      let progress = (start - rect.top) / (start - end);
      progress = Math.min(Math.max(progress, 0), 1);
      this.spaProgress.set(progress);
    }

    // Pool section logic
    const poolSection = document.querySelector('.pool-on-you');
    if (poolSection) {
      const rect = poolSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight;
      const end = viewportHeight * 0.2;
      let progress = (start - rect.top) / (start - end);
      progress = Math.min(Math.max(progress, 0), 1);
      this.poolProgress.set(progress);
    }
  }

  navItems = computed(() => [
    { label: this.langService.current().nav.links.experience, link: '#experience' },
    { label: this.langService.current().nav.links.wellness, link: '#wellness' },
    { label: this.langService.current().nav.links.contact, link: '#contact' }
  ]);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }
}
