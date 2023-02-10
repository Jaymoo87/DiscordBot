import { Client, Collection, ApplicationCommandDataResolvable, ClientEvents } from "discord.js";
import { CommandType } from "../types/command";
import { promisify } from "util";
import glob from "glob";
import { RegisterCommandOptions } from "../types/client";
import { Event } from "../structures/Event";

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection();

  constructor() {
    super({ intents: 32767 });
  }

  start() {
    this.registerModules();
    this.login(process.env.botToken);
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerCommands({ commands, guildId }: RegisterCommandOptions) {
    if (guildId) {
      this.guilds.cache.get(guildId)?.commands.set(commands);
      console.log(`Registering commands to ${guildId}`);
    } else {
      this.application?.commands.set(commands);
      console.log("registering global commands");
    }
  }

  async registerModules() {
    // Commands

    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const commandFiles = await globPromise(`${__dirname}/../commands/*/*{.ts, .js}`);

    commandFiles.forEach(async (filePath) => {
      const command: CommandType = await this.importFile(filePath);
      console.log(command);
      if (!command.name) return;

      this.commands.set(command.name, command);
      slashCommands.push(command);
    });

    //**Event**

    const eventFiles = await globPromise(`${__dirname}/../events/*{.ts, .js}`);

    eventFiles.forEach(async (filePath) => {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath);
      this.on(event.event, event.run);
    });
  }
}
