import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../language.service';

@Component({
  selector: 'app-booking-stay',
  templateUrl: './stay.component.html',
  styleUrl: './stay.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class StayComponent {
  langService = inject(LanguageService);
  onNext = output<void>();
}
