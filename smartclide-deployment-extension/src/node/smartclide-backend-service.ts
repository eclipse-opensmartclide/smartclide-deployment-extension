import * as fs from "fs";
import * as yaml from "js-yaml";
import { injectable } from "@theia/core/shared/inversify";
import { SmartCLIDEBackendService } from "../common/protocol";

@injectable()
export class SmartCLIDEBackendServiceImpl implements SmartCLIDEBackendService {
  saySmartCLIDETo(name: string): Promise<string> {
    return new Promise<string>((resolve) => resolve("SmartCLIDE " + name));
  }
  fileRead(filename: string): any {
    try {
      const data: any = fs.readFileSync(filename, "utf8");
      return data;
    } catch (err) {
      return err;
    }
  }
  fileReadYaml(filename: string): any {
    try {
      const data: any = yaml.load(fs.readFileSync(filename, "utf8"));
      return data;
    } catch (err) {
      return err;
    }
  }
  fileWrite(filePath: string, content: any): any {
    try {
      fs.writeFileSync(filePath, content);
      return "success";
    } catch (err) {
      return "error";
    }
  }
  fileWriteYaml(filePath: string, content: any): any {
    try {
      fs.writeFileSync(filePath, yaml.dump(content));
      return "success";
    } catch (err) {
      return "error";
    }
  }
}
