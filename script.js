import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAK89kvmMC5AIp3sMHWa7mPAuK28M4Teig",
    authDomain: "filetransferapp-7e0c8.firebaseapp.com",
    projectId: "filetransferapp-7e0c8",
    storageBucket: "filetransferapp-7e0c8.appspot.com",
    messagingSenderId: "1034933951577",
    appId: "1:1034933951577:web:875963fdca36088f5ea548",
    measurementId: "G-42CVE5QV8N"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

document.getElementById('uploadButton').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;

    for (const file of files) {
        const storageRef = ref(storage, `uploads/${file.webkitRelativePath}`);
        try {
            await uploadBytes(storageRef, file);
            console.log(`Uploaded ${file.name}`);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }
});
