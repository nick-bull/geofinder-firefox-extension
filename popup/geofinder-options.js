const testParagraph = document.getElementById("testing");
const setTestOutput = (output) => {
  testParagraph.innerText = output;
};
const appendTestOutput = (output) => {
  testParagraph.innerText += output;
}

const isActiveCheckbox = document.getElementById('options--is-active');
const isTimedCheckbox = document.getElementById('options--is-timed');
const timeLimitInput = document.getElementById('options--time-limit');
const apiTypeOptionsInput = document.querySelector('.options--api-type');
const apiKeyInput = document.querySelector('.options--api-key');
const apiValidationSpinner = document.querySelector('.options--api-key-validation-spinner');
const apiValidationMessage = document.querySelector('.options--api-key-validation-message');

const createSpinner = () => {
  const spinner = document.createElement('div');
  spinner.classList.add('spinner', 'rotating');

  return spinner;
};

const limitNumberInput = (input) => {
  const {max, min} = input;
  const value = Number(input.value);

  if (value === NaN || value < min) {
    input.value = min;
  }
  else if (value > max) {
    input.value = max;
  }
};

async function saveOptions(e) {
  const apiTypeOption = apiTypeOptionsInput.querySelector('input:checked');

  const isActive = isActiveCheckbox.checked;
  const isTimed = isTimedCheckbox.checked;
  const timeLimit = timeLimitInput.value;
  const apiType = apiTypeOption.getAttribute('option');
  const apiKey = apiKeyInput.value;

  await browser.storage.sync.set({
    isActive,
    isTimed,
    timeLimit,
    apiType,
    apiKey,
  });
  const tabs = await browser.tabs.query({});

  for (const tab of tabs) {
    const tabUrl = tab.url;
    const googleMapsUrlRegex = new RegExp(
      '^https?://(www.)?google.com/maps|^https?://maps.google.com'
    );
 
    if (!googleMapsUrlRegex.test(tabUrl)) {
      continue;
    }

    browser.tabs.reload(tab.id);
  }

  e.preventDefault();
}

async function restoreOptions() {
  const {
    isActive = true,
    timeLimit = 120,
    isTimed = false,
    apiType = 'google',
    apiKey = '',
  } = await browser.storage.sync.get();

  isActiveCheckbox.checked = isActive;

  timeLimitInput.value = timeLimit;
  timeLimitInput.disabled = !isTimed;
  isTimedCheckbox.checked = isTimed;

  const apiTypeOption = apiTypeOptionsInput.querySelector(`input[option="${apiType}"]`);
  apiTypeOption.checked = true;

  apiKeyInput.value = apiKey;
};

const testApiKeyValidity = async () => {
  apiValidationSpinner.style.display = 'inline-block';

  const apiKey = apiKeyInput.value;

  const apiTypeOption = apiTypeOptionsInput.querySelector('input:checked');
  const apiType = apiTypeOption.getAttribute('option');
  
  const validateApiKeyBuilder = {
    google: async (key) => {
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=0,0&key=${key}`;
      const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
      const apiPayload = await apiResponse.json();
      
      return apiPayload.status !== 'REQUEST_DENIED';
    },
    mapquest: async (key) => {
      const apiUrl = `http://open.mapquestapi.com/geocoding/v1/reverse?location=0,0&key=${key}`;
      const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
      
      return apiResponse.status !== 200;
    },
  };

  const validateApiKey = validateApiKeyBuilder[apiType];
  const isValidApiKey = await validateApiKey(apiKey);

  apiValidationSpinner.style.display = 'none';

  apiValidationMessage.textContent = isValidApiKey ? 'valid' : 'invalid';
  apiValidationMessage.style.color = isValidApiKey ? '#0a0' : '#c00';
};

document.addEventListener('DOMContentLoaded', restoreOptions);

isActiveCheckbox.addEventListener('change', saveOptions);
isTimedCheckbox.addEventListener('change', saveOptions);
timeLimitInput.addEventListener('change', () => limitNumberInput(timeLimitInput));
timeLimitInput.addEventListener('change', saveOptions);
apiTypeOptionsInput.addEventListener('change', saveOptions);
apiKeyInput.addEventListener('change', saveOptions);

apiKeyInput.addEventListener('blur', testApiKeyValidity);

isTimedCheckbox.onclick = () => {
  timeLimitInput.disabled = !isTimedCheckbox.checked;
};


