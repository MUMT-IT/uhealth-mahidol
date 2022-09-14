import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import '@firebase/storage';
import {connectFirestoreEmulator} from "firebase/firestore";
import {connectStorageEmulator} from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCy-GU37EF62Xaajdb1nAw4ImteoZncgns",
    authDomain: "uberhealth-c1541.firebaseapp.com",
    projectId: "uberhealth-c1541",
    storageBucket: "uberhealth-c1541.appspot.com",
    messagingSenderId: "115846268061",
    appId: "1:115846268061:web:1d7194ac88891247298074",
    measurementId: "G-CV6PH30VEE"
};

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const storage = getStorage(app)

if (process.env.NODE_ENV === 'development') {
    connectFirestoreEmulator(db, 'localhost', 9080)
    connectStorageEmulator(storage, 'localhost', 9199)
}
export {
    storage,
    db,
}
