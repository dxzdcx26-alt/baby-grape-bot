require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js");
const token = process.env.token;
const guildId = process.env.guildId;
let clientId = process.env.clientId;

if (!token) {
    console.error("ต้องมี token ใน Secrets ก่อนรันคำสั่งนี้");
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
        if (!clientId) {
            const me = await rest.get(Routes.user());
            clientId = me.id;
        }
        console.log("กำลังลงทะเบียน Slash Commands...");
        const route = guildId
            ? Routes.applicationGuildCommands(clientId, guildId)
            : Routes.applicationCommands(clientId);
        await rest.put(route, { body: commands });
        console.log(
            guildId
                ? "ลงทะเบียน Slash Commands สำเร็จ!"
                : "ลงทะเบียน Slash Commands แบบ global สำเร็จ! (อาจใช้เวลาถึง 1 ชั่วโมงก่อนโผล่)",
        );
    } catch (error) {
        console.error(error);
    }
})();
