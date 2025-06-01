
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BillModel } from '../models/bill.model';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private apiUrl = 'http://localhost:3000/bills'; // Adjust this URL to match your backend API URL
  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzFhMTVkNDVmM2RlNjU3ZTUzMzYxNSIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiam9hLmFsbWVpZGFzYW50b3NAZ21haWwuY29tIiwiaWF0IjoxNzQ4MDgzNDI5LCJleHAiOjE3NDgxNjk4Mjl9.BcfRcHYH6IqTerABDI2CWsi2kip-h1WyuDG0_xE0LtI';
  
  constructor(private http: HttpClient) { }
  
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }
  /**
   * Get all bills
   * @returns Observable with all bills
   */
  getAllBills(): Observable<BillModel[]> {
    return this.http.get<BillModel[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  /**
   * Get bill by id
   * @param id Bill ID
   * @returns Observable with the bill
   */
  getBillById(id: string): Observable<BillModel> {
    return this.http.get<BillModel>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Create a new bill with file upload
   * @param bill Bill data
   * @param proofFile Proof file
   * @returns Observable with the created bill
   */  createBill(bill: Partial<BillModel>, proofFile: File): Observable<BillModel> {
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
    
    return this.http.post<BillModel>(this.apiUrl, formData, {
      headers: this.getHeaders()
    });
  }
  /**
   * Update an existing bill
   * @param id Bill ID
   * @param bill Updated bill data
   * @returns Observable with the updated bill
   */
  updateBill(id: string, bill: Partial<BillModel>): Observable<BillModel> {
    return this.http.put<BillModel>(`${this.apiUrl}/${id}`, bill, {
      headers: this.getHeaders()
    });
  }

  /**
   * Delete a bill
   * @param id Bill ID
   * @returns Observable with deletion message
   */
  deleteBill(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}