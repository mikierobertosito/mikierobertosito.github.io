document.addEventListener('DOMContentLoaded', () => {
    // Funzione per caricare i dati JSON
    async function fetchPosts() {
        try {
            const response = await fetch('posts.json');
            // Se c'è un problema qui, controlla la console per SyntaxError
            const posts = await response.json(); 
            displayPosts(posts);
        } catch (error) {
            console.error('Errore nel caricamento dei post. Controlla posts.json:', error);
            document.getElementById('posts-container').innerHTML = '<p style="color:red;">Non è stato possibile caricare i post. Controlla la console del browser (F12).</p>';
        }
    }
    
    // Funzione che crea l'HTML per ogni post
    function displayPosts(posts) {
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = ''; 

        posts.forEach(post => {
            const postElement = document.createElement('article');
            postElement.className = 'blog-post';
            
            // Il link viene applicato solo al bottone
            postElement.innerHTML = `
                <h3>${post.titolo}</h3> 
                <p>${post.descrizione}</p>
                <p class="post-data">Pubblicato il: ${post.data}</p>
                <a href="video.html" class="btn">Leggi di più</a>
            `;
            postsContainer.appendChild(postElement);
        });
    }

    // Lancia il caricamento dei post all'apertura della pagina
    fetchPosts(); 
});
