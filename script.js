const uploadButton = document.getElementById('uploadBtn');
const stickerFileInput = document.getElementById('stickerFile');
const stickerGallery = document.getElementById('sticker-gallery');

// Load stickers from localStorage on page load
window.onload = function() {
    loadStickers();
};

// Upload sticker function
uploadButton.addEventListener('click', function() {
    const file = stickerFileInput.files[0];  // Get the selected file

    // Log the selected file to the console
    console.log("Selected file:", file);

    if (!file) {
        alert('Please select a sticker to upload!');
        return;
    }

    // Create a FileReader to read the image
    const reader = new FileReader();

    reader.onload = function(event) {
        console.log("File loaded successfully!");  // Log when the file is loaded successfully
        console.log("Image Data URL:", event.target.result);  // Log the Data URL of the image

        // Create an image element for the uploaded sticker
        const img = document.createElement('img');
        img.src = event.target.result;  // Set image source to the loaded file's Data URL
        img.alt = file.name;

        img.onload = function() {
            console.log("Image loaded into DOM successfully!");  // Log image load
        }

        img.onerror = function() {
            console.error("Error loading image!");  // Log error if image fails to load
        }

        // Create a div for the sticker
        const stickerDiv = document.createElement('div');
        stickerDiv.classList.add('sticker');
        
        // Add image to sticker div
        stickerDiv.appendChild(img);

        // Add the sticker to the gallery
        stickerGallery.appendChild(stickerDiv);

        console.log("Sticker added to gallery.");  // Log when the sticker is added

        trackAdsConversion('upload');
    };

    reader.readAsDataURL(file);  // Read the file as a Data URL (base64 string)
});

// Save sticker to localStorage
function saveStickerToLocalStorage(stickerSrc) {
    let stickers = JSON.parse(localStorage.getItem('stickers')) || [];
    stickers.push(stickerSrc);
    localStorage.setItem('stickers', JSON.stringify(stickers));
}

// Load stickers from localStorage and display them
function loadStickers() {
    let stickers = JSON.parse(localStorage.getItem('stickers')) || [];

    stickers.forEach(sticker => {
        const img = document.createElement('img');
        img.src = sticker;
        img.alt = 'Sticker';

        const stickerDiv = document.createElement('div');
        stickerDiv.classList.add('sticker');
        stickerDiv.appendChild(img);

        stickerGallery.appendChild(stickerDiv);
    });
}

// Download all stickers as a ZIP file
const downloadButton = document.getElementById('downloadBtn');
downloadButton.addEventListener('click', function() {
    let stickers = JSON.parse(localStorage.getItem('stickers')) || [];
    if (stickers.length === 0) {
        alert('No stickers available for download!');
        return;
    }

    // Create a zip file
    const zip = new JSZip();
    stickers.forEach((sticker, index) => {
        // Fetch the image from local storage and add it to the zip
        fetch(sticker)
            .then(response => response.blob())
            .then(blob => {
                zip.file(`sticker${index + 1}.png`, blob);
                if (index === stickers.length - 1) {
                    // Generate the zip file
                    zip.generateAsync({ type: "blob" })
                        .then(function(content) {
                            // Trigger the download
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(content);
                            link.download = 'stickers.zip';
                            link.click();
                            trackAdsConversion('download', { value: stickers.length });
                        });
                }
            });
    });
});
