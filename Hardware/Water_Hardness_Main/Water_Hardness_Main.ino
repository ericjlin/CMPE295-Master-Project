#include <Arduino.h>
#include "certs.h"
#include <WiFiClientSecure.h>
#include <MQTTClient.h>
#include <ArduinoJson.h>
#include "WiFi.h"

#include <WifiLocation.h>


// Hardware declerations
int sensorValue;
float tds_value;
float voltage;

int sensorPin;


// Location declerations
float longitude;
float latitude;


// Wifi credentials
const char *WIFI_SSID = "";
const char *WIFI_PASSWORD = "";


// Google API key for GeoLocation
const char* googleApiKey = "";

WifiLocation location (googleApiKey);


// The name of the device. This MUST match up with the name defined in the AWS console
#define DEVICE_NAME "my-esp32-device"

// The MQTTT endpoint for the device (unique for each AWS account but shared amongst devices within the account)
#define AWS_IOT_ENDPOINT ""

// The MQTT topic that this device should publish to
#define AWS_IOT_TOPIC "device/22/data"


WiFiClientSecure net = WiFiClientSecure();
MQTTClient client = MQTTClient(256);


// Set time via NTP, as required for x.509 validation (Open Source method from WifiLocation by Germán Martín)
void setClock () {
    configTime (0, 0, "pool.ntp.org", "time.nist.gov");

    Serial.print ("Waiting for NTP time sync: ");
    time_t now = time (nullptr);
    while (now < 8 * 3600 * 2) {
        delay (500);
        Serial.print (".");
        now = time (nullptr);
    }
    Serial.println();
}

void connectToWifi()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nConnected to WiFi!");
}

void getLocation()
{
  while(latitude == 0 && longitude == 0) {
    setClock ();  
    location_t loc = location.getGeoFromWiFi();

    latitude = loc.lat;
    longitude = loc.lon;
  }
  
  Serial.print("Location: "); 
  Serial.print(latitude, 7);
  Serial.print(", ");
  Serial.println(longitude, 7);
}

void connectToAWS()
{  
  // Configure WiFiClientSecure to use the AWS certificates we generated
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);

  // Connect to the MQTT broker on the AWS endpoint we defined earlier
  client.begin(AWS_IOT_ENDPOINT, 8883, net);

  Serial.print("Connecting to AWS IOT");

  while (!client.connect(DEVICE_NAME)) {
    Serial.print(".");
    delay(100);
  }

  // If we land here, we have successfully connected to AWS!
  // And we can subscribe to topics and send messages.
  Serial.println("\nConnected to AWS IOT!");
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
  Serial.print("TDS Value = "); 
  Serial.print(tds_value);
  Serial.println(" ppm");
  delay(2000);

  return tds_value;
}

void setup() {
  Serial.begin(9600);

  // Hardware setup
  sensorValue = 0;
  tds_value = 0;
  voltage = 0;
  sensorPin = 36;
  pinMode(sensorPin, INPUT);

  // Location setup
  longitude = 0;
  latitude = 0;

  connectToWifi();
  getLocation();
  connectToAWS();
}

void loop() {
  tds_value = getData();
  
  sendJsonToAWS(tds_value);
  client.loop();
  delay(1000);
}
