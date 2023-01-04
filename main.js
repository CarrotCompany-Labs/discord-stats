const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const data = require('./data.js')
require('dotenv/config')

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, ],});

client.once('ready', async() => {
	console.log(`✅ Ready! Logged in as ${client.user.tag}`);
    client.user.setUsername('$CROT Price');
});

client.on('ready', async() => {
    let sideInfo = await data.getApiData()
    let direction = await data.checkDirections(sideInfo.priceVolatility)

    const channelDailyTxn = client.channels.cache.get(process.env.channelDailyTxn);
    const channelDailyVolume = client.channels.cache.get(process.env.channelDailyVolume);
    const channelLiquidity = client.channels.cache.get(process.env.channelLiquidity);
    const channelValuation = client.channels.cache.get(process.env.channelValuation);

    const loop = () => {

        channelDailyTxn.setName(`Daily Txn: ${(sideInfo.dailyTxnCount)}`)
        channelDailyVolume.setName(`24h Volume: ${(data.abbreviateNumber(sideInfo.volumeDaily))}`)
        channelLiquidity.setName(`Liquidity: ${(data.abbreviateNumber(sideInfo.liquidity))}`)
        channelValuation.setName(`Market Cap: ${(data.abbreviateNumber(sideInfo.valuation))}`)

        console.log("📺 Channel Values Updated!")

        client.user.setActivity(`${sideInfo.priceCROT} $ ${direction} ${sideInfo.priceVolatility}`, { type: ActivityType.Playing })

        console.log("🤖 Update Bot Activity!")
    }; setInterval(loop, 3600000)   //1 Hour Update

});

client.login(process.env.TOKEN);