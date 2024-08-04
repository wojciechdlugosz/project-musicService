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
    thisSearch.filterSongs();
  
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
    const thisSearch = this;
    thisSearch.button = document.querySelector('.btn');

    thisSearch.button.addEventListener('click', function(event){
      event.preventDefault(); // Prevent form submission


      const inputName = document.getElementById('song-category').value;
      const selectCategory = document.getElementById('search_select').value;

      // Filter songs based on input values
      const filteredSongs = thisSearch.songs.filter(song => {
        const isInName = inputName !== '' && (song.title.includes(inputName));
        const isInCategory = selectCategory !== 'clean' && song.categories.includes(selectCategory);
        return (isInName && isInCategory) || (isInName && selectCategory === 'clean') || (isInCategory && inputName === '');
      });

      thisSearch.updatePlaylist(filteredSongs);
    });

  }

  updatePlaylist(filteredSongs) {
    const thisSearch = this;
    const playlistWrapper = document.querySelector(select.containerOf.searchPlaylist);
    playlistWrapper.innerHTML = ''; // Clear existing playlist

    for (const song of filteredSongs) {
      const songsObject = {
        id: song.id,
        title: song.title,
        author: song.author,
        filename:`songs/${song.filename}`,
        categories: song.categories,
        ranking: song.ranking,
      };

      const generatedSongHTML = templates.singleSong(songsObject); 
      playlistWrapper.insertAdjacentHTML('beforeend', generatedSongHTML);

      const containerOfAudio = document.getElementById(song.id);
      const audioElement = thisSearch.createAudioElement(song);
      containerOfAudio.appendChild(audioElement);


      thisSearch.initGreenPlayer(audioElement);
    }

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