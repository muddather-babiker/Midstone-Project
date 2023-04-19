import MusicPlaylistClient from '../api/musicPlaylistClient';
import Header from '../components/header';
import BindingClass from "../util/bindingClass";
import DataStore from "../util/DataStore";

/*
The code below this comment is equivalent to...
const EMPTY_DATASTORE_STATE = {
    'search-criteria': '',
    'search-results': [],
};

...but uses the "KEY" constants instead of "magic strings".
The "KEY" constants will be reused a few times below.
*/

const SEARCH_CRITERIA_KEY = 'search-criteria';
const SEARCH_RESULTS_KEY = 'search-results';
const EMPTY_DATASTORE_STATE = {
    [SEARCH_CRITERIA_KEY]: '',
    [SEARCH_RESULTS_KEY]: [],
};


/**
 * Logic needed for the view playlist page of the website.
 */
class ViewCar extends BindingClass {
    constructor() {
        super();
        this.bindClassMethods(['clientLoaded', 'mount', 'getCar', 'displaySearchResults', 'getHTMLForSearchResults'], this);
        this.dataStore = new DataStore(EMPTY_DATASTORE_STATE);
        this.dataStore.addChangeListener(this.displaySearchResults);
        this.header = new Header(this.dataStore);
        console.log("viewCar constructor");
    }

    /**
     * Once the client is loaded, get the playlist metadata and song list.
     */
    async clientLoaded() {
     console.log("calling client loaded");
    }

    /**
     * Add the header to the page and load the MusicPlaylistClient.
     */
    mount() {
        document.getElementById('view-car').addEventListener('click', this.getCar);

        this.header.addHeaderToPage();
        this.client = new MusicPlaylistClient();
        this.clientLoaded();
    }





    async getCar (){

        const errorMessageDisplay = document.getElementById('error-message');
        errorMessageDisplay.innerText = ``;
        errorMessageDisplay.classList.add('hidden');

        const createButton = document.getElementById('view-car');
        const origButtonText = createButton.innerText;
        createButton.innerText = 'Loading...';


        const vin = document.getElementById('vin-for-search').value;
        console.log("vin is");
        console.log(vin);

        if (vin) {
            const carResult = await this.client.getCar(vin);
            if (carResult==null){
                errorMessageDisplay.innerText = `No Car Found`;
                errorMessageDisplay.classList.remove('hidden');

                createButton.innerText = 'Search New Car';

                const searchResultsContainer = document.getElementById('search-results-container');
                const searchCriteriaDisplay = document.getElementById('search-criteria-display');
                const searchResultsDisplay = document.getElementById('search-results-display');

                searchResultsContainer.classList.add('hidden');
                searchCriteriaDisplay.innerHTML = '';
                searchResultsDisplay.innerHTML = '';


            }

            this.dataStore.setState({
                [SEARCH_CRITERIA_KEY]: vin,
                [SEARCH_RESULTS_KEY]: carResult,
            });
            console.log(dataStore.get(SEARCH_RESULTS_KEY));

        }
    }

   displaySearchResults() {
        const searchCriteria = this.dataStore.get(SEARCH_CRITERIA_KEY);
        const searchResults = this.dataStore.get(SEARCH_RESULTS_KEY);

        const searchResultsContainer = document.getElementById('search-results-container');
        const searchCriteriaDisplay = document.getElementById('search-criteria-display');
        const searchResultsDisplay = document.getElementById('search-results-display');
        console.log(searchResults);

        if (searchCriteria === '') {
            searchResultsContainer.classList.add('hidden');
            searchCriteriaDisplay.innerHTML = '';
            searchResultsDisplay.innerHTML = '';
        } else {
            searchResultsContainer.classList.remove('hidden');
            searchCriteriaDisplay.innerHTML = `"${searchCriteria}"`;
            searchResultsDisplay.innerHTML = this.getHTMLForSearchResults(searchResults);
        }
    }

   /**
     * Create appropriate HTML for displaying searchResults on the page.
     * @param searchResults An array of playlists objects to be displayed on the page.
     * @returns A string of HTML suitable for being dropped on the page.
     */
    getHTMLForSearchResults(searchResults) {
    console.log("search result is");
    console.log(searchResults);
        if (searchResults.length === 0) {
            return '<h4>No results found</h4>';
        }

        let html = '<table><tr><th>Make</th><th>Model</th><th>Year</th><th>Class</th><th>Capacity</th></tr>' +
            '<tr><td>'+ searchResults.make + '</td>' +
             '<td>'+ searchResults.model + '</td>'  +
             '<td>'+ searchResults.year + '</td>'  +
             '<td>'+ searchResults.classOfVehicle + '</td>'  +
             '<td>'+ searchResults.capacity + '</td></tr>'  +
              '</table>';

        const createButton = document.getElementById('view-car');
        createButton.innerText= "View Car";

        return html;
    }
}

/**
 * Main method to run when the page contents have loaded.
 */
const main = async () => {
    const viewCar = new ViewCar();
    viewCar.mount();
};

window.addEventListener('DOMContentLoaded', main);
