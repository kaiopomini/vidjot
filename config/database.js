if(process.env.NODE_ENV === 'production') {
  module.exports ={mongoURI: 'mongodb+srv://vidjot:vidjot@cluster0.9ez13.mongodb.net/vidjot-prod?retryWrites=true&w=majority'}
} else {
  module.exports ={mongoURI:'mongodb://localhost/vidjot-dev'}
}