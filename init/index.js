require("dotenv").config({ path: require('path').resolve(__dirname, '../.env') });

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); 
const mapToken = process.env.MAP_TOKEN;
console.log(mapToken);
const geocodingClient = mbxGeocoding({ accessToken: mapToken });  


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDb = async () => {
  try {
    await Listing.deleteMany({}); // no callback here
    const sampleListings = initData;
    //inserting owner information
    for (let listing of sampleListings) {
        listing.owner = "689e049725605835fdd7cb32"; // replace with actual user ID

        const geoData = await geocodingClient.forwardGeocode({
            query: listing.location,
            limit: 1
        })
        .send();

    listing.geometry = geoData.body.features[0].geometry;

    const newListing = new Listing(listing);
    await newListing.save();

        
    };

    

    // await Listing.insertMany(sampleListings);
    console.log("Database initialized with sample data");
  } catch (err) {
    console.error("Error initializing DB:", err);
  }
};

initDb();


// const initDB = async () => {
//   await Listing.deleteMany({});
//   await Listing.insertMany(initData.data);
//   console.log("data was initialized");
// };

// initDB();