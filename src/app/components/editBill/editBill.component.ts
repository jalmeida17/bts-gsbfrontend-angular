import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
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
  selector: 'app-edit-bill-modal',
  standalone: true,
  imports: [
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
    DividerModule,    IconFieldModule,
    InputIconModule,
    RippleModule,
    ImageModule
  ],
  templateUrl: './editBill.component.html',
  styleUrl: './editBill.component.scss',
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
export class EditBillModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() billToEdit: BillModel | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() billUpdated = new EventEmitter<any>();

  bill: any = {
    description: '',
    amount: null,
    date: new Date(),
    type: '',
  };
  selectedFile: File | null = null;
  isSubmitting = false;
  fileChanged = false;
  selectedFilePreview: string | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['billToEdit'] && this.billToEdit) {
      this.populateForm();
    }
  }
  populateForm() {
    if (this.billToEdit) {
      this.bill = {
        description: this.billToEdit.description || '',
        amount: this.billToEdit.amount || null,
        date: this.billToEdit.date ? new Date(this.billToEdit.date) : new Date(),
        type: this.billToEdit.type || '',
      };
      this.selectedFile = null;
      this.selectedFilePreview = null;
      this.fileChanged = false;
    }
  }

  onHide() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }  onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0];
      this.fileChanged = true;
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
    this.fileChanged = true;
  }

  isFormValid(): boolean {
    return !!(
      this.bill.amount > 0 &&
      this.bill.type &&
      this.bill.date &&
      (this.billToEdit?.proof || this.selectedFile) // Either existing proof or new file
    );
  }

  onSubmit() {
    if (!this.isFormValid() || !this.billToEdit) {
      return;
    }

    this.isSubmitting = true;

    const billData = {
      ...this.bill,
      _id: this.billToEdit._id,
      status: this.billToEdit.status // Keep the existing status
    };

    this.billUpdated.emit({
      bill: billData,
      file: this.fileChanged ? this.selectedFile : null // Only send file if it changed
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
    this.fileChanged = false;
    this.isSubmitting = false;
  }
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  viewCurrentProof() {
    if (this.billToEdit?.proof) {
      window.open(this.billToEdit.proof, '_blank');
    }
  }  isCurrentProofImage(): boolean {
    if (!this.billToEdit?.proof) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const url = this.billToEdit.proof.toLowerCase();
    return imageExtensions.some(ext => url.includes(ext));
  }
}