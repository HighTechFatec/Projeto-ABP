import admin from "../firebase";
import { Expo } from "expo-server-sdk";

const expo = new Expo();

/**
 * Envia notificação via Firebase Cloud Messaging (HTTP v1)
 * mantendo a estrutura usada pelo Expo.
 */
export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  // 🔥 1. Verifica se o token é válido
  if (!Expo.isExpoPushToken(expoPushToken)) {
    console.error(`❌ Token inválido (não é um Expo token): ${expoPushToken}`);
    return;
  }

  // 🔥 2. Convertendo token Expo → FCM token
  // OBS: O Expo cuida disso em segundo plano.
  // Basta enviar direto para o expoPushToken.
  const fcmToken = expoPushToken;

  // 🔥 3. Monta a notificação no formato HTTP v1
  const message = {
    token: fcmToken,
    notification: {
      title: title ?? "Alerta de Nova Temperatura",
      body: body ?? "Foi detectada uma nova temperatura, clique para visualizar!",
    },
    android: {
      notification: {
        sound: "default",
        channelId: "default",
        priority: "high",
        visibility: "public",
        notificationCount: 1,
      },
    },
    apns: {
      payload: {
        aps: {
          badge: 1,
          sound: "default",
          alert: {
            subtitle: "⚠️ Alerta de temperatura",
          },
        },
      },
    },
    data: {
      screen: "Notificações",
      ...(data ?? {}),
    },
  };

  try {
    // 🔥 4. Envio via HTTP v1 com Firebase Admin
    const response = await admin.messaging().send(message as admin.messaging.Message);

    console.log("✅ Notificação enviada com sucesso:", response);

    return response;
  } catch (error) {
    console.error("❌ Erro ao enviar notificação via FCM HTTP v1:", error);
    return null;
  }
}