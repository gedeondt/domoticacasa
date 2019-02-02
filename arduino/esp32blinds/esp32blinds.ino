#include <WiFi.h>
#include <FirebaseESP32.h>
#include <Update.h>
#include <WebServer.h>


#define FIREBASE_HOST "lamparas11.firebaseio.com"
#define FIREBASE_AUTH ""
#define WIFI_SSID "MOVISTAR_419C"
#define WIFI_PASSWORD ""

#define VERSION 0
#define TYPE "blind"

#define Relay_1 22
#define Relay_2 23

#define PARADO 0
#define SUBIENDO 1
#define BAJANDO 2

#define RELAY_ON 0
#define RELAY_OFF 1

WebServer server(80);

const char* serverIndex = 
"<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js'></script>"
"<form method='POST' action='#' enctype='multipart/form-data' id='upload_form'>"
   "<input type='file' name='update'>"
        "<input type='submit' value='Update'>"
    "</form>"
 "<div id='prg'>progress: 0%</div>"
 "<script>"
  "$('form').submit(function(e){"
  "e.preventDefault();"
  "var form = $('#upload_form')[0];"
  "var data = new FormData(form);"
  " $.ajax({"
  "url: '/update',"
  "type: 'POST',"
  "data: data,"
  "contentType: false,"
  "processData:false,"
  "xhr: function() {"
  "var xhr = new window.XMLHttpRequest();"
  "xhr.upload.addEventListener('progress', function(evt) {"
  "if (evt.lengthComputable) {"
  "var per = evt.loaded / evt.total;"
  "$('#prg').html('progress: ' + Math.round(per*100) + '%');"
  "}"
  "}, false);"
  "return xhr;"
  "},"
  "success:function(d, s) {"
  "console.log('success!')" 
 "},"
 "error: function (a, b, c) {"
 "}"
 "});"
 "});"
 "</script>";


void setupServer() {
  server.on("/", HTTP_GET, []() {
    server.sendHeader("Connection", "close");
    server.send(200, "text/html", serverIndex);
  });

  server.on("/update", HTTP_POST, []() {
    server.sendHeader("Connection", "close");
    server.send(200, "text/plain", (Update.hasError()) ? "FAIL" : "OK");
    ESP.restart();
  }, []() {
    HTTPUpload& upload = server.upload();
    if (upload.status == UPLOAD_FILE_START) {
      Serial.printf("Update: %s\n", upload.filename.c_str());
      if (!Update.begin(UPDATE_SIZE_UNKNOWN)) { //start with max available size
        Update.printError(Serial);
      }
    } else if (upload.status == UPLOAD_FILE_WRITE) {
      /* flashing firmware to ESP*/
      if (Update.write(upload.buf, upload.currentSize) != upload.currentSize) {
        Update.printError(Serial);
      }
    } else if (upload.status == UPLOAD_FILE_END) {
      if (Update.end(true)) { //true to set the size to the current progress
        Serial.printf("Update Success: %u\nRebooting...\n", upload.totalSize);
      } else {
        Update.printError(Serial);
      }
    }
  });
  server.begin();
}

void setupWifi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP()); 

  Serial.println();
  Serial.print("Mac: ");
  Serial.println(WiFi.macAddress());
}

void setup() {

  pinMode(Relay_1, OUTPUT);
  pinMode(Relay_2, OUTPUT);

  apagar();

  Serial.begin(115200);

  setupWifi();

  setupServer();

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.stream("/devices/"+WiFi.macAddress()+"/value", streamCallback);
  Firebase.setString("/devices/"+WiFi.macAddress()+"/ip", String(WiFi.localIP().toString()));
  Firebase.setString("/devices/"+WiFi.macAddress()+"/type", TYPE);
  Firebase.setInt("/devices/"+WiFi.macAddress()+"/version", VERSION);

}

void loop() {

  // Reconectar al wifi si se ha perdido
  if (WiFi.status() != WL_CONNECTED) {
    setupWifi();
  }

  server.handleClient();

  Serial.println("A la espera");
  delay(1000);
}

int state = PARADO;
int new_state = PARADO;

void streamCallback(streamResult event) {

  Serial.println("Cambio de estado: " + String(event.getInt()));
  
  new_state = event.getInt();
  if(new_state != state)
  {
    state = new_state;
    apagar();
    if(state == SUBIENDO){ subir(); }
    if(state == BAJANDO){ bajar(); }
  }
}

void apagar()
{
   digitalWrite(Relay_1, RELAY_OFF);
   digitalWrite(Relay_2, RELAY_OFF);
   delay(300);
}

void subir()
{
   digitalWrite(Relay_1, RELAY_ON);
   digitalWrite(Relay_2, RELAY_OFF);
   delay(300);
}

void bajar()
{
   digitalWrite(Relay_1, RELAY_OFF);
   digitalWrite(Relay_2, RELAY_ON);
   delay(300);
}
