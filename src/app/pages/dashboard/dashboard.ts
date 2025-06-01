import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { BillModel } from '../../../models/bill.model';
import { UserModel } from '../../../models/user.model';
import { BillService } from '../../../services/bill.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        DialogModule,
        FormsModule,
        InputTextModule,
        InputNumberModule,
        CalendarModule,
        TextareaModule,
        ToastModule,
        CardModule,
        DropdownModule,
        ToolbarModule,
        InputSwitchModule,
        PanelModule,
        DividerModule,
        ChipModule,
        TagModule,
        AvatarModule,
        BadgeModule,
        RippleModule
    ],
    providers: [MessageService],
    templateUrl: './dashboard.html',
    styles: [`
        .dashboard-container {
            padding: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .header-section {
            margin-bottom: 2rem;
        }
        
        .logo-title {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .logo-container {
            background-color: var(--primary-color);
            color: white;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 1rem;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: 700;
        }
        
        .title {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text-color);
            margin: 0;
            text-align: center;
            letter-spacing: 1px;
        }
        
        .stats-card {
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s;
            height: 100%;
        }
        
        .stats-card:hover {
            transform: translateY(-5px);
        }
        
        .stat-label {
            color: var(--text-color-secondary);
            font-size: 0.875rem;
            display: block;
            margin-bottom: 0.5rem;
        }
        
        .stat-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-color);
            margin: 0;
        }
        
        .icon-background {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        
        .document-bg {
            background-color: var(--primary-color);
        }
        
        .money-bg {
            background-color: var(--green-500);
        }
        
        .alert-bg {
            background-color: var(--orange-500);
        }
        
        .card-glass {
 
            backdrop-filter: blur(10px);
            border-radius: 8px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
            padding: 0.5rem;
            margin-bottom: 2rem;
        }
        
        .bill-dialog .p-dialog-content {
            padding: 2rem 1.5rem 1rem 1.5rem;
        }
        
        :host ::ng-deep {
            .p-datatable .p-datatable-thead > tr > th {
                background-color: var(--surface-ground);
                color: var(--text-color);
                font-weight: 600;
                padding: 0.75rem 1rem;
            }
            
            .p-datatable .p-datatable-tbody > tr > td {
                padding: 0.75rem 1rem;
            }
            
            .p-dropdown {
                width: 100%;
            }
            
            .p-toolbar {
                background: transparent;
                border: none;
                padding: 1rem 0;
            }
        }
    `]
})
export class Dashboard implements OnInit {
    bills: BillModel[] = [];
    billDialogVisible = false;
    bill: any = {};
    statusOptions = [
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Rejected', value: 'rejected' }
    ];

    constructor(
        private messageService: MessageService,
        private billService: BillService
    ) {}
    
    ngOnInit() {
        this.loadBills();
    }
    
    loadBills() {
        this.billService.getAllBills().subscribe({
            next: (data) => {
                this.bills = data;
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Bills loaded', life: 3000 });
            },
            error: (error) => {
                console.error('Error loading bills', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load bills', life: 3000 });
            }
        });
    }
      getTotalAmount(): number {
        return this.bills.reduce((total, bill) => total + (bill.amount || 0), 0);
    }
    
    getUnpaidBillsCount(): number {
        return this.bills.filter(bill => bill.status === 'pending').length;
    }

    
    getInitials(name: string): string {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    
    getAvatarColor(name: string): string {
        if (!name) return '#757575';
        const colors = ['#1976D2', '#9C27B0', '#E91E63', '#FF9800', '#009688', '#673AB7'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        hash = Math.abs(hash);
        return colors[hash % colors.length];
    }
    
    getStatusSeverity(status: string): string {
        switch (status) {
            case 'paid':
                return 'success';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'danger';
            default:
                return 'info';
        }
    }
    
    onFilter(event: any) {
        const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
        // Implement filtering if needed
    }
    
    openNewBillDialog() {
        this.bill = {};
        this.billDialogVisible = true;
    }
    
    editBill(bill: BillModel) {
        this.bill = { ...bill };
        this.billDialogVisible = true;
    }
      selectedProofFile: File | null = null;

    onFileSelect(event: any) {
        if (event.target.files.length > 0) {
            this.selectedProofFile = event.target.files[0];
        }
    }

    saveBill() {
        if (this.bill.id) {
            // Update existing bill
            this.billService.updateBill(this.bill.id, this.bill).subscribe({
                next: (updatedBill) => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Bill updated', life: 3000 });
                    this.loadBills();
                    this.billDialogVisible = false;
                },
                error: (error) => {
                    console.error('Error updating bill', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update bill', life: 3000 });
                }
            });
        } else {
            // Create new bill with file upload
            if (!this.selectedProofFile) {
                this.messageService.add({ 
                    severity: 'warn', 
                    summary: 'Warning', 
                    detail: 'Please upload a proof document', 
                    life: 3000 
                });
                return;
            }

            this.billService.createBill(this.bill, this.selectedProofFile).subscribe({
                next: (createdBill) => {
                    this.messageService.add({ 
                        severity: 'success', 
                        summary: 'Success', 
                        detail: 'Bill created successfully', 
                        life: 3000 
                    });
                    this.loadBills();
                    this.billDialogVisible = false;
                    this.selectedProofFile = null;
                },
                error: (error) => {
                    console.error('Error creating bill', error);
                    this.messageService.add({ 
                        severity: 'error', 
                        summary: 'Error', 
                        detail: 'Failed to create bill: ' + (error.message || 'Unknown error'), 
                        life: 5000 
                    });
                }
            });
        }
    }
    
    confirmDelete(bill: BillModel) {
        if (confirm('Are you sure you want to delete this bill?')) {
            this.billService.deleteBill(bill._id).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Bill deleted', life: 3000 });
                    this.loadBills();
                },
                error: (error) => {
                    console.error('Error deleting bill', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete bill', life: 3000 });
                }
            });
        }
    }
}
