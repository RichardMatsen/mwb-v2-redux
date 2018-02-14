import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
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

  constructor(private el: ElementRef) { }

  ngOnInit() {
  }
  
  // ngAfterViewInit() {            
  //   console.log('this', this);
  //   console.log('addCardInputCtrl', this.addCardInputCtrl);
  // }

  showNewCard() {
    this.displayAddCard = true;
    this.addCardInputCtrl.nativeElement.focus();
  }
  hideNewCard() {
    this.displayAddCard = false;
  }
  addNewCard(description: string) {
    const cardId =  this.list.cards.map(x => x.id).reduce((acc,val) => val > acc ? val : acc, 0) + 1;
    this.list.cards.push({
      id: cardId, 
      description: description, 
      status: this.list.name, 
      effectiveDate: new Date()
    });
    this.addCardInputCtrl.nativeElement.value='';
    this.displayAddCard = false;
  }

  // showNewCard(input) {
  //   this.displayAddCard = true;
  //   this.addCardInputCtrl.nativeElement.focus();
  // }

  // onEnter(description: string) {
  //   const cardId =  this.list.cards.map(x => x.id).reduce((acc,val) => val > acc ? val : acc, 0) + 1;
  //   this.list.cards.push({
  //     id: cardId, 
  //     description: description, 
  //     status: this.list.name, 
  //     effectiveDate: new Date()
  //   });
  // }

  allowDrop($event) {
    $event.preventDefault();
  }

  drop($event) {
    $event.preventDefault();
    const data = $event.dataTransfer.getData('text');

    let target = $event.target;
    const targetClassName = target.className;

    while( target.className !== 'list') {
      target = target.parentNode;
    }
    target = target.querySelector('.cards');

    if(targetClassName === 'card') {
      $event.target.parentNode.insertBefore(document.getElementById(data), $event.target);
    } else if(targetClassName === 'list__title') {
      if (target.children.length) {
        target.insertBefore(document.getElementById(data), target.children[0]);
      }else {
        target.appendChild(document.getElementById(data));
      }
    } else {
      target.appendChild(document.getElementById(data));
    }

  }

}
