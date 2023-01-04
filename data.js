const axios = require('axios');
require('dotenv/config')

function getData(path) {
    return new Promise(function (resolve, reject) {
        axios.get(path)
        .then(response => {
            resolve(response.data);
        }) .catch(error => {
            console.error(error);
            reject(error);
        });
    });
}

exports.getApiData = async() => {
    var data = await getData(process.env.API);

    let priceString = data.data.attributes.price_in_usd
    let dailyTxnCount = data.data.attributes.swap_count_24h
    let priceVolatility = data.data.attributes.price_percent_change
    let volumeDaily = data.data.attributes.from_volume_in_usd
    let liquidity = data.data.attributes.reserve_in_usd
    let valuation = data.data.attributes.fully_diluted_valuation
    let priceCROT = parseFloat(priceString, 10).toFixed(4)

    return { priceCROT, priceVolatility, dailyTxnCount, volumeDaily, liquidity, valuation }

}

exports.abbreviateNumber = (number) => {
    if (number >= 1000000) {
        return (number / 1000000).toFixed(2) + 'M';
    }; if (number >= 1000) {
      return (number / 1000).toFixed(2) + 'K';
    }; return number;
}

exports.checkDirections = async(number) => {
    let sign = number[0]
    console.log("First Character =>> " + sign)
    if (sign == "+") return "📈"
    else return "📉"
}