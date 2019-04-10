import {AfterContentChecked, Component, OnInit} from '@angular/core';
import {EntryService} from '../shared/entry.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EntryModel} from '../shared/entry.model';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import toastr from 'toastr';
import {CategoryModel} from '../../categories/shared/category.model';
import {CategoryService} from '../../categories/shared/category.service';


@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm = false;
  entry: EntryModel = new EntryModel();
  categories: Array<CategoryModel>;

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: [ 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez' ],
    today: 'Hoje',
    clear: 'Limpar',
  };

  constructor(private entryService: EntryService,
              private categoryService: CategoryService,
              private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createEntry();
    } else {
      this.updateEntry();
    }
  }

  get typeOptions(): Array<any> {
    return Object.entries(EntryModel.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        };
      }
    );
  }

  // PRIVATE METHODS
  private setCurrentAction() {
    if (this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  private loadEntry() {
    if (this.currentAction === 'edit') {

      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      )
        .subscribe(
          (entry) => {
            this.entry = entry;
            this.entryForm.patchValue(entry); // binds loaded entry data to entryForm
          },
          (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
        );
    }
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    );
  }

  private setPageTitle() {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de Novo Lancamento';
    } else {
      const entryName = this.entry.name || '';
      this.pageTitle = 'Editando Lancamento: ' + entryName;
    }
  }

  private createEntry() {
    const entry: EntryModel = Object.assign(new EntryModel(), this.entryForm.value);

    this.entryService.create(entry)
      .subscribe(
        newEntry => this.actionsForSucess(newEntry),
        error => this.actionsForError(error)
      );
  }

  private updateEntry() {
    const entry: EntryModel = Object.assign(new EntryModel(), this.entryForm.value);

    this.entryService.update(entry)
      .subscribe(
        newEntry => this.actionsForSucess(newEntry),
        error => this.actionsForError(error)
      );
  }

  private actionsForSucess(entry: EntryModel) {
    toastr.success('Solicitacao processada com sucesso!');

    // redirect/reload component page
    this.router.navigateByUrl('entries', {skipLocationChange: true}).then(
      () => this.router.navigate(['entries', entry.id, 'edit'])
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