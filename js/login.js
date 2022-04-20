/**
 * 登录验证
 */
(() => {
	// 全局DOM
	const doms = {
		userName: document.querySelector('#userName'),
		userPassword: document.querySelector('#userPassword'),
		signin: document.querySelector('.signin')
	};
	// 点击登录按钮验证用户登录信息
	doms.signin.addEventListener('click', async (e) => {
		e.preventDefault();
		const userNameVlue = doms.userName.value.trim();
		const userPassword = doms.userPassword.value.trim();
		if(!userNameVlue || !userPassword) {
			alert('用户名和密码不能为空');
			return;
		}
		const data = await fetch('https://study.duyiedu.com/api/user/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				loginId: userNameVlue,
				loginPwd: userPassword
			})
		});
		const token = data.headers.get('Authorization');
		const datas = await data.json();
		if(datas.data) {
			sessionStorage.setItem('token', token);
			location.href = './index.html';
		} else {
			alert(datas.msg);
		}
	});
})();