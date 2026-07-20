# ESP8266 + Firebase product viewer

This folder contains a minimal setup for reading product data from Firebase Realtime Database on an ESP8266.

## 1) Firebase setup
1. Create a Firebase project.
2. Enable Realtime Database.
3. Set the database rules to allow read access for testing:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

4. Upload sample data using the Node script:

```bash
node firebase_upload_example.js
```

## 2) Arduino setup
1. Open the Arduino IDE.
2. Install these libraries:
   - ESP8266WiFi
   - ESP8266HTTPClient
   - ArduinoJson
3. Replace the placeholders in the sketch:
   - YOUR_WIFI_SSID
   - YOUR_WIFI_PASSWORD
   - YOUR_PROJECT_ID
4. Upload the sketch to the ESP8266.
5. Open the Serial Monitor to view the products.

## 3) Data structure
The ESP8266 reads the following path:

```json
{
  "products": {
    "milk": {
      "name": "Milk",
      "quantity": "2 liters",
      "expiryDate": "2026-07-25",
      "status": "Expiring Soon"
    }
  }
}
```
