// Joke API endpoints
const JOKE_APIS = {
    jokeApi: 'https://official-joke-api.appspot.com/random_joke',
    uselessFacts: 'https://uselessfacts.jspm.io/random.json'
};

let currentJoke = '';

document.getElementById('joke-button').addEventListener('click', fetchJoke);
document.getElementById('copy-button').addEventListener('click', copyJoke);

async function fetchJoke() {
    const jokeButton = document.getElementById('joke-button');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const jokeText = document.getElementById('joke-text');

    // Reset states
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
    jokeButton.disabled = true;
    loading.style.display = 'block';

    try {
        // Randomly choose between joke API and useless facts
        const useJokeApi = Math.random() > 0.5;
        let response;

        if (useJokeApi) {
            response = await fetch(JOKE_APIS.jokeApi);
            if (!response.ok) throw new Error('Failed to fetch joke');
            
            const data = await response.json();
            currentJoke = `${data.setup}\n\n${data.punchline}`;
        } else {
            response = await fetch(JOKE_APIS.uselessFacts);
            if (!response.ok) throw new Error('Failed to fetch fact');
            
            const data = await response.json();
            currentJoke = `Fun Fact: ${data.text}`;
        }

        jokeText.textContent = currentJoke;
        loading.style.display = 'none';

    } catch (error) {
        console.error('Error fetching joke:', error);
        errorMessage.textContent = `⚠️ Error: ${error.message}. Please try again!`;
        errorMessage.style.display = 'block';
        jokeText.textContent = 'Click the button to get a random joke!';
        currentJoke = '';
        loading.style.display = 'none';

    } finally {
        jokeButton.disabled = false;
    }
}

function copyJoke() {
    if (!currentJoke) {
        alert('No joke to copy! Get one first.');
        return;
    }

    navigator.clipboard.writeText(currentJoke).then(() => {
        const copyButton = document.getElementById('copy-button');
        const originalText = copyButton.textContent;
        
        copyButton.textContent = '✓ Copied!';
        setTimeout(() => {
            copyButton.textContent = originalText;
        }, 2000);
    }).catch(() => {
        alert('Failed to copy to clipboard');
    });
}

// Fetch a joke on page load
window.addEventListener('load', () => {
    console.log('Joke Generator loaded! Click the button to get started.');
});
