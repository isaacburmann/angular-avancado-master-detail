import { InMemoryDbService} from 'angular-in-memory-web-api';
import {CategoryModel} from './pages/categories/shared/category.model';

export class InMemoryDatabase implements InMemoryDbService {
  createDb() {
    const categories: CategoryModel [] = [
      {id: 1, name: 'Moradia', description: 'Pagamentos de Contas da Casa'},
      {id: 2, name: 'Saude', description: 'Plano de Saude e Remedios'},
      {id: 3, name: 'Lazer', description: 'Cinema, parques, praia, etc'},
      {id: 4, name: 'Salario', description: 'Recebimento de Salario'},
      {id: 5, name: 'Extras', description: 'Trabalhos como freelancer'}
    ];
    return { categories };
  }
}
