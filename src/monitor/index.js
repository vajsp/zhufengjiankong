import { injectJsError } from './lib/jsError';
import { injectXHR } from './lib/jsError';
import { blankScreen } from './lib/blackScreen';
import { Timing } from './lib/timing';
injectJsError();
injectXHR();
blankScreen();
Timing();
