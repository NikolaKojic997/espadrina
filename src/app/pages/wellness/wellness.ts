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
    const scroll = window.scrollY;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
    this.isDesktop = typeof window === 'undefined' || window.innerWidth > 968;

    // Hero section
    this.heroTranslateX.set(scroll / 1.5);
    this.heroTranslateTextX.set(-scroll / 1.5);
    // Zoom out the background from initial scale down to 1
    const initialScale = this.isDesktop ? 1.7 : 1.3;
    this.heroScale.set(Math.max(1, initialScale - (scroll / 800)));

    // Spa section logic
    const spaStart = vh * 0.4;
    const spaEnd = vh * 1.1; 
    this.spaProgress.set(Math.max(0, Math.min((scroll - spaStart) / (spaEnd - spaStart), 1)));

    // Treatments section
    const treatmentsStart = vh * 1.2;
    const treatmentsEnd = vh * 2;
    
    if (scroll > treatmentsStart) {
      const progress = Math.min((scroll - treatmentsStart) / (treatmentsEnd - treatmentsStart), 1);
      this.treatmentsTranslateY.set(100 * (1 - progress));
      this.treatmentsOpacity.set(progress);
    } else {
      this.treatmentsTranslateY.set(100);
      this.treatmentsOpacity.set(0);
    }

    // Tepidarium Section
    const tepidariumStart = vh * 2.2;
    const tepidariumEnd = vh * 3.0;
    
    if (scroll > tepidariumStart) {
      const progress = Math.min((scroll - tepidariumStart) / (tepidariumEnd - tepidariumStart), 1);
      this.tepidariumTranslateY.set(100 * (1 - progress));
      this.tepidariumOpacity.set(progress);
    } else {
      this.tepidariumTranslateY.set(100);
      this.tepidariumOpacity.set(0);
    }

    // Open Pool Section
    const openPoolStart = vh * 3.2;
    const openPoolEnd = vh * 4.0;
    
    if (scroll > openPoolStart) {
      const progress = Math.min((scroll - openPoolStart) / (openPoolEnd - openPoolStart), 1);
      this.openPoolTranslateY.set(100 * (1 - progress));
      this.openPoolOpacity.set(progress);
    } else {
      this.openPoolTranslateY.set(100);
      this.openPoolOpacity.set(0);
    }

    // Indoor Pool Section
    const indoorPoolStart = vh * 4.2;
    const indoorPoolEnd = vh * 5.0;
    
    if (scroll > indoorPoolStart) {
      const progress = Math.min((scroll - indoorPoolStart) / (indoorPoolEnd - indoorPoolStart), 1);
      this.indoorPoolTranslateY.set(100 * (1 - progress));
      this.indoorPoolOpacity.set(progress);
    } else {
      this.indoorPoolTranslateY.set(100);
      this.indoorPoolOpacity.set(0);
    }
  }
}
