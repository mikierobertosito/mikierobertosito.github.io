document.addEventListener('DOMContentLoaded', () => {
    // Funzione per caricare i dati JSON
    async function fetchPosts() {
        try {
            const response = await fetch('posts.json');
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
            postElement.innerHTML = `
                <h3>${post.titolo}</h3>
                <p>${post.descrizione}</p>
                <p class="post-data">Pubblicato il: ${post.data}</p>
                <a href="#" class="btn">Leggi di più</a>
            `;
            postsContainer.appendChild(postElement);
        });
    }

    // Carica i post quando la pagina è pronta
    fetchPosts();
});
