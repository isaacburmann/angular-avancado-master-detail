import { OnInit } from '@angular/core';
import { BaseResourceService } from '../../services/base-resource.service';
import { BaseResourceModel } from '../../models/base-resource.model';

export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = [];

  constructor(private resourceService: BaseResourceService<T>) { }

  ngOnInit() {
    this.resourceService.getAll().subscribe(
      resources => this.resources = resources.sort((a, b) => b.id - a.id),
      error => alert('Erro ao carregar a lista')
    );
  }

  deleteResource(resource) {
    const mustDelete = confirm('Deseja realmente excluir essa item?');

    if (mustDelete) {
      this.resourceService.delete(resource.id).subscribe(
        () => this.resources = this.resources.filter(item => item !== resource),
        () => alert('Erro ao tentar excluir o item!')
      );
    }
  }

}
