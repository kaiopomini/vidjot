const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const methodOverride = require('method-override');
const { request } = require('https');

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
app.engine('handlebars', exphbs({
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

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

// Idea Index Page
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas:ideas
      });
    });
});

// Add Idea Form
app.get('/ideas/add', (req, res) =>{
  res.render('ideas/add');
});

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) =>{
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea: idea
    })
  });
});

// Process Form
app.post('/ideas', (req, res) =>{
  let errors = [];
  if(!req.body.title) {
    errors.push({text:'Please add a title'});
  }
  if(!req.body.details) {
    errors.push({text:'Please add some details'});
  }

  if(errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    };
    new Idea(newUser)
      .save()
      .then(idea => {
        res.redirect('/ideas');
      });
  }
});

// Edit form process
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;
    
    idea.save()
      .then(idea =>{
        res.redirect('/ideas');
      });
  });
});

// Delete Idea
app.delete('/ideas/:id', (req, res) => {
  Idea.remove({_id: req.params.id})
    .then(() => {
      res.redirect('/ideas');
    });
});

const port = 5000;


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});