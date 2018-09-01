// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare const __karma__: any;
declare const require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function () {};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// const context = require.context('./', true, /\data.service.spec\.ts$/);

/* Services */
// context.keys = () => [
//   // './app/services/data-service/data.service.base.spec.ts',
//   // './app/linqpad-review-pages/clinics/services/clinics-data.service.spec.ts',
//   // './app/linqpad-review-pages/referentials/services/referentials-data.service.spec.ts',
//   // './app/linqpad-review-pages/validations/services/validations-data.service.spec.ts',
//   // './app/dashboard/measure.service.spec.ts',
//   // './app/services/file-service/file.service.spec.ts',
//   // './app/services/data-service/name-parsing.service.spec.ts',
//   // './app/services/data-service/format.service.spec.ts',
//   // './app/linqpad-review-pages/validations/services/validations-format.service.spec.ts',
//   // './app/linqpad-review-pages/clinics/services/clinics-format.service.spec.ts',
//   // './app/linqpad-review-pages/referentials/services/referentials-format.service.spec.ts',
//   // './app/user/auth.service.spec.ts',
//   // './app/nav/routing-history/routing-history.service.spec.ts',
// ];

/* Redux store */
// context.keys = () => [
//   './app/dashboard/measure.actions.spec.ts',
//   './app/services/config/config.actions.spec.ts',
//   './app/linqpad-review-pages/common/page.actions.spec.ts',
//   './app/user/user.actions.spec.ts',
//   './app/store/reducers/root.reducer.spec.ts',
//   './app/store/reducers/page.reducer.spec.ts',
//   './app/store/reducers/page.reducer.verbose.spec.ts',
//   './app/store/reducers/search.reducer.spec.ts',
//   './app/store/reducers/config.reducer.spec.ts',
//   './app/store/reducers/user.reducer.spec.ts',
//   './app/store/reducers/ui.reducer.spec.ts',
//   './app/store/reducers/measure.reducer.spec.ts',
//   './app/store/util/deep-clone.spec.ts',
//   './app/store/middleWare/freeze-state.spec.ts',
//   './app/store/middleWare/http.middleware.spec.ts',
//   './app/store/middleWare/ui.middleware.spec.ts',
//   './app/store/selector-helpers/selector-helpers.spec.ts',
//   './app/store/selector-helpers/selector-helpers.observable.spec.ts',
//   './app/store/computed/computed-properties.spec.ts',
// ];

/* Components */
// context.keys = () => [
//   './app/app.component.spec.ts',
//   './app/nav/navbar.component.spec.ts',
//   // './app/nav/four-0-four/404.component.spec.ts',
//   './app/dashboard/dashboard.component.spec.ts',
//   './app/linqpad-review-pages/common/search/search.component.spec.ts',
//   // './app/login/login.component.spec.ts',
//   './app/tasks/kanban/kanban.component.spec.ts',
//   './app/tasks/kanban-list/kanban-list.component.spec.ts',
//   './app/tasks/kanban-card/kanban-card.component.spec.ts',
//   './app/common/list-limiter/list-limiter.component.spec.ts',
//   './app/graphs/sparkline/sparkline.component.spec.ts',
// ];

/* Common */
// context.keys = () => [
//   './app/common/object-shape-comparer/object-shape-comparer.spec.ts',
//   './app/common/format-AMPM/format-AMPM.spec.ts',
//   './testing-helpers/marble-testing/marble-testing.spec.ts',
//   './testing-helpers/subscribeAndExpect/subscribeAndExpect.hlpr.spec.ts',
//   './app/common/logger/logger.spec.ts',
// ];

// And load the modules.
context.keys().map(context);
// Finally, start Karma to run the tests.
__karma__.start();
