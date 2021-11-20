import { injectable, inject } from '@theia/core/shared/inversify';
import {
  Command,
  CommandContribution,
  CommandRegistry,
  MessageService,
} from '@theia/core/lib/common';

import {
  OutputChannelManager,
  OutputChannelSeverity,
} from '@theia/output/lib/browser/output-channel';
import { InputOptions } from '@theia/core/lib/browser/';
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service';
import { Git } from '@theia/git/lib/common';
import { GitRepositoryProvider } from '@theia/git/lib/browser/git-repository-provider';
import { MonacoQuickInputService } from '@theia/monaco/lib/browser/monaco-quick-input-service';
import { SmartCLIDEBackendService } from '../common/protocol';

import {
  postBuild,
  getBuildStatus,
  postDeploy,
  getDeployStatus,
} from '../common/fetchMethods';

const SmartClideBuild: Command = {
  id: 'smartClideBuild.command',
  label: 'SmartCLIDE Build',
};

const SmartClideBuildStatus: Command = {
  id: 'smartClideBuildStatus.command',
  label: 'SmartCLIDE Build Status',
};

const SmartClideDeploymentDeploy: Command = {
  id: 'smartClideDeploymentDeploy.command',
  label: 'SmartCLIDE Deploy',
};
const SmartClideDeploymentMonitoring: Command = {
  id: 'smartClideDeploymentMonitoring.command',
  label: 'SmartCLIDE Deployment Monitoring',
};

interface Settings {
  username: string;
  project: string;
  token: string;
  branch: string;
  yml: string;
  image: string;
  port: string;
  hostname: string;
  replicas: string;
}

