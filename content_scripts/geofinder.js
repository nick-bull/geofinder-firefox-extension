(async function() {
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

    locationInputContainer.style.paddingBottom = '6px';

    locationInputContainer.setAttribute('player-name', name);

    const nameElement = createFixedWidthLabel(`game--player-name`, name, 150);

    const locationInput = createTextInput(`game--answer`, 'Location');

    locationInputContainer.appendChild(nameElement);
    locationInputContainer.appendChild(locationInput);

    return locationInputContainer;
  };

  const createLocationInputs = async () => {
    const locationsContainer = document.createElement('div');

    const currentLocationNumber = locationIndex + 1;
    const totalLocations = targetLocations.length;

    const title = createTitle(
      'game--title',
      `Location guesses (${currentLocationNumber}/${totalLocations})`,
    );

    locationsContainer.appendChild(title);

    const processLocationResults = () => {
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

    const startButton = createButton('game--play', 'Let\'s play!');

    const storedIsTimed = await browser.storage.sync.get('isTimed');
    const {isTimed = false} = storedIsTimed;

    if (isTimed) {
      const storedTimeLimit = await browser.storage.sync.get('timeLimit');
      let {timeLimit = 90} = storedTimeLimit;

      const timerLabel = createFixedWidthLabel('game--timer', timeLimit, 150);
      timerLabel.style.paddingBottom = '6px';

      const timerInterval = setInterval(() => {
        timeLimit--;
        timerLabel.innerText = timeLimit;
      }, 1000);
      const timerTimeout = setTimeout(() => {
        clearInterval(timerInterval);
        timerLabel.innerText = 'Time up!';

        setTimeout(processLocationResults, 2000);
      }, timeLimit * 1000);

      locationsContainer.appendChild(timerLabel);

      startButton.addEventListener('click', () => {
        if (timerInterval) {
          clearInterval(timerInterval);
        }
        if (timerTimeout) {
          clearTimeout(timerTimeout);
        }
      });
    }

    startButton.addEventListener('click', () => {
      processLocationResults();
    });

    for (const playerName of playerNames) {
      locationsContainer.appendChild(createLocationInput(playerName));
    }

    locationsContainer.appendChild(startButton);

    gameContent.appendChild(locationsContainer);
  }

  const createGame = () => {
    // createGameLocation();
    // gameContent.appendChild(createDivider());

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
      const result = {playerName, addressGuess};

      if (addressGuess !== '') {
        const gcsGuess = await addressToGcs(addressGuess);

        result.gcsGuess = gcsGuess;
        result.distance = deltaLatLng(targetLocation, gcsGuess);
      }

      results.push(result);
    }
    results.sort((a, b) => (a.distance > b.distance) ? 1 : -1);

    const targetAddress = await gcsToAddress(targetLocation);

    locationIndex += 1;
    localStorage.setItem('locationIndex', locationIndex);

    gameContent.removeChild(loader);

    const title = createTitle('results--title', 'Round Results');

    const targetCoords = `${targetLocation.lat},${targetLocation.lng}`;
    const targetUrl = `https://www.google.com/maps/@${targetCoords},8z`;
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
      const {playerName, addressGuess, gcsGuess, distance} = result;

      const guessCoords = gcsGuess && `${gcsGuess.lat},${gcsGuess.lng}`;
      const processedDistance = distance ? `${Number(distance).toFixed(0)}km` : ':(';

      const resultContainer = document.createElement('div');

      const nameLabel = createFixedWidthLabel('results--name', playerName, 100);
      resultContainer.appendChild(nameLabel);

      const guessLabel = createFixedWidthLabel('results--guess', addressGuess, 200);

      if (guessCoords) {
        const directionUrl = createDirectionsUrl(guessCoords, targetCoords);
        const guessAnchor = document.createElement('a');
        guessAnchor.setAttribute('href', directionUrl);
        guessAnchor.appendChild(guessLabel);

        resultContainer.appendChild(guessAnchor);
      }
      else {
        resultContainer.appendChild(guessLabel);
      }

      const distanceLabel = createFixedWidthLabel(
       'results--distance', 
       processedDistance,
        200,
      );
      resultContainer.appendChild(distanceLabel);

      const scoreRatio = distance === undefined ? 0 : 1 - (distance / 2e4);
      const score = scoreRatio * 100;
      const roundedScore = score.toFixed(2);

      const totalScore = totalScores[playerName] + score;
      const roundedTotalScore = totalScore.toFixed(2);

      totalScores[playerName] = totalScore;

      const scoreMessage = `${roundedScore} (${roundedTotalScore})`;
      const scoreLabel = createFixedWidthLabel('results--score', scoreMessage, 200);
 
      resultContainer.appendChild(scoreLabel);

      resultsContainer.appendChild(resultContainer);
    }
    localStorage.setItem('totalScores', JSON.stringify(totalScores));

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

    const finalResults = [];
    for (const playerName of playerNames) {

      const score = totalScores[playerName];
      console.log(JSON.stringify(playerName));
      console.log(JSON.stringify(totalScores));

      const roundedScore = score.toFixed(2);

      finalResults.push({
        playerName,
        score: roundedScore,
      });
    }
    finalResults.sort((a, b) => a.score > b.score);

    console.log('2');

    const resultsContainer = document.createElement('div');
    for (const result of finalResults) {
      const {playerName, score} = result;

      const resultContainer = document.createElement('div');

      const nameLabel = createFixedWidthLabel('final-results--name', playerName, 100);
      const scoreLabel = createFixedWidthLabel('final-results--score', score, 100);
 
      resultContainer.appendChild(nameLabel);
      resultContainer.appendChild(scoreLabel);

      resultsContainer.appendChild(resultContainer);
    }

    console.log('3');

    const resetGameButton = createButton('final-results--reset', 'New game');
    resetGameButton.onclick = resetGame;
    
    gameContent.appendChild(title);
    gameContent.appendChild(createDivider());
    gameContent.appendChild(resultsContainer);
    gameContent.appendChild(createDivider());
    gameContent.appendChild(resetGameButton);
  };

  const resetGame = () => {
    targetLocations.length = 0;
    locationIndex = 0;
    for (const playerName of playerNames) {
      totalScores[playerName] = 0;
    }

    localStorage.setItem('targetLocations', targetLocations);
    localStorage.setItem('locationIndex', locationIndex);
    localStorage.setItem('totalScores', JSON.stringify(totalScores));

    clearGameContent();

    if (playerNames.length === 0) {
      createPlayersInput();
    }
    else {
      createGameLocations();
    }
  };

  const resetPlayers = () => {
    localStorage.removeItem('playerNames');
    playerNames.length = 0;
    totalScores = {};

    clearGameContent();
    resetGame();
  };

  const clearGameContent = () => {
    gameContent.textContent = '';
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

  const createMapQuestApis = (key) => {
    const mapquestRootUrl = 'https://open.mapquestapi.com/geocoding/v1';
    const geodecodeEndpoint = `${mapquestRootUrl}/reverse`;
    const geoencodeEndpoint = `${mapquestRootUrl}/address`;

    const gcsToAddress = async (gcs) => {
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
    const addressToGcs = async (address) => {
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
 
    return {gcsToAddress, addressToGcs};
  };

  const createGoogleApis = (key) => {
    const googleApiRootUrl = 'https://maps.googleapis.com/maps/api/geocode';

    const addressToGcs = async (address) => {
      const encodingUrl = `${googleApiRootUrl}/json?address=${address}&key=${key}`;
      const encodingResponse = await fetch(encodingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

      if (encodingResponse.status !== 200) {
        throw new Error(
          `Google API encoding error: returned ${encodingResponse.status}`
        );
      }

      const encodingPayload = await encodingResponse.json();
      const encodingResult = encodingPayload.results[0];
      const encodingGcs = encodingResult.geometry.location;

      return encodingGcs;
    };
 
    const gcsToAddress = async (gcs) => {
      const {lat, lng} = gcs;
      const decodingUrl = `${googleApiRootUrl}/json?latlng=${lat},${lng}&key=${key}`;
      const decodingResponse = await fetch(decodingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

      if (decodingResponse.status !== 200) {
        throw new Error(
          `Google API reverse encoding error: returned ${decodingResponse.status}`
        );
      }

      const decodingPayload = await decodingResponse.json();
      const decodingResult = decodingPayload.results[0];
      console.log(JSON.stringify(decodingResult.address_components[0]));
      const decodedAddressParts = 
        decodingResult.address_components.map(component => component.short_name);
      const decodedAddress = decodedAddressParts.join(', ');
      
      return decodedAddress;
    };

    return {gcsToAddress, addressToGcs};
  };

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
    const {isActive} = await browser.storage.sync.get('isActive');

    if (isActive === true) {
      run();
    }
  };

  const storedApiKey = await browser.storage.sync.get();
  const {apiKey} = storedApiKey;

  if (!apiKey) {
    alert('Geofinder for Google Maps: No API key provided');

    return;
  }

  const {gcsToAddress, addressToGcs} = createGoogleApis(apiKey);

  const mapquestRootUrl = 'https://open.mapquestapi.com/geocoding/v1';
  const geodecodeEndpoint = `${mapquestRootUrl}/reverse`;
  const geoencodeEndpoint = `${mapquestRootUrl}/address`;

  const storedPlayerNames = localStorage.getItem('playerNames');
  let playerNames = storedPlayerNames ? JSON.parse(storedPlayerNames) : []; 

  const storedTargetLocations = localStorage.getItem('targetLocations');
  let targetLocations = storedTargetLocations ? JSON.parse(storedTargetLocations) : [];

  const storedTotalScores = localStorage.getItem('totalScores');
  let totalScores = storedTotalScores ? JSON.parse(storedTotalScores) : {};

  const storedLocationIndex = localStorage.getItem('locationIndex');
  let locationIndex = storedLocationIndex ? JSON.parse(storedLocationIndex) : 0;

  const gameContainer = document.createElement('div');
  const gameContent = document.createElement('div');

  runIfActive();
})();

