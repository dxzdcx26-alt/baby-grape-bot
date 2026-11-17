require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js");
const token = process.env.token;
const guildId = process.env.guildId;
const clientId = process.env.clientId;

if (!token || !clientId || !guildId) {
    console.error("ต้องมี token, clientId และ guildId ใน Secrets ก่อนรันคำสั่งนี้");
    process.exit(1);
}

const commands = [
    new SlashCommandBuilder()
        .setName("score")
        .setDescription("จัดการคะแนนของสมาชิก (แอดมินเท่านั้น)")
        .addStringOption((option) =>
            option
                .setName("action")
                .setDescription("เลือกการกระทำ")
                .setRequired(true)
                .addChoices(
                    { name: "เพิ่ม (Add)", value: "add" },
                    { name: "ลบ (Remove)", value: "remove" },
                    { name: "ตั้งค่า (Set)", value: "set" },
                ),
        )
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("เลือกผู้ใช้")
                .setRequired(true),
        )
        .addNumberOption((option) =>
            option
                .setName("amount")
                .setDescription("จำนวนคะแนน")
                .setRequired(true),
        ),
    new SlashCommandBuilder()
        .setName("weekly_reset")
        .setDescription("ตัดรอบคะแนนประจำสัปดาห์ (แอดมินเท่านั้น)"),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    try {
        console.log("กำลังลงทะเบียน Slash Commands...");
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        });
        console.log("ลงทะเบียน Slash Commands สำเร็จ!");
    } catch (error) {
        console.error(error);
    }
})();
