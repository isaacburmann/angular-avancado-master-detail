import { Component, OnInit } from '@angular/core';
import {CategoryService} from '../shared/category.service';
import {CategoryModel} from '../shared/category.model';
import {element} from 'protractor';
import { BaseResourceListComponent } from '../../../shared/components/base-resource-list/base-resource-list.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent extends BaseResourceListComponent<CategoryModel> {

  constructor(private categoryService: CategoryService) {
    super(categoryService);
  }

}
