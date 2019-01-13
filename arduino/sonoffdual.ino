#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>

#define Led_1 13
#define Relay_1 12
#define Relay_2 5

// Set these to run example.
#define FIREBASE_HOST "lamparas11.firebaseio.com"
#define FIREBASE_AUTH ""
#define WIFI_SSID "MOVISTAR_419C"
#define WIFI_PASSWORD "EkxzSLpNqDv7LS7n9qW4"

#define PARADO 0
#define SUBIENDO 1
#define BAJANDO 2

void setupWifi() {
 digitalWrite(Led_1, false);
 WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
 Serial.print("connecting");
 while (WiFi.status() != WL_CONNECTED) {
   Serial.print(".");
   delay(500);
 }
 
 Serial.println();
 Serial.print("connected: ");
 Serial.println(WiFi.localIP());
  digitalWrite(Led_1, true);
}

void setup() {
  
 Serial.begin(115200);
 pinMode(Relay_1, OUTPUT);
 pinMode(Relay_2, OUTPUT);
 pinMode(Led_1, OUTPUT);
 
 digitalWrite(Relay_1, false);
 digitalWrite(Relay_2, false);
 digitalWrite(Led_1, true);

 setupWifi();
 
 Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}

int state = PARADO;
int new_state = PARADO;

void loop() {

 if (WiFi.status() != WL_CONNECTED) {
   setupWifi();
 }
  
 new_state = Firebase.getInt("/persianas/salon1");

 if (Firebase.failed())
 {
  Serial.print("setting number failed:");
  Serial.println(Firebase.error());
  ESP.reset();
 }

 if(new_state != state)
 {
    state = new_state;
  
    apagar();
    
    if(state == SUBIENDO){ subir(); }
    if(state == BAJANDO){ bajar(); }
    
 }
 
 // get value 
 Serial.print("state: ");
 Serial.println(state);
 
 Serial.println("________________________");
 delay(3000);

 // Parpadeamos para saber que esta funcionando
 digitalWrite(Led_1, false);
 delay(300);
 digitalWrite(Led_1, true);
}

void apagar()
{
   digitalWrite(Relay_1, false);
   digitalWrite(Relay_2, false);
   delay(300);
}

void subir()
{
   digitalWrite(Relay_1, true);
   digitalWrite(Relay_2, false);
   delay(300);
}

void bajar()
{
   digitalWrite(Relay_1, false);
   digitalWrite(Relay_2, true);
   delay(300);
}