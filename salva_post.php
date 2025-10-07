<?php
// === Questo script richiede PHP con permessi di scrittura sul file HTML ===

// 1. Inizializzazione e controllo del metodo
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: profilo.html");
    exit();
}

// 2. Ricezione e pulizia dei dati
// Assumiamo che l'utente sia "loggato" per coerenza con il profilo
$username_fittizio = 'Utente ID ' . rand(100, 999);
$data = date('d M Y'); 

$titolo = filter_input(INPUT_POST, 'title', FILTER_SANITIZE_STRING);
$contenuto = filter_input(INPUT_POST, 'content', FILTER_SANITIZE_STRING);

if (empty($titolo) || empty($contenuto)) {
    header("Location: profilo.html?errore=campi_vuoti");
    exit();
}

// 3. Generazione del nuovo blocco HTML (il post)
$nuovo_post_html = <<<HTML
                <article class="blog-post">
                    <h3>$titolo</h3>
                    <p>$contenuto</p>
                    <p class="post-data">Pubblicato da: **$username_fittizio** il $data</p>
                </article>
HTML;

// 4. Caricamento del file Archivio HTML
$file_archivio_path = 'archivio.html';
$contenuto_archivio = file_get_contents($file_archivio_path);

// 5. Trovare il punto dove iniettare il nuovo post
// Dobbiamo definire un "segnaposto" nel file archivio.html
$segnaposto = '<div id="posts-container" class="blog-grid">'; 

// 6. Iniezione del nuovo codice: Inseriamo il nuovo post DOPO il segnaposto
if (strpos($contenuto_archivio, $segnaposto) !== false) {
    // Troviamo la posizione dove si chiude il segnaposto
    $posizione_iniezione = strpos($contenuto_archivio, $segnaposto) + strlen($segnaposto);
    
    // Inseriamo il nuovo post dopo il segnaposto, ma prima del contenuto esistente (per averlo in cima)
    $nuovo_contenuto_archivio = 
        substr($contenuto_archivio, 0, $posizione_iniezione) . 
        "\n" . $nuovo_post_html . "\n" . 
        substr($contenuto_archivio, $posizione_iniezione);
        
    // 7. Scrittura del file aggiornato (sovrascrive l'archivio.html)
    file_put_contents($file_archivio_path, $nuovo_contenuto_archivio);
    
    // 8. Successo: reindirizza all'archivio per vedere il nuovo post
    header("Location: archivio.html?post_inviato");
    exit();
    
} else {
    // Errore: segnaposto non trovato
    header("Location: profilo.html?errore=configurazione_archivio_sbagliata");
    exit();
}
?>
