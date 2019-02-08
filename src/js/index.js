import '../css/style.scss'; // main CSS
import responsiveNav from 'responsive-nav';
import 'responsive-nav/client/dist/styles/responsive-nav.css';
// SVG icons
import '../svg/beaker.svg';
import '../svg/fish.svg';
import '../svg/user.svg';

const onLoad = (fn) => {
  if (document.readyState === 'loading') {
    // Loading hasn't finished yet
    document.addEventListener('DOMContentLoaded', fn);

    return;
  }
  // `DOMContentLoaded` has already fired
  fn();
};

// load optional contents
const loadPartial = () => {
  const link = document.querySelector('[data-ajax-replace]');
  if (!link) {
    return false;
  }
  const url = link.getAttribute('data-ajax-replace');

  const options = {
    headers: new Headers(),
  };

  options.headers.append('Content-Type', 'application/json');
  options.headers.append('X-Requested-With', 'XMLHttpRequest');

  return fetch(url, options)
    .then((response) => {
      if (response.ok) {
        return response;
      }

      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    })
    .then((response) => {
      response.text().then((text) => {
        link.insertAdjacentHTML('afterend', text);
        link.parentNode.removeChild(link);
      });
    });
};

// load optional contents on page load
const mq = window.matchMedia('(min-width: 35em)');
if (mq.matches) {
  onLoad(loadPartial);
}

// init nav on page load
onLoad(() => responsiveNav('nav'));
