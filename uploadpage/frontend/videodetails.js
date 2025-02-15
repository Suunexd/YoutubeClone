document.addEventListener('DOMContentLoaded', function() {
    // Ascultă evenimentul de submit pe formular
    document.getElementById('uploadForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Obținem valorile câmpurilor din formular
        const title = document.getElementById('Title').value;
        const description = document.getElementById('VideoDescription').value;
        const visibility = document.getElementById('Visibility').value;

        // Creăm un obiect FormData
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('visibility', visibility);

        // Obținem fișierele video și thumbnail
        const videoInput = document.getElementById('vInput');
        const thumbnailInput = document.getElementById('fileInput');

        // Verificăm dacă fișierul video a fost selectat
        if (videoInput.files.length > 0) {
            formData.append('video', videoInput.files[0]);
        } else {
            console.log('Fișierul video nu a fost încărcat!');
            alert('Te rugăm să încarci un fișier video!');
            return;
        }

        // Verificăm dacă fișierul thumbnail a fost selectat
        if (thumbnailInput.files.length > 0) {
            formData.append('thumbnail', thumbnailInput.files[0]);
        } else {
            console.log('Fișierul thumbnail nu a fost încărcat!');
            alert('Te rugăm să încarci un thumbnail!');
            return;
        }

        // Arată throbber (indicatorul de încărcare)
        document.getElementById('throbber').style.display = 'block';

        // Trimite formularul cu fișierele la server
        fetch('http://localhost:5001/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Ascunde throbber-ul
            document.getElementById('throbber').style.display = 'none';

            if (data.message === 'Videoclip incarcat cu succes!') {
                // Afișează popup-ul de succes
                const popup = document.getElementById('popup');
                popup.style.display = 'block';

                // Ascunde popup-ul după 3 secunde și redirecționează utilizatorul
                setTimeout(function() {
                    popup.style.display = 'none';
                    parent.location.href = 'upload.html';
                }, 3000);
            } else {
                alert('A apărut o problemă la încărcarea fișierului!');
            }
        })
        .catch(error => {
            // Ascunde throbber-ul și afișează eroarea
            document.getElementById('throbber').style.display = 'none';
            console.error('Eroare la încărcarea fișierului', error);
            alert('A apărut o eroare la încărcarea fișierului.');
        });
    });

    // Previzualizarea imaginii pentru thumbnail
    document.getElementById('fileInput').addEventListener('change', function(event) {
        const file = event.target.files[0]; // Obține fișierul selectat
        const thumbnailBlock = document.getElementById('thumbnailblock'); // Selectează div-ul de thumbnail
        thumbnailBlock.innerHTML = ''; // Curăță conținutul anterior al div-ului

        if (file) {
            const reader = new FileReader(); // Creează un FileReader pentru a citi fișierul

            reader.onload = function(e) {
                const img = document.createElement('img'); // Creează un element img
                img.src = e.target.result; // Setează src-ul imaginii la conținutul fișierului
                thumbnailBlock.appendChild(img); // Adaugă imaginea în thumbnailBlock
            };

            reader.readAsDataURL(file); // Citește fișierul ca URL de date
        } else {
            thumbnailBlock.innerHTML = '<p>No thumbnail selected</p>'; // Mesaj alternativ dacă nu există fișier
        }
    });
});
