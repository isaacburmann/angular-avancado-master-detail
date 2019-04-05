import { InMemoryDbService} from 'angular-in-memory-web-api';

export class InMemoryDatabase implements InMemoryDbService {
  createDb() {
    const categories = [
      {id: 1, name: 'Moradia', description: 'Pagamentos de Contas da Casa'},
      {id: 2, name: 'Moradia', description: 'Plano de Saude e Remedios'},
      {id: 3, name: 'Moradia', description: 'Cinema, parques, praia, etc'},
      {id: 4, name: 'Moradia', description: 'Recebimento de Salario'},
      {id: 5, name: 'Moradia', description: 'Trabalhos como freelancer'}
    ];
    return { categories };
  }
}
