import admin from "firebase-admin";
import serviceAccount from "../labconnect-6c837-firebase-adminsdk-fbsvc-d5dba4c664.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;