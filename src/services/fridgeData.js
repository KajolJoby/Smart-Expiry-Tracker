export function createFridgePayload(items) {
  return {
    generatedAt: new Date().toISOString(),
    items: items.map(({ id, product, expiryDate, quantity, addedAt }) => ({
      id,
      product,
      expiryDate,
      quantity,
      addedAt: addedAt?.toDate ? addedAt.toDate().toISOString() : addedAt,
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
