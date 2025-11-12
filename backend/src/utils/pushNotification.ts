import { Expo, ExpoPushMessage } from "expo-server-sdk";

const expo = new Expo();

export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  if (!Expo.isExpoPushToken(expoPushToken)) {
    console.error(`❌ Token inválido: ${expoPushToken}`);
    return;
  }

  const messages: ExpoPushMessage[] = [
    {
      to: expoPushToken,
      sound: "default",
      title: "Alerta de Nova Temperatura",
      body: "Foi detectada uma nova temperatura, clique para visualizar!",
      data: {
        screen: "Notificações", // 👈 Dica: envie o nome da tela ou dados
        ...(data ?? {}),
      },
      priority: "high",
      channelId: "default",
      badge: 1,
      subtitle: "⚠️ Alerta de temperatura",
    },
  ];

  try {
    const ticketChunk = await expo.sendPushNotificationsAsync(messages);
    console.log("✅ Notificação enviada:", ticketChunk);
  } catch (error) {
    console.error("❌ Erro ao enviar notificação:", error);
  }
}