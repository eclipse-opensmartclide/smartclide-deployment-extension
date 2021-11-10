import { injectable, inject } from "@theia/core/shared/inversify";
import { MenuModelRegistry } from "@theia/core";
import { SmartclideWidget } from "./smartclide-widget";
import {
  AbstractViewContribution,
  FrontendApplication,
} from "@theia/core/lib/browser";
import { Command, CommandRegistry } from "@theia/core/lib/common/command";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import { FrontendApplicationStateService } from "@theia/core/lib/browser/frontend-application-state";

export const SmartclideCommand: Command = { id: "smartclide:command" };

@injectable()
export class SmartclideContribution extends AbstractViewContribution<SmartclideWidget> {
  /**
   * `AbstractViewContribution` handles the creation and registering
   *  of the widget including commands, menus, and keybindings.
   *
   * We can pass `defaultWidgetOptions` which define widget properties such as
   * its location `area` (`main`, `left`, `right`, `bottom`), `mode`, and `ref`.
   *
   */
  constructor() {
    super({
      widgetId: SmartclideWidget.ID,
      widgetName: SmartclideWidget.LABEL,
      defaultWidgetOptions: { area: "left" },
      toggleCommandId: SmartclideCommand.id,
    });
  }

  @inject(WorkspaceService)
  protected readonly workspaceService: WorkspaceService;
  @inject(FrontendApplicationStateService)
  protected readonly stateService: FrontendApplicationStateService;

  /**
     * Example command registration to open the widget from the menu, and quick-open.
     * For a simpler use case, it is possible to simply call:
     ```ts
        super.registerCommands(commands)
     ```
     *
     * For more flexibility, we can pass `OpenViewArguments` which define 
     * options on how to handle opening the widget:
     * 
     ```ts
        toggle?: boolean
        activate?: boolean;
        reveal?: boolean;
     ```
     *
     * @param commands
     */
  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(SmartclideCommand, {
      execute: () => super.openView({ activate: false, reveal: true }),
    });
  }

  async onStart(app: FrontendApplication): Promise<void> {
    if (!this.workspaceService.opened) {
      app.stateService
        .reachedState("ready")
        .then(() => this.openView({ reveal: true }));
    }
  }

  async initializeLayout(app: FrontendApplication): Promise<void> {
    await this.openView({ activate: true });
  }
  /**
     * Example menu registration to contribute a menu item used to open the widget.
     * Default location when extending the `AbstractViewContribution` is the `View` main-menu item.
     * 
     * We can however define new menu path locations in the following way:
     ```ts
        menus.registerMenuAction(CommonMenus.HELP, {
            commandId: 'id',
            label: 'label'
        });
     ```
     * 
     * @param menus
     */
  registerMenus(menus: MenuModelRegistry): void {
    super.registerMenus(menus);
  }
}
