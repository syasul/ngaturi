import { db, eq, systemSettings } from '../db'

export async function sendTelegramAlert(message: string): Promise<void> {
  try {
    const settingRow = await db.query.systemSettings.findFirst({
      where: eq(systemSettings.key, 'telegram'),
    })

    if (!settingRow || !settingRow.value) return

    const config = settingRow.value as any
    if (!config.enabled || !config.botToken || !config.chatId) {
      return
    }

    const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    })

    if (!response.ok) {
      console.error('Telegram notification error:', await response.text())
    }
  } catch (error) {
    console.error('Error sending Telegram alert:', error)
  }
}
