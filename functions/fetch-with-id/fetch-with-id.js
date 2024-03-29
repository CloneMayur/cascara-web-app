const Airtable = require('airtable');

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = function(event, context, callback) {
  const {API_URL, API_CLIENT_ID, API_KEY } = process.env;

  // Format and send response to GET call
  const send = body => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(body)
    });
  }

  Airtable.configure({
    endpointUrl: API_URL,
    apiKey: API_KEY
  });
  var base = Airtable.base(API_CLIENT_ID);

  const id = event.path.match(/([^\/]*)\/*$/)[0]

  base('Coffeehouses').find(id, 
    function(err, record) {
      if (err) {
        console.log(err);
        send(err);
        return;
      }
      
      const checkDefault = (data) => {
        return record.get(data) ? (
          record.get(data)
        ) : (
          "No data available"
        )
      }

      const house = {
        img: record.get('photo')[0].thumbnails.full.url,
        name: record.get('name'),
        address: record.get('streetAddress'),
        neighborhood : checkDefault('neighborhood'),
        city: record.get('city'),
        state: record.get('state'),
        coffeeScore: checkDefault('coffeeScore'),
        wifiScore: checkDefault('wifiScore'),
        outletDesc: checkDefault('outletDesc'),
        seatingDesc: checkDefault('seatingDesc'),
        amenities: record.get('amenities'),
        goodFor: record.get('goodFor'),
      }
      send(house);
    })
}