import * as React from 'react';
import App from './app';

import '../../src/browser/app/style/index.css';

import {
  injectable,
  postConstruct,
  inject,
} from '@theia/core/shared/inversify';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService } from '@theia/core';

@injectable()
export class SmartCLIDEDeploymentWidget extends ReactWidget {
  static readonly ID = 'smartclide-deployment-widget:widget';
  static readonly LABEL = 'SmartCLIDE Deployment';

  @inject(MessageService)
  protected readonly messageService!: MessageService;
  @postConstruct()
  protected async init(): Promise<void> {
    this.id = SmartCLIDEDeploymentWidget.ID;
    this.title.label = SmartCLIDEDeploymentWidget.LABEL;
    this.title.caption = SmartCLIDEDeploymentWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = 'codicon icon-custom'; // example widget icon.
    this.update();
  }

  render(): React.ReactElement {
    return <App />;
  }
}
