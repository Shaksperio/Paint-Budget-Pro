import Dexie, { Table } from 'dexie';
import type { BudgetData, Product, Professional, Service, User } from '../types/budget';

class PaintBudgetDB extends Dexie {
  budgets!: Table<BudgetData, string>;
  products!: Table<Product, string>;
  services!: Table<Service, string>;
  professionals!: Table<Professional, string>;
  users!: Table<User, string>;

  constructor() {
    super('paintBudgetProDB');
    this.version(1).stores({
      budgets: 'id,numero,criadoEm,client.nome',
      products: 'id,nome,marca',
      services: 'id,nome,categoria',
      professionals: 'id,nome',
      users: 'id,email'
    });

    this.version(2).stores({
      budgets: 'id,numero,criadoEm,client.nome',
      products: 'id,nome,marca,tipo',
      services: 'id,nome,categoria',
      professionals: 'id,nome,email',
      users: 'id,email'
    });
  }
}

export const db = new PaintBudgetDB();
