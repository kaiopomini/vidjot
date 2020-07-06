const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

// Map global promise - get rid of waring
mongoose.Promise = global.Promise;

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', 
  {useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome'
  res.render('index',{
    title: title
  });
});


// About page
app.get('/about', (req, res) =>{
  res.render('about');
});

const port = 5000;


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});