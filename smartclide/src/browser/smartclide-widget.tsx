import * as React from "react";
import App from "./app";
import {
  injectable,
  postConstruct,
  inject,
} from "@theia/core/shared/inversify";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { MessageService } from "@theia/core";

@injectable()
export class SmartclideDeploymentWidgetWidget extends ReactWidget {
  static readonly ID = "smartclide-deployment-widget:widget";
  static readonly LABEL = "SmartclideDeploymentWidget Widget";

  @inject(MessageService)
  protected readonly messageService!: MessageService;
  @postConstruct()
  protected async init(): Promise<void> {
    this.id = SmartclideDeploymentWidgetWidget.ID;
    this.title.label = SmartclideDeploymentWidgetWidget.LABEL;
    this.title.caption = SmartclideDeploymentWidgetWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = "fa fa-window-maximize"; // example widget icon.
    this.update();
  }

  render(): React.ReactElement {
    return <App />;
  }
}
