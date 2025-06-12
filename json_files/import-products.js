import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

// 🔐 Load your service account key
const serviceAccount = JSON.parse(
  fs.readFileSync('./e-commerce-chatbot-ec4f8-firebase-adminsdk-fbsvc-90e9c84d7f.json')
);

// ✅ Explicitly include projectId here
initializeApp({
  credential: cert(serviceAccount),
  projectId: 'e-commerce-chatbot-ec4f8'
});

const db = getFirestore();

// 📦 Load the products.json file
const products = JSON.parse(fs.readFileSync('./products.json', 'utf8'));

// 🚀 Upload logic
async function uploadProducts() {
  const batch = db.batch();

  for (const item of products) {
    const docRef = db.collection('products').doc(item.id);
    batch.set(docRef, item);
  }

  try {
    await batch.commit();
    console.log(`✅ Successfully uploaded ${products.length} products.`);
  } catch (err) {
    console.error("❌ Upload failed:", err);
  }
}

uploadProducts();
