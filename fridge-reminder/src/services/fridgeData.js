export function createFridgePayload(items) {
  return {
    generatedAt: new Date().toISOString(),
    items: items.map(({ id, product, expiryDate, quantity, addedAt }) => ({
      id,
      product,
      expiryDate,
      quantity,
      addedAt,
    })),
  };
}

export function downloadJsonFile(payload, filename = "fridge-data.json") {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export async function uploadToFirebase(payload, firebaseUrl) {
  if (!firebaseUrl) {
    throw new Error("Please enter your Firebase Realtime Database URL.");
  }

  const endpoint = firebaseUrl.endsWith(".json") ? firebaseUrl : `${firebaseUrl.replace(/\/$/, "")}.json`;

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Firebase upload failed: ${response.status} ${errorText}`);
  }

  return response.json();
}
