const db = require('../config/database');



class ProductsModels {

    static async generateUniqueId() {
        try {
            const [result] = await db.query('SELECT MAX(pro_id) AS maxId FROM products');
            const currentMaxId = result[0].maxId;

            if (currentMaxId) {
                const idNumber = parseInt(currentMaxId.slice(1)) + 1;
                const nextId = `P${idNumber.toString().padStart(9, '0')}`;
                return nextId;
            } else {
                return 'P100000001';
            }
        } catch (error) {
            throw error;
        }
    }


    static async maxImage(pro_id) {
        try {
            const [result] = await db.query('SELECT MAX(image_file) as image_file FROM product_image WHERE pro_id = ?', pro_id);
            // console.log(result[0].image_file);
            if (result[0].image_file) {
                const imageFilePath = await result[0].image_file;
                const imageNumber = await imageFilePath.match(/(\d+)\.jpg$/)[1];

                return imageNumber;
            } else {
                return 0;
            }


        } catch (error) {
            throw error;
        }
    }


    static async ShowproductsAll() {
        try {
            const sql = `
                SELECT p.*, pt.type_name
                FROM products p
                INNER JOIN product_type pt ON p.type_id = pt.type_id
                ORDER BY p.pro_id DESC
            `;

            const [products] = await db.query(sql);

            const productsWithImages = await Promise.all(products.map(async product => {
                const sql_images = ` SELECT image_file, image_date FROM product_image  WHERE pro_id = ? `;
                const [images] = await db.query(sql_images, [product.pro_id]);

                return {
                    pro_id: product.pro_id,
                    barcode_id: product.barcode_id,
                    pro_name: product.pro_name,
                    pro_cost_price: product.pro_cost_price,
                    pro_price: product.pro_price,
                    pro_qty: product.pro_qty,
                    type_id: product.type_id,
                    pro_status: product.pro_status,
                    pro_date: product.pro_date,
                    type_name: product.type_name,
                    images: images // Array of image_file and image_date objects
                };
            }));

            return productsWithImages;
        } catch (error) {
            console.error('Error in ShowproductsAll:', error);
            throw error;
        }
    }



    static async create(proData) {

        try {
            const [result] = await db.query(`INSERT INTO products  SET ?`, proData);

            const insertproid = result.insertId;



            const [product] = await db.query('SELECT * FROM products WHERE id = ?', insertproid);
            return product;

        } catch (error) {
            throw error;
        }

    }

    static async ProductImages(path_file, pro_id) {

        try {
            const insertPromises = path_file.map(image_file => db.query(`INSERT INTO product_image (image_file, pro_id) VALUES (?, ?) `, [image_file, pro_id]));
            const insertResults = await Promise.all(insertPromises);
            // console.log(insertResults); // Log the insertResults to check the data

            // Check for any errors during insertion
            insertResults.forEach(result => {
                if (result instanceof Error) {
                    throw result;
                }
            });

        } catch (error) {
            console.error('Error inserting product images:', error);
            throw error;
        }
    }


    static async update(proData, pro_id) {

        try {
            const [result] = await db.query('UPDATE products SET ? WHERE pro_id = ?', [proData, pro_id]);
            const affectedRows = result.affectedRows;
            if (affectedRows > 0) {
                const [product] = await db.query('SELECT * FROM products WHERE pro_id = ?', pro_id);

                return product;
            } else {
                return null; // หรือจะส่งข้อความแสดงว่าไม่พบรายการที่จะอัปเดตก็ได้
            }
        } catch (error) {
            console.error('Error in update:', error);
            throw error;
        }

    }



    static async getProductById(pro_id) {

        const [rows] = await db.query('SELECT * FROM products WHERE pro_id = ?', [pro_id]);
        // console.log(rows);
        return rows[0] || null;
    }

    static async getImageById(pro_id) {
        const rows = await db.query('SELECT * FROM product_image WHERE pro_id = ?', [pro_id]);
        return rows[0] || null;
    }

    static async delete(pro_id) {
        try {

            const [result] = await db.query("DELETE FROM products WHERE pro_id = ? ", [pro_id]);
            await db.query("DELETE FROM product_image WHERE pro_id = ? ", [pro_id]);

            if (result) {
                return result.affectedRows;
            } else {
                throw new Error('ลบข้อมูลไม่สำเร็จ!'); // Handle the case when the delete
            }


        } catch (error) {
            throw error;
        }
    }

}


module.exports = ProductsModels;