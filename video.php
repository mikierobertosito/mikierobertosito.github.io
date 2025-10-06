<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Miki e Roberto | Video del Momento</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>

    <header>
        <nav>
            <ul>
                <li><a href="../index.html">Homepage</a></li>
                <li><a href="chi-siamo.html">Chi siamo</a></li>
                <li><a href="video.php">Video del Momento</a></li>
            </ul>
        </nav>
    </header>

    <main class="video-container">
        <?php 
            // QUESTO È UN ESEMPIO CON PHP. Sostituisci con la logica del tuo linguaggio.
            // In un sito PHP, un'area del genere verrebbe popolata da un database.
            
            // Dati Fittizi (da sostituire con il recupero dal tuo database/server)
            $video_url = "https://www.youtube.com/embed/YOUR_VIDEO_ID"; 
            $titolo = "La nostra ultima avventura in Sicilia!";
            $descrizione = "Dopo mesi di pianificazione, siamo finalmente partiti per un'escursione pazzesca sull'Etna. Guarda il nostro video completo per le riprese dal drone e tutte le sfide che abbiamo affrontato.";
        ?>

        <section class="video-box">
            <h1><?php echo $titolo; ?></h1>
            
            <div class="video-embed">
                <iframe 
                    width="100%" 
                    height="500" 
                    src="<?php echo $video_url; ?>" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>

            <div class="video-descrizione">
                <h2>Descrizione</h2>
                <p><?php echo $descrizione; ?></p>
                <a href="#" class="btn">Guarda altri video</a>
            </div>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 Miki e Roberto. Tutti i diritti riservati.</p>
    </footer>

</body>
</html>
