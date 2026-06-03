import { Component, signal, HostListener, inject, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { LanguageService } from '../../language.service';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private platformId = inject(PLATFORM_ID);
  langService = inject(LanguageService);

  heroScale = signal(1);
  riverReveal = signal(0);
  luxuryProgress = signal(0);
  foodProgress = signal(0);
  foodRotation = signal(0);
  spaProgress = signal(0);
  poolProgress = signal(0);

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Trigger scroll event on load to initialize animations properly
      setTimeout(() => this.onWindowScroll(), 100);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const isAtBottom = (viewportHeight + scrollY) >= (documentHeight - 50);
    
    // Hero zoom logic
    const heroScale = 1 + (scrollY / 1000) * 0.3;
    this.heroScale.set(Math.min(Math.max(heroScale, 1), 1.3));

    // River reveal logic
    const riverSection = document.querySelector('.timeless-flow');
    if (riverSection) {
      const rect = riverSection.getBoundingClientRect();
      if (isAtBottom && rect.top < viewportHeight) {
        this.riverReveal.set(100);
      } else {
        const sectionHeight = rect.height;
        const currentPos = viewportHeight - rect.top;
        let progress = (currentPos - viewportHeight * 0.2) / (sectionHeight * 0.8);
        progress = Math.min(Math.max(progress, 0), 1);
        this.riverReveal.set(progress * 100);
      }
    }

    // Luxury section logic
    const luxurySection = document.querySelector('.luxury-escape');
    if (luxurySection) {
      const rect = luxurySection.getBoundingClientRect();
      if (isAtBottom && rect.top < viewportHeight) {
        this.luxuryProgress.set(1);
      } else {
        const start = viewportHeight;
        const end = viewportHeight * 0.1;
        let progress = (start - rect.top) / (start - end);
        progress = Math.min(Math.max(progress, 0), 1);
        this.luxuryProgress.set(progress);
      }
    }

    // Food section logic
    const foodSection = document.querySelector('.timeless-food');
    if (foodSection) {
      const rect = foodSection.getBoundingClientRect();
      let progress = 0;
      if (isAtBottom && rect.top < viewportHeight) {
        progress = 1;
        this.foodProgress.set(1);
      } else {
        const start = viewportHeight;
        const end = viewportHeight * 0.2;
        progress = (start - rect.top) / (start - end);
        progress = Math.min(Math.max(progress, 0), 1);
        this.foodProgress.set(progress);
      }

      // Rotation: same logic as restaurant page (1 deg per 5px scrolled within section)
      // Stop rotating once the plate has reached its final position
      if (rect.top <= viewportHeight && progress < 1) {
        const sectionScrolled = scrollY - (scrollY + rect.top - viewportHeight);
        this.foodRotation.set(Math.max(0, sectionScrolled) / 5);
      }
    }

    // SPA section logic
    const spaSection = document.querySelector('.personal-spa');
    if (spaSection) {
      const rect = spaSection.getBoundingClientRect();
      if (isAtBottom && rect.top < viewportHeight) {
        this.spaProgress.set(1);
      } else {
        const start = viewportHeight;
        const end = viewportHeight * 0.2;
        let progress = (start - rect.top) / (start - end);
        progress = Math.min(Math.max(progress, 0), 1);
        this.spaProgress.set(progress);
      }
    }

    // Pool section logic
    const poolSection = document.querySelector('.pool-on-you');
    if (poolSection) {
      const rect = poolSection.getBoundingClientRect();
      if (isAtBottom && rect.top < viewportHeight) {
        this.poolProgress.set(1);
      } else {
        const start = viewportHeight;
        const end = viewportHeight * 0.2;
        let progress = (start - rect.top) / (start - end);
        progress = Math.min(Math.max(progress, 0), 1);
        this.poolProgress.set(progress);
      }
    }
  }
}
