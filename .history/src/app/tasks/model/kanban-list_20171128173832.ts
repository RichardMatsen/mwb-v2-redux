import { KanbanCard } from './kanban-card'

export class KanbanList {
  name: string;
  cards: KanbanCard[];

  constructor(initialValue) {
    this.name = initialValue.name;
    this.cards = initialValue.cards;
  }
}