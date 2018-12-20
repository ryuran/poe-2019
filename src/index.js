require('./css/style.scss')
console.log('Hello World')

const responsiveNav = require('responsive-nav')
require('responsive-nav/client/dist/styles/responsive-nav.css')

responsiveNav('nav')

const mq = window.matchMedia('(min-width: 35em)')

const loadPartial = () => {
  const link = document.querySelector('[data-ajax-replace]')
  if (!link) {
    return
  }
  const url = link.getAttribute('data-ajax-replace')

  const options = {
    headers: new Headers()
  }

  options.headers.append('Content-Type', 'application/json')
  options.headers.append('X-Requested-With', 'XMLHttpRequest')

  return fetch(url, options)
    .then((response) => {
      if (response.ok) {
        return response
      }

      const error = new Error(response.statusText)
      error.response = response
      throw error
    })
    .then((response) => {
      response.text().then((text) => {
        link.insertAdjacentHTML('afterend', text)
        link.parentNode.removeChild(link)
      })
    })
}

if (mq.matches) {
  loadPartial()
}
