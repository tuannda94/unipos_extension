let html = require('codebaseDir/views/cw/main.html');
import css from 'sourceDir/css/bootstrap-iso.css';
import { unipos } from 'codebaseDir/config/unipos.js';

class PostController
{
    constructor(data)
    {
        this.requestHandler = data.uniposPostRequestHandler;
        this.fromMember = {};
        this.toMember = {};
        this.eventBinding();
    }

    async eventBinding()
    {
        await chrome.storage.sync.get("cwAuthnToken", (data) => {
            this.token = data.cwAuthnToken;
            this.requestHandler.token = data.cwAuthnToken;
        });

        $("#unipos-icon").on("click", (event) => {
            $("#unipos_member_name").val('');
            $("#unipos_point_sending").val('');
            $("#unipos-message").val('');
            $("#unipos-modal").modal("show");
            this.fromMember = {};
            this.toMember = {};
        });

        $("#btn-send").on("click", (event) => {
            // Send message
            this.send().then(value => {
                if (value && value.id) {
                    // Sending Success
                    console.log("success");
                }
            });
        });

        // $("#unipos-message").on("input", _.debounce((event) => {
        //     this.generateMessage();
        //     // let message = $("#unipos-message").val();
        //     // Disable button send

        //     // Binding textarea with others inputs
        // }, 10));

        $("button[id^='core_value_']").on("click", (event) => {
            let coreNum = event.currentTarget.attributes.id.value.replace("core_value_", "");
            this.generateMessage(" #" + unipos.core_values[coreNum - 1]);
        });

        $(".modal").on("input", "#unipos_member_name, #unipos_point_sending", (event) => {
            this.generateMessage();
        });
    }

    async isValidPost(message)
    {
        if (message.length === 0) {
            return false;
        }

        let data = message.match(/(?<!\w)[@+#][\w.]+/g);
        let hasTo = false,
            hasPoint = false;

        for (let i=0;i<data.length;i++) {
            if (data[i].indexOf("@") === 0) {
                // Sending request check member exists
                let memberSuggestResponse = this.requestHandler.memberSuggestion(data[i].substring(1));

                await memberSuggestResponse.then(value => {
                    hasTo = value.length === 1;
                    if (hasTo) {
                        this.toMember = value[0];
                    }
                });
            } else if (data[i].indexOf("+") === 0) {
                let pointSend = data[i].substring(1);
                let check = pointSend.match(/^(?:[1-9]\d*|\d)$/);
                if (!check || !check.groups) {
                    hasPoint = true;
                }
            }
        }

        if (!hasTo || !hasPoint) {
            return false;
        }

        return true;
    }

    generateMessage(msg = "") {
        let message = "";
        let to = $("#unipos_member_name").val();
        let point = $("#unipos_point_sending").val();
        let coreVal = '';

        if (to.length !== 0) {
            message += ("@" + to + " ");
        }

        if (point.length !== 0) {
            message += ("+" + point + " ");
        }

        let validData = false;
        this.isValidPost(message).then((data) => {
            validData = data;
        });
        // if (validData === false) {
        //     $("#btn-send").attr("disabled", true);
        // } else {
        //     $("#btn-send").removeAttr("disabled");
        // }

        let oldMessage = $("#unipos-message").val();
        let data = oldMessage.match(/(?<!\w)[@+][\w.]+/g);
        $.each(data, (key, value) => {
            oldMessage = oldMessage.replace(value, "");
        });
        message += oldMessage.trim();
        message += msg;

        $("#unipos-message").val(message);
    }

    getMessage()
    {
        let message = $("#unipos-message").val();
        let data = message.match(/(?<!\w)[@+][\w.]+/g);

        for (let i=0;i<data.length;i++) {
            if (data[i].indexOf("@") === 0 || data[i].indexOf("+") === 0) {
                message = message.replace(data[i], "");
            }
        }

        return message.trim();
    }

    getPoint()
    {
        let message = $("#unipos-message").val();
        let data = message.match(/(?<!\w)[+][\w.]+/g);

        if (data.length !== 0) {
            return data[0].substring(1);
        }

        return 0;
    }

    validateMessage()
    {
        let message = this.getMessage();
        let data = message.match(/(?<!\w)[#][\w.]+/g);

        for (let i=0;i<data.length;i++) {
            if (data[i].indexOf("#") === 0) {
                message = message.replace(data[i], "");
            }
        }

        message = message.trim();
        if (message.length === 0) {
            return false;
        }

        return true;
    }

    async send()
    {
        let data = {};
        await this.requestHandler.profile().then((value) => {
            this.fromMember = value;
        });

        data = {
            "from_member_id": this.fromMember.member.id,
            "to_member_id": this.toMember.id,
            "point": this.getPoint(),
            "message": this.getMessage(),
        }
        console.log(data);

        // return this.requestHandler.send(data);
    }
}

export { PostController };
