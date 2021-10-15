import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../department.service';
import { Department } from '../department';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  departmentNome: string = '';
  departments: Department[] = [];
  departmentEdit: Department = null;

  private unsubscribe$: Subject<any> = new Subject();

  constructor(private departmentService: DepartmentService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.departmentService.get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((deps) => this.departments = deps) // aqui eu populo meu array fazio com o que vem do banco
  }

  clearFields() {
    this.departmentNome = '';
    this.departmentEdit = null;
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
    if (this.departmentEdit) {
      this.departmentService.update(
        { name: this.departmentNome, _id: this.departmentEdit._id }
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
      this.departmentService.add({ name: this.departmentNome })
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

  edit(dep: Department) {
    this.departmentNome = dep.name
    this.departmentEdit = dep
  }

  delete(dep: Department) {
    this.departmentService.del(dep)
      .subscribe(
        () => this.notify("Romovido com sucesso!"),
        (err) => this.notify(err.error.msg)
      )
  }

}
