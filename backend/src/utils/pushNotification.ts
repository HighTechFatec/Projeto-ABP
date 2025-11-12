import { Expo, ExpoPushMessage } from "expo-server-sdk";

// Cria uma instância do cliente Expo
const expo = new Expo();

// Função para enviar notificações push
export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string
) {
  if (!Expo.isExpoPushToken(expoPushToken)) {
    console.error(`❌ Token inválido: ${expoPushToken}`);
    return;
  }

  const messages: ExpoPushMessage[] = [
    {
      to: expoPushToken,
      sound: "default",
      title,
      body,
      data: { withSome: "data" },
    },
  ];

  try {
    const ticketChunk = await expo.sendPushNotificationsAsync(messages);
    console.log("✅ Notificação enviada:", ticketChunk);
  } catch (error) {
    console.error("❌ Erro ao enviar notificação:", error);
  }
}