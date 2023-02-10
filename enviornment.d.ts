declare global {
  namespace NodeJS {
    interface ProcessEnv {
      botToken: string;
      guildId: string;
      enviornment: "dev" | "prod" | "debug";
    }
  }
}

export {};
