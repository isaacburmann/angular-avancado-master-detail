import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
import { AfterContentChecked, Injector, OnInit } from '@angular/core';
import { BaseResourceModel } from '../../models/base-resource.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseResourceService } from '../../services/base-resource.service';


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  constructor(
    protected injector: Injector,
    public resource: T,
    protected resourceService: BaseResourceService<T>,
    protected jsonDataToResourceFn: (jsonData) => T
    ) {
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.formBuilder = this.injector.get(FormBuilder);
    }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }

  // PRIVATE METHODS
  private setCurrentAction() {
    if (this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory() {
    if (this.currentAction === 'edit') {

      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      )
        .subscribe(
          (category) => {
            this.category = category;
            this.categoryForm.patchValue(category); // binds loaded category data to categoryForm
          },
          (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
        );
    }
  }

  private setPageTitle() {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de Nova Categoria';
    } else {
      const categoryName = this.category.name || '';
      this.pageTitle = 'Editando Categoria: ' + categoryName;
    }
  }

  private createCategory() {
    const category: CategoryModel = Object.assign(new CategoryModel(), this.categoryForm.value);

    this.categoryService.create(category)
      .subscribe(
        newCategory => this.actionsForSucess(newCategory),
        error => this.actionsForError(error)
      );
  }

  private updateCategory() {
    const category: CategoryModel = Object.assign(new CategoryModel(), this.categoryForm.value);

    this.categoryService.update(category)
      .subscribe(
        newCategory => this.actionsForSucess(newCategory),
        error => this.actionsForError(error)
      );
  }

  private actionsForSucess(category: CategoryModel) {
    toastr.success('Solicitacao processada com sucesso!');

    // redirect/reload component page
    this.router.navigateByUrl('categories', {skipLocationChange: true}).then(
      () => this.router.navigate(['categories', category.id, 'edit'])
    );
  }

  private actionsForError(error) {
    toastr.error('Ocorreu um erro ao processar a sua solicitacao');

    this.submittingForm = false;

    // Exemplo de tratamento de erros retornados por uma chamada de API real
    // 422 significa que o servidor por alguma razao nao conseguiu processar a requisicao
    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).erros;
      // Exemplo de errors retornando do server ['CPF ja existe', 'Nome nao pode ficar em branco']
    } else {
      this.serverErrorMessages = ['Falha na comunicacao com o servidor. Por favor, tente mais tarde.'];
    }
  }

}
