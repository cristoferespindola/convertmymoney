const axios = require('axios')

const getUrl = data => `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${data}%27&$top=100&$skip=0&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`

const getQuotationApi = (url) =>  axios.get(url)

const extractQuotation  = res =>  res.data.value[0].cotacaoVenda

const getToday = () => {
  const today = new Date()
  const formatedToday = `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}`
  return formatedToday
}

const getQuotation = ({ getToday, getUrl, getQuotationApi, extractQuotation }) => async() => {
  try{
    const today = getToday()
    const url = getUrl(today)
    const res = await getQuotationApi(url)
    const quotation = extractQuotation(res)

    return quotation
  }catch(err) {
    console.log(err)

    return ''
  }
}
module.exports = {
  getQuotationApi,
  getQuotation: getQuotation({ getToday, getUrl, getQuotationApi, extractQuotation }),
  extractQuotation,
  getToday,
  getUrl,
  pure: {
    getQuotation
  }
}