// import admin from 'firebase-admin';
// import { getApps } from 'firebase-admin/app'

// const serviceAccount = JSON.parse(
//     process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
// )

// if (!getApps().length){
//     admin.initializeApp({
//         credential: admin.credential.cert(serviceAccount),
//     })
// }

// const adminDb = admin.firestore();

// export { adminDb };

// firebaseAdmin.ts

import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import { Storage } from '@google-cloud/storage';

const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

if (!getApps().length){
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const adminDb = admin.firestore();

const storage = new Storage({
  projectId: process.env.FIREBASE_PROJECT_ID,
  credentials: JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string),
});

const bucketName = process.env.FIREBASE_STORAGE_BUCKET_NAME as string;
const firebaseStorage = storage.bucket(bucketName);

export { adminDb, firebaseStorage };
