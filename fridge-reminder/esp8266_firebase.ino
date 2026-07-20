#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* FIREBASE_URL = "https://YOUR_PROJECT_ID.firebaseio.com/products.json";

void setup() {
  Serial.begin(115200);
  delay(1000);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  fetchProductsFromFirebase();
  delay(15000);
}

void fetchProductsFromFirebase() {
  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient https;
  if (!https.begin(client, FIREBASE_URL)) {
    Serial.println("Failed to connect to Firebase URL");
    return;
  }

  int httpCode = https.GET();
  if (httpCode > 0) {
    if (httpCode == HTTP_CODE_OK) {
      String payload = https.getString();
      Serial.println("Firebase payload:");
      Serial.println(payload);

      DynamicJsonDocument doc(4096);
      DeserializationError error = deserializeJson(doc, payload);
      if (error) {
        Serial.print("JSON parse failed: ");
        Serial.println(error.c_str());
        https.end();
        return;
      }

      if (!doc.containsKey("products")) {
        Serial.println("No 'products' key found in database.");
        https.end();
        return;
      }

      JsonObject products = doc["products"].as<JsonObject>();
      for (JsonPair pair : products) {
        JsonObject product = pair.value().as<JsonObject>();
        Serial.println("-------------------------");
        Serial.print("Product ID: ");
        Serial.println(pair.key().c_str());
        Serial.print("Name: ");
        Serial.println(product["name"].as<const char*>());
        Serial.print("Quantity: ");
        Serial.println(product["quantity"].as<const char*>());
        Serial.print("Expiry: ");
        Serial.println(product["expiryDate"].as<const char*>());
        Serial.print("Status: ");
        Serial.println(product["status"].as<const char*>());
      }
    }
  } else {
    Serial.print("GET failed, error: ");
    Serial.println(https.errorToString(httpCode).c_str());
  }

  https.end();
}
