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
    const isBrowser = typeof window !== 'undefined';
    if (!isBrowser) return;

    const scroll = window.scrollY;
    const vh = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const isAtBottom = (vh + scroll) >= (documentHeight - 50);
    const isDesktop = window.innerWidth > 968;

    // Hero zoom logic (same as home page)
    const heroScale = 1 + (scroll / 1000) * 0.3;
    this.heroScale.set(Math.min(Math.max(heroScale, 1), 1.3));

    // Helper to calculate progress based on element's viewport relative position
    const getProgressForSelector = (selector: string, startPct = 0.85, endPct = 0.25) => {
      const element = document.querySelector(selector);
      if (!element) return 0;
      const rect = element.getBoundingClientRect();
      
      // If we are at the bottom of the page and element has entered the viewport, complete the animation
      if (isAtBottom && rect.top < vh) {
        return 1;
      }
      
      const start = vh * startPct;
      const end = vh * endPct;
      const progress = (start - rect.top) / (start - end);
      return Math.min(Math.max(progress, 0), 1);
    };

    // Details section reveal
    const detailsProgressVal = getProgressForSelector('.details-section');
    this.detailsProgress.set(detailsProgressVal);

    // Villas section entry transition
    const villasProgressVal = getProgressForSelector('.villas-section');
    this.villasTranslateY.set(100 * (1 - villasProgressVal));
    this.villasOpacity.set(villasProgressVal);

    // Interior section zoom out background
    const interiorProgressVal = getProgressForSelector('.interior-section', 0.9, 0.1);
    this.interiorScale.set(1.5 - (0.5 * interiorProgressVal));

    // Hottub section rotation and scale
    const hottubSection = document.querySelector('.hottub-section');
    if (hottubSection) {
      const rect = hottubSection.getBoundingClientRect();
      const hottubStartTrigger = rect.top + scroll - vh;
      if (scroll > hottubStartTrigger) {
        this.hottubRotation.set(180 + (scroll - hottubStartTrigger) / 8);
        const scaleProgress = Math.min((scroll - hottubStartTrigger) / (vh * 1.5), 1);
        this.hottubScale.set(1 + (0.4 * scaleProgress));
      } else {
        this.hottubRotation.set(180);
        this.hottubScale.set(1);
      }
    } else {
      this.hottubRotation.set(180);
      this.hottubScale.set(1);
    }

    if (isDesktop) {
      this.hottubOpacity.set(1);
      this.hottubTranslateY.set(0);
    } else {
      const hottubProgressVal = getProgressForSelector('.hottub-section');
      this.hottubTranslateY.set(100 * (1 - hottubProgressVal));
      this.hottubOpacity.set(hottubProgressVal);
    }
  }
}
