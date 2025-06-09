
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BillModel } from '../models/bill.model';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private apiUrl = 'http://localhost:3000/bills';
  
  constructor(private http: HttpClient) { }

  getAllBills(): Observable<BillModel[]> {
    return this.http.get<BillModel[]>(this.apiUrl);
  }

  getBillById(id: string): Observable<BillModel> {
    return this.http.get<BillModel>(`${this.apiUrl}/${id}`);
  }
  createBill(bill: Partial<BillModel>, proofFile: File): Observable<BillModel> {
    const formData = new FormData();
    const metadata = JSON.stringify({
      date: bill.date,
      amount: bill.amount,
      description: bill.description,
      status: bill.status,
      type: bill.type
    });
    
    formData.append('metadata', metadata);
    formData.append('proof', proofFile);
    
    return this.http.post<BillModel>(this.apiUrl, formData);
  }

  updateBill(id: string, bill: Partial<BillModel>): Observable<BillModel> {
    return this.http.put<BillModel>(`${this.apiUrl}/${id}`, bill);
  }

  deleteBill(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}