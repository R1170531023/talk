(() => {
	
// 全局DOM
const doms = {
	nickName: document.querySelector('.nick-name'),
	accountName: document.querySelector('.account-name'),
	loginTime: document.querySelector('.login-time'),
	close: document.querySelector('.close'),
	contentBody: document.querySelector('.content-body'),
	inputContainer: document.querySelector('.input-container'),
	sendBtn: document.querySelector('.send-btn'),
	clear: document.querySelector('.clear'),
	arrowContainer: document.querySelector('.arrow-container'),
	selectContainer: document.querySelector('.select-container'),
	selectItem: document.querySelectorAll('.select-item'),
};
let page = 0;
let size = 10;
let disolayEnd = 'none';
let selectEnd = 'enter';

// 入口函数
function init() {
	initialize();
	initialist();
	eventFN();
}

// 页面数据初始化
async function initialize() {
	const data = await fetch(`https://study.duyiedu.com/api/user/profile`, {
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'authorization': 'Bearer '+sessionStorage.getItem('token')
		}
	});
	const datas = await data.json();
	const arr = datas.data.lastLoginTime.split('T')
		.filter((item, index) => index === 0)
		.join('').replaceAll('-', '月').replace('月', '年') + '日';
	doms.nickName.innerText = datas.data.loginId;
	doms.accountName.innerText = datas.data.nickname;
	doms.loginTime.innerText = arr;
}

// 聊天数据加载
async function initialist() {
	const data = await fetch('https://study.duyiedu.com/api/chat/history?page='+ page +'&size='+ size+'', {
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'authorization': 'Bearer '+sessionStorage.getItem('token')
		},
	});
	const datas = await data.json();
	if((page + 1) * size >= datas.chatTotal) return;
	dataRendering(datas.data);
}
function dataRendering(data) {
	const wordData = data.reverse();
	if(!wordData.length) {
		doms.contentBody.innerHTML += 
			`<div class="chat-container robot-container">
                <img src="./img/robot.jpg" alt="">
                <div class="chat-txt">
                    您好！我是腾讯机器人，非常欢迎您的到来，有什么想和我聊聊的吗？
                </div>
            </div>`
	}
	for(const key of wordData) {
		if(key.from === 'robot') {
			doms.contentBody.innerHTML += 
			`<div class="chat-container robot-container">
                <img src="./img/robot.jpg" alt="">
                <div class="chat-txt">
                    ${key.content}
                </div>
            </div>`
		}else if(key.from === 'user') {
			doms.contentBody.innerHTML += 
			`<div class="chat-container avatar-container">
                <img src="./img/avtar.png" alt="">
                <div class="chat-txt">${key.content}</div>
            </div>`
		}
	}
	const chatTop = document.querySelectorAll('.chat-container')[document.querySelectorAll('.chat-container').length-1].offsetTop;
	doms.contentBody.scrollTo(0, chatTop);
}

// 事件绑定
function eventFN() {
	doms.sendBtn.addEventListener('click', sendMessage);
	// 滚动加载历史聊天记录
	doms.contentBody.addEventListener('scroll', function () {
		if(this.scrollTop === 0) {
			page ++;
			initialist();
		}
	});
	// 点击清除事件
	doms.clear.addEventListener('click', () => {
		console.log('点击了')
	});
	// 点击切换发送按钮
	doms.arrowContainer.addEventListener('click', (e) => {
		doms.selectContainer.style.display = 'block';
		if(disolayEnd === 'none') {
			disolayEnd = 'block';
		}else if(disolayEnd === 'block'){
			disolayEnd = 'none';
		}
		// 里边的选项键点击事件
		doms.selectContainer.addEventListener('click', (e) => {
			if(e.target.innerText === '按Enter键发送') {
				selectEnd = e.target.dataset.type;
				disolayEnd = 'none';
				document.querySelector('.select-item.on').classList.remove('on');
				e.target.classList.add('on');
			}else if(e.target.innerText === '按Ctrl+Enter键发送') {
				selectEnd = e.target.dataset.type;
				disolayEnd = 'none';
				document.querySelector('.select-item.on').classList.remove('on');
				e.target.classList.add('on');
			}
			doms.selectContainer.style.display = disolayEnd;
		});
		doms.selectContainer.style.display = disolayEnd;
	});
	// 点击切换发送按钮
	doms.inputContainer.addEventListener('keyup', (e) => {
		if(selectEnd === 'ctrEnter' && e.ctrlKey) {
			sendMessage();
		}else if(selectEnd === 'enter' && e.code === 'Enter' && !e.ctrlKey) {
			sendMessage();
		}
	});
}


async function sendMessage() {
	const str = doms.inputContainer.value.trim();
		if(!str) return;
		dataRendering([{from: 'user', content: `${str}`}]);
		doms.inputContainer.value = '';
		// 给后端传送数据
		const data = await fetch('https://study.duyiedu.com/api/chat', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				'authorization': 'Bearer '+sessionStorage.getItem('token')
			},
			body: JSON.stringify({
				content: str
			})
		});
		const datas = await data.json();
		dataRendering([{from: 'robot', content: datas.data.content}]);
}

// 点击关闭事件
doms.close.onclick = () => {
	console.log('点击了')
	sessionStorage.removeItem('token');
	location.href = './login.html';
};


init();
})();