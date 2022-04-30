const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const app = express()
const port = 3001

// db
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/test');
}

const Schema = mongoose.Schema;

const list = new Schema({
  item: String,
}, {
  collection: 'list'
});

const ListModel = mongoose.model('list', list);

// const TaskSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   completed: {
//     type: Boolean,
//     default: false,
//   },
// });
// module.exports = mongoose.model('Task', TaskSchema);

//CRUD
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => 
  {
    ListModel.find({})
    .then(data => {
      res.json(data);
    })
    .catch(err => {
        console.log(err);
    })
  }
)

app.post('/', (req, res) => 
  {
    ListModel.create({
      item: req.body.item
    })
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      console.log(err)
    })
  }
)

app.delete('/:id', (req, res) => 
  {
    const id = req.params.id;
    ListModel.deleteOne({
      _id: id
    })
    .then(() => {
      res.status(200).json("ok");
    })
    .catch(err => {
      console.log(err)
    })
  }
)

app.put('/:id', (req, res) => 
  {
    const id = req.params.id;
    ListModel.updateOne({
      _id: id
    }, {
      item: req.body.item
    })
    .then(data => {
      res.json({item: req.body.item});
    })
    .catch(err => {
      console.log(err)
    })
  }
)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
