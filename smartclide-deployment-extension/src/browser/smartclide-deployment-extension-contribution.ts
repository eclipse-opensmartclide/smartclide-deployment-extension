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
import { InputOptions, LocalStorageService } from "@theia/core/lib/browser/";
import { WorkspaceStorageService } from "@theia/workspace/lib/browser/workspace-storage-service";
import { WorkspaceService } from "@theia/workspace/lib/browser/workspace-service";
import { Git } from "@theia/git/lib/common";
import { GitRepositoryProvider } from "@theia/git/lib/browser/git-repository-provider";
import { MonacoQuickInputService } from "@theia/monaco/lib/browser/monaco-quick-input-service";
import { SmartCLIDEBackendService } from "../common/protocol";

import {
  getRestLocalData,
  getCurrentLocalData,
  ProjectProps,
} from "../common/helpers";

import { fetchBuildStatus } from "../common/fetchMethods";
// import { fetchBuild, fetchBuildStatus } from "../common/fetchMethods";

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
const SmartClideDeploymentMonitoring: Command = {
  id: "smartClideDeploymentMonitoring.command",
  label: "SmartCLIDE Deployment Monitoring",
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
    @inject(SmartCLIDEBackendService)
    protected readonly smartCLIDEBackendService: SmartCLIDEBackendService,
    @inject(MessageService) private readonly messageService: MessageService,
    @inject(OutputChannelManager)
    private readonly outputChannelManager: OutputChannelManager,
    @inject(MonacoQuickInputService)
    private readonly monacoQuickInputService: MonacoQuickInputService,
    @inject(WorkspaceStorageService)
    protected readonly workspaceStorageService: WorkspaceStorageService,
    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService,
    @inject(Git)
    protected readonly git: Git,
    @inject(GitRepositoryProvider)
    protected readonly gitRepositoryProvider: GitRepositoryProvider,
    @inject(LocalStorageService)
    private readonly localStorageService: LocalStorageService
  ) {}

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(SmartClideBuild, {
      execute: async () => {
        //// ---------- CONST ------------ /////
        let settings = {
          username: "",
          project: "",
          token: "",
          branch: "",
          yaml: "",
        };

        const channel = this.outputChannelManager.getChannel("SmartCLIDE");
        channel.clear();

        const currentProject: string | undefined =
          this.workspaceService.workspace?.name?.split(".")[0] || "";

        const currentRepository = this.gitRepositoryProvider.selectedRepository;

        const curentBranch =
          currentRepository &&
          ((await this.git.branch(currentRepository, { type: "current" }))
            ?.name ||
            "");

        if (!currentProject || !currentRepository || !curentBranch) {
          this.messageService.error(
            `It is necessary to have at least one repository open.`
          );
          return;
        }

        const curentPatch =
          this.workspaceService.workspace?.resource.path.toString() || "";

        const prevSettings = await this.smartCLIDEBackendService.fileRead(
          `${curentPatch}/.settings.json`
        );

        if (prevSettings.errno) {
          this.smartCLIDEBackendService.fileWrite(
            `${curentPatch}/.settings.json`,
            JSON.stringify(settings)
          );
          const newSettings = await this.smartCLIDEBackendService.fileRead(
            `${curentPatch}/.settings.json`
          );
          settings = newSettings && { ...JSON.parse(newSettings) };
        } else {
          settings = { ...JSON.parse(prevSettings) };
        }

        const optionsUsername: InputOptions = {
          placeHolder: "username",
          prompt: "Enter Username:",
          value: settings.username,
        };
        const username = !settings?.username
          ? await this.monacoQuickInputService
              .input(optionsUsername)
              .then((value): string => value || "")
          : settings?.username;

        settings.username = username;
        settings.project = currentProject;
        settings.branch = curentBranch;

        if (!curentPatch || curentPatch === "") {
          this.messageService.error(
            `Han ocurrido problemas obteniendo la ruta.`
          );
          return;
        }

        const currentYaml = await this.smartCLIDEBackendService.fileReadYaml(
          `${curentPatch}/.gitlab-ci.yml`
        );

        if (!currentYaml || currentYaml?.errno) {
          const actionsConfirmYaml = ["Create", "Cancel"];
          const templateYaml = {
            image: "docker:latest",
            services: ["docker:dind"],
            stages: ["build"],
            variables: {
              CONTAINER_IMAGE: `${settings.username}/${settings.project}`,
            },
            build: {
              stage: "build",
              script: [
                "docker login",
                `docker build -t ${settings.username}/${settings.project} .`,
                `docker push ${settings.username}/${settings.project}`,
              ],
            },
            deploy: { services: [] },
          };

          await this.messageService
            .info(
              `You need a valid .gitlab-ci.yml file, the root repository.`,
              ...actionsConfirmYaml
            )
            .then(async (action) => {
              if (action === "Create") {
                this.smartCLIDEBackendService.fileWriteYaml(
                  `${curentPatch}/.gitlab-ci.yml`,
                  JSON.parse(JSON.stringify(templateYaml))
                );
              }
              const newCurrentYaml =
                await this.smartCLIDEBackendService.fileReadYaml(
                  `${curentPatch}/.gitlab-ci.yml`
                );
              settings.yaml = JSON.stringify(newCurrentYaml);
            });
        } else {
          settings.yaml = JSON.stringify(currentYaml);
        }

        //// ---------- FLOW ------------ /////

        const optionsToken: InputOptions = {
          placeHolder: "Enter Project Secrect Token",
          prompt: "Enter Project Secrect Token:",
        };
        const actionsConfirmBuild = ["Build now", "Cancel"];

        //// ---------- FLOW ------------ /////
        const newToken = !settings?.token
          ? await this.monacoQuickInputService
              .input(optionsToken)
              .then((value): string => value || "")
          : settings?.token;

        settings.token = newToken;
        //// ---------- PREPARE TO BUILD ------------ /////
        // let interval: any;
        newToken
          ? this.messageService
              .info(
                `Are you sure launch build to PROJECT: ${settings.project}?`,
                ...actionsConfirmBuild
              )
              .then(async (action) => {
                if (action === "Build now") {
                  this.smartCLIDEBackendService.fileWrite(
                    `${curentPatch}/.settings.json`,
                    JSON.stringify(settings)
                  );
                  channel.show();
                  channel.appendLine(`Start build ${settings.project}...`);
                  //   const res: Record<string, any> = await fetchBuild(
                  //     settings.project,
                  //     settings.token
                  //     settings.branch
                  //     settings.yml
                  //   );

                  //   console.log("res", res.state);

                  //   if (res?.state === "pending") {
                  //     this.messageService.warn(res?.message);
                  //     channel.appendLine(
                  //       res?.message,
                  //       OutputChannelSeverity.Info
                  //     );
                  //     setTimeout(() => {
                  //       this.messageService.warn("Job building...");
                  //       channel.appendLine(
                  //         "Job building...",
                  //         OutputChannelSeverity.Warning
                  //       );
                  //     }, 2000);
                  //     interval = setInterval(async () => {
                  //       const resp: Record<string, any> = await fetchBuildStatus(
                  //         settings,
                  //         token
                  //       );
                  //       console.log("resp", resp.state);

                  //       if (resp?.state === "success") {
                  //         clearInterval(interval);
                  //         this.messageService.info("Job ready to deploy");
                  //         channel.appendLine(
                  //           "Job ready to deploy",
                  //           OutputChannelSeverity.Info
                  //         );
                  //       }
                  //       if (resp?.state === "error") {
                  //         console.log("error fecth", resp);
                  //         clearInterval(interval);
                  //         this.messageService.error(resp?.message);
                  //         channel.appendLine(
                  //           resp?.message,
                  //           OutputChannelSeverity.Error
                  //         );
                  //       }
                  //     }, 8000);
                  //   }
                  //   if (res?.state === "error") {
                  //     console.log("error fecth", res);
                  //     this.messageService.error(res?.message);
                  //     channel.appendLine(
                  //       res?.message,
                  //       OutputChannelSeverity.Error
                  //     );
                  //   }
                }
              })
              .catch((err) => this.messageService.error(err.message))
          : this.messageService.error(
              `Error PROJECT and SECRECT TOKEN are required`
            );
      },
    });
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

    registry.registerCommand(SmartClideDeploymentDeploy, {
      execute: async () => {
        await this.messageService.warn("SmartCLIDE3 World!");
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
    registry.registerCommand(SmartClideDeploymentMonitoring, {
      execute: async () => {
        await this.messageService.warn("SmartCLIDE4 World!");
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
