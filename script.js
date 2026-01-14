document.addEventListener('DOMContentLoaded', () => {
    
    const garageContainer = document.getElementById('garage-container');
    
    if (garageContainer) {
        const addButtons = document.querySelectorAll('.character .add-btn');

        garageContainer.innerHTML = '<h2>My Garage</h2><div class="garage-list" id="garage-list"></div>';
        const garageList = document.getElementById('garage-list');

        let myCars = JSON.parse(localStorage.getItem('garageCars')) || [];
        
        renderGarage();

        addButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                addCarToGarage(event.target);
            });
        });

        function addCarToGarage(button) {
            const characterCard = button.parentElement;
            
            const titleElement = characterCard.querySelector('.title');
            
            if (!titleElement) {
                console.warn("Butonul apăsat nu este într-un card valid.");
                return;
            }

            const name = titleElement.innerText;
            
            const imgElement = characterCard.querySelector('.poza');
            if (!imgElement) return; 
            const imgSrc = imgElement.getAttribute('src'); 

            const linkElement = characterCard.querySelector('a');
            const linkHref = linkElement ? linkElement.getAttribute('href') : '#';

            const exists = myCars.some(car => car.name === name);
            if (exists) {
                alert(name + " is already in your garage!");
                return;
            }
            else {
                alert(name + " a fost adaugat in garaj!");
            }

            const newCar = {
                id: Date.now(), 
                name: name,
                img: imgSrc,
                link: linkHref
            };

            myCars.push(newCar);
            localStorage.setItem('garageCars', JSON.stringify(myCars));
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
                const linkDest = car.link || '#';

                carDiv.innerHTML = `
                    <a href="${linkDest}">
                        <img src="${car.img}" alt="${car.name}">
                    </a>
                    <h4>${car.name}</h4>
                    <button class="delete-btn" data-id="${car.id}">Remove</button>
                `;

                garageList.appendChild(carDiv);
                const deleteBtn = carDiv.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', deleteCar);
            });
        }

        function deleteCar(event) {
            event.preventDefault();
            const idToDelete = parseInt(event.target.getAttribute('data-id'));
            myCars = myCars.filter(car => car.id !== idToDelete);
            localStorage.setItem('garageCars', JSON.stringify(myCars));
            renderGarage();
        }
    }

    const startBtn = document.getElementById('start-engine-btn');

    if (startBtn) {
        const statusText = document.getElementById('race-status');
        const bestTimeDisplay = document.getElementById('best-time');
        
        const redLight = document.getElementById('light-red');
        const yellowLight = document.getElementById('light-yellow');
        const greenLight = document.getElementById('light-green');

        let startTime = 0;
        let endTime = 0;
        let isRaceOn = false;     
        let isGreenOn = false;    
        let timeoutIds = [];      
        let bestTime = null;

        function resetLights() {
            if(redLight) redLight.classList.remove('active-red');
            if(yellowLight) yellowLight.classList.remove('active-yellow');
            if(greenLight) greenLight.classList.remove('active-green');
        }

        startBtn.addEventListener('click', () => {
            if (isRaceOn) return; 

            isRaceOn = true;
            isGreenOn = false;
            resetLights();
            statusText.innerText = "Ready...";
            statusText.style.color = "white";
            startBtn.disabled = true;
            startBtn.style.opacity = "0.5";

            if(redLight) redLight.classList.add('active-red');

            let t1 = setTimeout(() => {
                if(redLight) redLight.classList.remove('active-red');
                if(yellowLight) yellowLight.classList.add('active-yellow');
                statusText.innerText = "Set...";
            }, 1000);

            const randomDelay = Math.floor(Math.random() * 2000) + 1000;

            let t2 = setTimeout(() => {
                if(yellowLight) yellowLight.classList.remove('active-yellow');
                if(greenLight) greenLight.classList.add('active-green');
                
                startTime = new Date().getTime();
                
                isGreenOn = true;
                statusText.innerText = "GO! GO! GO!";
                statusText.style.color = "#39ff14";
            }, 1000 + randomDelay); 

            timeoutIds.push(t1, t2);
        });

        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space' && isRaceOn) {
                event.preventDefault(); 
                handleRaceFinish();
            }
        });

        function handleRaceFinish() {
            if (!isGreenOn) {
                statusText.innerText = "FALSE START!";
                statusText.style.color = "red";
                resetLights();
                timeoutIds.forEach(id => clearTimeout(id));
                endGame();
                return;
            }

            endTime = new Date().getTime();
            const reactionTime = endTime - startTime;

            statusText.innerText = `Reaction Time: ${reactionTime} ms`;
            statusText.style.color = "white";

            if (bestTime === null || reactionTime < bestTime) {
                bestTime = reactionTime;
                bestTimeDisplay.innerText = bestTime;
                statusText.innerText += " (NEW RECORD!)";
            }
            endGame();
        }

        function endGame() {
            isRaceOn = false;
            isGreenOn = false;
            startBtn.disabled = false;
            startBtn.style.opacity = "1";
            timeoutIds = []; 
        }
    }

    const loginPanel = document.getElementById('login-panel');
    const dashboardPanel = document.getElementById('dashboard-panel');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loginError = document.getElementById('login-error');
    
    const userInput = document.getElementById('login-user');
    const passInput = document.getElementById('login-pass');
    const displayUser = document.getElementById('display-user');

    const loadSecretsBtn = document.getElementById('load-secrets-btn');
    const secretsContainer = document.getElementById('secrets-container');

    const savedUser = localStorage.getItem('activeUser');
    
    if (savedUser) {
        showDashboard(savedUser);
    } else {
        showLogin();
    }

    function showDashboard(username) {
        if (loginPanel) loginPanel.style.display = 'none';
        if (dashboardPanel) dashboardPanel.style.display = 'block';
        if (displayUser) displayUser.innerText = username;
    }

    function showLogin() {
        if (loginPanel) loginPanel.style.display = 'block';
        if (dashboardPanel) dashboardPanel.style.display = 'none';
        if (userInput) userInput.value = '';
        if (passInput) passInput.value = '';
        if (secretsContainer) secretsContainer.innerHTML = '';
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const enteredUser = userInput.value;
            const enteredPass = passInput.value;

            fetch('resources/users.json')
                .then(response => {
                    if (!response.ok) throw new Error("err");
                    return response.json();
                })
                .then(users => {
                    const validUser = users.find(u => u.username === enteredUser && u.password === enteredPass);

                    if (validUser) {
                        localStorage.setItem('activeUser', validUser.username);
                        if (loginError) loginError.style.display = 'none';
                        showDashboard(validUser.username);
                    } else {
                        if (loginError) loginError.style.display = 'block';
                    }
                })
                .catch(err => console.error("Eroare", err));
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('activeUser');
            showLogin();
        });
    }

    if (loadSecretsBtn) {
        loadSecretsBtn.addEventListener('click', () => {
            fetch('resources/secrets.json')
                .then(response => {
                    if (!response.ok) throw new Error("err");
                    return response.json();
                })
                .then(data => {
                    if (secretsContainer) {
                        secretsContainer.innerHTML = ''; 

                        data.forEach(secret => {
                            const card = document.createElement('div');
                            card.classList.add('secret-card');

                            card.innerHTML = `
                                <h4>${secret.title}</h4>
                                <p>${secret.info}</p>
                            `;
                            secretsContainer.appendChild(card);
                        });
                    }
                })
                .catch(err => console.error("Eroare", err));
        });
    }
});