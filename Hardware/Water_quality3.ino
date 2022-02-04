#include "certs.h"
#include <WiFiClientSecure.h>
#include <MQTTClient.h>
#include <ArduinoJson.h>
#include "WiFi.h"

// Hardware declerations
int sensorValue;
float tds_value;
float voltage;

int sensorPin;

// Wifi credentials
const char *WIFI_SSID = "";
const char *WIFI_PASSWORD = "";

// The name of the device. This MUST match up with the name defined in the AWS console
#define DEVICE_NAME "my-esp32-device"

// The MQTTT endpoint for the device (unique for each AWS account but shared amongst devices within the account)
#define AWS_IOT_ENDPOINT "a36pgvx5o92pt5-ats.iot.us-west-1.amazonaws.com"

// The MQTT topic that this device should publish to
#define AWS_IOT_TOPIC "device/22/data"

WiFiClientSecure net = WiFiClientSecure();
MQTTClient client = MQTTClient(256);

void connectToAWS()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }
  
  // Configure WiFiClientSecure to use the AWS certificates we generated
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);

  // Connect to the MQTT broker on the AWS endpoint we defined earlier
  client.begin(AWS_IOT_ENDPOINT, 8883, net);

  Serial.println("Connecting to AWS IOT");

  while (!client.connect(DEVICE_NAME)) {
    Serial.print(".");
    delay(100);
  }

  // If we land here, we have successfully connected to AWS!
  // And we can subscribe to topics and send messages.
  Serial.println("Connected!");
}

void sendJsonToAWS(float sensor_data)
{ 
  StaticJsonDocument<128> jsonDoc;
  //JsonObject stateObj = jsonDoc.createNestedObject("state");
  //JsonObject reportedObj = stateObj.createNestedObject("reported");
  
  // Write the temperature & humidity. Here you can use any C++ type (and you can refer to variables)
  //reportedObj["tds_value"] = sensor_data;
  jsonDoc["tds_value"] = sensor_data;
  //jsonDoc["temp_value"] = 10;
  //jsonDoc["ph_value"] = 11;
  //jsonDoc["turbidity_value"] = 12;
  
  // Create a nested object "location"
  //JsonObject locationObj = reportedObj.createNestedObject("location");
  //locationObj["name"] = "Test Water Source";

  Serial.println("\nPublishing message to AWS...");
  serializeJson(jsonDoc, Serial);
  char jsonBuffer[128];
  serializeJson(jsonDoc, jsonBuffer);

  client.publish(AWS_IOT_TOPIC, jsonBuffer);
}

float getData() {
  sensorValue = analogRead(sensorPin);
  voltage = sensorValue*5/4096.0; //Convert analog reading to Voltage
  tds_value = (133.42/voltage*voltage*voltage - 255.86*voltage*voltage + 857.39*voltage)*0.5; //Convert voltage value to TDS value
  //Serial.print("TDS Value = "); 
  //Serial.print(tds_value);
  //Serial.println(" ppm");
  delay(2000);

  return tds_value;
}

void setup() {
  Serial.begin(9600);

  sensorValue = 0;
  tds_value = 0;
  voltage = 0;
  sensorPin = 36;
  pinMode(sensorPin, INPUT);

  connectToAWS();
}

void loop() {
  tds_value = getData();
  
  sendJsonToAWS(tds_value);
  client.loop();
  delay(1000);
}
