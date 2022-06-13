import 'reflect-metadata';
import { MessageService } from '@theia/core';
import { ContainerModule, Container } from '@theia/core/shared/inversify';
import { SmartCLIDEDeploymentWidget } from './widget-widget';
import { render } from '@testing-library/react';
// import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service';

describe('SmartCLIDEDeploymentWidget', () => {
  let widget: SmartCLIDEDeploymentWidget;

  beforeEach(async () => {
    const module = new ContainerModule((bind) => {
      bind(MessageService).toConstantValue({
        info(message: string): void {
          console.log(message);
        },
      } as MessageService);
      bind(SmartCLIDEDeploymentWidget).toSelf();
    });
    const container = new Container();
    container.load(module);
    widget = container.resolve<SmartCLIDEDeploymentWidget>(
      SmartCLIDEDeploymentWidget
    );
  });

  it('should render react node correctly', async () => {
    const element = render(widget.render());
    console.log('element', element);
    expect(element.queryByText('Display Message')).toBeTruthy();
  });

  // it("should inject 'MessageService'", () => {
  //   const spy = jest.spyOn(widget as any, 'displayMessage');
  //   widget['displayMessage']();
  //   expect(spy).toBeCalled();
  // });
});
