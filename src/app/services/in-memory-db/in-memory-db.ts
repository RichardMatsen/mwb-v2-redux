import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemUsersService implements InMemoryDbService {
  createDb() {
    const users = [
      { id: '1', firstName: 'Sam', lastName: 'Smith', userName: 'Smith' },
      { id: '2', firstName: 'Jim', lastName: 'Jones', userName: 'Jones' },
      { id: '3', firstName: 'Bob', lastName: 'Brown', userName: 'Brown' },
    ];
    return {users};
  }
}
