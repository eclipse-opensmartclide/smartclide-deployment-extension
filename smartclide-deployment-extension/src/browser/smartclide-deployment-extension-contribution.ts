import {
  Command,
  CommandContribution,
  CommandRegistry,
  MessageService,
} from "@theia/core/lib/common";
import { injectable, inject } from "@theia/core/shared/inversify";

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

const BASE_URL = "http://146.158.241.186:3000";

const buildUrl = (user: string, serviceName: string) =>
  `${BASE_URL}/build/${user}/${serviceName}`;
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
    @inject(MessageService) private readonly messageService: MessageService
  ) {}

  //  @inject(HelloBackendService) private readonly helloBackendService: HelloBackendService, //  @inject(HelloBackendWithClientService) private readonly helloBackendWithClientService: HelloBackendWithClientService,

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(SmartClideDeploymentBuild, {
      execute: () => {
        setTimeout(() => {
          this.messageService.info("Hello World!");
        }, 500);
        const url = buildUrl("pberrocal", "hello-world-node");
        fetch(url).then((res: any) => {
          res.json().then((res: any) => {
            console.log("BUILD COMMAND", res);
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
