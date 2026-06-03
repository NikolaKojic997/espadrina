import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../language.service';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-wellness',
  templateUrl: './wellness.html',
  styleUrl: './wellness.scss',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class WellnessComponent {
  langService = inject(LanguageService);
  
  isDesktop = typeof window === 'undefined' || window.innerWidth > 968;
  heroScale = signal(this.isDesktop ? 1.7 : 1.3);
  heroTranslateX = signal(0);
  heroTranslateTextX = signal(0);
  spaProgress = signal(0);
  treatmentsTranslateY = signal(100);
  treatmentsOpacity = signal(0);
  tepidariumTranslateY = signal(100);
  tepidariumOpacity = signal(0);
  openPoolTranslateY = signal(100);
  openPoolOpacity = signal(0);
  indoorPoolTranslateY = signal(100);
  indoorPoolOpacity = signal(0);

  @HostListener('window:scroll')
  onWindowScroll() {
    const isBrowser = typeof window !== 'undefined';
    if (!isBrowser) return;

    const scroll = window.scrollY;
    const vh = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const isAtBottom = (vh + scroll) >= (documentHeight - 50);
    this.isDesktop = window.innerWidth > 968;

    // Hero section
    this.heroTranslateX.set(scroll / 1.5);
    this.heroTranslateTextX.set(-scroll / 1.5);
    // Zoom out the background from initial scale down to 1
    const initialScale = this.isDesktop ? 1.7 : 1.3;
    this.heroScale.set(Math.max(1, initialScale - (scroll / 800)));

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

    // Spa section logic
    const spaProgressVal = getProgressForSelector('.spa-details-section');
    this.spaProgress.set(spaProgressVal);

    // Treatments section
    const treatmentsProgressVal = getProgressForSelector('.treatments-section');
    this.treatmentsTranslateY.set(100 * (1 - treatmentsProgressVal));
    this.treatmentsOpacity.set(treatmentsProgressVal);

    // Tepidarium Section
    const tepidariumProgressVal = getProgressForSelector('.tepidarium-section');
    this.tepidariumTranslateY.set(100 * (1 - tepidariumProgressVal));
    this.tepidariumOpacity.set(tepidariumProgressVal);

    // Open Pool Section
    const openPoolProgressVal = getProgressForSelector('.open-pool-section');
    this.openPoolTranslateY.set(100 * (1 - openPoolProgressVal));
    this.openPoolOpacity.set(openPoolProgressVal);

    // Indoor Pool Section
    const indoorPoolProgressVal = getProgressForSelector('.indoor-pool-section');
    this.indoorPoolTranslateY.set(100 * (1 - indoorPoolProgressVal));
    this.indoorPoolOpacity.set(indoorPoolProgressVal);
  }
}
