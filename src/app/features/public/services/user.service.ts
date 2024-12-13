import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDto } from '../models/user-dto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserById(id: string): Observable<UserDto>{
    return this.http.get<UserDto>(`${environment.apiBaseUrl}/api/Users/${id}?addAuth=true`);
  }
  updateUserProfile(id: string, user: UserDto): Observable<UserDto>{
    return this.http.put<UserDto>(`${environment.apiBaseUrl}/api/Users/${id}`, user);
  }
}
