// form-validation.js

document.addEventListener('DOMContentLoaded', () => {
    
    // Selectăm formularul
    const contactForm = document.getElementById('contact-form');

    // Dacă nu suntem pe pagina de contact (formularul nu există), oprim execuția scriptului
    if (!contactForm) return;

    // 1. DEFINIREA EXPRESIILOR REGULATE (RegEx)
    const patterns = {
        // Nume: Litere mici/mari și spații, minim 3 caractere
        nume: /^[a-zA-Z\s]{3,}$/,
        
        // Email: format standard (ceva@ceva.domeniu)
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        
        // Telefon: Începe cu 07, urmat de exact 8 cifre (total 10)
        telefon: /^07\d{8}$/ 
    };

    // 2. SELECTAREA INPUTURILOR
    const fields = {
        nume: document.getElementById('nume'),
        email: document.getElementById('email'),
        telefon: document.getElementById('telefon'),
        mesaj: document.getElementById('mesaj')
    };

    // 3. FUNCȚIA DE VALIDARE
    // Primește inputul și regex-ul (sau null pentru mesaj)
    function validateInput(input, regex) {
        const value = input.value.trim();
        const errorSpan = document.getElementById('err-' + input.id);
        let isValid = false;

        if (input.id === 'mesaj') {
            // Validare specială pentru mesaj (doar să nu fie gol)
            isValid = value.length > 0;
        } else {
            // Validare cu RegEx pentru restul
            isValid = regex.test(value);
        }

        // Modificarea vizuală (Clase CSS + Mesaj Eroare)
        if (isValid) {
            input.classList.add('valid');
            input.classList.remove('invalid');
            errorSpan.classList.remove('visible'); // Ascundem eroarea
            return true;
        } else {
            input.classList.add('invalid');
            input.classList.remove('valid');
            errorSpan.classList.add('visible'); // Arătăm eroarea
            return false;
        }
    }

    // 4. EVENIMENTE "KEYUP" (Validare în timp real)
    // Adăugăm ascultători pe fiecare câmp ca să validăm pe măsură ce utilizatorul scrie
    fields.nume.addEventListener('keyup', () => validateInput(fields.nume, patterns.nume));
    fields.email.addEventListener('keyup', () => validateInput(fields.email, patterns.email));
    fields.telefon.addEventListener('keyup', () => validateInput(fields.telefon, patterns.telefon));
    
    fields.mesaj.addEventListener('keyup', () => {
        validateInput(fields.mesaj, null);
    });

    // 5. EVENIMENTUL "SUBMIT" (Validare finală)
    contactForm.addEventListener('submit', (e) => {
        // Oprim trimiterea standard a formularului
        e.preventDefault();

        // Validăm toate câmpurile manual
        const isNumeValid = validateInput(fields.nume, patterns.nume);
        const isEmailValid = validateInput(fields.email, patterns.email);
        const isTelValid = validateInput(fields.telefon, patterns.telefon);
        const isMesajValid = validateInput(fields.mesaj, null);

        // Verificăm dacă TOATE sunt true
        if (isNumeValid && isEmailValid && isTelValid && isMesajValid) {
            // Afișăm mesajul de succes
            const successMsg = document.getElementById('success-message');
            successMsg.style.display = 'block';

            // Resetăm formularul
            contactForm.reset();

            // Curățăm clasele de validare (verde) după 3 secunde
            setTimeout(() => {
                successMsg.style.display = 'none';
                // Iterăm prin obiectul fields pentru a scoate clasa 'valid'
                Object.values(fields).forEach(input => {
                    input.classList.remove('valid');
                });
            }, 3000);
        }
    });
});