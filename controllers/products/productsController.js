const productModels = require('../../models/products/productModels');
const FileHelper = require('../../models/fileuploads/fileModels');
const moment = require('moment');
require('../../message/message');
const fs = require('fs');
const { log } = require('console');


class ProductController {

    static async getProductAll(req, res) {

        try {
            const productmodels = await productModels.ShowproductsAll();

            if (productmodels) {
                res.status(200).json({ data: productmodels });
            }
        } catch (error) {
            res.status(500).send({ error: error500 });
        }
    }



    static async createProduct(req, res) {

        try {
            const { barcode_id, pro_name, pro_cost_price, pro_price, pro_qty, type_id, pro_status } = req.body;


            const pro_id = await productModels.generateUniqueId();
            const currentDate = new Date();
            const pro_date = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');


            const files = req.files;
            const folder = 'products';
            // บันทีกรูปภาพ หลายๆรูปภาพ
            const filePromises = files ? files.map((file, index) => FileHelper.uploadFile(file, `${pro_id}-${index + 1}`, folder)) : '';

            // ดึงรายชื่อแบบเต็มรูปแบบ เพื่อนำไป insert product image
            const fileUploadResults = await Promise.all(filePromises);
            const image_filename = fileUploadResults.map(result => result);

            // บันทึกข้อมูลรูปภาพ array 
            await productModels.ProductImages(image_filename, pro_id);

            const proData = { pro_id, barcode_id, pro_name, pro_cost_price, pro_price, pro_qty, type_id, pro_status, pro_date };

            const product = await productModels.create(proData)


            res.status(200).json({ status: 'ok', data: product });

        } catch (error) {
            res.status(500).send({ error: error500 });
        }

    }

    static async updatePorduct(req, res) {
        try {
            const { pro_id } = req.params;

            const { barcode_id, pro_name, pro_cost_price, pro_price, pro_qty, type_id, pro_status } = req.body;

            const currentDate = new Date();
            const pro_date = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');

            const proData = { pro_id, barcode_id, pro_name, pro_cost_price, pro_price, pro_qty, type_id, pro_status, pro_date };
            const product = await productModels.update(proData, pro_id)


            const max_image = parseInt(await productModels.maxImage(pro_id));

            const files = req.files;
            const folder = 'products';
            // บันทีกรูปภาพ หลายๆรูปภาพ
            const filePromises = files ? files.map((file, index) => FileHelper.uploadFile(file, `${pro_id}-${max_image + index + 1}`, folder)) : '';

            // ดึงรายชื่อแบบเต็มรูปแบบ เพื่อนำไป insert product image
            const fileUploadResults = await Promise.all(filePromises);
            const image_filename = fileUploadResults.map(result => result);

            // บันทึกข้อมูลรูปภาพ array
            await productModels.ProductImages(image_filename, pro_id);

            res.status(200).json({ status: 'ok', data: product });

        } catch (error) {
            console.log(error);
            res.status(500).send({ error: error500 });
        }

    }

    static async deleteProduct(req, res) {

        try {
            const { pro_id } = req.params;

            const product = await productModels.getProductById(pro_id);
            const imageArray = await productModels.getImageById(pro_id);
            if (product) {
                let dataunlink;
                for (const imageObj of imageArray) {
                    fs.unlink(imageObj.image_file, (err) => (err ? dataunlink = (dataunlinkError, err) : dataunlink = (dataunlinksuccess)));
                }

                await productModels.delete(pro_id);
                res.status(200).json({ status: 'ok', message: deletesuccess, data: product, image: dataunlink })
            } else {
                res.status(404).json({ status: 'error', message: ID_not_found })
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: error500 });
        }



    }
}

module.exports = ProductController;
