import { CommandType } from "../types/command";

export class Commands {
  constructor(commandOptions: CommandType) {
    Object.assign(this, commandOptions);
  }
}
