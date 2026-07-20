#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <time.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3C
#define BTN_DOWN D2
#define BTN_UP D3

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* FIREBASE_HOST = "YOUR_PROJECT_ID.firebaseio.com";
const char* FIREBASE_AUTH = "YOUR_DATABASE_SECRET";

const char* NTP_SERVER = "pool.ntp.org";
const long GMT_OFFSET_SEC = 19800;
const int DAYLIGHT_OFFSET_SEC = 0;

#define ROWS_PER_PAGE 8
#define STATUS_EXPIRED 0
#define STATUS_EXPIRING 1
#define STATUS_FRESH 2

struct Product {
  String name;
  String expiryDate;
  int daysLeft;
  int status;
};

Product products[20];
int productCount = 0;
int page = 0;

unsigned long lastBlink = 0;
bool blinkOn = true;
unsigned long lastFetch = 0;
#define FETCH_INTERVAL 30000

void setup() {
  Serial.begin(115200);
  delay(1000);

  pinMode(BTN_DOWN, INPUT_PULLUP);
  pinMode(BTN_UP, INPUT_PULLUP);

  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println("SSD1306 failed");
    for (;;);
  }

  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(20, 28);
  display.println("Smart Fridge");
  display.display();
  delay(1500);

  connectWiFi();

  if (WiFi.status() == WL_CONNECTED) {
    configTime(GMT_OFFSET_SEC, DAYLIGHT_OFFSET_SEC, NTP_SERVER);
    fetchFromFirebase();
    sortProducts();
  }

  drawProducts();
}

void loop() {
  unsigned long now = millis();

  if (now - lastBlink > getBlinkInterval()) {
    lastBlink = now;
    blinkOn = !blinkOn;
    drawProducts();
  }

  if (digitalRead(BTN_DOWN) == LOW) {
    delay(50);
    if (digitalRead(BTN_DOWN) == LOW) {
      int totalPages = (productCount + ROWS_PER_PAGE - 1) / ROWS_PER_PAGE;
      if (totalPages > 0) {
        page = (page + 1) % totalPages;
        drawProducts();
      }
      while (digitalRead(BTN_DOWN) == LOW) delay(10);
      delay(50);
    }
  }

  if (digitalRead(BTN_UP) == LOW) {
    delay(50);
    if (digitalRead(BTN_UP) == LOW) {
      int totalPages = (productCount + ROWS_PER_PAGE - 1) / ROWS_PER_PAGE;
      if (totalPages > 0) {
        page = (page - 1 + totalPages) % totalPages;
        drawProducts();
      }
      while (digitalRead(BTN_UP) == LOW) delay(10);
      delay(50);
    }
  }

  if (now - lastFetch > FETCH_INTERVAL) {
    lastFetch = now;
    if (WiFi.status() == WL_CONNECTED) {
      fetchFromFirebase();
      sortProducts();
      drawProducts();
    }
  }

  if (WiFi.status() != WL_CONNECTED) {
    static unsigned long lastReconnect = 0;
    if (now - lastReconnect > 10000) {
      lastReconnect = now;
      connectWiFi();
    }
  }
}

unsigned long getBlinkInterval() {
  int start = page * ROWS_PER_PAGE;
  for (int i = start; i < productCount && i < start + ROWS_PER_PAGE; i++) {
    if (products[i].status == STATUS_EXPIRED) return 200;
    if (products[i].status == STATUS_EXPIRING) return 500;
  }
  return 999999;
}

void drawProducts() {
  display.clearDisplay();

  int start = page * ROWS_PER_PAGE;
  int count = 0;

  for (int i = start; i < productCount && count < ROWS_PER_PAGE; i++) {
    int y = count * 8;

    bool hide = false;
    if (products[i].status == STATUS_EXPIRED || products[i].status == STATUS_EXPIRING) {
      hide = !blinkOn;
    }

    if (!hide) {
      String name = products[i].name;
      if (name.length() > 11) name = name.substring(0, 9) + "..";

      String date = products[i].expiryDate.substring(5);

      display.setCursor(0, y);
      display.print(name);
      display.setCursor(90, y);
      display.print(date);
    }

    count++;
  }

  display.display();
}

void sortProducts() {
  for (int i = 0; i < productCount; i++) {
    products[i].daysLeft = calculateDaysLeft(products[i].expiryDate);
    if (products[i].daysLeft < 0) products[i].status = STATUS_EXPIRED;
    else if (products[i].daysLeft <= 7) products[i].status = STATUS_EXPIRING;
    else products[i].status = STATUS_FRESH;
  }

  for (int i = 0; i < productCount - 1; i++) {
    for (int j = i + 1; j < productCount; j++) {
      if (products[j].status < products[i].status) {
        Product temp = products[i];
        products[i] = products[j];
        products[j] = temp;
      }
    }
  }
}

void connectWiFi() {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.print("WiFi...");
  display.display();

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    display.print(".");
    display.display();
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    display.clearDisplay();
    display.setCursor(0, 0);
    display.println("Connected");
    display.display();
    delay(1000);
  } else {
    display.clearDisplay();
    display.setCursor(0, 0);
    display.println("WiFi Failed");
    display.display();
    delay(2000);
  }
}

void fetchFromFirebase() {
  productCount = 0;

  String url = "https://";
  url += FIREBASE_HOST;
  url += "/items.json?auth=";
  url += FIREBASE_AUTH;

  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient https;
  https.begin(client, url);
  https.setTimeout(10000);

  int httpCode = https.GET();

  if (httpCode == HTTP_CODE_OK) {
    String payload = https.getString();
    parseProducts(payload);
  }

  https.end();
}

void parseProducts(const String& payload) {
  DynamicJsonDocument doc(8192);
  DeserializationError error = deserializeJson(doc, payload);

  if (error) return;

  if (doc.is<JsonArray>()) {
    JsonArray arr = doc.as<JsonArray>();
    for (JsonObject item : arr) {
      if (productCount >= 20) break;
      if (item.containsKey("product") && item.containsKey("expiryDate")) {
        products[productCount].name = item["product"].as<String>();
        products[productCount].expiryDate = item["expiryDate"].as<String>();
        productCount++;
      }
    }
  } else if (doc.is<JsonObject>()) {
    JsonObject obj = doc.as<JsonObject>();
    if (obj.containsKey("items") && obj["items"].is<JsonArray>()) {
      JsonArray arr = obj["items"].as<JsonArray>();
      for (JsonObject item : arr) {
        if (productCount >= 20) break;
        if (item.containsKey("product") && item.containsKey("expiryDate")) {
          products[productCount].name = item["product"].as<String>();
          products[productCount].expiryDate = item["expiryDate"].as<String>();
          productCount++;
        }
      }
    }
  }
}

int calculateDaysLeft(const String& expiryDate) {
  int year = expiryDate.substring(0, 4).toInt();
  int month = expiryDate.substring(5, 7).toInt();
  int day = expiryDate.substring(8, 10).toInt();

  time_t now = time(nullptr);
  struct tm* timeinfo = localtime(&now);

  int todayYear = timeinfo->tm_year + 1900;
  int todayMonth = timeinfo->tm_mon + 1;
  int todayDay = timeinfo->tm_mday;

  int totalDaysToday = todayYear * 365 + todayMonth * 30 + todayDay;
  int totalDaysExpiry = year * 365 + month * 30 + day;

  return totalDaysExpiry - totalDaysToday;
}
