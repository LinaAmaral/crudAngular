import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, delay } from 'rxjs/operators'
import { Product } from './product/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  readonly url = "http://localhost:3000/departments";

  private productsSubject$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(null);
  private loaded: boolean = false;

  constructor(private http: HttpClient) { }

  get(): Observable<Product[]> {
    if (!this.loaded) {
      this.http.get<Product[]>(this.url)
        .pipe(
          tap((deps) => console.log(deps)), delay(1000)
        )
        .subscribe(this.productsSubject$);
      this.loaded = true
    }
    return this.productsSubject$.asObservable();
  }

  add(department: Product): Observable<Product> {
    return this.http.post<Product>(this.url, department)
      .pipe(
        tap((dep: Product) =>
          this.productsSubject$.getValue().push(dep))
      )
  }

  del(department: Product): Observable<any> {
    return this.http.delete(`${this.url}/${department._id}`)
      .pipe(
        tap(() => {
          let departments = this.productsSubject$.getValue();
          let i = departments.findIndex(departmentBD => departmentBD._id === department._id);
          if (i >= 0) {
            departments.splice(i, 1);
          }
        })
      )
  }

  update(department: Product): Observable<Product> {
    return this.http.patch<Product>(`${this.url}/${department._id}`, department)
      .pipe(
        tap((dep) => { //tap causa uma ação no observable
          let departments = this.productsSubject$.getValue();
          let i = departments.findIndex(d => d._id === dep._id);
          if (i >= 0) {
            departments[i].name = dep.name
          }
        })
      )
  }
}
