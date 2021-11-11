import {
  Command,
  CommandContribution,
  CommandRegistry,
  MessageService,
} from "@theia/core/lib/common";
import { injectable, inject } from "@theia/core/shared/inversify";
import {
  OutputChannelManager,
  OutputChannelSeverity,
} from "@theia/output/lib/browser/output-channel";
import {
  MonacoQuickInputService,
  // MonacoQuickInputImplementation,
} from "@theia/monaco/lib/browser/monaco-quick-input-service";

import { InputOptions } from "@theia/core/lib/browser/";

//import {  HelloBackendService } from '../common/protocol';

const SmartClideDeploymentBuild: Command = {
  id: "smartClideDeploymentBuild.command",
  label: "SmartCLIDE Deployment Build",
};

const SmartClideDeploymentDeploy: Command = {
  id: "smartClideDeploymentDeploy.command",
  label: "SmartCLIDE Deployment Deploy",
};

const SmartClideDeploymentStatus: Command = {
  id: "smartClideDeploymentStatus.command",
  label: "SmartCLIDE Deployment Status",
};

const BASE_URL = "http://10.200.254.135:3000";

const fetchBuild = (
  username: string,
  project_name: string,
  messageService: any,
  channel: any
) => {
  fetch(`${BASE_URL}/build/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      project_name,
      username,
      image: "string",
      docker_password: "string",
      timestamp: "2021-11-10T10:44:38.158Z",
      tag: "string",
      version: "string",
    }),
  })
    .then((res: any) => {
      res.json().then((res: any) => {
        console.log(JSON.stringify(res));
        messageService.warn(res.message);
        channel.appendLine(res.message, OutputChannelSeverity.Warning);
        switch (res?.state) {
          case "pending":
            // fetchBuild(username, project_name, messageService, channel);
            messageService.warn(res.message);
            channel.appendLine(res.message, OutputChannelSeverity.Warning);
            break;
          case "error":
            channel.appendLine(res.message, OutputChannelSeverity.Error);
            messageService.error(res.message);
            break;
          case "done":
            channel.appendLine(res.message, OutputChannelSeverity.Info);
            messageService.info(res.message);
            break;
        }
        channel.show();
        return res.message;
      });
    })
    .catch((err: any) => {
      console.error("ERROR WHEN BUILD COMMAND - ", err);
      messageService.info("Error");
      channel.appendLine(err.message, OutputChannelSeverity.Error);
      channel.show();
      return err;
    });
};
const deployUrl = (
  user: string,
  serviceName: string,
  port: number,
  replica: number
) => `${BASE_URL}/deploy/${user}/${serviceName}/${port}/${replica}`;
const statusUrl = (user: string, serviceName: string) =>
  `${BASE_URL}/status/${user}/${serviceName}`;

@injectable()
export class SmartclideDeploymentExtensionCommandContribution
  implements CommandContribution
{
  constructor(
    @inject(MessageService) private readonly messageService: MessageService,
    @inject(OutputChannelManager)
    private readonly outputChannelManager: OutputChannelManager,
    @inject(MonacoQuickInputService)
    private readonly monacoQuickInputService: MonacoQuickInputService
  ) {}

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(SmartClideDeploymentBuild, {
      execute: () => {
        const optionsUser: InputOptions = {
          placeHolder: "Enter GitLab username",
        };
        const optionsRepositoryName: InputOptions = {
          placeHolder: "Enter GitLab repository name",
        };

        this.monacoQuickInputService.input(optionsUser).then((value) => {
          const username = value;

          username &&
            this.monacoQuickInputService
              .input(optionsRepositoryName)
              .then((value) => {
                const project_name = value;
                const actions = ["Build now", "Cancel"];
                if (username && project_name) {
                  const channel = this.outputChannelManager.getChannel(
                    "SmartCLIDE Deployment Channel"
                  );
                  this.messageService
                    .info(
                      `username is ${username} and repository name is ${project_name}`,
                      ...actions
                    )
                    .then((action) => {
                      if (action === "Build now") {
                        channel.show();
                        channel.appendLine(`Start build ${project_name}...`);
                        fetchBuild(
                          username,
                          project_name,
                          this.messageService,
                          channel
                        );
                        // setTimeout(() => {
                        //   fetchBuild(
                        //     username,
                        //     project_name,
                        //     this.messageService,
                        //     channel
                        //   );
                        // }, 2000);
                        // setTimeout(() => {
                        //   fetchBuild(
                        //     username,
                        //     project_name,
                        //     this.messageService,
                        //     channel
                        //   );
                        // }, 4000);
                      }
                    });
                } else {
                  this.messageService.error(
                    `Error username and repository name are required`
                  );
                }
              });
        });
      },
    });

    registry.registerCommand(SmartClideDeploymentDeploy, {
      execute: () => {
        setTimeout(() => {
          this.messageService.error("Hello2 World!");
        }, 500);
        const url = deployUrl("pberrocal", "hello-world-node", 7000, 1);
        fetch(url).then((res: any) => {
          res.json().then((res: any) => {
            console.log("DEPLOYCOMMAND COMMAND", res);
          });
        });
      },
    });
    registry.registerCommand(SmartClideDeploymentStatus, {
      execute: () => {
        setTimeout(() => {
          this.messageService.warn("Hello3 World!");
        }, 500);
        const url = statusUrl("pberrocal", "hello-world-node");
        fetch(url).then((res: any) => {
          res.json().then((res: any) => {
            console.log("STATUS COMMAND", res);
          });
        });
      },
    });
  }
}
