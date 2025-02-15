document.addEventListener('DOMContentLoaded', function () {
    // Funcția pentru a aduce videoclipurile din baza de date
    function loadVideos() {
        fetch('http://localhost:5000/videos')  // Modifică URL-ul în funcție de backend-ul tău
            .then(response => response.json())
            .then(videos => {
                const videoContainer = document.getElementById('videoContainer');
                videoContainer.innerHTML = '';  // Curăță conținutul anterior

                videos.forEach(video => {
                    const videoElement = document.createElement('div');
                    videoElement.classList.add('video-card');
                    videoElement.innerHTML = `
                        <img src="http://localhost:5000/uploads/thumbnail/${video.thumbnailPath}" alt="${video.title}">
                        <h3>${video.title}</h3>
                        <p>${video.description}</p>
                        <p><strong>Vizualizări:</strong> ${video.views}</p>
                        <p><strong>Like-uri:</strong> ${video.likes}</p>
                        <p><strong>Data creării:</strong> ${new Date(video.createdAt).toLocaleDateString()}</p>
                    `;
                    videoContainer.appendChild(videoElement);
                });
            })
            .catch(error => {
                console.error('Eroare la încărcarea videoclipurilor:', error);
            });
    }

    loadVideos();  // Încarcă videoclipurile la încărcarea paginii

    // Formularul de upload
    const uploadForm = document.getElementById('uploadForm');
    uploadForm.addEventListener('submit', function (event) {
        event.preventDefault();  // Previne comportamentul implicit de submit

        const formData = new FormData();
        formData.append('title', document.getElementById('Title').value);
        formData.append('description', document.getElementById('Description').value);
        formData.append('visibility', document.getElementById('Visibility').value);

        const videoFile = document.getElementById('videoFile').files[0];
        const thumbnailFile = document.getElementById('thumbnailFile').files[0];

        if (videoFile && thumbnailFile) {
            formData.append('video', videoFile);
            formData.append('thumbnail', thumbnailFile);

            // Arată indicatorul de încărcare
            document.getElementById('loading').style.display = 'block';

            // Trimite datele la server
            fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Videoclip încărcat cu succes!') {
                        alert('Videoclipul a fost încărcat cu succes!');
                        loadVideos();  // Reîncarcă lista de videoclipuri
                    } else {
                        alert('A apărut o problemă la încărcarea videoclipului.');
                    }
                })
                .catch(error => {
                    console.error('Eroare la încărcare:', error);
                    alert('A apărut o eroare!');
                })
                .finally(() => {
                    document.getElementById('loading').style.display = 'none';  // Ascunde indicatorul de încărcare
                });
        } else {
            alert('Te rog să selectezi atât un videoclip cât și un thumbnail!');
        }
    });
});
