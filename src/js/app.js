import {select, classNames, settings} from './settings.js';
import Home from './partials/Home.js';
import Search from './partials/Search.js';

const app = {

  initPages: function() {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    //console.log(thisApp.pages);
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;

      }
    }
    //console.log('pageMatchingHash2', pageMatchingHash);
    thisApp.activatePage(pageMatchingHash);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', (event)=>{

        const clickedElement = event.currentTarget;
        event.preventDefault();
        //console.log('clickedElement', clickedElement);

        // get page ID from href attr.
        const id = clickedElement.getAttribute('href').replace('#', '');
        //console.log(clickedElement,'clickedElement');
        // run thisApp.activatePage() with ID
        thisApp.activatePage(id);
        //console.log(id, 'id');
        // change URL hash, add / to prevent scrolling to #

        window.location.hash = '#/' + id;

      });
    }

  },

  activatePage: function(pageId){

    const thisApp = this;

    for(let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    for(let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  initData: function() {
    const thisApp = this;

    thisApp.songs = {};

    const url = settings.db.url + '/' + settings.db.songs;

    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (data) {
        thisApp.songs = data;

        new Home (thisApp.songs);
        new Search(thisApp.songs);

        thisApp.initPages();

      });
  },

  init: function() {
    const thisApp = this;

    //thisApp.initPages();
    //thisApp.initHome();
    //thisApp.initSearch();
    thisApp.initData();
  },

};

app.init();