import { InMemoryDbService} from 'angular-in-memory-web-api';
import {CategoryModel} from './pages/categories/shared/category.model';
import {EntryModel} from './pages/entries/shared/entry.model';

export class InMemoryDatabase implements InMemoryDbService {
  createDb() {
    const categories: CategoryModel[] = [
      {id: 1, name: 'Moradia', description: 'Pagamentos de Contas da Casa'},
      {id: 2, name: 'Saude', description: 'Plano de Saude e Remedios'},
      {id: 3, name: 'Lazer', description: 'Cinema, parques, praia, etc'},
      {id: 4, name: 'Salario', description: 'Recebimento de Salario'},
      {id: 5, name: 'Extras', description: 'Trabalhos como freelancer'}
    ];

    const entries: EntryModel[] = [
      {id: 1, name: 'Gas de Cozinha', categoryId: categories[0].id, category: categories[0], paid: false, date: '14/10/2018', amount: '70,80', type: 'expense', description: 'Qualquer descricao para essa despesa'} as EntryModel,
      {id: 2, name: 'Salario mensal', categoryId: categories[3].id, category: categories[3], paid: true, date: '15/10/2018', amount: '4405,49', type: 'revenue', description: 'Qualquer descricao para essa receita'} as EntryModel
    ];

    return { categories, entries };
  }
}
