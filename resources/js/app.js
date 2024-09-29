/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
//import {Workbox} from 'workbox-window';
require('./bootstrap');

window.Vue = require('vue');

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
window.onload = function () {
    const app = new Vue({
        el: '#app',
    });
}

if ('serviceWorker' in navigator) {
  const {Workbox} = await import('workbox-window');

  const wb = new Workbox('/sw.js');

wb.addEventListener('activated', event => {
  // `event.isUpdate` will be true if another version of the service
  // worker was controlling the page when this version was registered.
  if (!event.isUpdate) {
    console.log('Service worker activated for the first time!');

    // If your service worker is configured to precache assets, those
    // assets should all be available now.
  }
});

// Register the service worker after event listeners have been added.
wb.register();
}


