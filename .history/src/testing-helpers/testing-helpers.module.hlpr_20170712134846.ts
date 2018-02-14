import { NgModule } from '@angular/core';

import { DummyAppComponent } from './router-testing/dummy-app-component-for-router-outlet.hlpr';
import { DummyTargetComponent } from './router-testing/dummy-component-for-router-target.hlpr';
import { setupMockStore, addtoMockStore } from './ngRedux-testing/setup-mock-store.hlpr';
import { setupMockFileService, setupMockFormatService, setupMockPageActions } from './data.service-helpers/data.service-helpers.hlpr';
import { subscribeAndExpectAllValues,
         subscribeAndExpectValue,
         subscribeAndExpectNoDataEmitted } from './subscribeAndExpect/subscribeAndExpect.hlpr';
import { mockFactory } from './mock-factory/mock-factory';

@NgModule({
  imports: [ ],
  declarations: [
    DummyAppComponent,
    DummyTargetComponent,
  ],
  exports: [
    DummyAppComponent,
    DummyTargetComponent,
  ],
  providers: [
  ],
})
export class TestingHelpersModule {}
export { DummyAppComponent };
export { DummyTargetComponent };
export { setupMockStore, addtoMockStore }
export { setupMockFileService, setupMockFormatService, setupMockPageActions }
export { subscribeAndExpectAllValues, subscribeAndExpectValue, subscribeAndExpectNoDataEmitted }
export { mockFactory }
