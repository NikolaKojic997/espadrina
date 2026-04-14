import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../language.service';

@Component({
  selector: 'app-booking-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class PaymentComponent {
  langService = inject(LanguageService);
  onNext = output<void>();
  onBack = output<void>();
}
