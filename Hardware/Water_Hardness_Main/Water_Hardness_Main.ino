#include <Arduino.h>
#include "certs.h"
#include <WiFiClientSecure.h>
#include <MQTTClient.h>
#include <ArduinoJson.h>
#include "WiFi.h"

#include <WifiLocation.h>

// DS18B20 Temp Sensor
#include <OneWire.h>
#include <DallasTemperature.h>

// Hardware declerations
// TDS Sensor
int tds_sensor_value;
float tds_value;
float tds_voltage;
int tds_pin;

// Temperature Sensor
const int oneWireBus = 4;     
float temp_value;

OneWire oneWire(oneWireBus);
DallasTemperature temp_sensor(&oneWire);

// PH Sensor
int ph_pin;
float ph_value;
#define Offset -4.00     // Sensor offset precision         
#define ArrayLenth  40   // Collection amount
int pHArray[ArrayLenth]; // Array to average sensor output
int pHArrayIndex=0;

// Turbidity Sensor
int turb_sensor_value;
int turb_pin;
float turb_value;
float turb_voltage;


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
#define DEVICE_NAME ""

// The MQTTT endpoint for the device (unique for each AWS account but shared amongst devices within the account)
#define AWS_IOT_ENDPOINT ""

// The MQTT topic that this device should publish to
#define AWS_IOT_TOPIC ""


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

void sendJsonToAWS(float tds_data, float temp_data, float ph_data, float turb_data)
{ 
  StaticJsonDocument<128> jsonDoc;
  //JsonObject stateObj = jsonDoc.createNestedObject("state");
  //JsonObject reportedObj = stateObj.createNestedObject("reported");
  
  // Write the temperature & humidity. Here you can use any C++ type (and you can refer to variables)
  //reportedObj["tds_value"] = sensor_data;
  jsonDoc["tds_value"] = tds_data;
  jsonDoc["temp_value"] = temp_data;
  jsonDoc["ph_value"] = ph_data;
  jsonDoc["turbidity_value"] = turb_data;
  jsonDoc["latitude"] = latitude;
  jsonDoc["longitude"] = longitude;
  
  // Create a nested object "location"
  //JsonObject locationObj = reportedObj.createNestedObject("location");
  //locationObj["name"] = "Test Water Source";

  Serial.println("\nPublishing message to AWS...");
  serializeJson(jsonDoc, Serial);
  char jsonBuffer[128];
  serializeJson(jsonDoc, jsonBuffer);

  client.publish(AWS_IOT_TOPIC, jsonBuffer);
}

float getTdsData() {
  tds_sensor_value = analogRead(tds_pin);
  tds_voltage = tds_sensor_value*5/4096.0; //Convert analog reading to Voltage
  tds_value = (133.42/tds_voltage*tds_voltage*tds_voltage - 255.86*tds_voltage*tds_voltage + 857.39*tds_voltage)*0.5; //Convert voltage value to TDS value
  Serial.print("TDS Value: "); 
  Serial.print(tds_value);
  Serial.println(" ppm");
  delay(2000);

  return tds_value;
}

float getTempData() {
  temp_sensor.requestTemperatures(); 
  float temperature = temp_sensor.getTempFByIndex(0);
  Serial.print("Temperature value: ");
  Serial.print(temperature);
  Serial.println("ºF");
  delay(2000);

  return temperature;
}

// Open source code provided by sensor vendor DFROBOT: https://wiki.dfrobot.com/PH_meter_SKU__SEN0161_
float getPhData() {
  static float pHValue,voltage;

  while(pHArrayIndex != ArrayLenth){
      pHArray[pHArrayIndex++] = analogRead(ph_pin);
  }
  if(pHArrayIndex == ArrayLenth)pHArrayIndex = 0;
  voltage = avergearray(pHArray, ArrayLenth)*5.0/4096;
  pHValue = 3.5*voltage+Offset;
  
  Serial.print("pH value: ");
  Serial.println(pHValue ,2);
    
  return pHValue;
}

// Open source code provided by sensor vendor DFROBOT: https://wiki.dfrobot.com/PH_meter_SKU__SEN0161_
double avergearray(int* arr, int number){
  int i;
  int max,min;
  double avg;
  long amount=0;
  if(number<=0){
    Serial.println("Error number for the array to avraging!/n");
    return 0;
  }
  if(number<5){   
    for(i=0;i<number;i++){
      amount+=arr[i];
    }
    avg = amount/number;
    return avg;
  }else{
    if(arr[0]<arr[1]){
      min = arr[0];max=arr[1];
    }
    else{
      min=arr[1];max=arr[0];
    }
    for(i=2;i<number;i++){
      if(arr[i]<min){
        amount+=min;        
        min=arr[i];
      }else {
        if(arr[i]>max){
          amount+=max;   
          max=arr[i];
        }else{
          amount+=arr[i]; 
        }
      }
    }
    avg = (double)amount/(number-2);
  }
  return avg;
}

float getTurbidityData() {
  turb_sensor_value = analogRead(turb_pin);
  turb_voltage = turb_sensor_value * (5.0 / 4096.0); // Convert the analog reading (which goes from 0 - 1023) to a voltage (0 - 5V):
  turb_value = turb_voltage;
  Serial.print("Turbidity Value: "); 
  Serial.print(turb_value);
  Serial.println(" NTU");
  delay(2000);

  return turb_value;
}

void setup() {
  Serial.begin(9600);

  // Hardware setup
  tds_sensor_value = 0;
  tds_value = 0;
  tds_voltage = 0;
  tds_pin = 36;
  pinMode(tds_pin, INPUT);

  // Start the DS18B20 sensor
  temp_sensor.begin();
  temp_value = 0;

  // Ph sensor setup
  ph_pin = 39;
  ph_value = 0;
  pinMode(ph_pin, INPUT);

  // Turbidity sensor setup
  turb_pin = 34;
  turb_value = 0;
  turb_voltage = 0;

  // Location setup
  longitude = 0;
  latitude = 0;

  connectToWifi();
  getLocation();
  connectToAWS();
}

void loop() {
  tds_value = getTdsData();
  temp_value = getTempData();
  ph_value = getPhData();
  turb_value = getTurbidityData();
  Serial.println("");
  
  //sendJsonToAWS(tds_value, temp_value, ph_value, turb_value);
  client.loop();
  delay(1000);
}
