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
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { BillModel } from '../../../models/bill.model';
import { UserModel } from '../../../models/user.model';
import { BillService } from '../../../services/bill.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { NewBillModalComponent } from './components/newBill.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
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
        RippleModule,
        SelectModule,
        IconFieldModule,
        InputIconModule,
        ConfirmPopupModule,
        NewBillModalComponent
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss',
    animations: [
        trigger('slideIn', [
            transition(':enter', [
                style({ 
                    transform: 'translateX(2%)',
                    opacity: 0,
                    filter: 'blur(2px)'
                }),
                animate('600ms cubic-bezier(0.4, 0, 0.2, 1)', style({ 
                    transform: 'translateX(0)',
                    opacity: 1,
                    filter: 'blur(0)'
                }))
            ])
        ]),
        trigger('fadeInScale', [
            transition(':enter', [
                style({ 
                    transform: 'scale(0.95)',
                    opacity: 0
                }),
                animate('600ms cubic-bezier(0.4, 0, 0.2, 1)', style({ 
                    transform: 'scale(1)',
                    opacity: 1
                }))
            ])
        ])
    ]
})
export class Dashboard implements OnInit {
    bills: BillModel[] = [];
    newBillModalVisible = false;
    loading = false;
    searchValue: string | undefined;
    
    // Filter values for column filters
    selectedStatus: string | null = null;
    
    statusOptions = [
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Rejected', value: 'rejected' }
    ];

    constructor(
        private messageService: MessageService,
        private billService: BillService,
        private confirmationService: ConfirmationService
    ) {}
    
    ngOnInit() {
        this.loadBills();
    }
    
    loadBills() {
        this.loading = true;
        this.billService.getAllBills().subscribe({
            next: (data) => {

                this.bills = data.map(bill => ({
                    ...bill,
                    date: new Date(bill.date),
                }));
                this.loading = false;
                console.log('Bills loaded successfully', this.bills);
            },
            error: (error) => {
                console.error('Error loading bills', error);
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'Failed to load bills', 
                    life: 3000 
                });
                this.loading = false;
            }
        });
    }
    
    clear(table: Table) {
        table.clear();
        this.searchValue = '';
        this.selectedStatus = null;
    }
    
    onGlobalFilter(table: Table, event: Event) {
        const target = event.target as HTMLInputElement;
        table.filterGlobal(target.value, 'contains');
    }
    
    onStatusFilter(filterCallback: Function, value: string) {
        this.selectedStatus = value;
        filterCallback(value);
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

    editBill(bill: BillModel) {
        // For now, just show a message that edit is not implemented yet
        this.messageService.add({ 
            severity: 'info', 
            summary: 'Info', 
            detail: 'Edit functionality will be implemented soon', 
            life: 3000 
        });
    }

    openNewBillModal() {
        this.newBillModalVisible = true;
    }

    onBillSaved(event: { bill: any, file: File }) {
        this.billService.createBill(event.bill, event.file).subscribe({
            next: (createdBill) => {
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Bill created successfully', 
                    life: 3000 
                });
                this.loadBills();
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

    confirmDelete(event: Event, bill: BillModel) {
        this.confirmationService.confirm({
            target: event.currentTarget as EventTarget,
            message: 'Are you sure you want to delete this bill?',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Delete',
                severity: 'danger'
            },
            accept: () => {
                this.billService.deleteBill(bill._id).subscribe({
                    next: () => {
                        this.messageService.add({ 
                            severity: 'success', 
                            summary: 'Success', 
                            detail: 'Bill deleted successfully', 
                            life: 3000 
                        });
                        this.loadBills();
                    },
                    error: (error) => {
                        console.error('Error deleting bill', error);
                        this.messageService.add({ 
                            severity: 'error', 
                            summary: 'Error', 
                            detail: 'Failed to delete bill', 
                            life: 3000 
                        });
                    }
                });
            },
        });
    }
}