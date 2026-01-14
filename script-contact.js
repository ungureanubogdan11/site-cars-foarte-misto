document.addEventListener('DOMContentLoaded', () => {
    
    const contactForm = document.getElementById('contact-form');

    if (!contactForm) return;

    const patterns = {
        nume: /^[a-zA-Z\s]{3,}$/,
        
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        
        telefon: /^07\d{8}$/ 
    };

    const fields = {
        nume: document.getElementById('nume'),
        email: document.getElementById('email'),
        telefon: document.getElementById('telefon'),
        mesaj: document.getElementById('mesaj')
    };

    function validateInput(input, regex) {
        const value = input.value.trim();
        const errorSpan = document.getElementById('err-' + input.id);
        let isValid = false;

        if (input.id === 'mesaj') {
            isValid = value.length > 0;
        } else {
            isValid = regex.test(value);
        }

        if (isValid) {
            input.classList.add('valid');
            input.classList.remove('invalid');
            errorSpan.classList.remove('visible');
            return true;
        } else {
            input.classList.add('invalid');
            input.classList.remove('valid');
            errorSpan.classList.add('visible');
            return false;
        }
    }

    fields.nume.addEventListener('keyup', () => validateInput(fields.nume, patterns.nume));
    fields.email.addEventListener('keyup', () => validateInput(fields.email, patterns.email));
    fields.telefon.addEventListener('keyup', () => validateInput(fields.telefon, patterns.telefon));
    
    fields.mesaj.addEventListener('keyup', () => {
        validateInput(fields.mesaj, null);
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNumeValid = validateInput(fields.nume, patterns.nume);
        const isEmailValid = validateInput(fields.email, patterns.email);
        const isTelValid = validateInput(fields.telefon, patterns.telefon);
        const isMesajValid = validateInput(fields.mesaj, null);

        if (isNumeValid && isEmailValid && isTelValid && isMesajValid) {
            const successMsg = document.getElementById('success-message');
            successMsg.style.display = 'block';

            contactForm.reset();

            setTimeout(() => {
                successMsg.style.display = 'none';
                Object.values(fields).forEach(input => {
                    input.classList.remove('valid');
                });
            }, 3000);
        }
    });
});