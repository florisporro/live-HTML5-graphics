# HTML5 Graphics dynamic template for broadcast

This graphics renderer template utilizes a combination of javascript, HTML5 and a NodeJS server to offer the foundations for a dynamic, interactive graphics system for small broadcasts.

The use case is an events broadcaster that might have several events per week, that needs simple graphics support such as lower thirds or the ability to display messages like "we'll be right back". The goal is to have one template with an admin panel that will fit a lot of simple use cases.

## What do you mean widgets?

Each individual graphic use that would normally warrant a separate template, we're calling widgets. Currently we have widgets for:

 * Broadcast messages such as "We'll be right back!"
 * A clock showing the current time
 * A countdown clock showing a countdown in hours, minutes and seconds to a pre-defined moment
 * A logo in the top right corner loading an image from \live-content
 * A beta twitter widget that takes a tweet ID and shows the corresponding tweet

## What's planned for the future?

 * More widgets such as a dynamic, easier Twitter ticker, test patterns, location indicator with the Google Maps API, day schedule system to display during breaks and let viewers know what's coming, Instagram and Snapchat support
 * Further styling options, actual font choices
 * Preview mode, the ability to have one client designated as a preview which you can 'take' to program
 * Easier installation

## What does it look like?

Admin panel:

![](https://github.com/florisporro/live-HTML5-graphics/blob/master/adminpanel.png)

A variety of styling settings:

![](https://github.com/florisporro/live-HTML5-graphics/blob/master/general.png)

Rendering in CasparCG:

![](https://github.com/florisporro/live-HTML5-graphics/blob/master/rendering.jpg)

## How is it built?

CasparCG renders graphics_render.html. This file references graphics.js, which makes a connection to a NodeJS server using Socket.io. The server also serves an admin panel, so when the admin panel receives a change from the operator it sends the new state to the renderer using a Socket.io message, which means it updates immediately. All settings are saved constantly in data.json for persistence.

In summary:

 * **graphics_render.html** - the HTML file loaded by CasparCG. Backed by a CSS file for styling.
 * **graphics.js** - Connects to NodeJS server and dynamically changes graphics_render.html depending on settings. Also applies a lot of dynamic styling.
 * **app.js** - NodeJS server that takes input from an admin panel and stores the values entered by the operator in a JSON file for persistance, so they remain even if the server is restarted.

## How do I use it?

You'll need to use the command line. Find somewhere to store this application and run:

```
git clone https://github.com/florisporro/live-HTML5-graphics.git
```

(you might need to install Git first, which you can do by installing the Github client)

Now you need to install Node JS so we can run the server. Once done, using a terminal, navigate to the directory where you cloned this repository and run:


```
npm install
```

That should install all the dependencies.

You need to change your CasparCG server templates folder in the CasparCG Server configuration file so you can display the graphics_render.html file. Mine looks like this:

```
<template-path>C:\STREAMING\CasparCG\live-HTML5-graphics</template-path>
```

Rename data_example.json to data.json.

Now start the Node server with:

```
node server.js
```

Navigate to the admin panel in your web browser:

```
http://localhost:3000/admin
```

Start the template in CasparCG. That should do it!

I know this is quite elaborate right now, we'll be improving that in the future!

## Troubleshooting

You may run into an error when starting the server. Something to try:

```
npm install express && npm install
```

## How do I use the logo widget?

Any image you put in the folder live-content can be referenced to be shown on the graphics renderer.

## How do I use the Twitter widget?

Go to https://apps.twitter.com/ and create an application.

Then create a new file in the root of the project folder called .env, and add this info:

```
TWITTER_CONSUMER_KEY = 
TWITTER_CONSUMER_SECRET = 
TWITTER_ACCESS_TOKEN_KEY = 
TWITTER_ACCESS_TOKEN_SECRET = 
```

And fill in the corresponding information.

To use the widget, copy-paste a tweet ID from your timeline (you can find this by getting a direct URL to the tweet, the ID is a long number in the URL).