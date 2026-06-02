import { Component, inject, signal, computed, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../language.service';

export interface GalleryItem {
  src: string;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class GalleryComponent implements OnInit {
  langService = inject(LanguageService);

  activeTab = signal<'apartments' | 'restaurant' | 'wellness'>('apartments');
  lightboxIndex = signal<number | null>(null);
  columnCount = signal(3);

  // 22 apartment images ordered to distribute beautifully across columns
  apartmentsImages: GalleryItem[] = [
    { src: '/images/apartments/DZO_2034.JPG' }, // Stairs
    { src: '/images/apartments/DZO_1975.JPG' }, // Dining table
    { src: '/images/apartments/DZO_2147.JPG' }, // Living room from above
    { src: '/images/apartments/DZO_2039.JPG' }, // Living room couch/TV
    { src: '/images/apartments/DZO_2053.JPG' }, // Jacuzzi
    { src: '/images/apartments/DZO_2123.JPG' }, // Exterior apartments
    { src: '/images/apartments/DZO_2050.JPG' }, // Bed/river
    { src: '/images/apartments/DZO_1983.JPG' }, // Balcony view
    { src: '/images/apartments/DZO_2012 (1).JPG' }, // Lawn exterior
    { src: '/images/apartments/DZO_2171 (1).JPG' }, // Sofa close-up
    { src: '/images/apartments/DZO_2170.JPG' }, // Walkway wood
    { src: '/images/apartments/DZO_2230.JPG' }, // Door number 2
    { src: '/images/apartments/DZO_2160.JPG' }, // Another exterior view
    { src: '/images/apartments/DZO_2069.JPG' }, // Living room window view
    { src: '/images/apartments/DZO_2003.JPG' }, // Dining close-up
    { src: '/images/apartments/DZO_2025.JPG' }, // Interior chairs
    { src: '/images/apartments/DZO_2033.JPG' }, // Bathroom close-up
    { src: '/images/apartments/DZO_2037.JPG' }, // Kitchen area
    { src: '/images/apartments/DZO_2045.JPG' }, // Upstairs view
    { src: '/images/apartments/DZO_2060.JPG' }, // Balcony view zoom
    { src: '/images/apartments/DZO_2122.JPG' }, // Lawn/river zoom
    { src: '/images/apartments/DZO_2172 (1).JPG' }  // Exterior night view
  ];

  restaurantImages: GalleryItem[] = [];
  wellnessImages: GalleryItem[] = [];

  activeImages = computed(() => {
    switch (this.activeTab()) {
      case 'restaurant':
        return this.restaurantImages;
      case 'wellness':
        return this.wellnessImages;
      case 'apartments':
      default:
        return this.apartmentsImages;
    }
  });

  // Dynamically partition images into columns to preserve original aspect ratios without gaps
  columns = computed(() => {
    const imgs = this.activeImages();
    const count = this.columnCount();
    const cols: { img: GalleryItem; index: number }[][] = Array.from({ length: count }, () => []);

    imgs.forEach((img, idx) => {
      cols[idx % count].push({ img, index: idx });
    });
    return cols;
  });

  ngOnInit() {
    this.updateColumnCount();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateColumnCount();
  }

  private updateColumnCount() {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 600) {
        this.columnCount.set(2);
      } else {
        this.columnCount.set(3);
      }
    }
  }

  setTab(tab: 'apartments' | 'restaurant' | 'wellness') {
    this.activeTab.set(tab);
    this.closeLightbox();
  }

  openLightbox(index: number) {
    this.lightboxIndex.set(index);
  }

  closeLightbox() {
    this.lightboxIndex.set(null);
  }

  nextImage(event?: Event) {
    if (event) event.stopPropagation();
    const current = this.lightboxIndex();
    if (current !== null) {
      const next = (current + 1) % this.activeImages().length;
      this.lightboxIndex.set(next);
    }
  }

  prevImage(event?: Event) {
    if (event) event.stopPropagation();
    const current = this.lightboxIndex();
    if (current !== null) {
      const prev = (current - 1 + this.activeImages().length) % this.activeImages().length;
      this.lightboxIndex.set(prev);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.lightboxIndex() === null) return;
    if (event.key === 'ArrowRight') {
      this.nextImage();
    } else if (event.key === 'ArrowLeft') {
      this.prevImage();
    } else if (event.key === 'Escape') {
      this.closeLightbox();
    }
  }
}
