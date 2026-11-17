require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js");
const token = process.env.token;
const guildId = process.env.guildId;
const clientId = process.env.clientId; // **สำคัญ!** ต้องเพิ่ม clientId ใน Secrets ด้วย

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
    new SlashCommandBuilder()
        .setName("checkin")
        .setDescription("เช็คชื่อรายวัน (วอ / ประชุม / พีคไทม์ หรือกำหนดเอง)")
        .addStringOption((option) =>
            option
                .setName("topic")
                .setDescription("หัวข้อเช็คชื่อ ถ้าไม่ใส่จะใช้ วอ")
                .setRequired(false),
        ),
    new SlashCommandBuilder()
        .setName("leave")
        .setDescription("แจ้งลา (บันทึกในตารางสรุปคนลา)")
        .addStringOption((option) =>
            option
                .setName("date")
                .setDescription("วันที่ลา รูปแบบ YYYY-MM-DD")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("เหตุผลการลา")
                .setRequired(true),
        ),
    new SlashCommandBuilder()
        .setName("leave_list")
        .setDescription("Leave summary")
        .addStringOption((option) =>
            option
                .setName("date")
                .setDescription("YYYY-MM-DD")
                .setRequired(false),
        ),
    new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Leaderboard"),
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
