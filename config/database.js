if(process.env.NODE_ENV === 'production') {
  module.exports ={mongoURI: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_KEY}@cluster0.9ez13.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`}
} else {
  module.exports ={mongoURI:'mongodb://localhost/vidjot-dev'}
}