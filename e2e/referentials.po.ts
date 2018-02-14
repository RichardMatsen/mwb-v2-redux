import { element, by, ElementFinder } from 'protractor';
import { PageCommon } from './page-common.po';

export class ReferentialsPage extends PageCommon {

  url = '/referentials';
  selector = 'mwb-referentials';

  diagramButton(): ElementFinder {
    return element(by.css('app-referentials-diagram'));
  }

}
