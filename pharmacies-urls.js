const lineReader = require('line-reader'),
    Promise = require('bluebird');
const arrayToCsv = require('arrays-to-csv');

const {csvAppend} = require("csv-append");
const { append, end } = csvAppend('pharmacies1.csv', true);

const axios = require('axios');

const eachLine = Promise.promisify(lineReader.eachLine);
eachLine('urls.csv', async function(line) {
    let data = line.split(',');
    console.log("Starting with --- "+data[0]);
    const res = await axios.get(data[0]).catch(err => { return {status: 500}});
    if(res.data !== "" && res.status === 200 && res.data["pageProps"] !== undefined){
        res.data["pageProps"]["healthcareServices"]["services"].map(el => {
            append({
                name: el.location.name,
                address: el.location["physicalLocation"]["addressLine3"],
                phone: el["contacts"][0] !== undefined ? el["contacts"][0].value : null,
                email: el["contacts"][1] !== undefined ? el["contacts"][1].value : null,
                url: `https://www.healthdirect.gov.au/australian-health-services/healthcare-service/${data[1]}/${el.location.name}/pharmacy/${el.location.id}`
            })
        });
    }
    console.log("Finished --- "+line);
}).then(function() {
    console.log('done');
}).catch();

