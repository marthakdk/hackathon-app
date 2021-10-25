
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ideas } from '../models/ideas';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class IdeaService {
    constructor(private http: HttpClient) { }
    getAllIdeas() {
        return this.http.get<Ideas[]>(`${environment.apiUrl}/ideas`);
    }
    createNewIdea(idea: Ideas) {
        return this.http.post(`${environment.apiUrl}/ideas/create-new-idea`, idea);
    }
    upvoteIdea(id: string, idea: Ideas) {
        return this.http.put(`${environment.apiUrl}/ideas/${id}`, idea);
    }
}