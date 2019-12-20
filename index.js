const express = require('express')
const app = express()
const path = require('path')
const convert = require('./lib/convert')
const apiBc = require('./lib/apiBc')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', async(req, res) => {
  const quotation = await apiBc.getQuotation('04-12-2019')

  res.render('home', {
    quotation
  })
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