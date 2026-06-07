// Sélection des éléments du Dropdown
const dropdownBtn = document.querySelector('.dropdown-btn');
const dropdownContent = document.querySelector('.dropdown-content');

// Ouvre ou ferme le menu lors du clic sur le bouton
dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Empêche la fermeture immédiate
    dropdownContent.classList.toggle('show');
});

// Ferme le menu si l'utilisateur clique n'importe où ailleurs sur l'écran
document.addEventListener('click', () => {
    dropdownContent.classList.remove('show');
});

// Empêche la fermeture du menu lorsque l'on clique à l'intérieur de la liste ou sur la barre de défilement
dropdownContent.addEventListener('click', (e) => {
    e.stopPropagation();
});


// --- LE RESTE DE TON CODE COMPILATEUR CI-DESSOUS ---
const textarea = document.querySelector('textarea');
const saveButton = document.getElementById('save-btn');
const savedContent = localStorage.getItem('loadedMecommentContent');
const iconButtons = document.querySelectorAll('.icon-insert-btn');

const bytesMap = {};

// Mappage des boutons d'icônes
iconButtons.forEach(button => {
    const cleanTag = button.innerText.toUpperCase()
        .replace(/[^A-Z0-9]/g, '_')
        .replace(/_+/g, '_');
    
    const tagName = `[${cleanTag}]`;
    const bytesStr = button.getAttribute('data-bytes');
    
    const bytesArray = [];
    for (let i = 0; i < bytesStr.length; i += 2) {
        bytesArray.push(parseInt(bytesStr.substr(i, 2), 16));
    }
    
    bytesMap[tagName] = bytesArray;

    button.addEventListener('click', () => {
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        const currentText = textarea.value;

        textarea.value = currentText.substring(0, startPos) + tagName + currentText.substring(endPos);
        textarea.selectionStart = textarea.selectionEnd = startPos + tagName.length;
        textarea.focus();
        
        // Optionnel : ferme le menu après avoir cliqué sur une icône
        dropdownContent.classList.remove('show');
    });
});

// Charger le contenu venant de open.html
if (savedContent !== null) {
    textarea.value = savedContent;
    localStorage.removeItem('loadedMecommentContent'); 
}

// Sauvegarde binaire pure
saveButton.addEventListener('click', () => {
    let text = textarea.value;

    if (text.trim() === "") {
        alert("Write something before saving !");
        return;
    }

    const encoder = new TextEncoder();
    let finalBytes = [];

    const escapedTags = Object.keys(bytesMap).map(t => t.replace(/[\[\]]/g, '\\$&')).join('|');
    
    if (escapedTags) {
        const regex = new RegExp(`(${escapedTags})`, 'g');
        const parts = text.split(regex);

        for (let part of parts) {
            if (bytesMap[part]) {
                finalBytes.push(...bytesMap[part]);
            } else {
                finalBytes.push(...encoder.encode(part));
            }
        }
    } else {
        finalBytes = encoder.encode(text);
    }

    const byteArray = new Uint8Array(finalBytes);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });

    const link = document.createElement('a');
    link.download = 'mecomment.dat';
    link.href = window.URL.createObjectURL(blob);
    link.click();
    window.URL.revokeObjectURL(link.href);
});