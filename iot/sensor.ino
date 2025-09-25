#include <OneWire.h>
#include <DallasTemperature.h>
#include <LiquidCrystal_I2C.h>

// Data wire is plugged into port 2 on the Arduino
#define ONE_WIRE_BUS 27
#define LED_PIN 33

// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);

LiquidCrystal_I2C lcd(0x27,16,2); 

// Pass our oneWire reference to Dallas Temperature. 
DallasTemperature sensors(&oneWire);

void setup()
{
  lcd.init();                 
  lcd.backlight();

  Serial.begin(9600);
  Serial.println("Dallas Temperature IC Control Library Demo");

  pinMode(LED_PIN, OUTPUT);

  sensors.begin();
}

void loop()
{ 
  sensors.requestTemperatures(); // Send the command to get temperatures
  float tempC = sensors.getTempCByIndex(0);

  if(tempC != DEVICE_DISCONNECTED_C) {
    Serial.print("Temperatura: ");
    Serial.println(tempC);

    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Temp. atual:");
    lcd.setCursor(0,1);
    lcd.print(tempC);
    lcd.print(" C");
  } else {
    Serial.println("Error: Could not read temperature data");
  }

  if(tempC > 25) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }

  delay(1000);
}