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
    thisSearch.filteringSongs();
  
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

  createCategoriesList(categories) {
    const selectElement = document.getElementById('select_category');
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

  filteringSongs(){
    const thisSearch = this;
    const button = document.querySelector('.btn');
    const input = document.querySelector(select.containerOf.input);
    const selectCategories = document.getElementById('select_category');
    let selectedCategory;

    selectCategories.addEventListener('input', function (event) {
      event.preventDefault();
      selectedCategory = event.target.value;
      //console.log(selectedCategory);
    });

    button.addEventListener('click', function(event){
      event.preventDefault(); // Prevent form submission
      const inputString = input.value.toLowerCase();

      const playlistWrapper = document.querySelector(select.containerOf.searchPlaylist);
      playlistWrapper.innerHTML = '';
      console.log(playlistWrapper);

      for (const song of thisSearch.filteredSongs) {

        thisSearch.songsData = {
          id: song.id,
          title: song.title,
          author: song.author,
          filename:`songs/${song.filename}`,
          categories: song.categories,
          ranking: song.ranking,
        };

        const matchedSongs = (song.title.toLowerCase().includes(inputString)) & (song.categories.includes(selectedCategory) || selectedCategory == undefined || selectedCategory.includes('clean'));

        if(matchedSongs == true){
          thisSearch.songsHTML = templates.singleSong(thisSearch.songsData); 
          thisSearch.songsHTML = thisSearch.songsHTML.replaceAll('play-song', 'search-song');
          playlistWrapper.innerHTML += thisSearch.songsHTML; 
          console.log(playlistWrapper.innerHTML);
          const containerOfSong = document.querySelector(select.containerOf.search_song);
          const audioElement = thisSearch.createAudioElement(song);
          containerOfSong.appendChild(audioElement);

          console.log('containerofaudio',containerOfSong);
          //console.log(audioElement);
        }
      }
      thisSearch.initGreenPlayer();
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