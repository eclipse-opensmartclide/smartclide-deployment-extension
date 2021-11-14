import "reflect-metadata";
import { MessageService } from "@theia/core";
import { ContainerModule, Container } from "@theia/core/shared/inversify";
import { SmartclideDeploymentWidget } from "./smartclide-deployment-widget-widget";
import { render } from "@testing-library/react";
describe("SmartclideDeploymentWidget", () => {
  let widget: SmartclideDeploymentWidget;

  beforeEach(async () => {
    const module = new ContainerModule((bind) => {
      bind(MessageService).toConstantValue({
        info(message: string): void {
          console.log(message);
        },
      } as MessageService);
      bind(SmartclideDeploymentWidget).toSelf();
    });
    const container = new Container();
    container.load(module);
    widget = container.resolve<SmartclideDeploymentWidget>(
      SmartclideDeploymentWidget
    );
  });

  it("should render react node correctly", async () => {
    const element = render(widget.render());
    expect(element.queryByText("Display Message")).toBeTruthy();
  });
});
