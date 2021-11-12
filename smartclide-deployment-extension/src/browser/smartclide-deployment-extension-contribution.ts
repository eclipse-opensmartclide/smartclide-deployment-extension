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
        const channel =
          this.outputChannelManager.getChannel("SmartCLIDE Channel");
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

        const project: string = await this.monacoQuickInputService
          .input(optionsProject)
          .then((value): string => value || "");

        console.log(project);

        const apiToken = localData?.apiToken;

        //// ---------- CHECK STATUS ------------ /////
        project && apiToken
          ? this.messageService
              .info(`PROJECT: ${project}`, ...actionsConfirmBuild)
              .then(async (action) => {
                if (action === "Check now") {
                  channel.show();
                  channel.appendLine(`Checking build status ${project}...`);

                  const res: Record<string, any> = await fetchBuildStatus(
                    project,
                    apiToken
                  );

                  channel.appendLine(
                    `Status: ${res?.message}...`,
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
        const channel =
          this.outputChannelManager.getChannel("SmartCLIDE Channel");
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
        const optionsToken: InputOptions = {
          placeHolder: "Enter GitLab Api token",
          prompt: "Enter GitLab Api token:",
        };
        const optionsProject: InputOptions = {
          placeHolder: "project-name",
          prompt: "Enter Project name:",
          value: currentProject || localData?.project,
        };
        const actionsConfirmBuild = ["Build now", "Cancel"];

        //// ---------- FLOW ------------ /////
        const username: string = await this.monacoQuickInputService
          .input(optionsUser)
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

        const project = await this.monacoQuickInputService
          .input(optionsProject)
          .then((value): string => value || "");

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
                  console.log("pending fecth", res);

                  let refetch: any;

                  if (res?.status === "pending") {
                    this.messageService.warn(res?.message);
                    channel.appendLine(
                      res?.message,
                      OutputChannelSeverity.Warning
                    );
                    refetch = setInterval(async () => {
                      console.log("refecth");
                      await fetchBuild(project, apiToken).then(
                        (res: Record<string, any>) => {
                          this.messageService.warn(res?.message);
                          channel.appendLine(
                            res?.message,
                            OutputChannelSeverity.Warning
                          );
                        }
                      );
                    }, 5000);
                  }
                  if (res?.status === "error") {
                    clearInterval(refetch);
                    console.log("error fecth", res);
                    this.messageService.error(res?.message);
                    channel.appendLine(
                      res?.message,
                      OutputChannelSeverity.Error
                    );
                  }
                  if (res?.status === "done") {
                    console.log("done fecth", res);
                    clearInterval(refetch);
                    const buildMock = {
                      uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    };
                    const currentLocalData: Record<string, any> | undefined =
                      await getDataLocalStorage(
                        this.localStorageService,
                        "config"
                      );

                    currentLocalData &&
                      (await this.localStorageService.setData(
                        "config",
                        JSON.stringify({
                          ...currentLocalData,
                          buildMock,
                        })
                      ));
                    this.messageService.info(res?.message);
                    channel.appendLine(
                      res?.message,
                      OutputChannelSeverity.Info
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
