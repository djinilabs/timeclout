import packageJson from "../../../../package.json";

export const discordResponse = (content: string, statusCode = 200) => {
  return {
    statusCode,
    body: JSON.stringify({
      type: 4,
      data: {
        content,
        flags: 64, // EPHEMERAL
      },
    }),
    headers: {
      "Content-Type": "application/json",
      "User-Agent": `DiscordBot (https://app.tt3.app, ${packageJson.version})`,
    },
  };
};
