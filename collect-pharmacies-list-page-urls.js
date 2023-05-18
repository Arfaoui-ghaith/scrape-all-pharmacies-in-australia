const lineReader = require('line-reader'),
    Promise = require('bluebird');
const arrayToCsv = require('arrays-to-csv');

const {csvAppend} = require("csv-append");
const { append, end } = csvAppend('urls.csv', true);

const eachLine = Promise.promisify(lineReader.eachLine);
eachLine('au_postcodes.csv', function(line) {
    let location = line.split(',');
    let target = `${location[1].trim()} ${location[0].trim()} ${location[3].trim()}`.split(" ").join("-");
    let url = `https://www.healthdirect.gov.au/australian-health-services/_next/data/y9CjL2yEYm4i_6pGCmrqJ/en/search/${target.toLowerCase()}/pharmacy/310080006.json?isMapView=false&params=${target.toLowerCase()}&params=pharmacy&params=310080006`
    append({url,target});
    console.log(url);
}).then(function() {
    console.log('done');
}).catch(function(err) {
    console.error(err);
});


