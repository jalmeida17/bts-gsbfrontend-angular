import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';
import { RippleModule } from 'primeng/ripple';
import { trigger, transition, style, animate } from '@angular/animations';
import { BillModel } from '../../../../models/bill.model';

@Component({
  selector: 'app-view-bill-modal',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    CardModule,
    DividerModule,
    TagModule,
    ImageModule,
    RippleModule
  ],
  templateUrl: './viewBill.component.html',
  styleUrl: './viewBill.component.scss',
  animations: [
    trigger('slideInScale', [
      transition(':enter', [
        style({ 
          transform: 'scale(0.9)',
          opacity: 0
        }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ 
          transform: 'scale(1)',
          opacity: 1
        }))
      ])
    ])
  ]
})
export class ViewBillModalComponent {
  @Input() visible: boolean = false;
  @Input() billToView: BillModel | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();

  onHide() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  getStatusSeverity(status: string) {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warn';
      case 'rejected':
        return 'danger';
      default:
        return 'info';
    }
  }

  downloadProof() {
    if (this.billToView?.proof) {
      window.open(this.billToView.proof, '_blank');
    }
  }

  getUserName(): string {
    if (!this.billToView?.user) return 'Unknown User';
    
    if (typeof this.billToView.user === 'object' && this.billToView.user !== null) {
      return this.billToView.user.name || 'Unknown User';
    }
    
    return this.billToView.user;
  }

  getUserEmail(): string {
    if (!this.billToView?.user) return '';
    
    if (typeof this.billToView.user === 'object' && this.billToView.user !== null) {
      return this.billToView.user.email || '';
    }
    
    return '';
  }
}
