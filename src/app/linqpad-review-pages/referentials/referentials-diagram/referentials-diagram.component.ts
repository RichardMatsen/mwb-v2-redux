import { Component, OnInit, ViewChild } from '@angular/core';
import { ReferentialsDiagramModal } from '../referentials-diagram/referentials-diagram.modal.component';
import { SharedDataService } from '../../../services/shared-data.service';

@Component({
  selector: 'app-referentials-diagram',
  template: `
    <div>
      <button class="btn btn-info pull-right" (click)="showDiagram()">
        <i class="fa fa-sitemap" aria-hidden="true"></i> {{ buttonPrompt }}
      </button>
      <referentials-diagram-modal #diagramModal></referentials-diagram-modal>
    </div>
  `,
  styles: ['.btn { margin-right: 12px }']
})
export class ReferentialsDiagramComponent implements OnInit {

  @ViewChild('diagramModal') modal: ReferentialsDiagramModal;
  buttonPrompt: string;
    
  constructor(
    private sharedDataService: SharedDataService,
  ) {}

  ngOnInit() {
    this.sharedDataService.buttonPrompt$
      .subscribe(prompt => {
        this.buttonPrompt = prompt
      })
  }

  showDiagram() {
    this.modal.show();
    this.sharedDataService.changePrompt('Close Diagram')
  }
}
