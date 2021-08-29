const inputZip = document.querySelector('.zip-input');
const buttonZip = document.querySelector('.zip-button');
const spinner = document.querySelector('#loading');
const placeNameElement = document.querySelector('#place-name');
const tempTextElement = document.querySelector('#temp-text');
const descriptionTextElement = document.querySelector('#description-text');
const windSpeedTextElement = document.querySelector('#description-text-wind-speed');
const winDegTextElement = document.querySelector('#description-text-wind-deg');
const cloudTextElement = document.querySelector('#description-text-cloud');
const wrapperContentInfo = document.querySelector('#wrapper-content-info');
const wrapperPlaceHolder = document.querySelector('#wrapper-content-placeholder');
const searchsListContainer = document.querySelector('#wrapper__content-searchs-list');
const contentSearchContainer = document.querySelector('#wrapper__content-search');

const BASE_URL = 'http://api.openweathermap.org/data/2.5';

/**
 * Update view with values from the weather API.
 * @param {Object} data
 */
const updateSearchUI = data => {
    wrapperContentInfo.style.display = "flex";
    wrapperContentInfo.style.flexDirection = "column";
    placeNameElement.textContent = data.name;
    tempTextElement.textContent = data.main.temp;
    windSpeedTextElement.textContent = `Speed ${data.wind.speed}`;
    winDegTextElement.textContent = `Def ${data.wind.deg}`;
    cloudTextElement.textContent = `clouds ${data.clouds.all}`;

    descriptionTextElement.textContent = data.weather && data.weather[0].description;

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
 * Save in local server new data.
 * @param {Object} data
 */
const postWeatherData = (data) => {

    if(wrapperPlaceHolder) {
        wrapperPlaceHolder.classList.add('hide');
    }
    spinner.classList.add('show-loading')
    spinner.classList.remove('hide-loading')

    executeRequest({url: '/search-by-zip', method: 'POST', body: JSON.stringify(data)})
    .then((response) => {
        return response.json();
    })
    .then((response) => {
        if(response.cod === 200) {
            return buildUI(response);
        }
        return buildErrorView(response.message);
    })
    .catch((error) => {
        console.log("Error", error);
        spinner.classList.add('hide-loading');
        wrapperPlaceHolder && wrapperPlaceHolder.classList.add('hide');
        wrapperContentInfo && wrapperContentInfo.classList.add('hide');
    })
}

/**
 * Retrieve data from weather API
 */
const getWeatherByZip = async () => {
    const value = inputZip.value
    if(value) {
        const url = `${BASE_URL}/weather?zip=${value}&appid=${"1646c50a7288ea8d88ab65c09bfb155a"}`;
        const response = await fetch(url, {
            method: 'GET'
        })
        try {
            const respondeParsed = await response.json();
            postWeatherData(respondeParsed)
        } catch(e) {
            console.log(e)
        }

    }
}


buttonZip.addEventListener('click', getWeatherByZip)