import admin from "../firebase";

export async function sendPushNotification(
  fcmToken: string,
  title: string,
  body: string,
  data: Record<string, any> = {}
) {
  try {
    const message: admin.messaging.Message = {
      token: fcmToken,
      notification: {
        title,
        body,
      },
      data,
      android: {
        notification: {
          sound: "default",
          priority: "high",
          channelId: "default",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
          },
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log("✅ Notificação enviada:", response);
    return response;

  } catch (error) {
    console.error("❌ Erro FCM:", error);
    return null;
  }
}