const mineflayer = require('mineflayer')

const config = {
  host: 'MANOO_EZOUBIR.aternos.me:54765', // Remplace par ton IP
  port: 25565,
  username: 'BotAFK',
  auth: 'offline',
  version: false
}

let bot
let reconnecting = false
let antiAfkInterval

function connectBot() {
  console.log('🔄 Tentative de connexion...')

  bot = mineflayer.createBot(config)

  bot.once('spawn', () => {
    console.log('✅ Bot connecté !')

    reconnecting = false

    bot.chat('Bot AFK connecté.')

    // Évite de créer plusieurs intervalles si le bot se reconnecte
    if (antiAfkInterval) clearInterval(antiAfkInterval)

    antiAfkInterval = setInterval(() => {
      if (!bot.entity) return

      bot.setControlState('jump', true)

      setTimeout(() => {
        if (bot.entity) {
          bot.setControlState('jump', false)
        }
      }, 500)

      bot.look(
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 0.4,
        true
      )
    }, 60000)
  })

  // Répond à "ping"
  bot.on('chat', (username, message) => {
    if (username === bot.username) return

    if (message.toLowerCase() === 'ping') {
      bot.chat('Pong!')
    }
  })

  // Jette automatiquement les objets ramassés
  bot.on('playerCollect', (collector) => {
    if (collector !== bot.entity) return

    setTimeout(async () => {
      const items = bot.inventory.items()

      for (const item of items) {
        try {
          await bot.tossStack(item)
        } catch (err) {
          console.log(`Impossible de jeter ${item.name}`)
        }
      }
    }, 1000)
  })

  bot.on('end', reconnect)
  bot.on('kicked', reconnect)

  bot.on('error', (err) => {
    console.log('❌', err.message)
  })
}

function reconnect() {
  if (reconnecting) return

  reconnecting = true

  console.log('⏳ Serveur indisponible. Nouvelle tentative dans 10 secondes...')

  setTimeout(() => {
    reconnecting = false
    connectBot()
  }, 10000)
}

connectBot()
