import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../language.service';

@Component({
  selector: 'app-booking',
  template: `
    <div class="page-container luxury-escape" style="min-height: 80vh; display: flex; align-items: center; justify-content: center; padding-top: 120px;">
      <div class="escape-box" style="opacity: 1; transform: none; position: relative; z-index: 10;">
        <h2 style="font-size: 48px; margin-bottom: 20px;">{{ langService.current().nav.bookNow }}</h2>
        <p style="font-size: 18px; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto;">
          {{ langService.current().flow.desc }}
        </p>
        <div class="booking-form-placeholder" style="border: 1px solid rgba(0,0,0,0.1); padding: 40px; background: rgba(255,255,255,0.5); backdrop-filter: blur(10px);">
          <p>{{ langService.current().flow.comingSoon }}</p>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class BookingComponent {
  langService = inject(LanguageService);
}
