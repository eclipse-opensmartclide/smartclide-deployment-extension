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

import {
  getRestLocalData,
  getCurrentLocalData,
  ProjectProps,
} from "../common/helpers";
import { fetchBuild, fetchBuildStatus } from "../common/fetchMethods";

const SmartClideBuild: Command = {
  id: "smartClideBuild.command",
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
        //// ---------- CONST ------------ /////
        const channel = this.outputChannelManager.getChannel("SmartCLIDE");
        channel.clear();

        const currentProject: string | undefined =
          this.workspaceService.workspace?.name?.split(".")[0] || "empty";

        const restLocalData: Record<string, any>[] | [null] =
          await getRestLocalData(this.localStorageService, currentProject).then(
            (res: any) => res
          );

        console.log("restLocalData", restLocalData);

        const currentLocalData: ProjectProps | null = await getCurrentLocalData(
          this.localStorageService,
          currentProject
        ).then((res: any) => res);

        console.log("currentLocalData", currentLocalData);

        channel.show();

        const token = currentLocalData?.token;
        if (!token) {
          channel.appendLine(
            `Error, Secrect Token no detected`,
            OutputChannelSeverity.Error
          );
          this.messageService.error(`Error, Secrect Token no detected`);
          return;
        }
        currentProject &&
          channel.appendLine(`Checking build: ${currentProject}`);

        const optionsProject: InputOptions = {
          placeHolder: "project-name",
          prompt: "Enter Project name:",
          value: currentProject || currentLocalData?.project,
        };

        const actionsConfirmBuild = ["Check now", "Cancel"];

        const project: string = !currentProject
          ? await this.monacoQuickInputService
              .input(optionsProject)
              .then((value): string => value || "")
          : currentProject;

        //// ---------- CHECK STATUS ------------ /////
        project && token
          ? this.messageService
              .info(`PROJECT: ${project}`, ...actionsConfirmBuild)
              .then(async (action) => {
                if (action === "Check now") {
                  channel.show();
                  channel.appendLine(`Checking state ${project}...`);

                  const res: Record<string, any> = await fetchBuildStatus(
                    project,
                    token
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
    registry.registerCommand(SmartClideBuild, {
      execute: async () => {
        //// ---------- CONST ------------ /////
        const channel = this.outputChannelManager.getChannel("SmartCLIDE");
        channel.clear();
        console.log(this.workspaceService.workspace?.name);

        const currentProject: string | undefined =
          this.workspaceService.workspace?.name?.split(".")[0] || "empty";

        const restLocalData: Record<string, any>[] | [null] =
          await getRestLocalData(this.localStorageService, currentProject).then(
            (res: any) => res
          );

        console.log("restLocalData", restLocalData);

        const currentLocalData: ProjectProps | null = await getCurrentLocalData(
          this.localStorageService,
          currentProject
        ).then((res: any) => res);

        console.log("currentLocalData", currentLocalData);

        const optionsProject: InputOptions = {
          placeHolder: "project-name",
          prompt: "Enter Project name:",
          value: currentProject || currentLocalData?.project,
        };
        const optionsToken: InputOptions = {
          placeHolder: "Enter Project Secrect Token",
          prompt: "Enter Project Secrect Token:",
        };
        const actionsConfirmBuild = ["Build now", "Cancel"];

        //// ---------- FLOW ------------ /////
        const project = await this.monacoQuickInputService
          .input(optionsProject)
          .then((value): string => value || "");

        const token = !currentLocalData?.token
          ? await this.monacoQuickInputService
              .input(optionsToken)
              .then((value): string => value || "")
          : currentLocalData?.token;

        this.localStorageService.setData(
          currentProject,
          JSON.stringify([...restLocalData, { project, token }])
        );

        //// ---------- PREPARE TO BUILD ------------ /////
        let interval: any;
        token && project
          ? this.messageService
              .info(
                `Are you sure launch build to PROJECT: ${project}?`,
                ...actionsConfirmBuild
              )
              .then(async (action) => {
                if (action === "Build now") {
                  channel.show();
                  channel.appendLine(`Start build ${project}...`);
                  const res: Record<string, any> = await fetchBuild(
                    project,
                    token
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
                        token
                      );
                      console.log("resp", resp.state);

                      if (resp?.state === "success") {
                        clearInterval(interval);
                        this.messageService.info("Job ready to deploy");
                        channel.appendLine(
                          "Job ready to deploy",
                          OutputChannelSeverity.Info
                        );
                        this.localStorageService.setData(
                          currentProject,
                          JSON.stringify([
                            ...restLocalData,
                            {
                              project,
                              token,
                              deploy: resp?.name || "mockName",
                            },
                          ])
                        );
                      }
                      if (resp?.state === "error") {
                        console.log("error fecth", resp);
                        clearInterval(interval);
                        this.messageService.error(resp?.message);
                        channel.appendLine(
                          resp?.message,
                          OutputChannelSeverity.Error
                        );
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
              `Error PROJECT and SECRECT TOKEN are required`
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
        this.messageService.error("All settings are cleared");
        setTimeout(() => {
          this.messageService.error("Reloading");
        }, 1000);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
    });
  }
}
