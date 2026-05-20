import { Component, inject, signal, HostListener, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LanguageService } from '../../language.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class RestaurantComponent implements OnInit {
  langService = inject(LanguageService);
  rotation = signal(0);
  translateX = signal(0);
  translateXText = signal(0);
  chefTranslateX = signal(400);
  chefTranslateTextX = signal(-400);
  wineTransform = signal('rotate(180deg) scale(1.5)');
  ingredientsProgress = signal(0);
  wineTextProgress = signal(1);
  activePdfUrl = signal<SafeResourceUrl | null>(null);
  private sanitizer = inject(DomSanitizer);
  private initialVh = 0;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.initialVh = window.innerHeight;
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const scroll = window.scrollY;
    const vh = this.initialVh || (typeof window !== 'undefined' ? window.innerHeight : 0);

    // Ingredients reveal logic
    const ingStart = vh * 0.4;
    const ingEnd = vh * 1.1; 
    this.ingredientsProgress.set(Math.max(0, Math.min((scroll - ingStart) / (ingEnd - ingStart), 1)));

    const isDesktop = typeof window !== 'undefined' && window.innerWidth > 968;

    // Rotate 1 degree for every 5 pixels scrolled
    this.rotation.set(scroll / 5);
    // Move to the right as we scroll down
    this.translateX.set(isDesktop ? scroll / 1.5 : 0);
    // Move text to the left as we scroll down
    this.translateXText.set(isDesktop ? -scroll / 1.5 : 0);

    // Chef section animations (Trigger as we approach 3rd section)
    const startTrigger = vh * 1.8;
    const endTrigger = vh * 2.8;

    if (scroll > startTrigger) {
      const progress = Math.min((scroll - startTrigger) / (endTrigger - startTrigger), 1);
      this.chefTranslateX.set(400 * (1 - progress));
      this.chefTranslateTextX.set(-400 * (1 - progress));
    } else {
      this.chefTranslateX.set(400);
      this.chefTranslateTextX.set(-400);
    }

    // Wine section rotation (after Chef section)
    const wineStartTrigger = vh * 2.8;
    if (isDesktop) {
      this.wineTextProgress.set(1); // fully visible on desktop
      if (scroll > wineStartTrigger) {
        const rotation = 180 + (scroll - wineStartTrigger) / 8;
        this.wineTransform.set(`rotate(${rotation}deg) scale(1.5)`);
      } else {
        this.wineTransform.set('rotate(180deg) scale(1.5)');
      }
    } else {
      this.wineTransform.set('none');
      const wineTextStart = vh * 3.2;
      const wineTextEnd = vh * 3.8; 
      this.wineTextProgress.set(Math.max(0, Math.min((scroll - wineTextStart) / (wineTextEnd - wineTextStart), 1)));
    }
  }

  openPdf(url: string) {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth <= 968;
      if (isMobile) {
        // Fallback for mobile devices that don't support PDF embedding well
        window.location.href = url;
        return;
      }
    }
    const urlWithParams = url + '#toolbar=0&navpanes=0';
    this.activePdfUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(urlWithParams));
  }

  closePdf() {
    this.activePdfUrl.set(null);
  }
}
