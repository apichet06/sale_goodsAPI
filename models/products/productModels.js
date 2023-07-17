const db = require('../../config/database');



class ProductsModels {

    static async ShowproductsAll(proData) {

        try {

            const sql = `SELECT * FROM Products a 
                        INNER JOIN product_type b 
                        ON a.type_id = b.type_id
                        order by a.pro_id desc  `;
            const rows = await db.query(sql);

            return rows[0]

        } catch (error) {
            throw error;
        }


    }


}


module.exports = ProductsModels;