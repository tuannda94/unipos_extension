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
            this.clearData();
            $("#unipos-modal").modal("show");
        });

        // $("#btn-send").on("click", (event) => {
        //     // Send message
        //     this.send().then(value => {
        //         if (value && value.id) {
        //             // Sending Success
        //             console.log("success");
        //         }
        //     });
        // });

        $("#unipos-message").on("input", event => {
            let inputKey = event.originalEvent.data;
            let message = event.currentTarget.value;
            let currentPos = event.currentTarget.selectionStart - 1;
            let lastestSpace = message.substring(0, currentPos).lastIndexOf(" ");
            let wordFirstCharPos = lastestSpace + 1;
            let currentEvent = message.charAt(wordFirstCharPos);
            let currentWord = message.substring(wordFirstCharPos + 1, currentPos + 1);

            this.triggerSuggestion(currentEvent, currentWord);
        });

        $("button[id^='core_value_']").on("click", (event) => {
            let coreNum = event.currentTarget.attributes.id.value.replace("core_value_", "");
            let message = $("#unipos-message").val();
            $("#unipos-message").val(message + " #" + unipos.core_values[coreNum - 1]);
        });

        // $(".action button").on("click", (event) => {
        //     let btnClicked = event.currentTarget.attributes.value.value;
        //     let message = $("#unipos-message").val();
        //     message = message + " " + btnClicked;
        //     $("#unipos-message").val(message.trim());
        //     this.triggerSuggestion(btnClicked);
        // });

        $(document).bind('click', function(event) {
            let suggestContainer = $(".suggest");
            console.log(suggestContainer.is(event.target) || suggestContainer.has(event.target).length);
        });
    }

    async clearData()
    {
        await $("#unipos_member_name").val('');
        $("#unipos_point_sending").val('');
        $("#unipos-message").val('');
        this.fromMember = {};
        this.toMember = {};
    }

    // async send()
    // {
    //     let data = {};
    //     await this.requestHandler.profile().then((value) => {
    //         this.fromMember = value;
    //     });

    //     data = {
    //         "from_member_id": this.fromMember.member.id,
    //         "to_member_id": this.toMember.id,
    //         "point": this.getPoint(),
    //         "message": this.getMessage(),
    //     }
    //     console.log(data);

    //     // return this.requestHandler.send(data);
    // }

    async triggerSuggestion(event, word = "")
    {
        let data = {
            'success': false,
            'valid_member': false,
            'result': [],
        };

        switch (event) {
            case '@':
                if (!word) {
                    word = "";
                }
                let memberUname = word.match(/^[a-z.@]+$/);
                if (memberUname || word === "") {
                    if (memberUname === null) {
                        memberUname = "";
                    }

                    await this.suggestMembers(memberUname[0]).then(value => {
                        if (value) {
                            data.success = true;
                            data.result = value;
                            if (value.length === 1) {
                                data.valid_member = true;
                            }

                            this.displayMembersSuggestion(value, memberUname[0]);
                        }
                    });
                } else {
                    this.displayMembersSuggestion([]);
                }
                break;
            case '+':
                break;
            case '#':
                break;
            case ' ':
                $(".suggest").addClass("hidden");
                break;
            default:
                this.displayMembersSuggestion([]);
                break;
        }

        return data;
    }

    async suggestMembers(term = "")
    {
        return this.requestHandler.memberSuggestion(term);
    }

    displayMembersSuggestion(value = [], uname = "")
    {
        if (value.length === 0) {
            $(".suggest").addClass("hidden");
            return [];
        }

        if (value.length > 1 || value[0].uname !== uname) {
            this.resetDefault();
            let suggestionHtml = "";
            $.each(value, (key, value) => {
                suggestionHtml += `<div class="suggest-item">${value.uname} ${value.display_name}</div>`;
            });
            $("#member-suggestion").empty();
            $("#member-suggestion").html(suggestionHtml);
            $(".suggest").removeClass("hidden");

            $(".suggest").on("click", ".suggest-item", (event) => {
                console.log("aaaa");
            });
        } else {
            // Set ToMember
            $(".suggest").addClass("hidden");
            $("#member-picture-url").attr("src", value[0].picture_url);
            $("#member-display-name").text(value[0].display_name);
            $(".action button[value='@']").removeClass("not-done");
            $(".action button[value='@']").addClass("done");
        }
    }

    getToMember()
    {
        let toMember = $("#unipos-message").val().match(/(?<!\w)[@][\w.]+/g);
        if (toMember) {
            return toMember[0].substring(1);
        }

        return "";
    }

    getSendPoint()
    {
        let message = $("#unipos-message").val();
        if (message) {
            return message.match(/(?<!\w)[+][\w]+/g).substring(1);
        }

        return 0;
    }

    resetDefault()
    {
        $("#member-picture-url").attr("src", unipos.default_picture_url);
        $("#member-display-name").text(unipos.default_display_name);
        $(".action button[value='@']").removeClass("done");
        $(".action button[value='@']").addClass("not-done");
    }
}

export { PostController };
