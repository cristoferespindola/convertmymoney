const express = require('express')
const app = express()
const path = require('path')
const convert = require('./lib/convert')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/quotation', (req, res) => {
  const { quotation, amount } = req.query;
  const convertionValue = convert.convert(quotation, amount)

  if(quotation && amount) {
    res.render('quotation', {
      convertionValue: convert.toMoney( convertionValue ),
      quotation: convert.toMoney( quotation ),
      amount: convert.toMoney( amount ),
      error: false
    })
  } else {
    res.render('quotation', {
      error: 'Invalid values'
    })
  }
})

app.listen(3000, err => {
  if(err){
    console.log('Server error', err)
  } else {
    console.log('Run port 3000')
  }
})