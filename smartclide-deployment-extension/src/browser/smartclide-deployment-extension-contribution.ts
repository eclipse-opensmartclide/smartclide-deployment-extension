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
  // MonacoQuickPickItem,
  // MonacoQuickInputImplementation,
} from "@theia/monaco/lib/browser/monaco-quick-input-service";

import { InputOptions, LocalStorageService } from "@theia/core/lib/browser/";

import { getDataLocalStorage } from "../common/helpers";
import { fetchBuild } from "../common/fetchMethods";
import { BASE_URL } from "../common/constants";

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
    private readonly monacoQuickInputService: MonacoQuickInputService,
    @inject(LocalStorageService)
    private readonly localStorageService: LocalStorageService
  ) {}

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(SmartClideDeploymentBuild, {
      execute: async () => {
        //// ---------- CONST ------------ /////
        const channel = this.outputChannelManager.getChannel(
          "SmartCLIDE Deployment Channel"
        );
        const optionsUser: InputOptions = {
          prompt: "Enter GitLab username:",
          placeHolder: "Enter GitLab username",
        };
        const optionsToken: InputOptions = {
          placeHolder: "Enter GitLab Api token",
          prompt: "Enter GitLab Api token:",
        };
        const optionsProject: InputOptions = {
          placeHolder: "project-name",
          prompt: "Enter Project name:",
        };
        const actionsConfirmBuild = ["Build now", "Cancel"];

        //// ---------- FLOW ------------ /////
        const username: string = await this.monacoQuickInputService
          .input(optionsUser)
          .then((value): string => value || "");

        const localData: Record<string, any> | undefined = username
          ? await getDataLocalStorage(this.localStorageService, username)
          : undefined;

        const apiToken = !localData?.apiToken
          ? await this.monacoQuickInputService
              .input(optionsToken)
              .then((value): string => value || "")
          : localData?.apiToken;

        const project = await this.monacoQuickInputService
          .input(optionsProject)
          .then((value): string => value || "");

        //// ---------- PREPARE TO BUILD ------------ /////
        username && project
          ? this.messageService
              .info(
                `username is ${username} and repository name is ${project}`,
                ...actionsConfirmBuild
              )
              .then(async (action) => {
                if (action === "Build now") {
                  channel.show();
                  channel.appendLine(`Start build ${project}...`);
                  const build = await fetchBuild(
                    username,
                    project,
                    this.messageService,
                    OutputChannelSeverity,
                    channel
                  );
                  if (build === "done") {
                    const mockData = {
                      username,
                      apiToken,
                      project,
                      uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    };

                    this.localStorageService.setData(
                      username,
                      JSON.stringify(mockData)
                    );
                  }
                }
              })
          : this.messageService.error(
              `Error username and repository name are required`
            );
      },
    });

    registry.registerCommand(SmartClideDeploymentDeploy, {
      execute: () => {
        this.messageService.error("Hello2 World!");

        // const url = deployUrl("pberrocal", "hello-world-node", 7000, 1);
        // fetch(url).then((res: any) => {
        //   res.json().then((res: any) => {
        //     console.log("DEPLOYCOMMAND COMMAND", res);
        //   });
        // });
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
