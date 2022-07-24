import { Environment } from "./core/types/Environment";
import { ImageExtension } from "./core/types/ImageExtension";

export class Constants {
  public static readonly logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
  };

  public static readonly logColors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "cyan"
  };

  public static readonly environmentEnumValues: Environment[] = Object.values(Environment);
  public static readonly imageExtensionEnumValues: ImageExtension[] = Object.values(ImageExtension);
}
