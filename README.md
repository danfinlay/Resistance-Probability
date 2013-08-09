#Resistance Probability Estimator
##A game logic assistant for the board game [The Resistance](http://en.wikipedia.org/wiki/The_Resistance_(game)).

[Live application running here](http://danfinlay.com/projects/resistance/probability/)

The javascript for this app is bundled using Browserify to allow node-style Requires and modular organization. To build, first make sure browserify is installed, which requires [Node.js](http://nodejs.org/) is installed. 

Once Node.js is installed, run on your command line:
`npm install browserify -g`

Navigate to this repo's directory, and enter:
`browserify ./index.js -o ./site/js/bundle.js`