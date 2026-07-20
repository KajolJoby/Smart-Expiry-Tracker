const DATABASE_URL = process.env.FIREBASE_DATABASE_URL || "https://YOUR_PROJECT_ID.firebaseio.com";
const DATABASE_SECRET = process.env.FIREBASE_DATABASE_SECRET || "YOUR_DATABASE_SECRET";

const payload = [
  { id: 1, product: "Milk", expiryDate: "2026-07-25", quantity: 1, addedAt: new Date().toISOString() },
  { id: 2, product: "Eggs", expiryDate: "2026-07-28", quantity: 12, addedAt: new Date().toISOString() },
  { id: 3, product: "Yogurt", expiryDate: "2026-07-22", quantity: 2, addedAt: new Date().toISOString() },
  { id: 4, product: "Cheese", expiryDate: "2026-08-10", quantity: 1, addedAt: new Date().toISOString() },
  { id: 5, product: "Butter", expiryDate: "2026-07-21", quantity: 1, addedAt: new Date().toISOString() },
  { id: 6, product: "Apples", expiryDate: "2026-08-05", quantity: 6, addedAt: new Date().toISOString() },
  { id: 7, product: "Chicken", expiryDate: "2026-07-23", quantity: 1, addedAt: new Date().toISOString() },
  { id: 8, product: "Spinach", expiryDate: "2026-07-21", quantity: 1, addedAt: new Date().toISOString() }
];

async function uploadProducts() {
  const endpoint = `${DATABASE_URL}/items.json?auth=${DATABASE_SECRET}`;

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${await response.text()}`);
  }

  console.log("Products uploaded to Firebase /items");
  console.log(await response.text());
}

uploadProducts().catch((error) => {
  console.error(error);
  process.exit(1);
});
