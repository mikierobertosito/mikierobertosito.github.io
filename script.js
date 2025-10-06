document.addEventListener('DOMContentLoaded', () => {
    // Funzione per caricare i dati JSON
    async function fetchPosts() {
        try {
            const response = await fetch('post.json');
            const posts = await response.json();
            displayPosts(posts);
        } catch (error) {
            console.error('Errore nel caricamento dei post:', error);
            document.getElementById('posts-container').innerHTML = '<p>Non è stato possibile caricare i post.</p>';
        }
    }

    // Funzione per mostrare i post sulla pagina
    function displayPosts(posts) {
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = ''; // Svuota il contenitore prima di riempirlo

        posts.forEach(post => {
            const postElement = document.createElement('article');
            postElement.className = 'blog-post';
            postElement.innerHTML = // Funzione per mostrare i post sulla pagina
function displayPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''; 

    posts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.className = 'blog-post';
        
        // ATTENZIONE QUI: il link DEVE essere solo sul bottone.
        postElement.innerHTML = `
            <h3>${post.titolo}</h3>
            <p>${post.descrizione}</p>
            <p class="post-data">Pubblicato il: ${post.data}</p>
            <a href="pagine/video.php" class="btn">Leggi di più</a>  <-- Solo qui c'è il link!
        `;
        postsContainer.appendChild(postElement);
    });
}
