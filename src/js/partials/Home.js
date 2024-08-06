import {templates, select} from '../settings.js';
import Playlist from './Playlist.js';

class Home {
  constructor(allSongs, playedSongs)  {
    const thisHome = this;

    thisHome.allSongs = allSongs;
    thisHome.playedSongs = playedSongs || [];
    thisHome.playedCategories = [];

    thisHome.categoryList = [];
    //console.log(thisHome.categoryList);

    thisHome.render();
    thisHome.generatePlaylist(thisHome.allSongs);

    thisHome.renderCategories(thisHome.allSongs);

    thisHome.playlistInstance = new Playlist(thisHome.songs);
  
  }

  createAudioElement(song) {
    
    const audioElement = document.createElement('audio');
    
    audioElement.src = `songs/${song.filename}`;
    
    return audioElement;
  
  }
    
  generatePlaylist(allSongs) {
    const thisHome = this;
    const playlistContainer = document.querySelector(select.containerOf.playlist);
   
    for (const song of allSongs) {
      
      const filename = song.filename || '';
      const filenameParts = filename.replace('.mp3', '').replace(/-/g, '').split('_');
      const reversedParts = filenameParts.reverse();
      const fullName = reversedParts[1] + ' ' + reversedParts[0];
      const uppercaseFullName = fullName.toUpperCase();
  
      const songData = {
        id: song.id,
        title: song.title,
        author: uppercaseFullName,
        filename: `${song.filename}`,
        categories: song.categories,
        ranking: song.ranking,
      };
  
      const songHTML = templates.singleSong(songData);
      playlistContainer.innerHTML += songHTML;
  
      const containerOfAudio = document.getElementById(song.id);
      const audioElement = thisHome.createAudioElement(song);
      containerOfAudio.appendChild(audioElement);
    }
    thisHome.initGreenPlayer();
    thisHome.playSongs(thisHome.allSongs);
  }

  renderCategories(allSongs) {
    const thisHome = this;

    for (const song of allSongs) {
      const categoriesOfSong = song.categories;

      for (const category of categoriesOfSong) {
        if (!thisHome.categoryList.includes(category)) {
          thisHome.categoryList.push(category);
        }
      }
    }
  }

  playSongs(allSongs){

    const thisHome = this;
    const audioPlayers = document.querySelectorAll('.playlist');

    for(let audioElement of audioPlayers){
      const audio = audioElement.querySelector('audio');

      audio.addEventListener('play', function(event){
        event.preventDefault(); 
        console.log(audio);
        const categoriesParagraph = audioElement.querySelector('.song-details p#song-categories');
        const categoriesText = categoriesParagraph.textContent.replace('Categories:', '').trim();

        if (categoriesText !== '') {
          const categoriesArray = categoriesText.split(',').map(category => category.trim());
          console.log(categoriesArray);
          for (let category of categoriesArray) {
            if (!thisHome.playedCategories[category]) {
              thisHome.playedCategories[category] = 1;
            } else {
              thisHome.playedCategories[category]++;
            }
          }
          const favoriteCategoriesList = Object.entries(thisHome.playedCategories).sort((a,b) => b[1]-a[1]).map(el=>el[0]); 
          thisHome.mostPopularCategory = favoriteCategoriesList[0];

          console.log(thisHome.mostPopularCategory);
          console.log('Played Categories:', thisHome.playedCategories);

          for (const song of allSongs) {
            if (song.categories.includes(thisHome.mostPopularCategory)) {
              thisHome.playedSongs.push(song);
              console.log('listenedsongs', thisHome.playedSongs);
            }
          }
        }
      });
    } 
  }

  render() {

    const generatedHTML = templates.pageHome();
    const homeContainer = document.querySelector(select.containerOf.home);

    homeContainer.innerHTML+= generatedHTML;

    const allElements = document.querySelectorAll('[id^="upc-"]'); // Use querySelectorAll to select all elements with ID 'upc'
  
    allElements.forEach(element => {
      element.textContent = element.textContent.toUpperCase(); // Convert text content to uppercase
    });
  }

  initGreenPlayer(){
    // eslint-disable-next-line no-undef
    GreenAudioPlayer.init({
      selector: '.play-song', 
      stopOthersOnPlay: true,
    });
  }


}


export default Home;