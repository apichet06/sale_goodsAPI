const express = require('express');
const cors = require('cors');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const usersRoutes = require('./routes/usersRoutes');
const productRoutes = require('./routes/productRoutes');



app.use(cors());
app.use('/api', usersRoutes);
app.use('/api/product', productRoutes);
app.use('/api/uploads', express.static('uploads'));


const port = process.env.PORT || 3308;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});