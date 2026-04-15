require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, '../public')));


app.use('/api/donors', require('./routes/donors'));
app.use('/api/blood', require('./routes/blood'));
app.use('/api/organs', require('./routes/organs'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api', require('./routes/matching'));
app.use('/api/allocations', require('./routes/allocations'));
app.use('/api/alerts', require('./routes/alerts'));


app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
