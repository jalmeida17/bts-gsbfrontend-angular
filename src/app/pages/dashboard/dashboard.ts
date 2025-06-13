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
import { ChartModule } from 'primeng/chart';
import { Table } from 'primeng/table';
import { BillModel } from '../../../models/bill.model';
import { UserModel } from '../../../models/user.model';
import { BillService } from '../../../services/bill.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { NewBillModalComponent } from './components/newBill.component';
import { EditBillModalComponent } from './components/editBill.component';
import { ViewBillModalComponent } from './components/viewBill.component';
import { AuthService } from '../../../services/auth.service';

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
        RippleModule,        SelectModule,        IconFieldModule,        InputIconModule,
        ChartModule,
        ConfirmPopupModule,
        NewBillModalComponent,
        EditBillModalComponent,
        ViewBillModalComponent
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
export class Dashboard implements OnInit {    bills: BillModel[] = [];
    newBillModalVisible = false;
    editBillModalVisible = false;
    viewBillModalVisible = false;
    billToEdit: BillModel | null = null;
    billToView: BillModel | null = null;
    loading = false;
    searchValue: string | undefined;
    
    // Chart data properties
    pieChartData: any;
    pieChartOptions: any;
    lineChartData: any;
    lineChartOptions: any;
    
    // Chart type selection
    selectedChartType: 'bills' | 'money' = 'bills';
    
    // Filter values for column filters
    selectedStatus: string | null = null;
    
