const { v4: uuid } = require('uuid');
const { pool } = require('../utils/db');
const { ValidationError } = require('../utils/errors');

class GiftRecord {
  constructor(obj) {
    if (!obj.name || obj.name.length < 3 || obj.name.length > 55) {
      throw new ValidationError('Nazwa prezentu powinna mieć długość pomiędzy 3 a 55 znaki');
    }

    if (!obj.count || obj.count < 1 || obj.count > 99999) {
      throw new ValidationError('Ilość prezentów powinna być w przedziale 1 do 99999');
    }
    this.id = obj.id;
    this.name = obj.name;
    this.count = obj.count;
  }

  async insert() {
    if (!this.id) {
      this.id = uuid();
    }

    await pool.execute('INSERT INTO `gifts` VALUES (:id, :name, :count)', {
      id: this.id,
      name: this.name,
      count: this.count,
    });

    return this.id;
  }

  static async listAll() {
    const [results] = await pool.execute('SELECT * FROM `gifts`');
    return results;
  }

  static async getOne(id) {
    const [results] = await pool.execute('SELECT * FROM `gifts` WHERE `id` = :id', {
      id,
    });
    return results.length === 0 ? null : new GiftRecord(results[0]);
  }

  async countGivenGifts() {
    // results[0][0].count
    const [[{ count }]] = await pool.execute('SELECT COUNT(*) AS `count` FROM `children` WHERE `giftId` = :id', {
      id: this.id,
    });
    return count;
  }
}

module.exports = {
  GiftRecord,
};
