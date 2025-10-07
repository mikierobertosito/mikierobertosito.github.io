<?php
// === Questo codice richiede un ambiente PHP e un Database (es. MySQL) per funzionare ===

// 1. Inizia una sessione (necessaria per identificare l'utente loggato)
session_start();

// 2. Controlla se l'utente è loggato
if (!isset($_SESSION['user_id'])) {
    // Se non è loggato, reindirizza al login
    header("Location: login.html?errore=accesso_negato");
    exit();
}

// 3. Verifica i dati inviati tramite POST dal modulo
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Filtra e pulisci i dati
    $titolo = filter_input(INPUT_POST, 'title', FILTER_SANITIZE_STRING);
    $contenuto = filter_input(INPUT_POST, 'content', FILTER_SANITIZE_STRING);
    $user_id = $_SESSION['user_id'];
    
    // 4. Validazione finale
    if (empty($titolo) || empty($contenuto)) {
        header("Location: profilo.html?errore=campi_vuoti");
        exit();
    }
    
    // =========================================================================
    // QUI AVVIENE L'AZIONE CRUCIALE: SALVATAGGIO NEL DATABASE
    // =========================================================================
    
    // ESEMPIO CON PHP/PDO per l'inserimento nel database
    
    // $db = new PDO('mysql:host=localhost;dbname=sito_miki_roberto', 'root', 'password');
    // $stmt = $db->prepare("INSERT INTO posts (user_id, titolo, contenuto, data_pubblicazione) VALUES (:uid, :titolo, :cont, NOW())");
    // $stmt->execute(['uid' => $user_id, 'titolo' => $titolo, 'cont' => $contenuto]);
    
    // =========================================================================
    
    // 5. Successo: reindirizza alla pagina Archivio o Profilo con conferma
    header("Location: archivio.html?successo=post_pubblicato");
    exit();

} else {
    // Se la richiesta non è POST, reindirizza alla homepage
    header("Location: ../index.html");
    exit();
}
?>
