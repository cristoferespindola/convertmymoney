const api = require('./apiBc')
const axios = require('axios')

jest.mock('axios')

const quotation = 3.90
const result = {
  data: {
    value: [
      { cotacaoVenda: quotation }
    ]
  }
}

test('getQuotationApi', () => {
  axios.get.mockResolvedValue(result)

  api.getQuotationApi('url')
  .then( res => {
    expect(res).toEqual(result)
    expect(axios.get.mock.calls[0][0]).toBe('url')
  })
})

test('extractQuotation', () => {
  const extractedQuotation = api.extractQuotation(result)
  expect(extractedQuotation).toBe(quotation)
})

describe('getToday', () => {
  const realDate = Date

  const mockDate = (date) => {
    global.Date = class extends realDate {
      constructor(){
        return new realDate(date)
      }
    }
  }

  afterEach(() => {
    global.Date = realDate
  })

  test('getToday', () => {
    mockDate('2019-01-01T12:00:00z')
    const today = api.getToday()

    expect(today).toBe('1-1-2019')
  })
})

test('getUrl', () => {
  const url = api.getUrl('data')
  expect(url).toBe('https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27data%27&$top=100&$skip=0&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao')
})

test('getQuotation', () => {
  const getToday = jest.fn()
  getToday.mockReturnValue('1-1-2019')

  const getUrl = jest.fn()
  getUrl.mockReturnValue('url')

  const getQuotationApi = jest.fn()
  getQuotationApi.mockResolvedValue(result)

  const extractQuotation = jest.fn()
  extractQuotation.mockReturnValue(quotation)

  api.pure
  .getQuotation({ getToday, getUrl, getQuotationApi, extractQuotation })()
  .then( res =>{
    expect(res).toBe(quotation)
  })
})

test('getQuotationError', () => {
  const getToday = jest.fn()
  getToday.mockReturnValue('1-1-2019')

  const getUrl = jest.fn()
  getUrl.mockReturnValue('url')

  const getQuotationApi = jest.fn()
  getQuotationApi.mockReturnValue(Promise.reject('err'))

  const extractQuotation = jest.fn()
  extractQuotation.mockReturnValue(quotation)

  api.pure
  .getQuotation({ getToday, getUrl, getQuotationApi, extractQuotation })()
  .then( res =>{
    expect(res).toBe('')
  })
})