@injectable()
export class SmartCLIDEDeploymentExtensionCommandContribution
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
    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService,
    @inject(Git)
    protected readonly git: Git,
    @inject(GitRepositoryProvider)
    protected readonly gitRepositoryProvider: GitRepositoryProvider
  ) {}

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(SmartClideBuild, {
      execute: async () => {
        //// ---------- CONST ------------ /////
        let settings: Settings = {
          username: '',
          project: '',
          token: '',
          branch: '',
          yml: '',
          image: '',
          port: '',
          hostname: '',
          replicas: '1',
        };

        const channel = this.outputChannelManager.getChannel('SmartCLIDE');
        channel.clear();

        const currentProject: string | undefined =
          this.workspaceService.workspace?.name?.split('.')[0] || '';

        const currentRepository = this.gitRepositoryProvider.selectedRepository;

        const curentBranch =
          currentRepository &&
          ((await this.git.branch(currentRepository, { type: 'current' }))
            ?.name ||
            '');

        if (!currentProject || !currentRepository || !curentBranch) {
          this.messageService.error(
            `It is necessary to have at least one repository open.`
          );
          return;
        }

        const currentPath =
          this.workspaceService.workspace?.resource.path.toString() || '';

        const prevSettings = await this.smartCLIDEBackendService.fileRead(
          `${currentPath}/.settings.json`
        );

        if (prevSettings.errno) {
          this.smartCLIDEBackendService.fileWrite(
            `${currentPath}/.settings.json`,
            JSON.stringify(settings)
          );
          const newSettings = await this.smartCLIDEBackendService.fileRead(
            `${currentPath}/.settings.json`
          );
          settings = newSettings && { ...JSON.parse(newSettings) };
        } else {
          settings = { ...JSON.parse(prevSettings) };
        }

        const optionsUsername: InputOptions = {
          placeHolder: 'username',
          prompt: 'Enter Username:',
          value: settings.username,
        };
        const username = !settings?.username
          ? await this.monacoQuickInputService
              .input(optionsUsername)
              .then((value): string => value || '')
          : settings?.username;

        settings.username = username;
        settings.project = currentProject;
        settings.branch = curentBranch;

        if (!currentPath || currentPath === '') {
          this.messageService.error(
            `There have been problems getting the route.`
          );
          return;
        }

        const currentYaml = await this.smartCLIDEBackendService.fileReadYaml(
          `${currentPath}/.gitlab-ci.yml`
        );

        if (!currentYaml || currentYaml?.errno) {
          const actionsConfirmYaml = ['Create', 'Cancel'];
          const templateYaml = {
            image: 'docker:latest',
            services: ['docker:dind'],
            stages: ['build'],
            variables: {
              CONTAINER_IMAGE: `${settings.username}/${settings.project}`,
            },
            build: {
              stage: 'build',
              script: [
                'docker login',
                `docker build -t ${settings.username}/${settings.project} .`,
                `docker push ${settings.username}/${settings.project}`,
              ],
            },
            deploy: { services: '' },
          };

          await this.messageService
            .info(
              `You need a valid .gitlab-ci.yml file, the root repository.`,
              ...actionsConfirmYaml
            )
            .then(async (action) => {
              if (action === 'Create') {
                this.smartCLIDEBackendService.fileWriteYaml(
                  `${currentPath}/.gitlab-ci.yml`,
                  JSON.parse(JSON.stringify(templateYaml))
                );
              }
              const newCurrentYaml =
                await this.smartCLIDEBackendService.fileReadYaml(
                  `${currentPath}/.gitlab-ci.yml`
                );
              settings.yml = JSON.stringify(newCurrentYaml);
            });
        } else {
          settings.yml = JSON.stringify(currentYaml);
        }

        //// ---------- FLOW ------------ /////

        const optionsToken: InputOptions = {
          placeHolder: 'Enter Project Secrect Token',
          prompt: 'Enter Project Secrect Token:',
        };

        //// ---------- FLOW ------------ /////
        const newToken = !settings?.token
          ? await this.monacoQuickInputService
              .input(optionsToken)
              .then((value): string => value || '')
          : settings?.token;

        settings.token = newToken;

        //// ---------- MOCK PREPARE TO BUILD ------------ /////
        settings.image = `${username}/${currentProject}`;
        this.smartCLIDEBackendService.fileWrite(
          `${currentPath}/.settings.json`,
          JSON.stringify(settings)
        );
        channel.show();
        // UNCOMMENT TO MOCK IF API DOWNS
        // channel.appendLine(`Mock Start build ${settings.project}...`);
        // console.log("postBuild", postBuild);

        //// ---------- PROCESS PREPARE BUILD ------------ /////
        const actionsConfirmBuild = ['Build now', 'Cancel'];
        let interval: any;
        newToken
          ? this.messageService
              .info(
                `Are you sure launch build to PROJECT: ${settings.project}?`,
                ...actionsConfirmBuild
              )
              .then(async (action) => {
                if (action === 'Build now') {
                  this.smartCLIDEBackendService.fileWrite(
                    `${currentPath}/.settings.json`,
                    JSON.stringify(settings)
                  );
                  channel.show();
                  channel.appendLine(`Start build ${settings.project}...`);
                  const res: Record<string, any> = await postBuild(
                    settings.project,
                    settings.token,
                    settings.branch,
                    settings.yml
                  );

                  if (res?.status === 'pending') {
                    this.messageService.warn(res?.message);
                    channel.appendLine(
                      res?.message,
                      OutputChannelSeverity.Info
                    );
                    setTimeout(() => {
                      this.messageService.warn('Job building...');
                      channel.appendLine(
                        'Job building...',
                        OutputChannelSeverity.Warning
                      );
                    }, 2000);
                    interval = setInterval(async () => {
                      const resp: Record<string, any> = await getBuildStatus(
                        settings.project,
                        settings.token
                      );
                      console.log('resp', resp.status);

                      if (resp?.status === 'success') {
                        if (resp.image) {
                          settings.image = res.image;
                          this.smartCLIDEBackendService.fileWrite(
                            `${currentPath}/.settings.json`,
                            JSON.stringify(settings)
                          );
                        }
                        clearInterval(interval);
                        this.messageService.info('Job ready to deploy');
                        channel.appendLine(
                          'Job ready to deploy',
                          OutputChannelSeverity.Info
                        );
                      }
                      if (resp?.status === 'error') {
                        console.log('error fecth', resp);
                        clearInterval(interval);
                        this.messageService.error(resp?.message);
                        channel.appendLine(
                          resp?.message,
                          OutputChannelSeverity.Error
                        );
                      }
                    }, 8000);
                  }
                  if (res?.status === 'error') {
                    console.log('error fecth', res);
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
    registry.registerCommand(SmartClideBuildStatus, {
      execute: async () => {
        //// ---------- CONST ------------ /////
        let settings: Settings = {
          username: '',
          project: '',
          token: '',
          branch: '',
          yml: '',
          image: '',
          port: '',
          hostname: '',
          replicas: '1',
        };

        const channel = this.outputChannelManager.getChannel('SmartCLIDE');
        channel.clear();

        const currentProject: string | undefined =
          this.workspaceService.workspace?.name?.split('.')[0] || '';

        if (!currentProject) {
          this.messageService.error(
            `It is necessary to have at least one repository open.`
          );
          return;
        }

        const currentPath =
          this.workspaceService.workspace?.resource.path.toString() || '';

        const prevSettings = await this.smartCLIDEBackendService.fileRead(
          `${currentPath}/.settings.json`
        );

        if (prevSettings.errno) {
          this.smartCLIDEBackendService.fileWrite(
            `${currentPath}/.settings.json`,
            JSON.stringify(settings)
          );
          const newSettings = await this.smartCLIDEBackendService.fileRead(
            `${currentPath}/.settings.json`
          );
          settings = newSettings && { ...JSON.parse(newSettings) };
        } else {
          settings = { ...JSON.parse(prevSettings) };
        }

        settings.project = currentProject;

        if (!currentPath || currentPath === '') {
          this.messageService.error(
            `There have been problems getting the route.`
          );
          return;
        }

        //// ---------- FLOW ------------ /////

        const optionsToken: InputOptions = {
          placeHolder: 'Enter Project Secrect Token',
          prompt: 'Enter Project Secrect Token:',
        };
        const actionsConfirmBuild = ['Check now', 'Cancel'];

        //// ---------- FLOW ------------ /////
        const newToken = !settings?.token
          ? await this.monacoQuickInputService
              .input(optionsToken)
              .then((value): string => value || '')
          : settings?.token;

        settings.token = newToken;

        //// ---------- PREPARE TO BUILD ------------ /////
        newToken
          ? this.messageService
              .info(`PROJECT: ${settings.project}`, ...actionsConfirmBuild)
              .then(async (action) => {
                if (action === 'Check now') {
                  channel.show();
                  channel.appendLine(`Checking status ${settings.project}...`);

                  const res: Record<string, any> = await getBuildStatus(
                    settings.project,
                    settings.token
                  );
                  console.log('response', res);

                  settings.image = res.image || 'mock';

                  this.smartCLIDEBackendService.fileWrite(
                    `${currentPath}/.settings.json`,
                    JSON.stringify(settings)
                  );

                  channel.appendLine(
                    `Status: ${res?.status || res?.detail}...`,
                    OutputChannelSeverity.Warning
                  );
                }
              })
              .catch((err) => this.messageService.error(err.message))
          : this.messageService.error(`Error TOKEN are required`);
      },
    });

    registry.registerCommand(SmartClideDeploymentDeploy, {
      execute: async () => {
        //// ---------- CONST ------------ /////
        let settings: Settings = {
          username: '',
          project: '',
          token: '',
          branch: '',
          yml: '',
          image: '',
          port: '',
          hostname: '',
          replicas: '1',
        };

        const channel = this.outputChannelManager.getChannel('SmartCLIDE');
        channel.clear();

        const currentProject: string | undefined =
          this.workspaceService.workspace?.name?.split('.')[0] || '';

        if (!currentProject) {
          this.messageService.error(
            `It is necessary to have at least one repository open.`
          );
          return;
        }

        const currentPath =
          this.workspaceService.workspace?.resource.path.toString() || '';

        const prevSettings = await this.smartCLIDEBackendService.fileRead(
          `${currentPath}/.settings.json`
        );

        if (prevSettings.errno) {
          this.smartCLIDEBackendService.fileWrite(
            `${currentPath}/.settings.json`,
            JSON.stringify(settings)
          );
          const newSettings = await this.smartCLIDEBackendService.fileRead(
            `${currentPath}/.settings.json`
          );
          settings = newSettings && { ...JSON.parse(newSettings) };
        } else {
          settings = { ...JSON.parse(prevSettings) };
        }

        if (!currentPath || currentPath === '') {
          this.messageService.error(
            `There have been problems getting the route.`
          );
          return;
        }

        //// ---------- FLOW ------------ /////
        const optionsDomain: InputOptions = {
          placeHolder: 'Enter Domain',
          prompt: 'Enter Domain:',
        };
        const optionsPort: InputOptions = {
          placeHolder: 'Enter Port',
          prompt: 'Enter Port:',
        };
        const optionsToken: InputOptions = {
          placeHolder: 'Enter Project Secrect Token',
          prompt: 'Enter Project Secrect Token:',
        };
        const hostname = !settings?.hostname
          ? await this.monacoQuickInputService
              .input(optionsDomain)
              .then((value): string => value || '')
          : settings?.hostname;

        settings.hostname = hostname;

        const port = !settings?.port
          ? await this.monacoQuickInputService
              .input(optionsPort)
              .then((value): string => value || '')
          : settings?.port;

        settings.port = port;

        //// ---------- FLOW ------------ /////
        const newToken = !settings?.token
          ? await this.monacoQuickInputService
              .input(optionsToken)
              .then((value): string => value || '')
          : settings?.token;

        settings.token = newToken;
        const actionsConfirmDeploy = ['Deploy now', 'Cancel'];
        let interval: any;
        if (settings.image) {
          this.messageService
            .info(
              `Are you sure launch deploy to PROJECT: ${settings.project}?`,
              ...actionsConfirmDeploy
            )
            .then(async (action) => {
              if (action === 'Deploy now') {
                this.smartCLIDEBackendService.fileWrite(
                  `${currentPath}/.settings.json`,
                  JSON.stringify(settings)
                );
                channel.show();
                channel.appendLine(`Start deploy ${settings.project}...`);
                const res: Record<string, any> = await postDeploy(
                  settings.image,
                  settings.token,
                  settings.port,
                  settings.hostname,
                  settings.image,
                  settings.replicas
                );

                if (res?.status === 'pending') {
                  this.messageService.warn(res?.message);
                  channel.appendLine(res?.message, OutputChannelSeverity.Info);
                  setTimeout(() => {
                    this.messageService.warn('Job building...');
                    channel.appendLine(
                      'Job building...',
                      OutputChannelSeverity.Warning
                    );
                  }, 2000);
                  interval = setInterval(async () => {
                    const resp: Record<string, any> = await getDeployStatus(
                      settings.project,
                      settings.token
                    );
                    console.log('resp', resp.status);

                    if (resp?.status === 'success') {
                      if (resp.image) {
                        settings.image = res.image;
                        this.smartCLIDEBackendService.fileWrite(
                          `${currentPath}/.settings.json`,
                          JSON.stringify(settings)
                        );
                      }
                      clearInterval(interval);
                      this.messageService.info('Job ready to deploy');
                      channel.appendLine(
                        'Job ready to deploy',
                        OutputChannelSeverity.Info
                      );
                    }
                    if (resp?.status === 'error') {
                      console.log('error fecth', resp);
                      clearInterval(interval);
                      this.messageService.error(resp?.message);
                      channel.appendLine(
                        resp?.message,
                        OutputChannelSeverity.Error
                      );
                    }
                  }, 8000);
                }
                if (res?.status === 'error') {
                  console.log('error fecth', res);
                  this.messageService.error(res?.message);
                  channel.appendLine(res?.message, OutputChannelSeverity.Error);
                }
              }
            });
        } else {
          this.messageService.error(
            'Error you need to have at least one build image'
          );
          channel.appendLine(
            'Error you need to have at least one build image',
            OutputChannelSeverity.Error
          );
        }
      },
    });
    registry.registerCommand(SmartClideDeploymentMonitoring, {
      execute: async () => {
        await this.messageService.warn('SmartCLIDE4 World!');
      },
    });
  }
}
