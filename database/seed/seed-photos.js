/* eslint-disable */

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

require('dotenv').config();

// Set the Region
AWS.config.region = 'us-west-1';

const bucketName = 'ultimate-nike';

const items = [];

// I don't think there's a sufficient picture selection, I'll refactor to get pics from Unsplash

// get a random photo from Lorem Pixel (different each time)
const getPhoto = async (url) => {
  try {
    const response = await fetch(url);
    return response.body;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// store data array with urls in file, refactor later
const writeDataToFile = async (newData) => {
  try {
    const filePath = path.join(__dirname, 'seed-data.json');
    const file = await fs.readFileSync(filePath, 'utf8') || '[]';
    const update = JSON.parse(file).concat(newData);
    await fs.writeFileSync(filePath, JSON.stringify(update, null, 2));
    console.log('wrote updated data to file');
  } catch (err) {
    console.log(err);
  }
};

// fil out "other photos" in seed-data file with placeholder urls (random main photos)
const writeOtherUrlsToFile = async () => {
  try {
    const filePath = path.join(__dirname, 'seed-data.json');
    const file = await fs.readFileSync(filePath, 'utf8') || '[]';
    const existingItems = JSON.parse(file);
    existingItems.forEach((item) => {
      for (let i = 1; i <= 8; i += 1) {
        const productId = Math.ceil(Math.random() * 100);
        const styleId = `00${Math.ceil(Math.random() * 3)}`;
        const url = `https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/regular/${productId}-${styleId}.jpg`;
        item.other_photos.push({
          regular_url: url,
        });
      }
    });
    await fs.writeFileSync(filePath, JSON.stringify(existingItems, null, 2));
    console.log('wrote other photo urls to file');
  } catch (err) {
    console.log(err);
  }
};

const uploadPhoto = async (stream, key) => {
  try {
    const upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: bucketName,
        Key: `photos/${key}.jpg`,
        Body: stream,
        ContentType: 'image/png',
        ACL: 'public-read',
      },
    });
    const promise = upload.promise();
    const data = await promise;
    console.log('Successfully uploaded photo:', data);
    return data.Location;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// photo size images:
// regular: 1024 width x 768 height
// thumbnail: 160 width x 160 height

const findAndUploadMainPhotos = async (number) => {
  try {
    for (let i = 1; i <= number; i += 1) {
      for (let j = 1; j <= 3; j += 1) {
        /* eslint-disable no-await-in-loop */
        let fileStream = await getPhoto(75, 75);
        const thumbnailUrl = await uploadPhoto(fileStream, `main/thumbnail/${i}-00${j}`);
        fileStream = await getPhoto(1024, 768);
        const regularUrl = await uploadPhoto(fileStream, `main/regular/${i}-00${j}`);

        const item = {
          product_id: i,
          style_id: `00${j}`,
          main_photo: {
            thumbnail_url: thumbnailUrl,
            regular_url: regularUrl,
          },
          other_photos: [],
        };

        items.push(item);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const seedPhotos = async (url, style) => {
  try {
    // Upload "main" photos
    let fileStream = await findAndUploadMainPhotos(100);
    const thumbnailUrl = await uploadPhoto(fileStream, `main/thumbnail/${1}-00${j}`);

    // Upload "other" photos
    // findAndUploadMultiplePhotos(5, 'other', 1024, 768);

    writeDataToFile(items);
  } catch (err) {
    console.log(err);
  }
};

// seedPhotos();

// writeOtherUrlsToFile();


const seedPhoto = async (url, productId, styleId) => {
  try {
    let fileStream = await getPhoto(url);;
    const result = await uploadPhoto(fileStream, `main/regular/${productId}-00${styleId}`);
  } catch (err) {
    console.log(err);
  }
};

seedPhoto("https://ultimate-nike.s3.us-west-1.amazonaws.com/photos/main/thumbnail/3-001.jpg", 3, 1);