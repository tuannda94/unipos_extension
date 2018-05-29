import UnipostRequestHandler from 'frameworkDir/Http/Requests/UnipostRequestHandler.js';
import env from 'codebaseDir/env.js';
import { unipos } from 'codebaseDir/config/unipos.js';

class ProfileController
{
    constructor(data) {
        this.maxRequestResult = unipos.max_request_result;
        this.requestHandler = data.unipostRequestHandler;
        this.receivedCards = [];
        this.sentCards = [];
        this.clappedCards = [];
        this.totalReceivedPoint = 0;
        this.totalSentPoint = 0;
        this.totalClappedPoint = 0;
        this.userProfile = {};
    }

    async profile() {
        this.clearData();
        let allLoaded = false;
        while (!allLoaded) {
            let requests = [];
            if ($.isEmptyObject(this.userProfile)) {
                requests.push(this.requestHandler.profile());
            }

            if (this.firstLoad() || (this.receivedCards.length != 0 && this.receivedCards.length % this.maxRequestResult == 0)) {
                let lastCard = this.receivedCards[this.receivedCards.length - 1];
                let offset = lastCard != undefined ? lastCard.id : '';
                requests.push(this.requestHandler.received(offset));
            }

            if (this.firstLoad() || (this.sentCards.length != 0 && this.sentCards.length % this.maxRequestResult == 0)) {
                let lastCard = this.sentCards[this.sentCards.length - 1];
                let offset = lastCard != undefined ? lastCard.id : '';
                requests.push(this.requestHandler.sent(offset));
            }

            if (this.firstLoad() || (this.clappedCards.length != 0 && this.clappedCards.length % this.maxRequestResult == 0)) {
                let lastCard = this.clappedCards[this.clappedCards.length - 1];
                let offset = lastCard != undefined ? lastCard.id : '';
                requests.push(this.requestHandler.clapped(offset));
            }

            if (requests.length == 0) {
                allLoaded = true;
                break;
            }

            await Promise.all(requests).then(value => {
                $.each(value, (key, value) => {
                    if (value.member != undefined) {
                        this.userProfile = value;
                    } else if (value.length > 0 && value[0].from_member.id == this.userProfile.member.id) {
                        $.merge(this.sentCards, value);
                    } else if (value.length > 0 && value[0].to_member.id == this.userProfile.member.id) {
                        $.merge(this.receivedCards, value);
                    } else if (value.length > 0 && value[0].to_member.id != this.userProfile.member.id && value[0].from_member.id != this.userProfile.member.id) {
                        $.merge(this.clappedCards, value);
                    }
                });
            });
        }

        if (allLoaded) {
            let totalReceivedPoint = 0;
            let totalSentPoint = 0;
            let totalClappedPoint = 0;

            $.each(this.receivedCards, (key, value) => {
                totalReceivedPoint += (value.point + value.praise_count);
            });

            $.each(this.sentCards, (key, value) => {
                totalReceivedPoint += value.praise_count;
                totalSentPoint += value.point;
            });

            totalClappedPoint = this.clappedCards.length;

            this.totalReceivedPoint = totalReceivedPoint;
            this.totalSentPoint = totalSentPoint;
            this.totalClappedPoint = totalClappedPoint;
            this.display();
        }
    }

    firstLoad()
    {
        return this.receivedCards.length == 0 &&
                this.sentCards.length == 0 &&
                this.clappedCards.length == 0 &&
                $.isEmptyObject(this.userProfile)
    }

    display() {
        let groups = this.userProfile.groups[0] || '';
        let template = `
            <div class="wrapper">
                <div class="headers">
                    <div class="header-avatar">
                        <img src=${this.userProfile.member.picture_url} class="involvingMember_picture"/>
                    </div>
                    <div class="header-profile-detail">
                        <div>
                            <div class="default-title">
                                <label>Name</label>
                            </div>
                            <div class="default-label">
                                <label>${this.userProfile.member.display_name}</label>
                            </div>
                        </div>
                        <div>
                            <div class="default-title">
                                <label>E-mail</label>
                            </div>
                            <div class="default-label">
                                <label>${this.userProfile.member.email_address}</label>
                            </div>
                        </div>
                        <div>
                            <div class="default-title">
                                <label>Groups</label>
                            </div>
                            <div class="default-label">
                                <label>${groups.name != undefined ? groups.name : ''}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <table class="box">
                    <tbody>
                        <tr class="partial">
                            <td class="tbox-left">Point Received</td>
                            <td class="tbox-right">${this.totalReceivedPoint}</td>
                        </tr>
                        <tr class="partial">
                            <td class="tbox-left">Point Sent</td>
                            <td class="tbox-right">${this.totalSentPoint}</td>
                        </tr>
                        <tr class="partial">
                            <td class="tbox-left">Post Clapped</td>
                            <td class="tbox-right">${this.totalClappedPoint}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        let itv = setInterval(() => {
            if ($('.wrapper').length) {
                $('.wrapper').remove();
            }
            if ($('#js_body').length) {
                if ($('#js_body').length) {
                    $('#js_body').append(template);
                    clearInterval(itv);
                }
            }
        }, 500);
    }

    clearData() {
        this.receivedCards = [];
        this.sentCards = [];
        this.clappedCards = [];
        this.totalReceivedPoint = 0;
        this.totalSentPoint = 0;
        this.totalClappedPoint = 0;
        this.userProfile = {};
    }
}

export { ProfileController };
