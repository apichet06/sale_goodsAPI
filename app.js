const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' }); // Specify the destination folder for uploaded files

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const usersRoutes = require('./routes/users/usersRoutes');
const productRoutes = require('./routes/products/productRoutes');



app.use(cors());
app.use('/api', usersRoutes);
app.use('/api/product', productRoutes);
app.use('/uploads', express.static('uploads'));


const port = process.env.PORT || 3308;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});