    statusOptions = [
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Rejected', value: 'rejected' }
    ];    constructor(
        private messageService: MessageService,
        private billService: BillService,
        private confirmationService: ConfirmationService,
        private authService: AuthService
    ) {}
      ngOnInit() {
        this.loadBills();
        this.initializeCharts();
    }loadBills() {
        this.loading = true;
        this.billService.getAllBills().subscribe({
            next: (data) => {
                // Get current authenticated user
                const currentUser = this.authService.getCurrentUser();
                
                if (!currentUser) {
                    this.messageService.add({ 
                        severity: 'error', 
                        summary: 'Error', 
                        detail: 'No authenticated user found', 
                        life: 3000 
                    });
                    this.loading = false;
                    return;
                }

                // Filter bills to only show those belonging to the current user
                const filteredBills = data.filter(bill => {
                    // Handle different user reference formats
                    let billUserId: string;
                    
                    if (typeof bill.user === 'object' && bill.user !== null) {
                        // User is populated object
                        billUserId = bill.user._id || '';
                    } else if (typeof bill.user === 'string') {
                        // User is just ID string
                        billUserId = bill.user;
                    } else {
                        // Fallback - skip this bill
                        return false;
                    }
                    
                    return billUserId === currentUser.id;
                });                this.bills = filteredBills.map(bill => ({
                    ...bill,
                    date: new Date(bill.date),
                }));
                this.loading = false;
                this.setupLineChart();
                console.log('Bills loaded successfully for user:', currentUser.id, this.bills);
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
    
    initializeCharts() {
        this.setupLineChart();
    }    setupLineChart() {
        if (this.selectedChartType === 'bills') {
            this.setupBillsChart();
        } else if (this.selectedChartType === 'money') {
            this.setupMoneyChart();
        }
    }

    setupBillsChart() {
        const monthlyData = this.getMonthlyBillsData();
        
        this.lineChartData = {
            labels: monthlyData.labels,
            datasets: [{
                label: 'Bills Created',
                data: monthlyData.data,
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };

        this.lineChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        };
    }

    setupMoneyChart() {
        const monthlyData = this.getMonthlyMoneyData();
        
        this.lineChartData = {
            labels: monthlyData.labels,
            datasets: [{
                label: 'Total Amount (€)',
                data: monthlyData.data,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };

        this.lineChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value: any) {
                            return '€' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context: any) {
                            return 'Total: €' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            }
        };
    }

    selectChartType(type: 'bills' | 'money') {
        this.selectedChartType = type;
        this.setupLineChart();
    }


    getStatusCounts() {
        const counts = { approved: 0, pending: 0, rejected: 0 };
        
        this.bills.forEach(bill => {
            switch(bill.status?.toLowerCase()) {
                case 'approved':
                    counts.approved++;
                    break;
                case 'pending':
                    counts.pending++;
                    break;
                case 'rejected':
                    counts.rejected++;
                    break;
            }
        });
        
        return counts;
    }    getMonthlyBillsData() {
        const monthlyBills = new Map();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        this.bills.forEach(bill => {
            const date = new Date(bill.date);
            const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
            
            if (monthlyBills.has(monthKey)) {
                monthlyBills.set(monthKey, monthlyBills.get(monthKey) + 1);
            } else {
                monthlyBills.set(monthKey, 1);
            }
        });

        const sortedEntries = Array.from(monthlyBills.entries()).sort((a, b) => {
            const dateA = new Date(a[0].split(' ')[1] + '-' + (months.indexOf(a[0].split(' ')[0]) + 1) + '-01');
            const dateB = new Date(b[0].split(' ')[1] + '-' + (months.indexOf(b[0].split(' ')[0]) + 1) + '-01');
            return dateA.getTime() - dateB.getTime();
        });

        return {
            labels: sortedEntries.map(entry => entry[0]),
            data: sortedEntries.map(entry => entry[1])
        };
    }

    getMonthlyMoneyData() {
        const monthlyMoney = new Map();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Filter only approved and pending bills
        const validBills = this.bills.filter(bill => 
            bill.status?.toLowerCase() === 'approved' || bill.status?.toLowerCase() === 'pending'
        );
        
        validBills.forEach(bill => {
            const date = new Date(bill.date);
            const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
            const amount = bill.amount || 0;
            
            if (monthlyMoney.has(monthKey)) {
                monthlyMoney.set(monthKey, monthlyMoney.get(monthKey) + amount);
            } else {
                monthlyMoney.set(monthKey, amount);
            }
        });

        const sortedEntries = Array.from(monthlyMoney.entries()).sort((a, b) => {
            const dateA = new Date(a[0].split(' ')[1] + '-' + (months.indexOf(a[0].split(' ')[0]) + 1) + '-01');
            const dateB = new Date(b[0].split(' ')[1] + '-' + (months.indexOf(b[0].split(' ')[0]) + 1) + '-01');
            return dateA.getTime() - dateB.getTime();
        });

        return {
            labels: sortedEntries.map(entry => entry[0]),
            data: sortedEntries.map(entry => entry[1])
        };
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
    }    editBill(bill: BillModel) {
        this.billToEdit = bill;
        this.editBillModalVisible = true;
    }

    viewBill(bill: BillModel) {
        this.billToView = bill;
        this.viewBillModalVisible = true;
    }

    openNewBillModal() {
        this.newBillModalVisible = true;
    }    onBillSaved(event: { bill: any, file: File }) {
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
    }    onBillUpdated(event: { bill: any, file: File | null }) {
        if (event.file) {
            // Update with new file
            this.billService.updateBillWithFile(event.bill._id, event.bill, event.file).subscribe({
                next: (updatedBill) => {
                    this.messageService.add({ 
                        severity: 'success', 
                        summary: 'Success', 
                        detail: 'Bill updated successfully', 
                        life: 3000 
                    });
                    this.loadBills();
                },
                error: (error) => {
                    console.error('Error updating bill', error);
                    this.messageService.add({ 
                        severity: 'error', 
                        summary: 'Error', 
                        detail: 'Failed to update bill: ' + (error.message || 'Unknown error'), 
                        life: 5000 
                    });
                }
            });
        } else {
            // Update without file
            this.billService.updateBill(event.bill._id, event.bill).subscribe({
                next: (updatedBill) => {
                    this.messageService.add({ 
                        severity: 'success', 
                        summary: 'Success', 
                        detail: 'Bill updated successfully', 
                        life: 3000 
                    });
                    this.loadBills();
                },
                error: (error) => {
                    console.error('Error updating bill', error);
                    this.messageService.add({ 
                        severity: 'error', 
                        summary: 'Error', 
                        detail: 'Failed to update bill: ' + (error.message || 'Unknown error'), 
                        life: 5000 
                    });
                }
            });
        }
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