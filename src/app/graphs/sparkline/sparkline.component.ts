import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sparkline',
  templateUrl: './sparkline.component.html',
})
export class SparklineComponent implements OnInit {

  @Input() id: string;
  @Input() history: number[];
  points = '';
  width = 100;
  height = 30;
  margin = 3;
  constructor() { }

  ngOnInit() {
    if (this.history && this.history.length) {
      this.draw();
    }
  }

  draw() {
    const x_spacing = this.history.length > 1 ? this.width / (this.history.length - 1) : 0;
    this.points = '';
    this.points = this.normalizeData(this.history)
      .map(d => (d * (this.height - (2 * this.margin))) + this.margin)  // scale y values
      .map((d, i) => { return {x: i * x_spacing, y: d}; })        // apply x spacing
      .map(d => `${d.x},${d.y}`).join(' ');                       // convert to string containing coords
  }

  normalizeData(data: number[]): number[] {
    const max = Math.max( ...data);
    const min = Math.min( ...data);
    return data.map(d => ((d - min) / (max - min)) );
  }
}
