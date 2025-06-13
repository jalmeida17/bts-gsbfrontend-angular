import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RippleModule } from 'primeng/ripple';
import { ImageModule } from 'primeng/image';
import { trigger, transition, style, animate } from '@angular/animations';
import { BillModel } from '../../../models/bill.model';

@Component({
  selector: 'app-new-bill-modal',
  standalone: true,  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    TextareaModule,
    ButtonModule,
    DropdownModule,
    FileUploadModule,
    CardModule,
    DividerModule,
    IconFieldModule,
    InputIconModule,
    RippleModule,
    ImageModule
  ],
  templateUrl: './newBill.component.html',
  styleUrls: ['./newBill.component.scss'],
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ]
})
export class NewBillModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() billSaved = new EventEmitter<any>();

  bill: any = {
    description: '',
    amount: null,
    date: new Date(),
    type: '',
  };
  selectedFile: File | null = null;
  selectedFilePreview: string | null = null;
  isSubmitting = false;


  onHide() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }
  onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0];
      if (this.selectedFile) {
        this.createFilePreview(this.selectedFile);
      }
    }
  }

  createFilePreview(file: File) {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedFilePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedFilePreview = null;
    }
  }

  onFileRemove() {
    this.selectedFile = null;
    this.selectedFilePreview = null;
  }

  isFormValid(): boolean {
    return !!(
      this.bill.amount > 0 &&
      this.bill.type &&
      this.bill.date &&
      this.selectedFile
    );
  }

  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    this.isSubmitting = true;

    const billData = {
      ...this.bill,
      status: 'Pending' // Automatically set to pending
    };

    this.billSaved.emit({
      bill: billData,
      file: this.selectedFile
    });
    this.isSubmitting = false;
    this.onHide();
  }
  resetForm() {
    this.bill = {
      description: '',
      amount: null,
      date: new Date(),
      type: '',
    };
    this.selectedFile = null;
    this.selectedFilePreview = null;
    this.isSubmitting = false;
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}