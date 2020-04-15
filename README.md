This project was started 4 years ago as a way to add simple graphics to livestreams. It has since grown into the full-on commercial project [Holographics](https://hologfx.io).

# HTML5 Graphics dynamic template for broadcast

This graphics renderer template utilizes a combination of javascript, HTML5 and a NodeJS server to offer the foundations for a dynamic, interactive graphics system for small broadcasts.

The use case is an events broadcaster that might have several events per week, that needs simple graphics support such as lower thirds or the ability to display messages like "we'll be right back". The goal is to have one template with an admin panel that will fit a lot of simple use cases.

## What's included?
 
 * A dynamically generated quick access 'admin panel' to change values and cue animations on the template in real time
 * A clock widget
 * A lower third widget
 * Widgets will fade their opacity if visibility is turned off

It's pretty bare bones but it works and CasparCG renders it.

## What's planned for the future?

 * More widgets such as a news / Twitter ticker, broadcaster messages ('stand-by for broadcast'), test patterns, location indicator with the Google Maps API, day schedule system to display during breaks, client / sponsor logo display, 
 * Styling options
 * Better admin side, mobile support, etc

## What does it look like?

Current admin panel:

![](https://github.com/florisporro/live-HTML5-graphics/blob/master/adminpanel.jpg)

Current rendering:

![](https://github.com/florisporro/live-HTML5-graphics/blob/master/rendering.jpg)

## How is it built?

The system is comprised of three components.

 * **graphics_render.html** - the HTML file loaded by CasparCG. Backed by a CSS file for styling.
 * **graphics.js** - the script that governs the front-end. Does a poll to the server every second and processes the response data.
 * **server.js** - NodeJS server that takes input from an admin panel and stores the values entered by the operator in a JSON file for persistance, so they remain even if the server is rebooted. This data file (data.json) is also the file polled by graphics.js.

## How do I use it?

First install Node JS if you don't have it already. Open a command terminal and navigate to the folder where you cloned this repository. Run:

```
npm install
```

That should install all the dependencies.

Change your CasparCG server templates folder in the configuration file so you can display the graphics_render.html file. Mine looks like this:

```
<template-path>C:\STREAMING\CasparCG\live-HTML5-graphics</template-path>
```

Start the Node server with:

```
node server.js
```

Navigate to the admin panel in your web browser:

```
http://localhost:27015/admin
```

Start the template in CasparCG. That should do it!
