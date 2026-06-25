import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

initializeApp({
  credential: cert({
    projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
    privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore();

async function migrate() {
  const snap = await db.collection("tickets").get();
  const batch = db.batch();
  let count = 0;

  for (const doc of snap.docs) {
    const data = doc.data();

    // Skip tickets already migrated
    if (data.statusHistory) continue;

    const initialStatus = data.isValidIssue ? "AI Verified" : "Rejected";
    const createdAt     = data.createdAt ?? new Date().toISOString();

    batch.update(doc.ref, {
      status: initialStatus,
      statusHistory: [
        { status: "Reported",     timestamp: createdAt },
        { status: initialStatus,  timestamp: createdAt, note: "Migrated from legacy status" },
      ],
    });

    count++;

    // Firestore batches max out at 500 operations
    if (count % 499 === 0) {
      await batch.commit();
      console.log(`Committed ${count} updates...`);
    }
  }

  await batch.commit();
  console.log(`Migration complete. Updated ${count} tickets.`);
}

migrate().catch(console.error);
