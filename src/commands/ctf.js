const {guildId, clientId, activeCtfChanName, activeChallengeChanName, completedChallengeChanName } = require("../config.js");
const { SlashCommandBuilder, ChannelType, CategoryChannelChildManager, GuildChannel, GuildManager, CategoryChannel } = require("discord.js");
const { createCTF, AlreadyExistsError, exportCTF } = require("../func.js");

const ctfCommand = new SlashCommandBuilder()
    .setName("ctf")
    .setDescription("Add or manage CTF's")
    .setDefaultMemberPermissions("0");

ctfCommand.addSubcommand((command) =>
    command
        .setName("add")
        .setDescription("Add a CTF")
        //.setDefaultMemberPermissions("0")
        .addStringOption((option) =>
            option.setName("name").setDescription("The name of the CTF").setRequired(true),
        ),
);


ctfCommand.addSubcommand((command) =>
    command
        .setName("export")
        .setDescription("Export a CTF")
);

module.exports = {
    data: ctfCommand,
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();
        const name = interaction.options.getString("name");
        switch (subCommand) {
            case "add":
                try {
                    await createCTF(interaction.member.guild, name);
                }
                catch (err) {
                    if (err instanceof AlreadyExistsError) {
                        return await interaction.reply(`CTF ${name} already exists!`);
                    }
                    return await interaction.reply("An unknown error occured.");
                }
                return await interaction.reply(`CTF ${name} successfully added.`);    
            case "export":
                try {
                    await exportCTF(interaction.member.guild);
                }
                catch (err) {
                    return await interaction.reply("An unknown error occured.");
                }
            default:
                throw `Unknown subcommand ${interaction.options.getSubcommand()}`;
        }
    },
};