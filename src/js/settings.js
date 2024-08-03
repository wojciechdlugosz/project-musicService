export const select = {

  templateOf: {
    pageHome: '#template-homepage-widget',
    singleSong: '#template-singlesong-widget',
  },

  containerOf: {
    home:'.home-wrapper',
    pages: '#pages',
    subscribe: '.subscribe',
    playlist: '.playlist-wrapper',
    song: '.play-song',
  },

  nav: {
    links: '.main-nav a',
  },

};

export const classNames = {
  nav: {
    active: 'active',
  },
  pages: {
    active: 'active',
  },
};

export const templates = {
  pageHome: Handlebars.compile(document.querySelector(select.templateOf.pageHome).innerHTML),
  singleSong: Handlebars.compile(document.querySelector(select.templateOf.singleSong).innerHTML),
};

export const settings = {

  db: {
    songs: 'songs',
  }
};