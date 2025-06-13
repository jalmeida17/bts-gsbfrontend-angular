import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://bts-gsbbackend.onrender.com/users';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getCurrentUser(): Observable<UserModel> {
    const currentUser = this.authService.getCurrentUser();
    console.log('Current User:', currentUser);
    if (!currentUser?.email) {
      throw new Error('No authenticated user');
    }

    const params = new HttpParams().set('email', currentUser.email);
    return this.http.get<UserModel[]>(`${this.apiUrl}`, { params })
      .pipe(
        map(users => {
          if (users && users.length > 0) {
            return users[0];
          }
          throw new Error('User not found');
        })
      );
  }

  updateProfile(user: Partial<UserModel>): Observable<UserModel> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.email) {
      throw new Error('No authenticated user');
    }

    const params = new HttpParams().set('email', currentUser.email);
    return this.http.put<UserModel>(`${this.apiUrl}`, user, { params });
  }

  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.apiUrl}`, user);
  }

  deleteUser(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.delete(`${this.apiUrl}`, { params });
  }
}
