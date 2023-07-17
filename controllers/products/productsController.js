const productModels = require('../../models/products/productModels');

require('../../message/message');


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


}

module.exports = ProductController;
