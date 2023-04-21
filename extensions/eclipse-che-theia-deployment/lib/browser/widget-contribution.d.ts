import { MenuModelRegistry } from '@theia/core';
import { SmartCLIDEDeploymentWidget } from './widget-widget';
import { AbstractViewContribution } from '@theia/core/lib/browser';
import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';
import { MenuNode, SubMenuOptions, CommandRegistry } from '@theia/core/lib/common';
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service';
import { SmartCLIDEBackendService } from '../common/protocol';
import { CommandService } from '@theia/core/lib/common/command';
import { Settings } from './../common/ifaces';
export declare class SmartCLIDEDeploymentWidgetContribution extends AbstractViewContribution<SmartCLIDEDeploymentWidget> {
    /**
     * `AbstractViewContribution` handles the creation and registering
     *  of the widget including commands, menus, and keybindings.
     *
     * We can pass `defaultWidgetOptions` which define widget properties such as
     * its location `area` (`main`, `left`, `right`, `bottom`), `mode`, and `ref`.
     *
     */
    protected readonly stateService: FrontendApplicationStateService;
    protected readonly workspaceService: WorkspaceService;
    protected readonly smartCLIDEBackendService: SmartCLIDEBackendService;
    private readonly messageService;
    private readonly outputChannelManager;
    private readonly monacoQuickInputService;
    protected readonly commandService: CommandService;
    settings: Settings;
    handleTokenInfo: ({ data }: any) => void;
    constructor();
    registerCommands(commands: CommandRegistry): void;
    registerMenus(menus: MenuModelRegistry): void;
    onStart(): void;
    initializeLayout(): void;
}
export declare class PlaceholderMenuNode implements MenuNode {
    readonly id: string;
    readonly label: string;
    protected options?: SubMenuOptions | undefined;
    constructor(id: string, label: string, options?: SubMenuOptions | undefined);
    get icon(): string | undefined;
    get sortString(): string;
}
//# sourceMappingURL=widget-contribution.d.ts.map