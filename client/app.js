const inputZip = document.querySelector('.zip-input');
const buttonZip = document.querySelector('.zip-button');
const spinner = document.querySelector('#loading');
const placeNameElement = document.querySelector('#place-name');
const tempTextElement = document.querySelector('#temp-text');
const descriptionTextElement = document.querySelector('#description-text');
const windSpeedTextElement = document.querySelector('#description-text-wind-speed');
const winDegTextElement = document.querySelector('#description-text-wind-deg');
const cloudTextElement = document.querySelector('#description-text-cloud');
const wrapperContentInfo = document.querySelector('#entryHolder');
const wrapperPlaceHolder = document.querySelector('#wrapper-content-placeholder');
const searchsListContainer = document.querySelector('#wrapper__content-searchs-list');
const contentSearchContainer = document.querySelector('#wrapper__content-search');
const feelingsTextArea = document.querySelector('#feelings');
const dateTextElement = document.querySelector('#date');
const contentTextElement = document.querySelector('#content');

const BASE_URL = 'http://api.openweathermap.org/data/2.5';
const API_KEY = '1646c50a7288ea8d88ab65c09bfb155a';

/**
 * Update view with values from the weather API.
 * @param {Object} data
 */
const updateSearchUI = data => {
    wrapperContentInfo.style.display = "flex";
    wrapperContentInfo.style.flexDirection = "column";
    placeNameElement.innerHTML = `<h1 class="place-name">${data.name}</h1>`;
    tempTextElement.innerHTML = data.main.temp;
    windSpeedTextElement.innerHTML = `Speed ${data.wind.speed}`;
    winDegTextElement.innerHTML = `Def ${data.wind.deg}`;
    cloudTextElement.innerHTML = `clouds ${data.clouds.all}`;
    contentTextElement.innerHTML = `<h1 class="feelings-content">${data.feelings}</h1>`;
    dateTextElement.innerHTML = data.time;

    descriptionTextElement.innerHTML = data.weather && data.weather[0].description;

}

/**
 * Update searchs list with values from the local API.
 * @param {Object} data
 */
const updateSearchsListUI = data => {

    while (searchsListContainer.firstChild) {
        searchsListContainer.removeChild(searchsListContainer.firstChild);
    }

    for (const item of data) {
        const listItem = document.createElement('li');
        const listItemContent = document.createElement('div');
        const time = document.createElement('h2');
        const place = document.createElement('h2');
        const description = document.createElement('h2');
        time.textContent = item.time;
        time.classList.add('search-list-time');
        place.textContent = item.data.name;
        place.classList.add('search-list-place');
        description.textContent = item.data.weather && item.data.weather[0].description;
        description.classList.add('search-list-description');
        listItemContent.appendChild(place);
        listItemContent.appendChild(time);
        listItemContent.appendChild(description);
        listItem.classList.add('search-list-item')
        listItem.appendChild(listItemContent);
        searchsListContainer.appendChild(listItem);
    }
}

/**
 * Save in local server new data.
 * @param {Object} data
 */
const postData = async ( url = '', data = {})=> {
    if(wrapperPlaceHolder) {
        wrapperPlaceHolder.classList.add('hide');
    }
    spinner.classList.add('show-loading');
    spinner.classList.remove('hide-loading');

      const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    try {
        const parsedResponse = await response.json();
        if(parsedResponse.cod === 200) {
            return buildUI(parsedResponse);
        }
        return buildErrorView(parsedResponse.message);
    } catch(error) {
        console.log('error', error)
        spinner.classList.add('hide-loading');
        wrapperPlaceHolder && wrapperPlaceHolder.classList.add('hide');
        wrapperContentInfo && wrapperContentInfo.classList.add('hide');
    }
}

/**
 * Dynamic fetch method based on url, method.
 * @param {Object} object
 */
const executeRequest = ({url, method, body}) => {

    return fetch(url,{
        method,
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body
    })
}

/**
 * Hide the loading spinner.
 */
const hideSpinner = ( ) => {
    spinner.classList.add('hide-loading');
    spinner.classList.remove('show-loading');
}

/**
 * Hide place holderview.
 */
const hidePlaceHolder = () => {
    wrapperPlaceHolder && wrapperPlaceHolder.classList.add('hide');
}

/**
 *  Build UI with new data from requests.
 * @param {Object} response
 */
const buildUI = async (response) => {
    try {
        if(document.querySelector('#error-message')) document.querySelector('#error-message').style.display = 'none';
        updateSearchUI(response);
        hideSpinner();
        hidePlaceHolder();
        const searchs = await executeRequest({url: '/searchs', method: 'GET'});
        const searchsjson = await searchs.json();
        updateSearchsListUI(searchsjson);
    } catch(error) {
        console.log("Error:" , error)
    }
}

/**
 * Build error view in order to show an error message.
 * @param {Object} message
 */
const buildErrorView = (message) => {
    wrapperContentInfo.style.display = 'none';
    spinner.classList.add('hide');
    spinner.classList.remove('show-loading');

    if (document.querySelector('#error-message')) {
        document.querySelector('#error-message').style.display = 'flex';
    } else {
        const errorText = document.createElement('h3');
        errorText.id = "error-message"
        errorText.textContent = message;
        errorText.style.padding = "20px";
        contentSearchContainer.appendChild(errorText);
    }
}

/**
 * Retrieve data from weather API
 */
const getWeatherByZip = async (baseUrl, key) => {
    const value = inputZip.value;
    const feelings = feelingsTextArea.value;
    if(value) {
        const url = `${baseUrl}/weather?zip=${value}&appid=${key}&units=metric`;
        const response = await fetch(url, {
            method: 'GET'
        })
        try {
            const respondeParsed = await response.json();
            const params = {
                feelings,
                ...respondeParsed,
            }
            postData('/search-by-zip', params);
        } catch(error) {
            console.log(error)
        }

    }
}


buttonZip.addEventListener('click', () => getWeatherByZip(BASE_URL, API_KEY))