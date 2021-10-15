import { Component, OnInit } from '@angular/core';
import { ProductService} from '../products.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from './product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {

  productNome: string = '';
  products: Product[] = [];
  productEdit: Product = null;

  private unsubscribe$: Subject<any> = new Subject();

  constructor(private productService:  ProductService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.productService.get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((product) => this.products = product) // aqui eu populo meu array fazio com o que vem do banco
  }

  clearFields() {
    this.productNome = '';
    this.productEdit = null;
  }

  cancel() {
    this.clearFields();
  }

  notify(msg: string) {
    this.snackbar.open(msg, 'OK', { duration: 3000 })
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  save() {
    if (this.productEdit) {
      this.productService.update(
        { name: this.productNome, _id: this.productEdit._id }
      ).subscribe(
        (dep) => {
          this.notify("Alterado com sucesso!")
        },
        (erro) => {
          this.notify("Erro ao salvar")
          console.log(erro)
        }
      )
    }
    else {
      this.productService.add({ name: this.productNome })
        .subscribe(
          (dep) => {
            console.log(dep)
            this.notify("Inserido com sucesso!")
          },
          (erro) => {
            console.error(erro);
          }
        );
    }
    this.clearFields();
  }

  edit(dep: Product) {
    this.productNome = dep.name
    this.productEdit = dep
  }

  delete(dep: Product) {
    this.productService.del(dep)
      .subscribe(
        () => this.notify("Romovido com sucesso!"),
        (err) => this.notify(err.error.msg)
      )
  }

}

