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

interface Bill {
    id: number;
    user: string;
    price: number;
    description: string;
    date: Date;
    status: string;
    category?: string;
    avatar?: string;
    dueDate?: Date;
    priority?: string;
}
@Component({
    selector: 'app-formlayout-demo',
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
        RippleModule],
    template: `
        <div class="dashboard-container">
            <p-toast position="top-right"></p-toast>

            <!-- Header Section with Stats -->
            <div class="header-section">
                <div class="logo-title">
                    <div class="logo-container">
                        <span class="logo">GSB</span>
                    </div>
                    <h1 class="title">GESTION DES FACTURES</h1>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                    <p-card styleClass="stats-card">
                        <div class="flex justify-between">
                            <div>
                                <span class="stat-label">Total des factures</span>
                                <h3 class="stat-value">{{ bills.length }}</h3>
                            </div>
                            <div class="icon-background document-bg">
                                <i class="pi pi-file text-2xl"></i>
                            </div>
                        </div>
                    </p-card>
                    
                    <p-card styleClass="stats-card">
                        <div class="flex justify-between">
                            <div>
                                <span class="stat-label">Montant total</span>
                                <h3 class="stat-value">{{ getTotalAmount() | currency:'EUR' }}</h3>
                            </div>
                            <div class="icon-background money-bg">
                                <i class="pi pi-dollar text-2xl"></i>
                            </div>
                        </div>
                    </p-card>
                    
                    <p-card styleClass="stats-card">
                        <div class="flex justify-between">
                            <div>
                                <span class="stat-label">Factures impayées</span>
                                <h3 class="stat-value">{{ getUnpaidBillsCount() }}</h3>
                            </div>
                            <div class="icon-background alert-bg">
                                <i class="pi pi-exclamation-triangle text-2xl"></i>
                            </div>
                        </div>
                    </p-card>
                </div>
            </div>
            
            <p-divider></p-divider>
            
            <!-- Table Toolbar -->
            <p-toolbar styleClass="mb-4">
                <ng-template pTemplate="left">
                    <h2 class="m-0 font-semibold">Liste des factures</h2>
                </ng-template>
                <ng-template pTemplate="right">
                    <p-button icon="pi pi-plus" label="Nouvelle Facture" 
                            styleClass="p-button-primary mr-2" (click)="openNewBillDialog()"></p-button>
                    <p-button icon="pi pi-filter" label="Filtrer" 
                            styleClass="p-button-outlined p-button-secondary"></p-button>
                </ng-template>
            </p-toolbar>
            
            <!-- Data Table -->
            <div class="card-glass">
                <p-table #dt [value]="bills" [tableStyle]="{ 'min-width': '60rem' }"
                        [rowHover]="true"
                        [rows]="10" [paginator]="true" [rowsPerPageOptions]="[5, 10, 25]"
                        [globalFilterFields]="['user','description','status','category']"
                        styleClass="p-datatable-gridlines p-datatable-striped p-datatable-sm"
                        [scrollable]="true">
                    <ng-template pTemplate="caption">
                        <div class="flex justify-between items-center">                            <span class="p-input-icon-left">
                                <i class="pi pi-search mr-2"></i>
                                <input pInputText type="text" placeholder="Rechercher..." 
                                    (input)="onFilter($event)" />
                            </span>
                        </div>
                    </ng-template>
                    <ng-template pTemplate="header">
                        <tr>
                            <th pSortableColumn="id" style="width:5%">ID <p-sortIcon field="id"></p-sortIcon></th>
                            <th pSortableColumn="user" style="width:18%">Client <p-sortIcon field="user"></p-sortIcon></th>
                            <th pSortableColumn="price" style="width:12%">Montant <p-sortIcon field="price"></p-sortIcon></th>
                            <th pSortableColumn="description" style="width:25%">Description <p-sortIcon field="description"></p-sortIcon></th>
                            <th pSortableColumn="date" style="width:15%">Date <p-sortIcon field="date"></p-sortIcon></th>
                            <th pSortableColumn="status" style="width:15%">Statut <p-sortIcon field="status"></p-sortIcon></th>
                            <th style="width:10%">Actions</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-bill>
                        <tr>
                            <td><strong>{{ bill.id }}</strong></td>
                            <td>
                                <div class="flex align-items-center gap-2">
                                    <p-avatar [label]="getInitials(bill.user)" shape="circle" 
                                            [style]="{'background-color': getAvatarColor(bill.user)}"></p-avatar>
                                    <span>{{ bill.user }}</span>
                                </div>
                            </td>
                            <td>
                                <span class="text-bold">{{ bill.price | currency:'EUR' }}</span>
                            </td>
                            <td>{{ bill.description }}</td>
                            <td>{{ bill.date | date:'dd/MM/yyyy' }}</td>
                            <td>
                                <p-tag [value]="bill.status" [severity]="getStatusSeverity(bill.status)"></p-tag>
                            </td>
                            <td>
                                <div class="flex gap-2">
                                    <button pButton pRipple icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-raised p-button-info"
                                            (click)="editBill(bill)" pTooltip="Modifier"></button>
                                    <button pButton pRipple icon="pi pi-trash" class="p-button-rounded p-button-text p-button-raised p-button-danger"
                                            (click)="confirmDelete(bill)" pTooltip="Supprimer"></button>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="7" class="text-center p-4">Aucune facture trouvée.</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
              <p-dialog [(visible)]="billDialogVisible" [style]="{ width: '500px' }" 
                     [header]="bill.id ? 'Modifier la facture' : 'Nouvelle facture'" [modal]="true" 
                     styleClass="p-fluid bill-dialog" [draggable]="false" [resizable]="false">
                <ng-template pTemplate="content">
                    <div class="form-grid grid">
                        <div class="col-12 mb-3">
                            <div class="field">
                                <label for="user" class="font-semibold block mb-2">Client</label>
                                <span class="p-input-icon-left w-full">
                                    <i class="pi pi-user"></i>
                                    <input type="text" pInputText id="user" [(ngModel)]="bill.user" required class="w-full" />
                                </span>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6 mb-3">
                            <div class="field">
                                <label for="price" class="font-semibold block mb-2">Montant</label>
                                <span class="p-input-icon-left w-full">
                                    <i class="pi pi-euro"></i>
                                    <p-inputNumber id="price" [(ngModel)]="bill.price" mode="currency" currency="EUR" 
                                                locale="fr-FR" class="w-full"></p-inputNumber>
                                </span>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6 mb-3">
                            <div class="field">
                                <label for="status" class="font-semibold block mb-2">Statut</label>
                                <p-dropdown id="status" [options]="statusOptions" optionLabel="label" optionValue="value"
                                            [(ngModel)]="bill.status" placeholder="Sélectionner un statut" class="w-full"></p-dropdown>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6 mb-3">
                            <div class="field">
                                <label for="date" class="font-semibold block mb-2">Date d'émission</label>
                                <p-calendar id="date" [(ngModel)]="bill.date" dateFormat="dd/mm/yy" 
                                            showIcon="true" class="w-full" [showButtonBar]="true"></p-calendar>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6 mb-3">
                            <div class="field">
                                <label for="dueDate" class="font-semibold block mb-2">Date d'échéance</label>
                                <p-calendar id="dueDate" [(ngModel)]="bill.dueDate" dateFormat="dd/mm/yy" 
                                            showIcon="true" class="w-full" [showButtonBar]="true"></p-calendar>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6 mb-3">
                            <div class="field">
                                <label for="category" class="font-semibold block mb-2">Catégorie</label>
                                <p-dropdown id="category" [options]="categoryOptions" optionLabel="label" optionValue="value"
                                            [(ngModel)]="bill.category" placeholder="Sélectionner une catégorie" class="w-full"></p-dropdown>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6 mb-3">
                            <div class="field">
                                <label for="priority" class="font-semibold block mb-2">Priorité</label>
                                <p-dropdown id="priority" [options]="priorityOptions" optionLabel="label" optionValue="value"
                                            [(ngModel)]="bill.priority" placeholder="Sélectionner une priorité" class="w-full"></p-dropdown>
                            </div>
                        </div>
                        
                        <div class="col-12 mb-3">
                            <div class="field">
                                <label for="description" class="font-semibold block mb-2">Description</label>
                                <p-textarea id="description" [(ngModel)]="bill.description" rows="3" 
                                            autoResize="true" class="w-full"></p-textarea>
                            </div>
                        </div>
                    </div>
                </ng-template>
                
                <ng-template pTemplate="footer">
                    <div class="flex justify-content-end gap-2">
                        <p-button label="Annuler" icon="pi pi-times" styleClass="p-button-text p-button-secondary" 
                                (click)="billDialogVisible = false"></p-button>
                        <p-button label="Enregistrer" icon="pi pi-check" styleClass="p-button-primary" 
                                (click)="saveBill()"></p-button>
                    </div>
                </ng-template>
            </p-dialog>
        </div>
    `,    styles: [`
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
            background: rgba(255, 255, 255, 0.8);
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
export class FormLayoutDemo implements OnInit {
    bills: Bill[] = [];
    billDialogVisible = false;
    bill: Bill = this.createEmptyBill();
    
    statusOptions = [
        { label: 'Payée', value: 'Paid' },
        { label: 'En attente', value: 'Pending' },
        { label: 'Impayée', value: 'Unpaid' }
    ];
    
    categoryOptions = [
        { label: 'Services', value: 'Services' },
        { label: 'Équipement', value: 'Equipment' },
        { label: 'Fournitures', value: 'Supplies' },
        { label: 'Abonnement', value: 'Subscription' },
        { label: 'Consultation', value: 'Consulting' }
    ];
    
    priorityOptions = [
        { label: 'Haute', value: 'High' },
        { label: 'Moyenne', value: 'Medium' },
        { label: 'Basse', value: 'Low' }
    ];
    
    constructor(private messageService: MessageService) {}
      ngOnInit() {
        this.generateMockData();
    }
    
    onFilter(event: Event) {
        const element = event.target as HTMLInputElement;
        if (element && element.value) {
            this.bills = this.bills.filter(bill => 
                bill.user.toLowerCase().includes(element.value.toLowerCase()) ||
                bill.description.toLowerCase().includes(element.value.toLowerCase()) ||
                bill.status.toLowerCase().includes(element.value.toLowerCase()) ||
                (bill.category && bill.category.toLowerCase().includes(element.value.toLowerCase()))
            );
        } else {
            this.generateMockData(); // Réinitialise les données
        }
    }
    
    generateMockData() {
        const statuses = ['Paid', 'Pending', 'Unpaid'];
        const users = ['Michael Johnson', 'Emma Wilson', 'Robert Davis', 'Sophia Martinez', 'William Anderson'];
        const descriptions = [
            'Service internet mensuel',
            'Facture d\'électricité',
            'Services d\'eau',
            'Fournitures de bureau',
            'Abonnement logiciel',
            'Service téléphonique',
            'Location d\'équipement',
            'Services de consultation',
            'Hébergement de site web',
            'Frais de déplacement'
        ];
        const categories = ['Services', 'Equipment', 'Supplies', 'Subscription', 'Consulting'];
        const priorities = ['High', 'Medium', 'Low'];
        
        for (let i = 1; i <= 20; i++) {
            const randomDate = new Date();
            randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 90));
            
            const dueDate = new Date(randomDate);
            dueDate.setDate(dueDate.getDate() + 30);
            
            this.bills.push({
                id: i,
                user: users[Math.floor(Math.random() * users.length)],
                price: parseFloat((Math.random() * 1000 + 50).toFixed(2)),
                description: descriptions[Math.floor(Math.random() * descriptions.length)],
                date: randomDate,
                dueDate: dueDate,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                category: categories[Math.floor(Math.random() * categories.length)],
                priority: priorities[Math.floor(Math.random() * priorities.length)]
            });
        }
    }
    
    getInitials(name: string): string {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
    
    getAvatarColor(name: string): string {
        const colors = [
            '#2196F3', '#F44336', '#4CAF50', '#FF9800', '#9C27B0', 
            '#3F51B5', '#E91E63', '#009688', '#673AB7', '#FFEB3B'
        ];
        let sum = 0;
        for (let i = 0; i < name.length; i++) {
            sum += name.charCodeAt(i);
        }
        return colors[sum % colors.length];
    }
    
    getStatusSeverity(status: string): string {
        switch (status) {
            case 'Paid': return 'success';
            case 'Pending': return 'warning';
            case 'Unpaid': return 'danger';
            default: return 'info';
        }
    }
    
    getTotalAmount(): number {
        return this.bills.reduce((sum, bill) => sum + bill.price, 0);
    }
    
    getUnpaidBillsCount(): number {
        return this.bills.filter(bill => bill.status === 'Unpaid').length;
    }
    
    confirmDelete(bill: Bill) {
        // Simple deletion for this demo, but in a real app, you'd use a confirmation dialog
        this.deleteBill(bill);
    }
    
    openNewBillDialog() {
        this.bill = this.createEmptyBill();
        this.billDialogVisible = true;
    }
    
    editBill(bill: Bill) {
        this.bill = { ...bill };
        this.billDialogVisible = true;
    }
    
    deleteBill(bill: Bill) {
        this.bills = this.bills.filter(b => b.id !== bill.id);
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Facture supprimée', life: 3000 });
    }
    
    saveBill() {
        if (!this.bill.user?.trim()) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Le nom du client est requis', life: 3000 });
            return;
        }
        
        if (this.bill.id) {
            // Update existing bill
            const index = this.bills.findIndex(b => b.id === this.bill.id);
            if (index !== -1) {
                this.bills[index] = { ...this.bill };
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Facture mise à jour', life: 3000 });
            }
        } else {
            // Create new bill
            this.bill.id = this.getNextId();
            this.bills.push({ ...this.bill });
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Facture créée', life: 3000 });
        }
        
        this.billDialogVisible = false;
        this.bill = this.createEmptyBill();
    }
    
    getNextId(): number {
        return Math.max(...this.bills.map(b => b.id), 0) + 1;
    }
    
    createEmptyBill(): Bill {
        return {
            id: 0,
            user: '',
            price: 0,
            description: '',
            date: new Date(),
            dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
            status: 'Pending',
            category: '',
            priority: 'Medium'
        };
    }
}
