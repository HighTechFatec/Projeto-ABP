#include <WiFi.h>
#include <PubSubClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS 27

const char* ssid = "LAB 108";
const char* password = "fatec258";

const char* mqtt_server = "10.68.55.212";
const int mqtt_port = 1883;
const char* mqtt_topic = "sensors/temperature";

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

WiFiClient espClient;
PubSubClient client(espClient);

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
  client.setServer(mqtt_server, mqtt_port);
  sensors.begin();
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);

  if (tempC != DEVICE_DISCONNECTED_C) {
    char payload[50];
    snprintf(payload, sizeof(payload), "{\"temperature\":%.2f}", tempC);

    Serial.print("Publishing: ");
    Serial.println(payload);

    client.publish(mqtt_topic, payload);
  } else {
    Serial.println("Error: Could not read temperature");
  }

  delay(5000); // 5 seconds
}
