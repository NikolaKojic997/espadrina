import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type Lang = 'en' | 'sr';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANG_KEY = 'user-lang';
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  
  private langSignal = signal<Lang>('en');
  // English is the default hardcoded state
  private translationsSignal = signal<any>({
    nav: { 
      bookNow: 'Book now', 
      restaurant: 'Restaurant', 
      menu: 'MENU', 
      links: { 
        home: 'Home', 
        experience: 'Experience', 
        wellness: 'Wellness', 
        contact: 'Contact' 
      } 
    },
    flow: { 
      title: 'FIND YOURSELF ALONG THE TIMELESS FLOW OF THE DRINA', 
      desc: 'On the banks of the Drina, luxury takes on a different meaning. More intimate, more grounded, more real. It is a place to slow down, reconnect with nature, and rediscover the beauty of simplicity, comfort and belonging.', 
      cta: 'Explore Drina', 
      comingSoon: 'Booking system is coming soon...' 
    },
    luxury: { 
      title: 'LUXURY ESCAPE', 
      desc: 'Luxury apartments provide a perfect blend of modern comfort and natural peace, designed for your ultimate relaxation.', 
      cta: 'Find yourself' 
    },
    food: { 
      title: 'TIMELESS FOOD', 
      desc: 'Enjoy authentic local flavors, prepared with care from the freshest ingredients of the Drina region.', 
      cta: 'Find out more', 
      comingSoon: 'Everything will be implemented soon' 
    },
    spa: { 
      title: 'YOUR PERSONAL SPA', 
      desc: 'Relax in our exclusive spa center, where natural tranquility meets premium treatments for your body and mind.', 
      cta: 'Find out more' 
    },
    pool: { 
      title: 'POOL ON YOU', 
      desc: 'Dive into a refreshing pool with views of the river and mountains, creating memories that last forever.', 
      cta: 'Find out more' 
    },
    inspiration: { 
      title: 'ENDLESS INSPIRATION', 
      desc: 'Let the beauty of the Drina inspire you. Our resort is a sanctuary for those seeking authenticity, peace, and unforgettable moments by the sound of the water.', 
      cta: 'CONTACT US' 
    },
    footer: { rights: '2026 Espadrina. All Rights Reserved.' }
  });

  initPromise: Promise<void>;
  
  constructor() {
    this.initPromise = this.initLanguage();
  }

  private async initLanguage() {
    let initialLang: Lang = 'en';
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem(this.LANG_KEY) as Lang;
      if (savedLang) {
        initialLang = savedLang;
      }
    }
    await this.setLanguage(initialLang);
  }

  // Computed signal that returns the current dictionary
  current = computed(() => this.translationsSignal());
  
  // Expose current language
  currentLang = computed(() => this.langSignal());

  async setLanguage(lang: Lang) {
    this.langSignal.set(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.LANG_KEY, lang);
    }

    try {
      // Fetch the properties file from the public directory
      const content = await firstValueFrom(
        this.http.get(`i18n/${lang}.properties`, { responseType: 'text' })
      );
      const parsed = this.parseProperties(content);
      this.translationsSignal.set(parsed);
    } catch (err) {
      console.error(`Failed to load ${lang}.properties`, err);
    }
  }

  toggleLanguage() {
    const nextLang = this.langSignal() === 'en' ? 'sr' : 'en';
    this.setLanguage(nextLang);
  }

  /**
   * Simple parser for .properties files that supports dot notation for nesting
   */
  private parseProperties(content: string): any {
    const result: any = {};
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('!')) continue;

      const index = trimmed.indexOf('=');
      if (index === -1) continue;

      const key = trimmed.substring(0, index).trim();
      const value = trimmed.substring(index + 1).trim();

      // Handle nested keys like nav.links.experience
      const parts = key.split('.');
      let current = result;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          current[part] = value;
        } else {
          current[part] = current[part] || {};
          current = current[part];
        }
      }
    }
    return result;
  }
}
