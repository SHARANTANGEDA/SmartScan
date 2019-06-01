const express = require('express');
const expr=express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const users = require('./routes/api/users');
const questions = require('./routes/api/questions');
const answers = require('./routes/api/answers');
const comments = require('./routes/api/comments')
const publicProfile = require('./routes/api/publicProfile');
const admin = require('./routes/api/admin');
const faculty = require('./routes/api/faculty');
const hod = require('./routes/api/hod');
const department = require('./routes/api/department')
const google = require('./routes/api/google')
const imageUpload=require('./routes/api/imageUpload')

const path = require('path');

//@MongoDB Atlas Connection
const db = require('./config/keys').mongoURI;
mongoose.connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Body parser middleware
expr.use(bodyParser.urlencoded({ extended: false }));
expr.use(bodyParser.json());

//passport middleware and Config
expr.use(passport.initialize());
require('./config/passport')(passport);

expr.use('/api/users',users);
expr.use('/api/questions',questions);
expr.use('/api/answers',answers);
expr.use('/api/comments',comments)
expr.use('/api/publicProfile',publicProfile);
expr.use('/api/admin',admin);
expr.use('/api/faculty',faculty);
expr.use('/api/hod',hod);
expr.use('/api/department',department)
// expr.use('/api/imageUpload',imageUpload)
// expr.use('/uploads',expr.static('uploads'))

//Server static assets if in production
if(process.env.NODE_ENV === 'production') {
  //Set static folder
  console.log({'IN node_env':process.env.NODE_ENV})
  expr.use(expr.static('client/build'));
  expr.get('*',(req,res) => {
    res.sendFile(path.resolve(__dirname,'client','build','index.html'));
  })
}

const port = process.env.PORT || 5000;

expr.listen(port, () => console.log(`server running on port ${port}`));
