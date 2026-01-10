document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SELECTARE ELEMENTE DOM
    const garageContainer = document.getElementById('garage-container');
    const addButtons = document.querySelectorAll('.add-btn');

    // Inițializare structură HTML garaj
    garageContainer.innerHTML = '<h2>My Garage</h2><div class="garage-list" id="garage-list"></div>';
    const garageList = document.getElementById('garage-list');

    // 2. LOCAL STORAGE: Încărcăm mașinile salvate
    let myCars = JSON.parse(localStorage.getItem('garageCars')) || [];
    
    // Desenăm garajul la încărcarea paginii
    renderGarage();

    // 3. EVENT LISTENERS: Butoanele "Add to Garage"
    addButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Oprim comportamentul default (să nu ne ducă pe link) și propagarea
            event.preventDefault();
            event.stopPropagation();
            
            addCarToGarage(event.target);
        });
    });

    // --- FUNCȚII GARAJ ---

    function addCarToGarage(button) {
        // Găsim cardul părintelui
        const characterCard = button.parentElement;
        
        // 1. Extragem Numele
        const name = characterCard.querySelector('.title').innerText;
        
        // 2. Extragem Imaginea (calea din src)
        const imgElement = characterCard.querySelector('.poza');
        const imgSrc = imgElement.getAttribute('src'); 

        // 3. [NOU] Extragem Link-ul către pagina personajului
        // Căutăm tag-ul <a> din interiorul cardului
        const linkElement = characterCard.querySelector('a');
        const linkHref = linkElement ? linkElement.getAttribute('href') : '#';

        // Verificăm dacă mașina există deja
        const exists = myCars.some(car => car.name === name);
        if (exists) {
            alert(name + " is already in your garage!");
            return;
        }

        // Creăm obiectul mașină (acum include și link-ul)
        const newCar = {
            id: Date.now(), 
            name: name,
            img: imgSrc,
            link: linkHref // Salvăm destinația link-ului
        };

        // Adăugăm în array și salvăm în LocalStorage
        myCars.push(newCar);
        localStorage.setItem('garageCars', JSON.stringify(myCars));
        
        // Actualizăm afișarea
        renderGarage();
    }

    function renderGarage() {
        garageList.innerHTML = '';

        if (myCars.length === 0) {
            garageList.innerHTML = '<p>Garage empty. Add some cars!</p>';
            return;
        }

        myCars.forEach(car => {
            const carDiv = document.createElement('div');
            carDiv.classList.add('garage-item');

            // Verificăm dacă există link salvat (pentru compatibilitate), altfel punem '#'
            const linkDest = car.link || '#';

            // [NOU] Împachetăm imaginea într-un tag <a>
            carDiv.innerHTML = `
                <a href="${linkDest}">
                    <img src="${car.img}" alt="${car.name}">
                </a>
                <h4>${car.name}</h4>
                <button class="delete-btn" data-id="${car.id}">Remove</button>
            `;

            garageList.appendChild(carDiv);

            // Adăugăm funcționalitate pe butonul de ștergere
            const deleteBtn = carDiv.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', deleteCar);
        });
    }

    function deleteCar(event) {
        // Prevenim orice comportament nedorit
        event.preventDefault();
        
        const idToDelete = parseInt(event.target.getAttribute('data-id'));
        
        // Filtrăm lista pentru a scoate elementul cu ID-ul respectiv
        myCars = myCars.filter(car => car.id !== idToDelete);
        
        // Salvăm noua listă și re-desenăm
        localStorage.setItem('garageCars', JSON.stringify(myCars));
        renderGarage();
    }
    
    // --- THEME TOGGLE (Dacă există butonul în HTML) ---
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('neon-mode');
        });
    }

    

});