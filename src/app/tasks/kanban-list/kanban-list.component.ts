import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { KanbanList } from '../model/kanban-list';

@Component({
  selector: 'mwb-kanban-list',
  templateUrl: './kanban-list.component.html',
  styleUrls: ['./kanban-list.component.css']
})
export class KanbanListComponent implements OnInit {

  @ViewChild('addcard') addCardInputCtrl: ElementRef;
  @Input() list: KanbanList;
  displayAddCard = false;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  // dragStart(ev) {
  //   ev.dataTransfer.setData('text', ev.target.id);
  // }

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

    let target = $event.target;
    const targetClassName = target.className;

    while ( target.className !== 'list') {
      target = target.parentNode;
    }
    target = target.querySelector('.cards');

    const cardToMove = document.getElementById(data).parentElement; // move the KanbanCard element

    if (targetClassName === 'card') {
      $event.target.parentNode.insertBefore(cardToMove, $event.target);
    } else if (targetClassName === 'list_title') {
      if (target.children.length) {
        target.insertBefore(cardToMove, target.children[0]);
      }else {
        target.appendChild(cardToMove);
      }
    } else {
      target.appendChild(cardToMove);
    }

  }

}
