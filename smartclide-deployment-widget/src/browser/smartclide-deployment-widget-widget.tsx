import * as React from 'react';
import App from './app';

import 'bootstrap/dist/css/bootstrap.css';
import '../../src/browser/app/style/index.css';

import {
  injectable,
  postConstruct,
  inject,
} from '@theia/core/shared/inversify';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService } from '@theia/core';

@injectable()
export class SmartclideDeploymentWidget extends ReactWidget {
  static readonly ID = 'smartclide-deployment-widget:widget';
  static readonly LABEL = 'SmartclideDeployment';

  @inject(MessageService)
  protected readonly messageService!: MessageService;
  @postConstruct()
  protected async init(): Promise<void> {
    this.id = SmartclideDeploymentWidget.ID;
    this.title.label = SmartclideDeploymentWidget.LABEL;
    this.title.caption = SmartclideDeploymentWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = 'fa fa-window-maximize'; // example widget icon.
    this.update();
  }

  render(): React.ReactElement {
    return <App />;
  }
}
