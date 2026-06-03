import { Component, inject, signal, HostListener, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LanguageService } from '../../language.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class RestaurantComponent implements OnInit {
  langService = inject(LanguageService);
  rotation = signal(0);
  translateX = signal(0);
  translateY = signal(0);
  translateXText = signal(0);
  translateYText = signal(0);
  heroOpacity = signal(1);
  chefTranslateX = signal(400);
  chefTranslateTextX = signal(-400);
  wineTransform = signal('rotate(180deg) scale(1.5)');
  ingredientsProgress = signal(0);
  menuProgress = signal(0);
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
    const isBrowser = typeof window !== 'undefined';
    if (!isBrowser) return;

    const scroll = window.scrollY;
    const vh = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const isAtBottom = (vh + scroll) >= (documentHeight - 50);
    const isDesktop = window.innerWidth > 968;

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

    // Ingredients reveal logic
    const ingredientsProgressVal = getProgressForSelector('.ingredients-section');
    this.ingredientsProgress.set(ingredientsProgressVal);

    // Menu reveal logic
    const menuProgressVal = getProgressForSelector('.menu-section');
    this.menuProgress.set(menuProgressVal);

    // Rotate 1 degree for every 5 pixels scrolled
    this.rotation.set(scroll / 5);
    // Move to the right as we scroll down on desktop
    this.translateX.set(isDesktop ? scroll / 1.5 : 0);
    // Move down as we scroll down on mobile
    this.translateY.set(!isDesktop ? scroll / 1.5 : 0);
    // Move text to the left as we scroll down
    this.translateXText.set(isDesktop ? -scroll / 1.5 : 0);

    if (!isDesktop) {
      const fadeEnd = vh * 0.3; // Fade out by 30% of scroll
      const opacity = Math.max(0, 1 - (scroll / fadeEnd));
      this.heroOpacity.set(opacity);
      
      // Move text up slightly faster to make the fade/sklanjanje more obvious
      this.translateYText.set(-scroll / 2);
    } else {
      this.heroOpacity.set(1);
      this.translateYText.set(0);
    }

    // Chef section animations (Trigger as we approach Chef section)
    const chefSection = document.querySelector('.chef-section');
    if (chefSection) {
      const rect = chefSection.getBoundingClientRect();
      const startTrigger = rect.top + scroll - vh;
      const endTrigger = startTrigger + vh;
      
      if (isAtBottom && rect.top < vh) {
        this.chefTranslateX.set(0);
        this.chefTranslateTextX.set(0);
      } else if (scroll > startTrigger) {
        const progress = Math.min((scroll - startTrigger) / (endTrigger - startTrigger), 1);
        this.chefTranslateX.set(400 * (1 - progress));
        this.chefTranslateTextX.set(-400 * (1 - progress));
      } else {
        this.chefTranslateX.set(400);
        this.chefTranslateTextX.set(-400);
      }
    } else {
      this.chefTranslateX.set(400);
      this.chefTranslateTextX.set(-400);
    }

    // Wine section rotation (after Chef section)
    const wineMapSection = document.querySelector('.wine-map-section');
    if (wineMapSection) {
      const rect = wineMapSection.getBoundingClientRect();
      const wineStartTrigger = rect.top + scroll - vh;
      if (scroll > wineStartTrigger) {
        const rotation = 180 + (scroll - wineStartTrigger) / 8;
        this.wineTransform.set(`rotate(${rotation}deg) scale(1)`);
      } else {
        this.wineTransform.set('rotate(180deg) scale(1)');
      }
    } else {
      this.wineTransform.set('rotate(180deg) scale(1)');
    }

    this.wineTextProgress.set(1); // fully visible on desktop and mobile
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
