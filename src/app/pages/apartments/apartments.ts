import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../language.service';

@Component({
  selector: 'app-apartments',
  templateUrl: './apartments.html',
  styleUrl: './apartments.scss',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ApartmentsComponent {
  langService = inject(LanguageService);

  heroScale = signal(1);
  heroTranslateX = signal(0);
  heroTranslateTextX = signal(0);
  detailsProgress = signal(0);
  interiorScale = signal(1.5);

  villasTranslateY = signal(100);
  villasOpacity = signal(0);
  hottubRotation = signal(180);
  hottubTextProgress = signal(1);

  @HostListener('window:scroll')
  onWindowScroll() {
    const scroll = window.scrollY;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
    const isDesktop = typeof window !== 'undefined' && window.innerWidth > 968;

    // Hero zoom logic (same as home page)
    const heroScale = 1 + (scroll / 1000) * 0.3;
    this.heroScale.set(Math.min(Math.max(heroScale, 1), 1.3));

    // Details section reveal
    const detailsStart = vh * 0.4;
    const detailsEnd = vh * 1.1;
    this.detailsProgress.set(Math.max(0, Math.min((scroll - detailsStart) / (detailsEnd - detailsStart), 1)));

    // Villas section entry transition
    const villasStart = vh * 1.2;
    const villasEnd = vh * 2.0;
    if (scroll > villasStart) {
      const progress = Math.min((scroll - villasStart) / (villasEnd - villasStart), 1);
      this.villasTranslateY.set(100 * (1 - progress));
      this.villasOpacity.set(progress);
    } else {
      this.villasTranslateY.set(100);
      this.villasOpacity.set(0);
    }

    // Interior section zoom out background
    const interiorStart = vh * 2.2;
    if (scroll > interiorStart) {
      const interiorProgress = Math.min((scroll - interiorStart) / (vh * 1.5), 1);
      this.interiorScale.set(1.5 - (0.5 * interiorProgress));
    } else {
      this.interiorScale.set(1.5);
    }

    // Hottub section rotation
    const hottubStartTrigger = vh * 3.2;
    if (scroll > hottubStartTrigger) {
      this.hottubRotation.set(180 + (scroll - hottubStartTrigger) / 8);
    } else {
      this.hottubRotation.set(180);
    }

    if (isDesktop) {
      this.hottubTextProgress.set(1);
    } else {
      const hottubTextStart = vh * 3.4;
      const hottubTextEnd = vh * 4.0;
      this.hottubTextProgress.set(Math.max(0, Math.min((scroll - hottubTextStart) / (hottubTextEnd - hottubTextStart), 1)));
    }
  }
}
