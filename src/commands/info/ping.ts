import { Commands } from "../../structures/Commands";

export default new Commands({
  name: "ping",
  description: "replies with ping",
  run: async ({ interaction }) => {
    interaction.followUp("Ping");
  },
});
