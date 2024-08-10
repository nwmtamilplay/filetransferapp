'use strict';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAK89kvmMC5AIp3sMHWa7mPAuK28M4Teig",
    authDomain: "filetransferapp-7e0c8.firebaseapp.com",
    projectId: "filetransferapp-7e0c8",
    storageBucket: "filetransferapp-7e0c8.appspot.com",
    messagingSenderId: "1034933951577",
    appId: "1:1034933951577:web:875963fdca36088f5ea548",
    measurementId: "G-42CVE5QV8N"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const imageDisplay = document.getElementById('imageDisplay');
const readImageDisplay = document.getElementById('readImageDisplay');
const uploadButton = document.getElementById('uploadButton');
const downloadKeyGenerate = document.getElementById('download-key-generate');
const downloadKey = document.getElementById('download-key');
const imageExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'webp', 'svg', 'ico'];
const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 'mpeg', 'mpg', 'm4v', '3gp', 'ogg', 'ogv', 'mts'];
let sentFile;

// Handle drag events
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('dragover');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragover');
});

dropArea.addEventListener('drop', async (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    const maxSize = 100 * 1024 * 1024; // 2 MB limit, change this value as needed
    if (file.size > maxSize) {
        alert('File size exceeds 100 MB. Please upload a smaller file.');
        this.value = ''; // Clear the file input
    }
    console.log(file)
    const fileExtension = file.name.split('.').pop().toLowerCase();
    sentFile = file;
    const reader = new FileReader();
    reader.onload = function (event) {
        // Display the image
        const base64String = event.target.result;
        if (imageExtensions.includes(fileExtension)) {
            imageDisplay.querySelector('img').src = base64String;
            imageDisplay.querySelector('img').classList.remove('d-none');
        } else {
            if (videoExtensions.includes(fileExtension)) {
                imageDisplay.querySelector('img').src = `https://placehold.co/600x400/EEE/00000079?text=Video.${fileExtension}`;
                imageDisplay.querySelector('img').classList.remove('d-none');
            } else {
                imageDisplay.querySelector('img').src = 'https://placehold.co/600x400/EEE/00000079?text=No+Preview';
            }

        }

        imageDisplay.querySelector('h5').textContent = file.name;
        imageDisplay.classList.remove('d-none');
        dropArea.classList.add('d-none')
        uploadButton.classList.add('active')
    };
    reader.readAsDataURL(file);
});

// Handle file input click
dropArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    const maxSize = 100 * 1024 * 1024; // 2 MB limit, change this value as needed
    if (file.size > maxSize) {
        alert('File size exceeds 100 MB. Please upload a smaller file.');
        this.value = ''; // Clear the file input
    }
    sentFile = file;
    const fileExtension = file.name.split('.').pop().toLowerCase();
    console.log(fileExtension)
    const reader = new FileReader();
    reader.onload = function (event) {
        // Display the image
        const base64String = event.target.result;
        if (imageExtensions.includes(fileExtension)) {
            imageDisplay.querySelector('img').src = base64String;
            imageDisplay.querySelector('img').classList.remove('d-none');
        } else {
            if (videoExtensions.includes(fileExtension)) {
                imageDisplay.querySelector('img').src = `https://placehold.co/600x400/EEE/00000079?text=Video.`;
                imageDisplay.querySelector('img').classList.remove('d-none');
            } else {
                imageDisplay.querySelector('img').src = 'https://placehold.co/600x400/EEE/00000079?text=No+Preview';
            }

        }

        imageDisplay.querySelector('h5').textContent = file.name;
        imageDisplay.classList.remove('d-none');
        dropArea.classList.add('d-none')
        uploadButton.classList.add('active')
    };
    reader.readAsDataURL(file);

});
function generateRandomFiveDigitNumber() {
    return Math.floor(10000 + Math.random() * 90000);
}
// Function to handle file uploads
async function handleFile(file) {
    document.querySelector('#sender').textContent = "Uploading..."
    const key = generateRandomFiveDigitNumber();
    const storageRef = ref(storage, `uploads/${key}-${file.name}`);
    try {
        await uploadBytes(storageRef, file);
        console.log(`Uploaded ${file.name}`);
        downloadKeyGenerate.classList.remove('d-none');
        downloadKeyGenerate.querySelector('input').value = key;
        document.querySelector('#sender').textContent = 'Copy Download Key and Share';
        imageDisplay.classList.add('d-none');
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}
document.querySelector('#copy-btn').addEventListener('click', () => {
    const input = downloadKeyGenerate.querySelector('input')
    navigator.clipboard.writeText(input.value).then(() => {
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
})
document.querySelector('#paste-btn').addEventListener('click', () => {
    const inputToPaste = downloadKey.querySelector('input')
    navigator.clipboard.readText().then((text) => {
        inputToPaste.value = text;
        readFile(text);
    }).catch(err => {
        console.error('Failed to read clipboard contents: ', err);
    });
});
uploadButton.addEventListener('click', async () => {
    uploadButton.remove();
    const file = sentFile;
    if (file) {
        await handleFile(file);
    }
});

async function readFile(key) {
    document.querySelector("#receiver").textContent = "Loading..."
    const storageRef = ref(storage, 'uploads/'); // Directory path
    try {
        const res = await listAll(storageRef);
        res.items.forEach(async (itemRef) => {
            document.querySelector("#receiver").textContent = "Received"
            const url = await getDownloadURL(itemRef);
            if (itemRef.name.includes(key)) {
                const fileExtension = itemRef.name.split('.').pop().toLowerCase();
                // Display the image
                if (imageExtensions.includes(fileExtension)) {
                    readImageDisplay.querySelector('img').src = url;
                    readImageDisplay.querySelector('img').classList.remove('d-none');
                } else {
                    if (videoExtensions.includes(fileExtension)) {
                        readImageDisplay.querySelector('video').src = url;
                        readImageDisplay.querySelector('video').classList.remove('d-none');
                    } else {
                        readImageDisplay.querySelector('img').src = 'https://placehold.co/600x400/EEE/00000079?text=No+Preview';
                    }

                }
                readImageDisplay.querySelector('h5').textContent = itemRef.name;
                readImageDisplay.classList.remove('d-none');
                downloadKey.classList.add("d-none")
                document.querySelector("#downloadButton").classList.add("active")
                document.querySelector("#downloadButton").addEventListener("click", () => {
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = itemRef.name; // Use the file name from Firebase Storage
                    a.click();
                })
                return true;
            }

        });

    } catch (e) {
        console.error('Error downloading files individually: ', e);
    }
}

downloadKey.querySelector('input').addEventListener('input', () => {
    const textInput = downloadKey.querySelector('input').value;
    const wordCount = textInput.trim().split("").filter(Boolean).length; // Count words
    console.log(wordCount)
    if (wordCount == 5) {
        let result = readFile(textInput);
    }

});
// document.getElementById('downloadButton').addEventListener('click', downloadFilesIndividually);