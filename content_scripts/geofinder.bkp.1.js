(function() {
  const createLabel = (className, text) => {
    const labelElement = document.createElement('p');
    labelElement.classList.add(className); 

    labelElement.textContent = text;

    labelElement.style.display = 'inline-block';
    labelElement.style.height = '18px';
    labelElement.style.fontSize = '12px';
    labelElement.style.marginRight = '12px';
    labelElement.style.verticalAlign = 'middle';

    return labelElement;
  };
  const createFixedWidthLabel = (className, text, width = 50) => {
    const labelElement = createLabel(className, text);
    labelElement.style.width = `${width}px`;
    labelElement.style.textOverflow = 'ellipsis';
    labelElement.style.overflow = 'hidden';
    
    return labelElement;
  };
  const createWarningLabel = (className, text) => {
    const labelContainer = document.createElement('div');

    const label = createLabel(className, text);

    const warningIcon = document.createElement('img');
    warningIcon.style.marginRight = '6px';
    warningIcon.style.width = '18px';
    warningIcon.style.height = '18px';
    warningIcon.style.verticalAlign = 'middle';

    warningIcon.setAttribute(
      'src',
      'https://www.materialui.co/materialIcons/alert/warning_black_24x24.png',
    );

    labelContainer.appendChild(warningIcon);
    labelContainer.appendChild(label);

    return labelContainer;
  };

  const createTextInput = (className, placeholder = '') => {
    const textInput = document.createElement('input');
    textInput.classList.add(className); 

    textInput.placeholder = placeholder;

    textInput.style.border = '1px solid rgba(0,0,0,0.15)';
    textInput.style.borderRadius = '6px';
    textInput.style.fontSize = '12px';
    textInput.style.marginRight = '12px';
    textInput.style.padding = '3px';

    return textInput;
  };

  const createButton = (className, text, action) => {
    const buttonElement = document.createElement('button');
    buttonElement.classList.add(className); 

    buttonElement.type = 'button';
    buttonElement.textContent = text;

    buttonElement.style.position = 'relative';
    buttonElement.style.color = 'white';
    buttonElement.style.backgroundColor = '#1A73E8';
    buttonElement.style.borderRadius = '6px';
    buttonElement.style.fontSize = '12px';
    buttonElement.style.padding = '3px 6px';
    buttonElement.style.zIndex = 1001;

    buttonElement.onmousedown = () => {
      buttonElement.style.backgroundColor = '#1967D2';
    };
    buttonElement.onmouseup = () => {
      buttonElement.style.backgroundColor = '#1A73E8';
    };
    buttonElement.onclick = action;

    return buttonElement;
  };
  const createSecondaryButton = (className, text, action) => {
    const buttonElement = createButton(className, text, action);
    buttonElement.style.backgroundColor = '#ddd';
    buttonElement.style.color = '#222';

    buttonElement.onmousedown = () => {
      buttonElement.style.backgroundColor = '#aaa';
    };
    buttonElement.onmouseup = () => {
      buttonElement.style.backgroundColor = '#ddd';
    };

    return buttonElement;
  };

  const createTitle = (className, text) => {
    const titleElement = document.createElement('h5');
    titleElement.classList.add(className); 

    titleElement.textContent = text;

    titleElement.style.marginBottom = '12px';

    return titleElement;
  };

  const createDivider = () => {
    const divider = document.createElement('div');
    divider.style.marginTop = '12px';
    divider.style.marginBottom = '12px';
    divider.style.borderBottom = '1px solid #E8EAED';

    return divider;
  };

  const createLoader = () => {
    const loader = document.createElement('div');
    loader.classList.add('rotating');

    return loader;
  };

  const createPlayerInput = () => {
    const playerInput = createTextInput('player--input', 'Player name');
    playerInput.style.display = 'block';
    playerInput.style.marginBottom = '3px';

    return playerInput;
  };
  const createPlayersInput = () => {
    const playerContainer = document.createElement('div');
    playerContainer.style.marginBottom = '6px';

    const playerNameInput = createPlayerInput();

    const addPlayerButton = createButton('player--add', 'Add player');
    addPlayerButton.style.marginRight = '12px';
    addPlayerButton.onclick = () => playerContainer.appendChild(createPlayerInput());

    const startButton = createButton('player--add', 'Start');
    startButton.style.marginTop = '6px';
    startButton.onclick = () => {
      const playerInputs = playerContainer.querySelectorAll('.player--input');

      for (const playerInput of playerInputs) {
        const playerName = playerInput.value;

        if (playerName === '') {
          continue;
        }

        playerNames.push(playerName);
        totalScores[playerName] = 0;
      }

      localStorage.setItem('playerNames', JSON.stringify(playerNames));
      localStorage.setItem('totalScores', JSON.stringify(totalScores));

      clearGameContent();
      createGameLocations();
    };

    playerContainer.appendChild(playerNameInput);

    const title = createTitle('players--title', 'Add players');

    gameContent.appendChild(title);
    gameContent.appendChild(playerContainer);
    gameContent.appendChild(addPlayerButton);
    gameContent.appendChild(startButton);
  };

  const createGameLocations = () => {
    const locationsContainer = document.createElement('div');
    locationsContainer.classList.add('locations--container');
    locationsContainer.style.marginBottom = '12px';

    const title = createTitle('locations--title', 'Set game locations');

    const addLocationButton = createButton(`locations--add`, 'Add location');
    addLocationButton.style.marginRight = '6px';
    addLocationButton.onclick = () => {
      const gameLocation = createGameLocation();
      locationsContainer.appendChild(gameLocation);
    };

    const warningContainer = document.createElement('div');

    const submitLocationsButton = createButton(`locations--submit`, 'Set game locations');
    submitLocationsButton.onclick = () => {
      warningContainer.textContent = '';
      warningContainer.style.marginBottom = '12px';

      const locationInputs = locationsContainer.querySelectorAll('.location--container');

      for (const locationInput of locationInputs) {
        const latInput = locationInput.querySelector('.location--lat');
        const lngInput = locationInput.querySelector('.location--lng');

        if (latInput.value === '' || lngInput.value === '') {
          continue;
        }

        targetLocations.push({lat: latInput.value, lng: lngInput.value});
      }

      if (targetLocations.length === 0) {
        const noLocationsWarningLabel = createWarningLabel(
          'locations--none-provided',
          'No locations provided',
        );
        warningContainer.appendChild(noLocationsWarningLabel);

        return;
      }

      localStorage.setItem('targetLocations', JSON.stringify(targetLocations));
      localStorage.setItem('locationIndex', 0 /*targetLocations.length - 1*/);

      locationIndex = 0;

      redirectToLocationIndex();
    };

    locationsContainer.appendChild(createGameLocation());

    gameContent.appendChild(title);
    gameContent.appendChild(locationsContainer);
    gameContent.appendChild(warningContainer);
    gameContent.appendChild(addLocationButton);
    gameContent.appendChild(submitLocationsButton);
  };
  
  const createDirectionsUrl = (startLocation, endLocation) => { 
    return `https://www.google.com/maps/dir/${startLocation}/${endLocation}/`;
  };
  const createStreetViewUrl = (lat, lng) => {
    return `http://maps.google.com/maps?q=&layer=c&cbll=${lat},${lng}`;
  };
  const redirectToLocationIndex = () => {
    const {lat, lng} = targetLocations[locationIndex];
    document.location.href = createStreetViewUrl(lat, lng);
  };

  const createGameLocation = () => {
    const locationContainer = document.createElement('div');
    locationContainer.classList.add('location--container');

    locationContainer.style.marginBottom = '6px';

    const latInput = createTextInput('location--lat', 'Latitude');
    const lngInput = createTextInput('location--lng', 'Longitude');

    locationContainer.appendChild(latInput);
    locationContainer.appendChild(lngInput);

    return locationContainer;
  };

  const createLocationInput = (name) => {
    const locationInputContainer = document.createElement('div');
    locationInputContainer.classList.add(`game--location`); 

    locationInputContainer.style.padding = '3px';

    locationInputContainer.setAttribute('player-name', name);

    const nameElement = createFixedWidthLabel(`game--player-name`, name);

    const locationInput = createTextInput(`game--answer`, 'Location');

    locationInputContainer.appendChild(nameElement);
    locationInputContainer.appendChild(locationInput);

    return locationInputContainer;
  };

  const createLocationInputs = () => {
    const locationsContainer = document.createElement('div');

    const currentLocationNumber = locationIndex + 1;
    const totalLocations = targetLocations.length;

    const title = createTitle(
      'game--title',
      `Location guesses (${currentLocationNumber}/${totalLocations})`,
    );

    locationsContainer.appendChild(title);

    for (const playerName of playerNames) {
      locationsContainer.appendChild(createLocationInput(playerName));
    }

    const startButton = createButton('game--play', 'Let\'s play!');
    startButton.onclick = () => {
      const guessElements = locationsContainer.querySelectorAll('.game--location');

      const guesses = [];
      for (const guessElement of guessElements) {
        const playerName = guessElement.getAttribute('player-name');
        const guessInput = guessElement.querySelector('.game--answer');
        const addressGuess = guessInput.value;

        guesses.push({playerName, addressGuess});
      }

      clearGameContent();
      createGameResults(guesses);
    };

    locationsContainer.appendChild(startButton);

    gameContent.appendChild(locationsContainer);
  }

  const createGame = () => {
    // createGameLocation();
    // gameContent.appendChild(createDivider());

    console.log(targetLocations.length);
    console.log(locationIndex);

    if (locationIndex < targetLocations.length) {
      createLocationInputs();
    }
    else {
      resetGame();
    }
  };

  const createGameResults = async (guesses) => {
    const results = [];
    const targetLocation = targetLocations[locationIndex];

    const loader = createLoader();
    gameContent.appendChild(loader);

    for (const guess of guesses) {
      const {playerName, addressGuess} = guess;

      const latLngGuess = await latLngFromAddress(addressGuess);
      const distance = deltaLatLng(targetLocation, latLngGuess);

      results.push({playerName, addressGuess, latLngGuess, distance});
    }
    results.sort((a, b) => (a.distance > b.distance) ? 1 : -1);

    const targetAddress = await addressFromLatLng(targetLocation);

    locationIndex += 1;
    localStorage.setItem('locationIndex', locationIndex);

    gameContent.removeChild(loader);

    const title = createTitle('results--title', 'Round Results');

    const targetCoords = `${targetLocation.lat},${targetLocation.lng}`;
    const targetParam = `center=${targetCoords}`;
    const targetUrl = `https://www.google.com/maps/@?api=1&map_action=map&${targetParam}&basemap=satellite`;
    const targetAnchor = document.createElement('a');
    targetAnchor.setAttribute('href', targetUrl);
    targetAnchor.textContent = targetAddress;

    const targetLabel = createLabel('results--target', `Target: `);
    targetLabel.appendChild(targetAnchor);

    gameContent.appendChild(title);
    gameContent.appendChild(targetLabel);
    gameContent.appendChild(createDivider());

    const resultsContainer = document.createElement('div');
    for (const result of results) {
      const {playerName, addressGuess, latLngGuess, distance} = result;
      const {lat, lng} = latLngGuess;
      const guessCoords = `${lat},${lng}`;
      const roundedDistance = Number(distance).toFixed(0);

      const resultContainer = document.createElement('div');

      const nameLabel = createFixedWidthLabel('results--name', playerName, 100);

      const directionUrl = createDirectionsUrl(guessCoords, targetCoords);
      const guessLabel = createFixedWidthLabel('results--guess', addressGuess, 200);
      const guessAnchor = document.createElement('a');
      guessAnchor.setAttribute('href', directionUrl);
      guessAnchor.appendChild(guessLabel);

      const distanceLabel = createFixedWidthLabel(
       'results--distance', 
       `${roundedDistance}km`,
        200,
      );

      const scoreRatio = 1 - (distance / 2e4);
      const score = scoreRatio * 100;
      const roundedScore = score.toFixed(2);

      totalScores[playerName] += score;

      const scoreMessage = `${roundedScore} (${totalScores[playerName]})`;
      const scoreLabel = createFixedWidthLabel('results--score', scoreMessage, 100);
 
      resultContainer.appendChild(nameLabel);
      resultContainer.appendChild(guessAnchor);
      resultContainer.appendChild(distanceLabel);
      resultContainer.appendChild(scoreLabel);

      resultsContainer.appendChild(resultContainer);
    }

    const isLastGame = locationIndex === targetLocations.length;
    const continueGameLabel = isLastGame ? 'Final scores!' : 'Next round';
    const continueGameButton = createButton('results--continue', continueGameLabel);
    continueGameButton.onclick = () => {
      clearGameContent();

      if (isLastGame) {
        // TODO: Final results!
        createFinalResults();
      }
      else {
        redirectToLocationIndex();
        // createGame();
      }
    };

    gameContent.appendChild(resultsContainer);
    gameContent.appendChild(createDivider());
    gameContent.appendChild(continueGameButton);
  };

  const createFinalResults = () => {
    const title = createTitle('final-results--title', 'Final results');

    const players = Object.keys(totalScores);
    const resultsContainer = document.createElement('div');
    for (const player of players) {
      const resultContainer = document.createElement('div');

      const score = totalScores[player];

      const nameLabel = createFixedWidthLabel('final-results--name', player, 100);
      const scoreLabel = createFixedWidthLabel('final-results--score', score, 100);
 
      resultContainer.appendChild(nameLabel);
      resultContainer.appendChild(scoreLabel);

      resultsContainer.appendChild(resultContainer);
    }

    const resetGameButton = createButton('final-results--reset', 'New game');
    resetGameButton.onclick = resetGame;
    
    gameContent.appendChild(title);
    gameContent.appendChild(createDivider());
    gameContent.appendChild(resultsContainer);
    gameContent.appendChild(createDivider());
    gameContent.appendChild(resetGameButton);
  };

  const resetGame = () => {
    localStorage.removeItem('targetLocations');
    localStorage.removeItem('locationIndex');
    localStorage.removeItem('totalScores');

    targetLocations.length = 0;
    locationIndex = 0;
    totalScores = {};

    clearGameContent();
    createGameLocations();
  };

  const resetPlayers = () => {
    localStorage.removeItem('playerNames');
    playerNames.length = 0;

    clearGameContent();
    createPlayersInput();
  };

  const clearGameContent = () => {
    gameContent.textContent = '';
  };

  const addressFromLatLng = async (gcs) => {
    const {lat, lng} = gcs;
    const gcsInput = `${lat},${lng}`;

    const decodingUrl = `${geoencodeEndpoint}?key=${key}&location=${gcsInput}`;
    const decodingResponse = await fetch(decodingUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
    const decodingPayload = await decodingResponse.json();

    if (!decodingPayload || !Array.isArray(decodingPayload.results)) {
      return;
    }

    const decodingResult = decodingPayload.results[0];
    if (!decodingResult || !Array.isArray(decodingResult.locations)) {
      return;
    }

    const location = decodingResult.locations[0];

    let locationAddressParts = [];
    if (location.street) {
      locationAddressParts.push(location.street);
    }
    if (location.adminArea6) {
      locationAddressParts.push(location.adminArea6);
    }
    if (location.adminArea5) {
      locationAddressParts.push(location.adminArea5);
    }
    if (location.adminArea4) {
      locationAddressParts.push(location.adminArea4);
    }
    if (location.adminArea3) {
      locationAddressParts.push(location.adminArea3);
    }
    if (location.adminArea2) {
      locationAddressParts.push(location.adminArea2);
    }
    if (location.adminArea1) {
      locationAddressParts.push(location.adminArea1);
    }

    return locationAddressParts.join(', ');
  };
  const latLngFromAddress = async (address) => {
    const encodingUrl = `${geoencodeEndpoint}?key=${key}&location=${address}`;

    const encodingResponse = await fetch(encodingUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

    const encodingPayload = await encodingResponse.json();

    if (!encodingPayload || !Array.isArray(encodingPayload.results)) {
      return;
    }

    const encodingResult = encodingPayload.results[0];
    if (!encodingResult || !Array.isArray(encodingResult.locations)) {
      return;
    }

    const location = encodingResult.locations[0];
    return location.latLng;
  };

  const deltaLatLng = (gcs1, gcs2) => {
    const {lat: lat1, lng: lng1} = gcs1;
    const {lat: lat2, lng: lng2} = gcs2;

    var R = 6371; // Radius of the earth in km

    var dLat = deg2rad(lat2 - lat1);
    var dLng = deg2rad(lng2 - lng1); 

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLng / 2) * Math.sin(dLng / 2); 

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    var d = R * c; // Distance in km

    return d;
  }

  const deg2rad = (deg) => {
    return deg * (Math.PI/180)
  }

  const run = () => {
    document.getElementById("scene").style.zIndex = 100;
    document.title = "";

    gameContainer.style.position = 'relative';
    gameContainer.style.padding = '12px';
    gameContainer.style.backgroundColor = 'white';
    gameContainer.style.zIndex = 1001;
    gameContainer.style.boxShadow = '0 0 5px rgba(0,0,0,0.25)';

    const gameResetButton = createSecondaryButton('game--reset', 'Reset game');
    gameResetButton.onclick = resetGame;
    gameResetButton.style.marginRight = '12px';

    const playerResetButton = createSecondaryButton('game--reset', 'Reset players');
    playerResetButton.onclick = resetPlayers;

    const loader = createLoader();

    gameContainer.appendChild(gameContent);
    gameContainer.appendChild(createDivider());
    gameContainer.appendChild(gameResetButton);
    gameContainer.appendChild(playerResetButton);
    gameContainer.appendChild(loader);

    document.body.appendChild(gameContainer);

    if (playerNames.length === 0) {
      createPlayersInput();
    }
    else if (targetLocations.length === 0) {
      createGameLocations();
    }
    else {
      createGame();
    }
  };

  const runIfActive = async () => {
    try {
      const {isActive} = await browser.storage.sync.get('isActive');

      if (isActive === true) {
        run();
      }
    }
    catch (error) {
      alert(error.message);
    }
  };

  const key = 'TAev1bCWYNbAzMhFyQX2Gr1ecGDd6wrO';

  const mapquestRootUrl = 'https://open.mapquestapi.com/geocoding/v1';
  const geodecodeEndpoint = `${mapquestRootUrl}/reverse`;
  const geoencodeEndpoint = `${mapquestRootUrl}/address`;

  alert("A");

  const storedPlayerNames = localStorage.getItem('playerNames');
  let playerNames = storedPlayerNames ? JSON.parse(storedPlayerNames) : []; 

  alert("B");

  const storedTargetLocations = localStorage.getItem('targetLocations');
  let targetLocations = storedTargetLocations ? JSON.parse(storedTargetLocations) : [];

  alert("C");

  const storedTotalScores = localStorage.getItem('totalScores');
  let totalScores = storedTotalScores ? JSON.parse(storedTotalScores) : {};

  alert("D");

  const storedLocationIndex = localStorage.getItem('locationIndex');
  let locationIndex = storedLocationIndex ? JSON.parse(storedLocationIndex) : 0;

  alert("E");

  const gameContainer = document.createElement('div');
  const gameContent = document.createElement('div');

  runIfActive();
})();

