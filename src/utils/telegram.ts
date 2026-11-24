import type { OrderRecord } from '../types/window';
import { formatUZS } from './pricing';

/**
 * Configure Telegram Bot credentials here to automatically forward orders.
 * When left empty, orders are saved cleanly in localStorage without network calls.
 */
export const BOT_TOKEN = '';
export const CHAT_ID = '';

export async function sendOrderToTelegram(order: OrderRecord): Promise<boolean> {
  if (!BOT_TOKEN.trim() || !CHAT_ID.trim()) {
    return false;
  }

  const lines = [
    `🪟 *New AKFI Deraza Order: ${order.orderNumber}*`,
    `👤 Name: ${order.customer.name}`,
    `📞 Phone: ${order.customer.phone}`,
    `📍 Address: ${order.customer.address}`,
    order.customer.measurementDate
      ? `📅 Measurement: ${order.customer.measurementDate}`
      : '',
    order.customer.roomNotes ? `🏠 Room notes: ${order.customer.roomNotes}` : '',
    order.customer.comment ? `💬 Comment: ${order.customer.comment}` : '',
    '',
    `📦 *Items (${order.items.length}):*`,
    ...order.items.map((item, idx) => {
      const c = item.config;
      return `${idx + 1}. ${c.modelId.toUpperCase()} (${c.series}) · ${c.widthMm}x${c.heightMm}mm · x${c.quantity} = ${formatUZS(item.price.totalPrice)}`;
    }),
    '',
    `💰 *Total: ${formatUZS(order.totalAmount)}*`,
  ].filter(Boolean);

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: lines.join('\n'),
          parse_mode: 'Markdown',
        }),
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}
