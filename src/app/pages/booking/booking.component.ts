import { Component, inject, OnInit, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../language.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule
  ]
})
export class BookingComponent implements AfterViewInit {
  langService = inject(LanguageService);
  platformId = inject(PLATFORM_ID);

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Small delay to ensure DOM is ready and any old instances are cleared
      setTimeout(() => {
        this.initWebBookingPro();
      }, 100);
    }
  }

  private initWebBookingPro() {
    // Set settings
    (window as any).wbpSettings = {
      'hotelId': '34003',
      'language': this.langService.currentLang(),
      'currency': 'EUR',
      'showLogo': '0',
      'showProperty': 0,
      'showFooter': '0',
      'darktheme': '0'
    };

    // Load assets
    fetch('https://booking.webbookingpro.com/asset-manifest.json')
      .then((response) => response.json())
      .then(({ entrypoints }) => {
        entrypoints.forEach((file: string) => {
          if (file.endsWith('.css')) {
            const cssId = 'wbp-css-' + file.replace(/\//g, '-');
            if (!document.getElementById(cssId)) {
              const css = document.createElement('link');
              css.id = cssId;
              css.rel = 'stylesheet';
              css.href = 'https://booking.webbookingpro.com/' + file;
              document.head.appendChild(css);
            }
          }
          else if (file.endsWith('js')) {
            // For JS, we might need to re-append to force execution in the new #wbproot
            // But to avoid duplicate scripts in memory, we remove the old ones if they exist
            const scriptId = 'wbp-js-' + file.replace(/\//g, '-');
            const oldScript = document.getElementById(scriptId);
            if (oldScript) {
              oldScript.remove();
            }

            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://booking.webbookingpro.com/' + file + '?t=' + new Date().getTime();
            script.async = true;
            document.body.appendChild(script);
          }
        });
      })
      .catch(err => console.error('Failed to load WebBookingPro assets', err));
  }
}
