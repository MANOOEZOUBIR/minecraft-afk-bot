const mineflayer = require('mineflayer')

function startBot() {
  const bot = mineflayer.createBot({
    host: 'MANOO_EZOUBIR.aternos.me:54765',
    port: 25565,
    username: 'BotAFK',
    auth: 'offline',
    version: false
  })

  bot.once('spawn', () => {
    console.log('✅ Bot connecté !')

    bot.chat('Bot AFK connecté.')

    setInterval(() => {
      bot.setControlState('jump', true)

      setTimeout(() => {
        bot.setControlState('jump', false)
      }, 500)

      bot.look(
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * Math.PI / 6,
        true
      )
    }, 60000)
  })

  bot.on('chat', (username, message) => {
    if (username === bot.username) return

    if (message.toLowerCase() === 'ping') {
      bot.chat('Pong!')
    }
  })

  bot.on('end', () => {
    console.log('🔄 Déconnecté. Reconnexion dans 10 secondes...')
    setTimeout(startBot, 10000)
  })

  bot.on('kicked', (reason) => {
    console.log('⛔ Expulsé :', reason)
  })

  bot.on('error', (err) => {
    console.log(err)
  })
}

startBot()
