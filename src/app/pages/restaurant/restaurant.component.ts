import { Component, inject, signal, HostListener, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { LanguageService } from '../../language.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class RestaurantComponent {
  langService = inject(LanguageService);
  rotation = signal(0);
  translateX = signal(0);
  translateXText = signal(0);
  chefTranslateX = signal(400); 
  chefTranslateTextX = signal(-400);

  @HostListener('window:scroll')
  onWindowScroll() {
    const scroll = window.scrollY;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 0;

    // Rotate 1 degree for every 5 pixels scrolled
    this.rotation.set(scroll / 5);
    // Move to the right as we scroll down
    this.translateX.set(scroll / 1.5);
    // Move text to the left as we scroll down
    this.translateXText.set(-scroll / 1.5);

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
  }
}
