// import { BASE_URL } from "./constants";

export const fetchBuild = async (
  username: string,
  project: string,
  messageService: any,
  OutputChannelSeverity: any,
  channel: any
) => {
  // TODO: Remove when backend endpoint are ok
  messageService.warn("mock done 1");
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      channel.appendLine("mock done 2", OutputChannelSeverity.Warning);
      resolve("done");
    }, 3000);
  });

  // return await fetch(`${BASE_URL}/build/`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     project: "test-kubernetes",
  //     username: "pberr",
  //   }),
  // })
  //   .then((res: any) => {
  //     res.json().then((res: any): string => {
  //       console.log(res?.state);

  //       messageService.warn(res.message);
  //       channel.appendLine(res.message, OutputChannelSeverity.Warning);
  //       channel.show();
  //       switch (res?.state) {
  //         case "pending":
  //           console.log("retruns pending fecth");
  //           messageService.warn(res.message);
  //           channel.appendLine(res.message, OutputChannelSeverity.Warning);
  //           let refetch: any = setTimeout(async () => {
  //             console.log("call new fecth");

  //             await fetchBuild(username, project, messageService, channel);
  //           }, 2000);

  //           clearTimeout(refetch);
  //           return "pending";
  //         case "error":
  //           channel.appendLine(res.message, OutputChannelSeverity.Error);
  //           messageService.error(res.message);
  //           return "error";
  //         case "done":
  //           channel.appendLine(res.message, OutputChannelSeverity.Info);
  //           messageService.info(res.message);
  //           return "done";
  //         default:
  //           return "done";
  //       }
  //     });
  //   })
  //   .catch((err: any): string => {
  //     console.error("ERROR WHEN BUILD COMMAND - ", err);
  //     messageService.info("Error");
  //     channel.appendLine(err.message, OutputChannelSeverity.Error);
  //     channel.show();
  //     return "error";
  //   });
};
