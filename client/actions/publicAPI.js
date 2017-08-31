import axios from 'axios';

let apiUrl=  'https://api.livecoin.net/';

class PublicAPI {
    constructor(request) {
        if(request.pairs) {
            if(!(/\w+\/\w+/i).test(request.pairs)) throw new Error('Invalid pairs input: BTC/USD-type required');
            this.pairs = request.pairs.toUpperCase();
        };

    }

    getPairs() {
        let requestUrl;
        if(this.pairs !== 'all') {
            requestUrl = apiUrl + '/exchange/ticker?currencyPair=' + this.pairs;
        } else {
            requestUrl = apiUrl + '/exchange/ticker';
        }
        return axios.get(requestUrl)
    }

};

export default PublicAPI;