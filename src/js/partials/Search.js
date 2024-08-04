import {select, templates} from '../settings.js';
class Search {

  constructor(allSongs, playedSongs){
    const thisSearch = this;

    thisSearch.allSongs = allSongs;
    thisSearch.playedSongs = playedSongs || [];

    thisSearch.playedCategories = [];

    thisSearch.categoryList = [];

    thisSearch.render();
    thisSearch.getCategory(thisSearch.allSongs);
  
  }

  getCategory(allSongs){
    const thisSearch = this;

    for (const song of allSongs) {
      const categoriesOfSong = song.categories; // Assuming each song object has a "categories" property
  
      for (const category of categoriesOfSong) {
        if (!thisSearch.categoryList.includes(category)) {
          thisSearch.categoryList.push(category);
        }
      }
    }
  }

  createAudioElement(song) {
    const audioElement = document.createElement('audio');
    
    audioElement.src = `songs/${song.filename}`;
    
    return audioElement;

  }

  createPlaylist(){
    const thisSearch = this;
    const categoryList = [];

    // for every category (song)...
    for (const song of thisSearch.songs) {
      // Create a new object representing the song with selected properties
      const songsObject = {
        id: song.id,
        title: song.title,
        author: song.author,
        filename:`songs/${song.filename}`,
        categories: song.categories,
        ranking: song.ranking,
      };
      const generatedSongHTML = templates.singleSong(songsObject); 
      const playlistContainer = document.querySelector(select.containerOf.searchPlaylist);
      playlistContainer.insertAdjacentHTML('beforeend', generatedSongHTML);
      //console.log(playlistContainer);
      const containerOfAudio = document.getElementById(song.id);
      
      const audioElement = thisSearch.createAudioElement(song);
      containerOfAudio.appendChild(audioElement);

      for (const category of song.categories) {
        if (!categoryList.includes(category)) {
          categoryList.push(category);
        }
      }
    }

    thisSearch.createCategoriesList(categoryList);
  }

  createCategoriesList(categories) {
    const selectElement = document.getElementById('search_select');
    selectElement.innerHTML = ''; // Clear existing options

    const defaultOption = document.createElement('option');
    defaultOption.value = 'clean';
    selectElement.appendChild(defaultOption);

    for (const category of categories) {
      const optionElement = document.createElement('option');
      optionElement.value = category;
      optionElement.textContent = category;
      selectElement.appendChild(optionElement);
    }
  }

  filterSongs(){
    //const thisSearch = this;
    const button = document.querySelector(select.containerOf.buttonSearch);

    button.addEventListener('submit', function(event){
      event.preventDefault(); // Prevent form submission

    });

  }

  render() {

    const generatedHTML = templates.searchPage();
    const searchContainer = document.querySelector(select.containerOf.search);

    searchContainer.innerHTML+= generatedHTML;

    const allElements = document.querySelectorAll('#upc'); // Use querySelectorAll to select all elements with ID 'upc'
  
    allElements.forEach(element => {
      element.textContent = element.textContent.toUpperCase(); // Convert text content to uppercase
    });

  }

  initGreenPlayer(){
    // eslint-disable-next-line no-undef
    GreenAudioPlayer.init({
      selector: '.searched-song', 
      stopOthersOnPlay: true,
    });
  }

}

export default Search;