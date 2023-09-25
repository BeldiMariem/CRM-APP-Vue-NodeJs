const cors = require('cors');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Registration of our router auth in index.js
const authRoutes = require('./routes/v1/public/auth.router')
const roleRoutes = require('./routes/v1/public/role.router')
const activityRoutes = require('./routes/v1/public/activity.router')
const contactRoutes = require('./routes/v1/public/contact.router')
const dealRoutes = require('./routes/v1/public/deal.router')

const PORT = process.env.PORT || 3000;

// mongodb+srv://manel:0000@cluster0.ge0wt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
// Importing routes
dotenv.config();

mongoose.connect(
    process.env.DB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log('connected to db!!!!!!!!!!!'));
mongoose.set('useCreateIndex', true);
app.use(cors());

// Middleware
app.use(express.json());

// Route Middlewares --> everything in authRoute will have the prefix /api/user

// Registration of the router appi.router.js under the prefix /api
app.use('/api', require('./routes/v1/apii.router.js'));

// the requests are going to have the prefix : /api/auth
app.use('/api/auth', authRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/user', roleRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/deal', dealRoutes);

app.listen(PORT, () => console.log(`Server up and running at ${PORT}`));