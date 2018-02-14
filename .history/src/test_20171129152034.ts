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

/* Services */
// let context = require.context('./', true, /data.service.base\.spec\.ts/);
// let context = require.context('./', true, /clinics-data.service\.spec\.ts/);
// let context = require.context('./', true, /referentials-data.service\.spec\.ts/);
// let context = require.context('./', true, /validations-data.service\.spec\.ts/);
// let context = require.context('./', true, /measure.service\.spec\.ts/);
// let context = require.context('./', true, /file.service\.spec\.ts/);
// let context = require.context('./', true, /name-parsing.service\.spec\.ts/);
// let context = require.context('./', true, /format.service\.spec\.ts/);
// let context = require.context('./', true, /validations-format.service\.spec\.ts/);
// let context = require.context('./', true, /clinics-format.service\.spec\.ts/);
// let context = require.context('./', true, /referentials-format.service\.spec\.ts/);
// let context = require.context('./', true, /auth.service.spec\.ts/);
// let context = require.context('./', true, /list-formatter-observable-extensions\.spec\.ts/);

/* Redux store */
// let context = require.context('./', true, /measure.actions\.spec\.ts/);
// let context = require.context('./', true, /config.actions\.spec\.ts/);
// let context = require.context('./', true, /page.actions\.spec\.ts/);
// let context = require.context('./', true, /user.actions\.spec\.ts/);

// let context = require.context('./', true, /page.reducer\.spec\.ts/);
// let context = require.context('./', true, /page.reducer.verbose\.spec\.ts/);
// let context = require.context('./', true, /root.reducer\.spec\.ts/);
// let context = require.context('./', true, /search.reducer.spec.ts/);
// let context = require.context('./', true, /config.reducer.spec.ts/);
// let context = require.context('./', true, /user.reducer.spec.ts/);
// let context = require.context('./', true, /ui.reducer.spec.ts/);
// let context = require.context('./', true, /measure.reducer.spec.ts/);

// let context = require.context('./', true, /deep-clone.spec.ts/);
// let context = require.context('./', true, /freeze-state.spec.ts/);
// let context = require.context('./', true, /http.middleware.spec.ts/);
// let context = require.context('./', true, /ui.middleware.spec.ts/);
// let context = require.context('./', true, /selector-helpers\.spec\.ts/);
// let context = require.context('./', true, /selector-helpers.observable\.spec\.ts/);

/* Components */
// let context = require.context('./', true, /app.component\.spec\.ts/);
// let context = require.context('./', true, /dashboard.component\.spec\.ts/);
// let context = require.context('./', true, /search.component\.spec\.ts/);

/* Common */
// let context = require.context('./', true, /object-shape-comparer\.spec\.ts/);
// let context = require.context('./', true, /marble-testing\.spec\.ts/);
// let context = require.context('./', true, /format-AMPM\.spec\.ts/);
// let context = require.context('./', true, /subscribeAndExpect.hlpr.spec.ts/);
// let context = require.context('./', true, /sparkline.component.spec.ts/);
// let context = require.context('./', true, /logger.spec.ts/);




// And load the modules.
context.keys().map(context);
// Finally, start Karma to run the tests.
__karma__.start();
