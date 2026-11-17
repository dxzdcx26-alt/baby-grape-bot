// ไฟล์: send-panel.js (เวอร์ชันอ่านจาก Secrets)

require('dotenv').config();
const { Client, GatewayIntentBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const token = process.env.token;

if (!token) {
    console.error('ไม่พบ token ใน Secrets! กรุณาตรวจสอบ');
    process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
    console.log('บอทพร้อมแล้ว! กำลังจะส่งแผงควบคุม...');

    const guild = client.guilds.cache.first();
    if (!guild) {
        console.error('ไม่พบเซิร์ฟเวอร์ที่บอทอยู่!');
        return client.destroy();
    }

    const channels = await guild.channels.fetch();
    const channel =
        (process.env.controlChannelId &&
            channels.get(process.env.controlChannelId)) ||
        channels.find(
            (ch) =>
                ch.type === ChannelType.GuildText &&
                /control|panel|ควบคุม/i.test(ch.name),
        );
    if (!channel) {
        console.error('ไม่พบห้องควบคุม (ชื่อห้องต้องมี control/panel/ควบคุม)');
        return client.destroy();
    }
    console.log(`ใช้ห้องควบคุม #${channel.name}`);

    try {
        const messages = await channel.messages.fetch({ limit: 50 });
        const oldPanels = messages.filter((msg) => msg.author.id === client.user.id);
        if (oldPanels.size > 0) await channel.bulkDelete(oldPanels, true);
        console.log(`ลบแผงเก่า ${oldPanels.size} ข้อความในห้องควบคุมเรียบร้อย`);
    } catch (error) {
        console.warn('ไม่สามารถลบข้อความเก่าได้ (อาจจะไม่มีสิทธิ์ หรือข้อความเก่าเกิน 14 วัน):', error.message);
    }

    const embed = new EmbedBuilder()
        .setColor('DarkGreen')
        .setTitle('💰 Heist Report Panel 💰')
        .setDescription('กดปุ่มด้านล่างเพื่อเริ่มบันทึกผลงานการทำกิจกรรมต่างๆ ของแก๊ง')
        .setThumbnail('https://img2.pic.in.th/pic/LOGO_12ebdf768694f5bef.png');

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('start_heist_report') // ID สำหรับเริ่มระบบ Dropdown
                .setLabel('📝 เริ่มบันทึกผลงาน')
                .setStyle(ButtonStyle.Success)
                .setEmoji('💰'),
        );

    await channel.send({ embeds: [embed], components: [row] });
    console.log('ส่งแผงควบคุมเรียบร้อยแล้ว!');
    client.destroy(); // ปิดการทำงานของบอทหลังจากส่งเสร็จ
});

client.login(token);