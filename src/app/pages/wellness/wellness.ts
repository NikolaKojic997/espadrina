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
  poolScale = signal(1.5);
  treatmentsTranslateY = signal(100);
  treatmentsOpacity = signal(0);
  
  icebergTranslateX = signal(-400);
  iceRoomTextTranslateX = signal(400);
  iceRoomOpacity = signal(0);

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

    // Ice Room Section
    const iceRoomStart = vh * 1.8;
    const iceRoomEnd = vh * 2.8;
    
    if (scroll > iceRoomStart) {
      const progress = Math.min((scroll - iceRoomStart) / (iceRoomEnd - iceRoomStart), 1);
      this.icebergTranslateX.set(-400 * (1 - progress));
      this.iceRoomTextTranslateX.set(400 * (1 - progress));
      this.iceRoomOpacity.set(progress);
    } else {
      this.icebergTranslateX.set(-400);
      this.iceRoomTextTranslateX.set(400);
      this.iceRoomOpacity.set(0);
    }

    // Pool section
    const poolStart = vh * 2.8;
    if (scroll > poolStart) {
      // Goes from 1.5 down to 1 over exactly 1.5 screens of scrolling
      const poolProgress = Math.min((scroll - poolStart) / (vh * 1.5), 1);
      this.poolScale.set(1.5 - (0.5 * poolProgress));
    } else {
      this.poolScale.set(1.5);
    }
  }
}
