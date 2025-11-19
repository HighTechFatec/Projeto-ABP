#include <WiFi.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS 27

const char* ssid = "";
const char* password = "";

const char* serverUrl = "https://projeto-abp.onrender.com/dados";

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup_wifi() {
  Serial.print("Conectando ao Wi-Fi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n✔️ Wi-Fi conectado!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

void setup() {
  Serial.begin(9600);
  setup_wifi();
  sensors.begin();
}

void loop() {
  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);

  if (tempC == DEVICE_DISCONNECTED_C) {
    Serial.println("❌ Erro ao ler temperatura!");
    delay(5000);
    return;
  }

  // -----------------------------
  // POST PARA /dados
  // -----------------------------
  String payload = "{\"temperatura\": " + String(tempC, 2) + ", \"id_laboratorio\": 1}";

  Serial.print("📤 Enviando POST para /dados: ");
  Serial.println(payload);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
      Serial.printf("✔️ POST /dados OK! Código: %d\n", httpResponseCode);
      Serial.println("Resposta: " + http.getString());
    } else {
      Serial.printf("❌ Erro no POST /dados: %s\n", http.errorToString(httpResponseCode).c_str());
    }

    http.end();

    // -----------------------------
// ENVIAR PARA /avisos SE ESTOURAR LIMITES
// -----------------------------
if (tempC >= 50.0 || tempC <= 20.0) {

  HTTPClient http2;

  String payloadAvisos = 
    "{\"temp_min\": 20.0, \"temp_max\": 50.0, \"id_usuario\": 1}";

  http2.begin("https://projeto-abp.onrender.com/avisos");
  http2.addHeader("Content-Type", "application/json");

  Serial.print("🚨 Temperatura fora dos limites! Enviando /avisos: ");
  Serial.println(payloadAvisos);

  int responseAvisos = http2.POST(payloadAvisos);

  if (responseAvisos > 0) {
    Serial.printf("✔️ POST /avisos OK! Código: %d\n", responseAvisos);
    Serial.println("Resposta: " + http2.getString());
  } else {
    Serial.printf("❌ Erro no POST /avisos: %s\n", http2.errorToString(responseAvisos).c_str());
  }

  http2.end();

} else {
  Serial.println("🟢 Temperatura dentro dos limites. Nenhum aviso enviado.");
}

  } else {
    Serial.println("⚠️ Wi-Fi desconectado!");
  }

  delay(30000);
}