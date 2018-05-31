class BaseRequest
{
	constructor(data) {
		//
    }

	makeRequest(data, token, unipos = false, method = 'POST', api = "") {
        if (api.length === 0) {
            api = this.apiUrl;
        }

        return new Promise((resolve, reject) => {
            axios({
                "url": api,
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
}

export { BaseRequest };
