import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Department } from './department';
import { HttpClient } from '@angular/common/http';
import { tap, delay } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  readonly url = "http://localhost:3000/departments";

  private departmentsSubject$: BehaviorSubject<Department[]> = new BehaviorSubject<Department[]>(null);
  private loaded: boolean = false;

  constructor(private http: HttpClient) { }

  get(): Observable<Department[]> {
    if (!this.loaded) {
      this.http.get<Department[]>(this.url)
        .pipe(
          tap((deps) => console.log(deps)), delay(1000)
        )
        .subscribe(this.departmentsSubject$);
      this.loaded = true
    }
    return this.departmentsSubject$.asObservable();
  }

  add(department: Department): Observable<Department> {
    return this.http.post<Department>(this.url, department)
      .pipe(
        tap((dep: Department) =>
          this.departmentsSubject$.getValue().push(dep))
      )
  }

  del(department: Department): Observable<any> {
    return this.http.delete(`${this.url}/${department._id}`)
      .pipe(
        tap(() => {
          let departments = this.departmentsSubject$.getValue();
          let i = departments.findIndex(departmentBD => departmentBD._id === department._id);
          if (i >= 0) {
            departments.splice(i, 1);
          }
        })
      )
  }

  update(department: Department): Observable<Department> {
    return this.http.patch<Department>(`${this.url}/${department._id}`, department)
      .pipe(
        tap((dep) => { //tap causa uma ação no observable
          let departments = this.departmentsSubject$.getValue();
          let i = departments.findIndex(d => d._id === dep._id);
          if (i >= 0) {
            departments[i].name = dep.name
          }
        })
      )
  }
}
