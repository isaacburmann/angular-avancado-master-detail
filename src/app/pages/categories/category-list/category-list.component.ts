import { Component, OnInit } from '@angular/core';
import {CategoryService} from '../shared/category.service';
import {CategoryModel} from '../shared/category.model';
import {element} from 'protractor';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  categories: CategoryModel[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories,
      error => alert('Erro ao listar categorias')
    );
  }

  deleteCategory(category) {
    const mustDelete = confirm('Deseja realmente excluir essa categoria?');

    if(mustDelete) {
      this.categoryService.delete(category.id).subscribe(
        () => this.categories = this.categories.filter(item => item !== category),
        () => 'Erro ao tentar excluir a categoria!'
      );
    }
  }

}
