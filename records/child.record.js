const { v4: uuid } = require('uuid');
const { pool } = require('../utils/db');
const { ValidationError } = require('../utils/errors');

class ChildRecord {
  constructor(child) {
    if (!child || child.name.length < 3 || child.name.length > 25) {
      throw new ValidationError('Imię dziecka powinno posiadać od 3 do 25 liter');
    }

    this.id = child.id;
    this.name = child.name;
    this.giftId = child.giftId;
  }

  static async listAll() {
    const [results] = await pool.execute('SELECT * FROM `children` ORDER BY `name`');
    return results.map((child) => new ChildRecord(child));
  }

  static async getOne(id) {
    const [results] = await pool.execute('SELECT * FROM `children` WHERE `id` = :id', {
      id,
    });
    return results.length === 0 ? null : new ChildRecord(results[0]);
  }

  async insert() {
    if (!this.id) {
      this.id = uuid();
    }

    await pool.execute('INSERT INTO `children`(`id`, `name`) VALUES(:id, :name)', {
      id: this.id,
      name: this.name,
    });
  }

  async update() {
    await pool.execute('UPDATE `children` SET `name` = :name, `giftId` = :giftId WHERE `id` = :id', {
      id: this.id,
      name: this.name,
      giftId: this.giftId,
    });
  }
}

module.exports = {
  ChildRecord,
};
