import { injectable, inject } from "@theia/core/shared/inversify";
import {
  Command,
  CommandContribution,
  CommandRegistry,
  MessageService,
} from "@theia/core/lib/common";
import {
  OutputChannelManager,
  OutputChannelSeverity,
} from "@theia/output/lib/browser/output-channel";
import { WorkspaceService } from "@theia/workspace/lib/browser/workspace-service";
import { MonacoQuickInputService } from "@theia/monaco/lib/browser/monaco-quick-input-service";
import { InputOptions, LocalStorageService } from "@theia/core/lib/browser/";

import { getDataLocalStorage } from "../common/helpers";
import { fetchBuild, fetchBuildStatus } from "../common/fetchMethods";

const SmartClideDeploymentBuild: Command = {
  id: "smartClideDeploymentBuild.command",
  label: "SmartCLIDE Build",
};

const SmartClideBuildStatus: Command = {
  id: "smartClideBuildStatus.command",
  label: "SmartCLIDE Build Status",
};

const SmartClideDeploymentDeploy: Command = {
  id: "smartClideDeploymentDeploy.command",
  label: "SmartCLIDE Deploy",
};
const SmartClideDeploymentStatus: Command = {
  id: "smartClideDeploymentStatus.command",
  label: "SmartCLIDE Deployment Status",
};

