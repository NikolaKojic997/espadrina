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
  // Initialize with a fallback object to prevent template errors during first load
  private translationsSignal = signal<any>({
    nav: { bookNow: '', restaurant: '', menu: '', links: { home: '' } },
    flow: { title: '', desc: '', cta: '', comingSoon: '' },
    luxury: { title: '', desc: '', cta: '' },
    food: { title: '', desc: '', cta: '', comingSoon: '' },
    spa: { title: '', desc: '', cta: '' },
    pool: { title: '', desc: '', cta: '' },
    inspiration: { title: '', desc: '', cta: '' },
    footer: { rights: '' }
  });

  constructor() {
    this.initLanguage();
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
