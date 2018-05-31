import env from 'codebaseDir/env.js';
import { BaseRequest } from 'frameworkDir/Http/Requests/BaseRequest.js';

class UniposPostRequestHandler extends BaseRequest
{
	constructor(data)
	{
        super();
        this.apiUrl = env.API_URL;
        this.sendApiUrl = env.SEND_API;
        this.token = "";
    }

    async memberSuggestion(term, limit = 5) {
        let data = { term, limit };
        let sendingData = this.getRequestData(data, "member-suggestion", "FindSuggestMembers");

        return await this.makeRequest(sendingData, this.token, true);
    }

    async send(data) {
        let sendingData = this.getRequestData(data, "send-card", "SendCard");
        return await this.makeRequest(sendingData, this.token, true, "POST", this.sendApiUrl);
    }

    async profile() {
        let data = this.getRequestData([], "profile", "GetProfile");

        return await this.makeRequest(data, this.token, true);
    }

    getRequestData(data, type, method) {
        let params = {};
        switch(type) {
            case "member-suggestion":
                params.term = data.term;
                params.limit = data.limit;
                break;
            case "send-card":
            	params = data;
                break;
            case "profile":
                params = [];
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

export default UniposPostRequestHandler;
