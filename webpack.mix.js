const mix = require('laravel-mix');
require('laravel-mix-workbox');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
   .extract(['vue', 'lodash', 'popper.js', 'jquery', 'bootstrap', 'axios', 'socket.io-client'])
   .sass('resources/sass/app.scss', 'public/css')
   .version()

   // tinymce
   .scripts([
      'node_modules/tinymce/jquery.tinymce.js',
      'node_modules/tinymce/jquery.tinymce.min.js',
      'node_modules/tinymce/tinymce.js',
      'node_modules/tinymce/tinymce.min.js'
   ], 'public/node_modules/tinymce/tinymce.js')
   // .copyDirectory('node_modules/tinymce/plugins', 'public/node_modules/tinymce/plugins')
   .copyDirectory('node_modules/tinymce/skins', 'public/node_modules/tinymce/skins')
   .copyDirectory('node_modules/tinymce/themes', 'public/node_modules/tinymce/themes').
   generateSW({
	directoryIndex: 'public/',
    exclude: [
          /\.(?:png|jpg|jpeg|svg)$/,
          // Ignore the mix.js that's being generated 
          'mix.js'
      ],
	navigateFallback:"/offline.html",
	runtimeCaching: [
    {
        urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

              // Apply a cache-first strategy.
        handler: 'CacheFirst',
        options: {
                  // Use a custom cache name.
                  cacheName: 'images',
        }
    },
    {
    urlPattern:"https://cdn.*.com/**" /*({request, url}) =>{url.includes("cdn")==true}*/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'cdns',
      expiration: {
        maxEntries: 20,
	maxAgeSeconds: 2 * 24 * 60 * 60,
      },
      cacheableResponse:{
	statuses: [0, 200]
      }
    },
  },{
    urlPattern:"/**/"/* ({request, url}) => {request.method=="POST"}*/,
    handler:"NetworkOnly",
    method:"POST",
    options:{
      cacheName:"apCachePost",
      cacheableResponse:{
	statuses: [0, 200]
      },
      backgroundSync:{
       name:"Apisync",
       options:{
    	maxRetentionTime:24*60*2
       }
      }
    }
  },{
    urlPattern:"https://fonts.*.com/**"/* ({request, url}) =>{url.includes("fonts")==true}*/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'cdns',
      expiration: {
        maxEntries: 20,
	maxAgeSeconds: 2 * 24 * 60 * 60,
      },
      cacheableResponse:{
	statuses: [0, 200]
      }
    }
  }],
   swDest: 'sw.js',  
    skipWaiting: true,
    clientsClaim: true,
   });
