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
  hottubScale = signal(1);
  hottubOpacity = signal(0);
  hottubTranslateY = signal(100);

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

    // Hottub section rotation and scale
    const hottubStartTrigger = vh * 3.2;
    if (scroll > hottubStartTrigger) {
      this.hottubRotation.set(180 + (scroll - hottubStartTrigger) / 8);
      const scaleProgress = Math.min((scroll - hottubStartTrigger) / (vh * 1.5), 1);
      this.hottubScale.set(1 + (0.4 * scaleProgress));
    } else {
      this.hottubRotation.set(180);
      this.hottubScale.set(1);
    }

    if (isDesktop) {
      this.hottubOpacity.set(1);
      this.hottubTranslateY.set(0);
    } else {
      const hottubTextStart = vh * 3.2;
      const hottubTextEnd = vh * 4.0;
      if (scroll > hottubTextStart) {
        const progress = Math.min((scroll - hottubTextStart) / (hottubTextEnd - hottubTextStart), 1);
        this.hottubTranslateY.set(100 * (1 - progress));
        this.hottubOpacity.set(progress);
      } else {
        this.hottubTranslateY.set(100);
        this.hottubOpacity.set(0);
      }
    }
  }
}
