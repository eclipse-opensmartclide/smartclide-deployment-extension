import React from 'react';
import App from './app';

import '../../src/browser/app/style/index.css';

import {
  injectable,
  inject,
  postConstruct,
} from '@theia/core/shared/inversify';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service';
import { BackendContextProvider } from './app/contexts/BackendContext';
import { SmartCLIDEBackendService } from '../common/protocol';
import { CommandRegistry } from '@theia/core/lib/common';

@injectable()
export class SmartCLIDEDeploymentWidget extends ReactWidget {
  static readonly ID = 'command-deployment-widget:widget';
  static readonly LABEL = 'Deployment';

  @inject(WorkspaceService)
  protected readonly workspaceService: WorkspaceService;
  @inject(SmartCLIDEBackendService)
  protected readonly smartCLIDEBackendService: SmartCLIDEBackendService;
  @inject(CommandRegistry) protected readonly commandRegistry: CommandRegistry;

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
    return (
      <BackendContextProvider>
        <App
          commandRegistry={this.commandRegistry}
          workspaceService={this.workspaceService}
          backendService={this.smartCLIDEBackendService}
        />
      </BackendContextProvider>
    );
  }
}
