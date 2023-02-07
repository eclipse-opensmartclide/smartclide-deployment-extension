import React from 'react';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { SmartCLIDEBackendService } from '../common/protocol';
import { CommandRegistry } from '@theia/core/lib/common';
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service';
import '../../src/browser/app/style/index.css';
import '../../src/browser/app/style/nav/index.css';
import '../../src/browser/app/style/spinner/index.css';
import '../../src/browser/app/style/button/index.css';
import '../../src/browser/app/style/card/index.css';
import '../../src/browser/app/style/table/index.css';
import '../../src/browser/app/style/select/index.css';
export declare class SmartCLIDEDeploymentWidget extends ReactWidget {
    static readonly ID = "command-deployment-widget:widget";
    static readonly LABEL = "Deployment";
    protected readonly workspaceService: WorkspaceService;
    protected readonly smartCLIDEBackendService: SmartCLIDEBackendService;
    protected readonly commandRegistry: CommandRegistry;
    protected init(): Promise<void>;
    render(): React.ReactElement;
}
//# sourceMappingURL=widget-widget.d.ts.map