const SmartClideDeploymentClearSettings: Command = {
  id: "smartClideDeploymentClearSettings.command",
  label: "SmartCLIDE Clear Settings",
};

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
    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService,
    @inject(LocalStorageService)
    private readonly localStorageService: LocalStorageService
  ) {}

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(SmartClideBuildStatus, {
      execute: async () => {
        const channel = this.outputChannelManager.getChannel("SmartCLIDE");
        channel.clear();

        const currentProject: string | undefined =
          this.workspaceService.workspace?.name?.split(".")[0];

        channel.show();
        currentProject &&
          channel.appendLine(`Checking build: ${currentProject}`);

        const localData: Record<string, any> | undefined =
          await getDataLocalStorage(this.localStorageService, "config");

        const optionsProject: InputOptions = {
          placeHolder: "project-name",
          prompt: "Enter Project name:",
          value: currentProject || localData?.project,
        };

        const actionsConfirmBuild = ["Check now", "Cancel"];

        const project: string = !currentProject
          ? await this.monacoQuickInputService
              .input(optionsProject)
              .then((value): string => value || "")
          : currentProject;

        console.log("project", project);

        const apiToken = localData?.apiToken;

        //// ---------- CHECK STATUS ------------ /////
        project && apiToken
          ? this.messageService
              .info(`PROJECT: ${project}`, ...actionsConfirmBuild)
              .then(async (action) => {
                if (action === "Check now") {
                  channel.show();
                  channel.appendLine(`Checking build state ${project}...`);

                  const res: Record<string, any> = await fetchBuildStatus(
                    project,
                    apiToken
                  );
                  console.log("res", res);

                  channel.appendLine(
                    `Status: ${res?.state}...`,
                    OutputChannelSeverity.Warning
                  );
                }
              })
              .catch((err) => this.messageService.error(err.message))
          : this.messageService.error(`Error PROJECT are required`);
      },
    });
    registry.registerCommand(SmartClideDeploymentBuild, {
      execute: async () => {
        const channel = this.outputChannelManager.getChannel("SmartCLIDE");
        channel.clear();
        //// ---------- CONST ------------ /////

        const currentProject: string | undefined =
          this.workspaceService.workspace?.name?.split(".")[0];

        const localData: Record<string, any> | undefined =
          await getDataLocalStorage(this.localStorageService, "config");

        const optionsUser: InputOptions = {
          prompt: "Enter GitLab username:",
          placeHolder: "Enter GitLab username",
          value: localData?.username,
        };
        const optionsProject: InputOptions = {
          placeHolder: "project-name",
          prompt: "Enter Project name:",
          value: currentProject || localData?.project,
        };
        const optionsToken: InputOptions = {
          placeHolder: "Enter GitLab Project Secrect Token",
          prompt: "Enter GitLab Project Secrect Token:",
        };
        const actionsConfirmBuild = ["Build now", "Cancel"];

        //// ---------- FLOW ------------ /////
        const username: string = await this.monacoQuickInputService
          .input(optionsUser)
          .then((value): string => value || "");

        const project = await this.monacoQuickInputService
          .input(optionsProject)
          .then((value): string => value || "");

        const apiToken =
          !localData?.apiToken || localData?.username !== username
            ? await this.monacoQuickInputService
                .input(optionsToken)
                .then((value): string => value || "")
            : localData?.apiToken;

        this.localStorageService.setData(
          "config",
          JSON.stringify({
            ...localData,
            username,
            apiToken,
          })
        );

        const currentLocalData: Record<string, any> | undefined =
          await getDataLocalStorage(this.localStorageService, "config");

        currentLocalData &&
          (await this.localStorageService.setData(
            "config",
            JSON.stringify({
              ...currentLocalData,
              project,
            })
          ));

        //// ---------- PREPARE TO BUILD ------------ /////
        let interval: any;
        username && project
          ? this.messageService
              .info(
                `USERNAME: ${username}, PROJECT: ${project}`,
                ...actionsConfirmBuild
              )
              .then(async (action) => {
                if (action === "Build now") {
                  channel.show();
                  channel.appendLine(`Start build ${project}...`);
                  const res: Record<string, any> = await fetchBuild(
                    project,
                    apiToken,
                    username
                  );

                  console.log("res", res.state);

                  if (res?.state === "pending") {
                    this.messageService.warn(res?.message);
                    channel.appendLine(
                      res?.message,
                      OutputChannelSeverity.Info
                    );
                    setTimeout(() => {
                      this.messageService.warn("Job building...");
                      channel.appendLine(
                        "Job building...",
                        OutputChannelSeverity.Warning
                      );
                    }, 2000);
                    interval = setInterval(async () => {
                      const resp: Record<string, any> = await fetchBuildStatus(
                        project,
                        apiToken
                      );
                      console.log("resp", resp.state);

                      if (resp?.state === "success") {
                        clearInterval(interval);
                        this.messageService.info("Job ready to deploy");
                        channel.appendLine(
                          "Job ready to deploy",
                          OutputChannelSeverity.Info
                        );
                      }
                      if (resp?.state === "error") {
                        console.log("error fecth", resp);
                        this.messageService.error(resp?.message);
                        channel.appendLine(
                          resp?.message,
                          OutputChannelSeverity.Error
                        );
                        clearInterval(interval);
                      }
                    }, 8000);
                  }
                  if (res?.state === "error") {
                    console.log("error fecth", res);
                    this.messageService.error(res?.message);
                    channel.appendLine(
                      res?.message,
                      OutputChannelSeverity.Error
                    );
                  }
                }
              })
              .catch((err) => this.messageService.error(err.message))
          : this.messageService.error(
              `Error USERNAME and PROJECT are required`
            );
      },
    });

    registry.registerCommand(SmartClideDeploymentDeploy, {
      execute: async () => {
        await this.messageService.warn("Hello3 World!");
      },
    });
    registry.registerCommand(SmartClideDeploymentStatus, {
      execute: async () => {
        await this.messageService.warn("Hello4 World!");
        // const items: QuickPickItem[] = [
        //   { type: "item", label: "Deploy: 1" },
        //   { type: "item", label: "Deploy: 2" },
        //   { type: "separator", label: "string2" },
        //   { type: "item", label: "Deploy: 3" },
        //   { type: "item", label: "Deploy: 4" },
        //   { type: "separator", label: "string2" },
        // ];
        // const quick = await this.monacoQuickInputService
        //   .showQuickPick(items)
        //   .then((value): QuickPickItem => value);

        // console.log("quick", quick);

        // this.messageService.info("quick");
      },
    });

    registry.registerCommand(SmartClideDeploymentClearSettings, {
      execute: () => {
        window.localStorage.clear();
        this.messageService.error("All settings are clreared");
      },
    });
  }
}
