import * as React from "react";
import {
  injectable,
  postConstruct,
  inject,
} from "@theia/core/shared/inversify";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { MessageService } from "@theia/core";
import { LocalStorageService } from "@theia/core/lib/browser/";

@injectable()
export class SmartclideDeploymentWidgetWidget extends ReactWidget {
  static readonly ID = "smartclide-deployment-widget:widget";
  static readonly LABEL = "SmartclideDeploymentWidget Widget";
  static state = {
    username: "",
    apiToken: "",
  };

  @inject(MessageService)
  protected readonly messageService!: MessageService;
  @inject(LocalStorageService)
  private readonly localStorageService: LocalStorageService;
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
    return (
      <>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 col-md-6 col-md-offset-3">
              <div className="well">
                <div className="row">
                  <div className="form-group col-xs-12">
                    <label htmlFor="username" className="text-black ">
                      Gitlab Username
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="username"
                      placeholder="Gitlab Username"
                      name="username"
                      onChange={this.updateInput}
                    />
                  </div>
                  <div className="form-group col-xs-12">
                    <label htmlFor="apitoken" className="text-black ">
                      Your Api Token
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="apitoken"
                      placeholder="Your Api Token"
                      name="apitoken"
                      onChange={this.updateInput}
                    />
                  </div>
                  <div className="form-group col-xs-12 text-rigth">
                    <button
                      className="btn btn-primary "
                      title="Display Message"
                      onClick={(_a) =>
                        this.localStorageService.setData(
                          "config",
                          JSON.stringify({
                            ...SmartclideDeploymentWidgetWidget.state,
                          })
                        )
                      }
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  protected updateInput(e: React.ChangeEvent<HTMLInputElement>) {
    const key = e.currentTarget
      .name as keyof typeof SmartclideDeploymentWidgetWidget.state;
    SmartclideDeploymentWidgetWidget.state[key] = e.currentTarget.value;
  }
}
