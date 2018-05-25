import env from 'codebaseDir/env.js';

class UnipostRequestHandler
{
    constructor() {
        this.baseUrl = env.BASE_URL;
        this.apiUrl = env.API_URL;
        this.eventBinding();
    }

    eventBinding() {
        //
    }

    makeRequest(data, token, unipos = false, method = 'POST') {
        return new Promise((resolve, reject) => {
            axios({
                "url": this.apiUrl,
                "method": method,
                "headers": {
                    "Content-Type": "application/json",
                    "x-unipos-token": token,
                },
                data: JSON.stringify(data),
            }).then(response => {
                resolve(response.data.result);
            }).catch(error => {
                reject(error)
            });
        });
    }

    async received(offset = "") {
        let params = window.location.href.replace(this.baseUrl, '').split('?');
        let token = localStorage.getItem('authnToken');
        let memberId = params[1].substring(params[1].indexOf("=") + 1);
        let data = this.getRequestData(memberId, "received", offset);

        return await this.makeRequest(data, token, true);
    }

    async sent(offset = "") {
        let params = window.location.href.replace(this.baseUrl, '').split('?');
        let token = localStorage.getItem('authnToken');
        let memberId = params[1].substring(params[1].indexOf("=") + 1);
        let data = this.getRequestData(memberId, "sent", offset);

        return await this.makeRequest(data, token, true);
    }

    async clapped(offset = "") {
        let params = window.location.href.replace(this.baseUrl, '').split('?');
        let token = localStorage.getItem('authnToken');
        let memberId = params[1].substring(params[1].indexOf("=") + 1);
        let data = this.getRequestData(memberId, "clapped", offset);

        return await this.makeRequest(data, token, true);
    }

    async profile() {
        let params = window.location.href.replace(this.baseUrl, '').split('?');
        let token = localStorage.getItem('authnToken');
        let memberId = params[1].substring(params[1].indexOf("=") + 1);
        let data = this.getRequestData(memberId, "profile", "", "GetMemberDetail");

        return await this.makeRequest(data, token, true);
    }

    getRequestData(memberId, type = "received", offset = "", method = "GetCards2") {
        let params = {
            "offset_card_id": offset,
            "count": 20000,
        };
        switch(type) {
            case "received":
                params.to_member_id = memberId;
                break;
            case "sent":
                params.from_member_id = memberId;
                break;
            case "clapped":
                params.praised_member_id = memberId;
                break;
            case "profile":
                params.member_id = memberId;
                delete params.offset_card_id;
                delete params.count;
                break;
            default:
                //
        }

        return {
            "jsonrpc":"2.0",
            "method":"Unipos." + method,
            "params":params,
            "id":"Unipos." + method
        };
    }
}

export default UnipostRequestHandler;