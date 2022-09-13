import './sass/index.scss';
import getRefs from './js/getRefs';
import debounce from 'lodash.debounce';
import API from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const refs = getRefs();

refs.searchInput.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const inputName = e.target.value.trim();
  API.fetchCountries(inputName).then(searchingInterface).catch(onCatchError);
  clearRender();
}

function onCatchError() {
  Notify.failure('Oops, there is no country with that name');
}

function renderCountryList(countries) {
  const markupList = countries
    .map(country => {
      return `<li class='country-list__item'>
  		<a class='country-list__link' href='#'>
    		<img src='${country.flags.svg}' alt='${country.name.official}' width='40' height='40' />
  		</a>
  			<p class='country-list__country'>${country.name.official}</p>
		</li>`;
    })
    .join('');

  refs.listOfCountry.innerHTML = markupList;
}

function renderCountryInfo(countries) {
  const markupInfo = countries
    .map(country => {
      return `<ul class='country-info__list'>
		<li class='country-info__item'>
			<img src='${country.flags.svg}' alt='${
        country.name.official
      }' width='40' height='40' />
			<p class='country-info__item--name'>${country.name.official}</p>
		</li>
		<li class='country-info__item'>
			<p class='country-info__item--subtitle'>Capital:</p>
			${country.capital}
		</li>
		<li class='country-info__item'>
			<p class='country-info__item--subtitle'>Population:</p>
			${country.population}
		</li>
		<li class='country-info__item'>
			<p class='country-info__item--subtitle'>Languages:</p>
			${Object.values(country.languages)}
		</li>
		</ul>`;
    })
    .join('');

  refs.countryInfo.innerHTML = markupInfo;
}

function searchingInterface(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.length >= 2 && countries.length <= 10) {
    renderCountryList(countries);
  } else if (countries.length === 1) {
    renderCountryInfo(countries);
  }
}

function clearRender() {
  refs.listOfCountry.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
