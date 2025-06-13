import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { BillService } from '../../../services/bill.service';
import { BillModel } from '../../../models/bill.model';
import { trigger, transition, style, animate } from '@angular/animations';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-admin-stats',
    standalone: true,    imports: [
        CommonModule,
        ChartModule,
        CardModule,
        ButtonModule,
        DropdownModule,
        ToastModule,
        FormsModule
    ],
    templateUrl: './admin-stats.html',
    styleUrls: ['./admin-stats.scss'],
    providers: [BillService, MessageService],
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
export class AdminStats implements OnInit {
    bills: BillModel[] = [];
    loading = false;

    // Chart data
    statusChartData: any;
    statusChartOptions: any;
    monthlyChartData: any;
    monthlyChartOptions: any;
    typeChartData: any;
    typeChartOptions: any;
    amountTrendData: any;
    amountTrendOptions: any;

    // Period filter
    periodOptions = [
        { label: 'Last 3 Months', value: 3 },
        { label: 'Last 6 Months', value: 6 },
        { label: 'Last Year', value: 12 },
        { label: 'All Time', value: 0 }
    ];
    selectedPeriod = 6;

    // Stats
    totalStats = {
        totalBills: 0,
        totalAmount: 0,
        pendingBills: 0,
        approvedBills: 0,
        rejectedBills: 0,
        avgBillAmount: 0
    };

    constructor(private billService: BillService) {}

    ngOnInit() {
        this.loadBills();
        this.initializeChartOptions();
    }    loadBills() {
        this.loading = true;
        this.billService.getAllBills().subscribe({
            next: (bills) => {
                this.bills = bills;
                this.filterBillsByPeriod();
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading bills:', error);
                this.loading = false;
            }
        });
    }

    onPeriodChange() {
        this.loadBills();
    }

    filterBillsByPeriod() {
        if (this.selectedPeriod === 0) {
            // All time - no filtering needed
            this.calculateStats();
            this.generateCharts();
            return;
        }

        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - this.selectedPeriod);
        
        const filteredBills = this.bills.filter(bill => 
            new Date(bill.date) >= cutoffDate
        );
        
        // Use filtered bills for calculations
        this.calculateStatsForBills(filteredBills);
        this.generateChartsForBills(filteredBills);
    }

    calculateStats() {
        this.calculateStatsForBills(this.bills);
    }

    calculateStatsForBills(bills: BillModel[]) {
        this.totalStats.totalBills = bills.length;
        this.totalStats.totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
        this.totalStats.pendingBills = bills.filter(bill => bill.status === 'Pending').length;
        this.totalStats.approvedBills = bills.filter(bill => bill.status === 'Approved').length;
        this.totalStats.rejectedBills = bills.filter(bill => bill.status === 'Rejected').length;
        this.totalStats.avgBillAmount = this.totalStats.totalBills > 0 ? 
            this.totalStats.totalAmount / this.totalStats.totalBills : 0;
    }

    generateCharts() {
        this.generateChartsForBills(this.bills);
    }

    generateChartsForBills(bills: BillModel[]) {
        this.generateStatusChart(bills);
        this.generateMonthlyChart(bills);
        this.generateTypeChart(bills);
        this.generateAmountTrendChart(bills);
    }    generateStatusChart(bills: BillModel[]) {
        const statusCounts = {
            'Pending': bills.filter(bill => bill.status === 'Pending').length,
            'Approved': bills.filter(bill => bill.status === 'Approved').length,
            'Rejected': bills.filter(bill => bill.status === 'Rejected').length
        };

        this.statusChartData = {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: [
                    '#FFA726', // Orange for Pending
                    '#66BB6A', // Green for Approved
                    '#EF5350'  // Red for Rejected
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        };
    }

    generateMonthlyChart(bills: BillModel[]) {
        const monthlyData: { [key: string]: number } = {};
        const monthlyAmounts: { [key: string]: number } = {};

        bills.forEach(bill => {
            const monthYear = new Date(bill.date).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
            });
            monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
            monthlyAmounts[monthYear] = (monthlyAmounts[monthYear] || 0) + bill.amount;
        });

        const sortedMonths = Object.keys(monthlyData).sort((a, b) => 
            new Date(a).getTime() - new Date(b).getTime()
        );

        this.monthlyChartData = {
            labels: sortedMonths,
            datasets: [
                {
                    label: 'Number of Bills',
                    data: sortedMonths.map(month => monthlyData[month]),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    yAxisID: 'y'
                },
                {
                    label: 'Total Amount (€)',
                    data: sortedMonths.map(month => monthlyAmounts[month]),
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    yAxisID: 'y1',
                    type: 'line'
                }
            ]
        };
    }

    generateTypeChart(bills: BillModel[]) {
        const typeCounts: { [key: string]: number } = {};
        
        bills.forEach(bill => {
            typeCounts[bill.type] = (typeCounts[bill.type] || 0) + 1;
        });

        this.typeChartData = {
            labels: Object.keys(typeCounts),
            datasets: [{
                data: Object.values(typeCounts),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        };
    }

    generateAmountTrendChart(bills: BillModel[]) {
        const sortedBills = [...bills].sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        let runningTotal = 0;
        const cumulativeData = sortedBills.map(bill => {
            runningTotal += bill.amount;
            return {
                x: new Date(bill.date).toLocaleDateString(),
                y: runningTotal
            };
        });

        this.amountTrendData = {
            labels: cumulativeData.map(item => item.x),
            datasets: [{
                label: 'Cumulative Amount (€)',
                data: cumulativeData.map(item => item.y),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        };
    }

    initializeChartOptions() {
        this.statusChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                title: {
                    display: true,
                    text: 'Bills by Status',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            }
        };

        this.monthlyChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Number of Bills'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Amount (€)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                title: {
                    display: true,
                    text: 'Monthly Bills Overview',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            }
        };

        this.typeChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                title: {
                    display: true,
                    text: 'Bills by Type',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            }
        };

        this.amountTrendOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cumulative Amount (€)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                title: {
                    display: true,
                    text: 'Cumulative Amount Trend',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            }
        };
    }

    private getTextColor(): string {
        return getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#000000';
    }

    private getSecondaryTextColor(): string {
        return getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary').trim() || '#666666';
    }
}
