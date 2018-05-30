class BaseRequest
{
	constructor(data) {
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
}

export { BaseRequest };
