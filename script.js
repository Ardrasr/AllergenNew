const allergyForm = document.getElementById('allergy-form');
const ingredientsInput = document.getElementById('ingredients');
const allergensResultDiv = document.getElementById('allergens-result');
const extractedTextContent = document.getElementById('extracted-text-content');
const ingredientImageInput = document.getElementById('ingredient-image');
const imageContainer = document.getElementById('image-container');
const ingredientImageDisplay = document.getElementById('ingredient-image-display');

const allergens = [];

allergyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    allergens.length = 0;

    const allergensInput = document.getElementById('allergens');
    allergens.push(...allergensInput.value.split(',').map((allergen) => allergen.trim().toLowerCase()));

    const file = ingredientImageInput.files[0];
    const text = await extractTextFromImage(file);
    const translatedText = await translateText(text);

    extractedTextContent.textContent = translatedText;

    const ingredients = translatedText.split('\n').map((ingredient) => ingredient.trim().toLowerCase());

    let message = '';

    for (const allergen of allergens) {
        for (const ingredient of ingredients) {
            if (ingredient.includes(allergen)) {
                message += `<div class="alert">${ingredient} contains ${allergen}</div>`;
                break;
            }
        }
    }

    if (message) {
        allergensResultDiv.innerHTML = message;
    } else {
        allergensResultDiv.innerHTML = `<div class="safe">Food is safe to consume</div>`;
    }

    ingredientImageDisplay.src = URL.createObjectURL(file);
    imageContainer.style.display = 'block';
});

async function extractTextFromImage(file) {
    const apiKey = 'K84784109788957';
    const apiUrl = `https://api.ocr.space/parse/image`;

    const formData = new FormData();
    formData.append('apikey', apiKey);
    formData.append('file', file);

    const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    const text = data.ParsedResults[0].ParsedText;
    return text;
}

async function translateText(text) {
    const apiKey = '3ab2e517522735c31b0a';
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|en`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Mashape-Key': apiKey
            }
        });

        const data = await response.json();
        return data.responseData.translatedText;
    } catch (error) {
        console.error('Error translating text:', error);
        return text;
    }
}