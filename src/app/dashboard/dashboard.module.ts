import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MaterialModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { DashboardThumbnailComponent } from './dashboard-thumbnail';
import { MeasureService } from './measure.service';
import { MigrationWorkBenchCommonModule } from '../common/mw.common.module';
import { SparklineComponent } from '../graphs/sparkline/sparkline.component';
import { ServicesModule } from '../services/services.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    // MaterialModule,
    MatCardModule,
    MigrationWorkBenchCommonModule,
    ServicesModule,
  ],
  declarations: [
    DashboardComponent,
    DashboardThumbnailComponent,
    SparklineComponent,
    // MatCard,
  ],
  providers: [
    MeasureService,
  ],
})
export class DashboardModule {}
