var casper = require('casper').create();

casper.start('http://localhost:4000/', function () {
  this.echo(this.evaluate(function () {
    return document.links.length // returns a NodeList containing HTMLAnchorElement(s)
  }));
});

casper.run();