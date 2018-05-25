import UnipostRequestHandler from 'frameworkDir/Http/Requests/UnipostRequestHandler.js';
import env from 'codebaseDir/env.js';

class ProfileController
{
	constructor(data) {
		this.requestHandler = data.unipostRequestHandler;
		this.totalReceivedPoint = 0;
		this.totalSentPoint = 0;
		this.totalClappedPoint = 0;
		this.userProfile = {};
	}

	async profile() {
		await Promise.all([
				this.requestHandler.received(),
				this.requestHandler.sent(),
				this.requestHandler.clapped(),
				this.requestHandler.profile()
			])
			.then(value => {
				console.log(value);
				let totalReceivedPoint = 0;
				let totalSentPoint = 0;
				let totalClappedPoint = 0;
				let receivedCards = value[0];
				let sentCards = value[1];
				let clappedCards = value[2];
				this.userProfile = value[3];

				$.each(receivedCards, (key, value) => {
					totalReceivedPoint += (value.point + value.praise_count);
				});

				$.each(sentCards, (key, value) => {
					totalReceivedPoint += value.praise_count;
					totalSentPoint += value.point;
				});

				$.each(clappedCards, (key, value) => {
					totalClappedPoint += value.praise_count * 2;
					totalSentPoint += value.praise_count * 2;
				});

				this.totalReceivedPoint = totalReceivedPoint;
				this.totalSentPoint = totalSentPoint;
				this.totalClappedPoint = totalClappedPoint;
				this.display();
			});

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
								<label>${groups.name}</label>
							</div>
						</div>
					</div>
				</div>
			  	<table class="box">
				    <tbody>
				      	<tr class="partial">
					        <td class="tbox-left">Received</td>
					        <td class="tbox-right">${this.totalReceivedPoint}</td>
				      	</tr>
				      	<tr class="partial">
					        <td class="tbox-left">Sent</td>
					        <td class="tbox-right">${this.totalSentPoint}</td>
				      	</tr>
				      	<tr class="partial">
					        <td class="tbox-left">Clapped</td>
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
}

export { ProfileController };
