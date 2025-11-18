#include <WiFi.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS 27

const char* ssid = "LAB 108";
const char* password = "fatec258";

const char* serverUrl = "https://dashboard.render.com/web/srv-d477rmi4d50c73fvspb0/dados";

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup_wifi() {
  Serial.print("Connecting to Wi-Fi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ Wi-Fi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    if (client.connect("ESP32TempClient")) {
      Serial.println("✅ Connected!");
    } else {
      Serial.print("❌ Failed, rc=");
      Serial.print(client.state());
      Serial.println(" Retrying in 5s...");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(9600);
  setup_wifi();
  sensors.begin();
}

void loop() {
  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);

  if (tempC != DEVICE_DISCONNECTED_C) {
   String payload = "{\"temperature\": " + String(tempC, 2) + "}";
    Serial.print("Sending POST request with payload: ");
    Serial.println(payload);

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");
      
      int httpResponseCode = http.POST(payload);

      if (httpResponseCode > 0) {
        Serial.printf("✅ POST success, code: %d\n", httpResponseCode);
        String response = http.getString();
        Serial.println("Response: " + response);
      } else {
        Serial.printf("❌ POST failed, error: %s\n", http.errorToString(httpResponseCode).c_str());
      }

      http.end();
    } else {
      Serial.println("⚠️ Wi-Fi disconnected!");
    }
  } else {
    Serial.println("Error: Could not read temperature");
  }

  delay(60000); // 1 minuto
}
