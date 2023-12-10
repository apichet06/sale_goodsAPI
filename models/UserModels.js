const db = require('../config/database');
const bcrypt = require('bcrypt');


class User {

  static async generateUniqueId() {
    try {
      const [result] = await db.query('SELECT MAX(u_id) AS maxId FROM users');
      const currentMaxId = result[0].maxId;

      if (currentMaxId) {
        const idNumber = parseInt(currentMaxId.slice(1)) + 1;
        const nextId = `U${idNumber.toString().padStart(6, '0')}`;
        return nextId;
      } else {
        // If no existing users, start from U100001
        return 'U100001';
      }
    } catch (error) {
      throw error;
    }
  }


  static async create(userData) {

    try {
      const [result] = await db.query('INSERT INTO users SET ?', userData);
      const insertedUserId = result.insertId;

      // Fetch the inserted user data แสง data ที่ insert 
      const [user] = await db.query('SELECT * FROM users WHERE id = ?', insertedUserId);

      return user;

    } catch (error) {
      throw error;
    }
  }


  static async update(userData, u_id) {
    // console.log(u_id);
    try {
      const [result] = await db.query('UPDATE users SET ? Where  u_id = ? ', [userData, u_id])
      if (result) {
        // console.log(result.affectedRows);
        return result.affectedRows;
      } else {
        throw new Error('User update failed.'); // Handle the case when the update was not successful
      }
    } catch (error) {
      throw error;
    }

  }

  static async delete(u_id) {

    try {
      const [result] = await db.query('DELETE FROM users WHERE  u_id = ?', [u_id])
      // console.log(result.affectedRows);
      if (result) {
        return result.affectedRows;
      } else {
        throw new Error('ลบข้อมูลไม่สำเร็จ!'); // Handle the case when the delete
      }

    } catch (error) {
      throw error;
    }

  }

  static async usersAll() {

    try {

      const [result] = await db.query('SELECT * FROM users order by u_id desc');
      if (result) {
        return result;
      } else {
        throw new Error('ไม่พบข้อมูลผู้ใช้!')
      }

    } catch (error) {
      throw error;
    }

  }

  //    show user update  แสดงรายการหลังจาก update หรือ delete ข้อมูล

  static async getUserById(u_id) {

    const [rows] = await db.query('SELECT * FROM users WHERE u_id = ?', [u_id]);
    // console.log(rows);
    return rows[0] || null;
  }

  // login ค้นหา Email และตรวจสอบรหัสผ่าน

  static async findByEmail(email) {

    const [rows] = await db.query('SELECT * FROM users WHERE u_email = ?', [email]);
    // console.log(rows);
    return rows[0] || null;
  }

  static async comparePasswords(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static async findupdateByEmail(email, u_id) {
    const [rows] = await db.query('SELECT * FROM users WHERE u_email = ? AND u_id != ? ', [email, u_id]);
    return rows[0] || null;

  }

}

module.exports = User;
