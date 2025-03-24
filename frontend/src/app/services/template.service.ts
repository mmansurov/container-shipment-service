import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Template } from '../models/template.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private apiUrl = `${environment.apiUrl}/templates`;

  templates$ = this.getAllTemplates();

  constructor(private http: HttpClient) {
  }

  private getAllTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(this.apiUrl);
  }
}
