const { Router } = require('express');
const { GiftRecord } = require('../records/gift.record');

const giftRouter = Router();

giftRouter // /gift
  .get('/', async (req, res) => {
    const giftsList = await GiftRecord.listAll();
    res.render('gifts/list', {
      giftsList,
    });
  })

  .post('/', async (req, res) => {
    const data = {
      ...req.body, // kopia przesłanego obiektu
      count: Number(req.body.count), // podmianka count w przesłanym obiekcie
    };

    const newGift = new GiftRecord(data);
    await newGift.insert();

    res.redirect('/gift');
  });
module.exports = {
  giftRouter,
};
