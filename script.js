document.addEventListener('DOMContentLoaded', function () {
    // --- Theme toggle functionality ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeLabel = document.getElementById('theme-label');

    // Check for saved theme preference in localStorage or use system scheme
    const savedTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    // Apply the saved or system theme on load
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
        themeLabel.textContent = 'Modo Oscuro';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.checked = false;
        themeLabel.textContent = 'Modo Claro';
    }

    // Event listener for theme toggle switch
    themeToggle.addEventListener('change', function () {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark'); // Save preference
            themeLabel.textContent = 'Modo Oscuro';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light'); // Save preference
            themeLabel.textContent = 'Modo Claro';
        }
    });

    // --- Bio edit functionality ---
    const editBioBtn = document.getElementById('edit-bio-btn');
    const bioModal = document.getElementById('bio-modal');
    const closeBioModal = bioModal.querySelector('.close-btn');
    const saveBioBtn = document.getElementById('save-bio-btn');
    const bioTextarea = document.getElementById('bio-textarea');
    const userBio = document.getElementById('user-bio');

    // Load saved bio from localStorage or set default
    const savedBio = localStorage.getItem('userBio');
    if (savedBio) {
        userBio.textContent = savedBio;
    }

    // Open bio edit modal
    editBioBtn.addEventListener('click', function () {
        bioTextarea.value = userBio.textContent;
        bioModal.style.display = 'flex'; // Show modal
    });

    // Close bio edit modal
    closeBioModal.addEventListener('click', function () {
        bioModal.style.display = 'none'; // Hide modal
    });

    // Save bio from textarea
    saveBioBtn.addEventListener('click', function () {
        userBio.textContent = bioTextarea.value;
        localStorage.setItem('userBio', bioTextarea.value); // Save bio to localStorage
        bioModal.style.display = 'none'; // Hide modal
    });

    // --- Profile picture and Cover photo change functionality ---
    const profilePic = document.getElementById('profile-pic');
    const changeProfilePicBtn = document.getElementById('change-profile-pic');
    const composeProfilePic = document.getElementById('compose-profile-pic');
    const coverPhoto = document.getElementById('cover-photo');
    const changeCoverPhotoBtn = document.getElementById('change-cover-photo');

    // Load saved profile picture from localStorage or set default
    const savedProfilePic = localStorage.getItem('profilePic');
    if (savedProfilePic) {
        profilePic.src = savedProfilePic;
        composeProfilePic.src = savedProfilePic;
        console.log('Foto de perfil cargada desde localStorage.');
    } else {
        console.log('No se encontró foto de perfil en localStorage.');
    }

    // Load saved cover photo from localStorage or set default
    const savedCoverPhoto = localStorage.getItem('coverPhoto');
    if (savedCoverPhoto) {
        coverPhoto.src = savedCoverPhoto;
        console.log('Foto de portada cargada desde localStorage.');
    } else {
        console.log('No se encontró foto de portada en localStorage.');
    }

    // Function to resize an image using a canvas
    function resizeImage(img, maxWidth) {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
            height = height * (maxWidth / width);
            width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        return canvas.toDataURL('image/jpeg', 0.7); // Convert to JPEG with quality 0.7
    }

    // Function to handle image file selection and update image elements
    function handleImageChange(inputElement, imgElement, localStorageKey) {
        inputElement.onchange = function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const img = new Image();
                    img.onload = function() {
                        const resizedDataURL = resizeImage(img, 300); // Resize profile/cover pics to max 300px width
                        imgElement.src = resizedDataURL;
                        localStorage.setItem(localStorageKey, resizedDataURL);
                        console.log(`Imagen de ${localStorageKey} guardada en localStorage. Longitud: ${resizedDataURL.length}`);
                        if (localStorageKey === 'profilePic') {
                            composeProfilePic.src = resizedDataURL;
                        }
                    };
                    img.onerror = function(error) { // Added error handling for image load
                        console.error(`Error al cargar imagen para redimensionar ${localStorageKey}:`, error);
                    };
                    img.src = event.target.result;
                };
                reader.onerror = function(error) { // Added error handling for file read
                    console.error(`Error al leer archivo para ${localStorageKey}:`, error);
                };
                reader.readAsDataURL(file);
            }
        };
        inputElement.click();
    }

    // Event listener for changing profile picture
    changeProfilePicBtn.addEventListener('click', function () {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        handleImageChange(input, profilePic, 'profilePic');
    });

    // Event listener for changing cover photo
    changeCoverPhotoBtn.addEventListener('click', function () {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        handleImageChange(input, coverPhoto, 'coverPhoto');
    });

    // --- Tweet functionality (Simplified: no image uploads for tweets) ---
    const tweetText = document.getElementById('tweet-text');
    const tweetButton = document.getElementById('tweet-button');
    const tweetsContainer = document.getElementById('tweets-container');
    // Se han eliminado las referencias a elementos de carga de imágenes de tweets
    // const imageUploadInput = document.getElementById('image-upload-input'); // REMOVED
    // const previewImagesContainer = document.getElementById('preview-images'); // REMOVED
    // const imageCount = document.getElementById('image-count'); // REMOVED
    const imageModal = document.getElementById('image-modal'); // Still needed for profile/cover photo previews
    const closeImageModal = imageModal.querySelector('.close-btn'); // Still needed
    const modalImage = document.getElementById('modal-image'); // Still needed
    // let selectedImages = []; // REMOVED

    // Enable/disable tweet button based on text content
    tweetText.addEventListener('input', function () {
        tweetButton.classList.toggle('active', this.value.trim().length > 0);
    });

    // Se ha eliminado el event listener para imageUploadInput (para tweets)
    // Se ha eliminado el event listener para closeImageModal (si era exclusivo de tweets)
    // El modal de imagen aún se usa para las fotos de perfil/portada.

    // Function to save all current tweets to localStorage
    function saveTweets() {
        try {
            const tweets = [];
            document.querySelectorAll('.tweet').forEach(tweetElement => {
                const content = tweetElement.querySelector('.tweet-content').textContent;
                // Images array will now always be empty as image upload is removed for tweets
                const images = []; // Siempre un array vacío
                const timestamp = tweetElement.dataset.timestamp || new Date().toISOString();
                tweets.push({ content, images, timestamp });
            });
            const tweetsString = JSON.stringify(tweets);
            console.log('Tamaño de tweets a guardar (bytes):', new TextEncoder().encode(tweetsString).length);
            localStorage.setItem('tweets', tweetsString);
            console.log('Tweets guardados en localStorage. Contenido (primeros 100 caracteres):', tweetsString.substring(0,100) + '...');
        } catch (e) {
            console.error("Error al guardar tweets en localStorage:", e);
            alert('¡Advertencia: El almacenamiento del navegador está lleno! No se pudieron guardar todos los tweets. Intenta eliminar publicaciones antiguas.'); // User-friendly message
        }
    }

    // Function to load tweets from localStorage and display them
    function loadTweets() {
        try {
            const savedTweets = localStorage.getItem('tweets');
            if (savedTweets) {
                console.log('Datos raw de tweets desde localStorage (primeros 100 caracteres):', savedTweets.substring(0,100) + '...');
                const tweets = JSON.parse(savedTweets);
                console.log('Tweets parseados desde localStorage:', tweets);
                tweets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                tweetsContainer.innerHTML = '';
                tweets.forEach(tweet => {
                    // Pass empty array for images as tweet image upload is removed
                    const tweetElement = renderTweet(tweet.content, [], tweet.timestamp);
                    tweetsContainer.appendChild(tweetElement);
                });
            } else {
                console.log('No se encontraron tweets guardados en localStorage.');
            }
        } catch (e) {
            console.error("Error al cargar tweets desde localStorage:", e);
        }
    }

    // Function to render a single tweet element
    // This function is simplified to not expect/render images for tweets
    function renderTweet(content, images, timestamp) { // 'images' parameter can be ignored or will be empty
        const tweetElement = document.createElement('div');
        tweetElement.className = 'tweet';
        tweetElement.dataset.timestamp = timestamp || new Date().toISOString();

        const tweetHeader = document.createElement('div');
        tweetHeader.className = 'tweet-header';

        const profilePicElement = document.createElement('img');
        profilePicElement.className = 'tweet-profile-pic';
        profilePicElement.src = profilePic.src || 'https://placehold.co/150x150/cccccc/333333?text=Profile';

        const userInfo = document.createElement('div');
        userInfo.className = 'tweet-user-info';

        const username = document.createElement('span');
        username.className = 'tweet-username';
        username.textContent = document.getElementById('profile-name').textContent || 'Nombre de Perfil';

        const handle = document.createElement('span');
        handle.className = 'tweet-handle';
        handle.textContent = document.getElementById('user-handle').textContent || '@UsuarioEjemplo';

        const tweetTime = document.createElement('span');
        tweetTime.className = 'tweet-time';
        const date = new Date(timestamp);
        tweetTime.textContent = ` • ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

        userInfo.appendChild(username);
        userInfo.appendChild(handle);
        userInfo.appendChild(tweetTime);

        tweetHeader.appendChild(profilePicElement);
        tweetHeader.appendChild(userInfo);

        const tweetContent = document.createElement('div');
        tweetContent.className = 'tweet-content';
        tweetContent.textContent = content;

        tweetElement.appendChild(tweetHeader);
        tweetElement.appendChild(tweetContent);

        const tweetActions = document.createElement('div');
        tweetActions.className = 'tweet-actions';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-tweet-btn';
        // MODIFICACIÓN: Se ha eliminado el texto "Eliminar"
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>'; 
        deleteBtn.addEventListener('click', function () {
            tweetElement.remove();
            saveTweets();
        });

        tweetActions.appendChild(deleteBtn);
        tweetElement.appendChild(tweetActions);

        // Se ha eliminado la lógica de renderizado de imágenes para tweets
        // if (images && images.length > 0) { ... }
        
        return tweetElement;
    }

    // Event listener for the main tweet button
    tweetButton.addEventListener('click', function () {
        const tweetContent = tweetText.value.trim();
        if (tweetContent.length === 0) { // Ahora solo se verifica el contenido de texto
            console.log('Intento de publicación sin contenido. Cancelado.');
            return;
        }

        // Solo se maneja contenido de texto para los tweets
        const currentTimestamp = new Date().toISOString();
        console.log('Publicando tweet solo con texto.');
        const newTweetElement = renderTweet(tweetContent, [], currentTimestamp); // Siempre pasa un array vacío para las imágenes
        tweetsContainer.prepend(newTweetElement);
        saveTweets();

        // Reiniciar campos del formulario
        tweetText.value = '';
        // Se han eliminado las líneas que reseteaban elementos de imagen
        tweetButton.classList.remove('active');
        console.log('Formulario de publicación solo texto reiniciado.');
    });

    // --- Initial load ---
    loadTweets();
});
