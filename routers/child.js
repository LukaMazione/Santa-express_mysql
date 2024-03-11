const { Router } = require('express');
const { ChildRecord } = require('../records/child.record');
const { GiftRecord } = require('../records/gift.record');
const { ValidationError } = require('../utils/errors');

const childRouter = Router();

childRouter // /child
  .get('/', async (req, res) => {
    const childrenList = await ChildRecord.listAll();
    // console.log(childrenList);
    const giftsList = await GiftRecord.listAll();
    res.render('children/list', {
      childrenList,
      giftsList,
    });
  })
  .post('/', async (req, res) => {
    const newChild = new ChildRecord(req.body);
    console.log(typeof req.body.name);
    await newChild.insert();

    res.redirect('/child');
  })
  .patch('/gift/:childId', async (req, res) => {
    const child = await ChildRecord.getOne(req.params.childId);
    if (child === null) {
      throw new ValidationError('Brak takiego dziecka');
    }

    const gift = req.body.giftId === '' ? null : await GiftRecord.getOne(req.body.giftId);

    if (gift) {
      if (gift.count <= await gift.countGivenGifts()) {
        throw new ValidationError('Prezenty zostały już rozdane');
      }
    }

    // child.giftId = gift === null ? null : gift.id;
    child.giftId = gift?.id ?? null;
    // Pozwala bezpiecznie odwołać się do gift.id, nawet jeśli gift jest null lub
    // undefined, bez ryzyka wystąpienia błędu.
    // Jeśli gift jest null lub undefined, zwraca undefined.
    // Operator ?? zmienia undefined na null, ale tylko w przypadku, gdy lewa strona jest
    // null lub undefined. Nie zmieni innych "falsy" wartości (jak 0, '', false).

    await child.update();

    res.redirect('/child');
  });
module.exports = {
  childRouter,
};
