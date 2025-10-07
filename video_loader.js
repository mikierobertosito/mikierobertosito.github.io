document.addEventListener('DOMContentLoaded', () => {
    const dataFile = '../dati_video.txt'; // Il percorso è relativo a video.html

    async function loadVideoData() {
        try {
            // 1. Richiedi il file di testo
            const response = await fetch(dataFile);
            if (!response.ok) {
                throw new Error(`Impossibile trovare il file: ${response.status}`);
            }
            const dataText = await response.text();

            // 2. Analizza i dati e mettili in un oggetto
            const config = parseDataText(dataText);

            // 3. Genera l'HTML
            displayVideo(config);

        } catch (error) {
            console.error('Errore nel caricamento dei dati video:', error);
            document.getElementById('video-content-area').innerHTML = `
                <p style="color: red; text-align: center;">
                    Errore: Non è stato possibile caricare i dati video dal file dati_video.txt. 
                    Controlla la console per i dettagli.
                </p>`;
            document.getElementById('video-title').textContent = "Errore di Caricamento";
        }
    }

    // Analizza le righe (es. TITOLO_VIDEO=Il Mio Video) in un oggetto JavaScript
    function parseDataText(text) {
        const config = {};
        const lines = text.split('\n');
        
        lines.forEach(line => {
            const parts = line.split('=', 2).map(p => p.trim());
            if (parts.length === 2) {
                config[parts[0]] = parts[1];
            }
        });
        return config;
    }

    // Crea l'HTML del video
    function displayVideo(config) {
        const titleElement = document.getElementById('video-title');
        const contentArea = document.getElementById('video-content-area');
        
        const videoTitle = config['TITOLO_VIDEO'] || 'angela bossfight';
        const videoFile = config['VIDEO_FILE'] || '';
        const description = config['DESCRIZIONE'] || 'crediti toby fox';
        
        // Aggiorna il titolo principale
        titleElement.textContent = videoTitle;
        
        // Verifica se c'è un percorso video valido
        if (videoFile) {
            // Poiché video.html è in 'pagine/', il percorso '../' è necessario 
            const videoSrc = `../${videoFile}`; 
            
            contentArea.innerHTML = `
                <div class="video-embed">
                    <video controls width="100%" height="auto">
                        <source src="${videoSrc}" type="video/mp4"> 
                        Il tuo browser non supporta il tag video.
                    </video>
                </div>
                <div class="video-descrizione">
                    <h2>Descrizione</h2>
                    <p>${description}</p>
                    <a href="#" class="btn">Guarda altri video</a>
                </div>
            `;
        } else {
            contentArea.innerHTML = `
                <p style="color: red; text-align: center;">
                    Errore: VIDEO_FILE non specificato nel file dati_video.txt.
                </p>
            `;
        }
    }

    loadVideoData();
});
