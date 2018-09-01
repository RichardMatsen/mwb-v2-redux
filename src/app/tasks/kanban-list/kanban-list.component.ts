import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { KanbanList } from '../model/kanban-list';

@Component({
  selector: 'mwb-kanban-list',
  templateUrl: './kanban-list.component.html',
  styleUrls: ['./kanban-list.component.css']
})
export class KanbanListComponent implements OnInit {

  @ViewChild('addcard') addCardInputCtrl: ElementRef;
  @ViewChild('cards') cardsCtrl: ElementRef;
  @Input() list: KanbanList;
  displayAddCard = false;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  showNewCard() {
    this.displayAddCard = true;
    setTimeout(() => this.addCardInputCtrl.nativeElement.focus(), 100);  // Allow a tick before focussing
  }

  hideNewCard() {
    this.displayAddCard = false;
    this.renderer.setProperty(this.addCardInputCtrl.nativeElement, 'value', '');
  }

  addNewCard(description: string) {
    const cardId =  this.list.cards.map(x => x.id).reduce((acc, val) => val > acc ? val : acc, 0) + 1;
    this.list.cards.push({
      id: cardId,
      description: description,
      status: this.list.name,
      effectiveDate: new Date()
    });
    this.hideNewCard();
  }

  allowDrop($event) {
    $event.preventDefault();
  }

  drop($event) {
    $event.preventDefault();
    const data = $event.dataTransfer.getData('text');
    const cardToMove = document.getElementById(data).parentElement; // move the KanbanCard element
    const cards = this.cardsCtrl.nativeElement;
    this.dropAtPosition($event.target, cards, cardToMove);
  }

  private dropAtPosition(target, cards, cardToMove) {
    if (target.className === 'card') {
      cards.insertBefore(cardToMove, target.parentNode);  // drop before selected card
    }
    if (target.className === 'list_title' && cards.children.length) {
      cards.insertBefore(cardToMove, cards.children[0]);  // drop at top of list
    }
    if (target.className === 'list_title' && !cards.children.length) {
      cards.appendChild(cardToMove);  // append to end of list
    }
    if (target.className !== 'card' && target.className !== 'list_title') {
      cards.appendChild(cardToMove);  // append to end of list
    }
  }

}
