const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mvps', { useNewUrlParser: true, useUnifiedTopology: true });

let mvpSchema = mongoose.Schema({
  item: String,
  date: String,
  price: Number
})

let Mvps = mongoose.model('mvp', mvpSchema)
let save = (expenses) => {
  expenses.forEach( expense => {
    const entry = {'item': expense['item']}
    Mvps.findOneAndUpdate(entry,
    { 'item': expense.item,
      'date': expense.date,
      'price': expense.price}
    , {new: true, upsert:true}, (err, result) => {
      if(err) {
        console.log(err);
      }
    })
  })
}

module.exports.Mvps = Mvps;
module.exports.save = save;



//brew services stop mongodb-community@4.4