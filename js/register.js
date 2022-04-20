(() => {
	// DOM
	const doms = {
		user: document.querySelector('.user'),
		userName: document.querySelector('.userName'),
		userPassword: document.querySelector('.userPassword'),
		userPasswordEnd: document.querySelector('.userPasswordEnd'),
		formWrapper: document.querySelector('.form-wrapper')
	};
	let isUser = false;

	const demand = async (loginId, nickname, loginPwd) => {
		const data = await fetch('https://study.duyiedu.com/api/user/reg', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				loginId: loginId,
				nickname: nickname,
				loginPwd: loginPwd
			})
		});
		const datas = await data.json();
		if(datas.data) {
			alert('注册成功');
			setTimeout(() => {location.href = './login.html'}, 2000);
		}
	};

	// 表单提交函数
	const onRegister = (e) => {
		e.preventDefault();
		const userValue = doms.user.value.trim();
		const userNameValue = doms.userName.value.trim();
		const userPasswordValue = doms.userPassword.value.trim();
		const userPasswordEndValue = doms.userPasswordEnd.value.trim();

		// 验证用户填写的信息是否符合要求
		if(!userValue) {
			alert('用户名不能为空');
			return;
		} else if(!userNameValue) {
			alert('用户昵称不能为空');
			return;
		} else if(!userPasswordValue) {
			alert('注册密码不能为空');
			return;
		} else if(!userPasswordEndValue) {
			alert('确认密码不能为空');
			return;
		} else if(userPasswordValue !== userPasswordEndValue) {
			alert('两次密码不一致');
			return;
		} else if(!isUser) {
			alert('该账号已经存在');
			return;
		}
		// 请求服务端数据
		demand(userValue, userNameValue, userPasswordValue);
	}

	// 注册表单提交事件
	doms.formWrapper.addEventListener('submit', onRegister);

	// 验证用户名是否已经注册
	doms.user.onchange = async (e) => {
		e.preventDefault();
		const data = await fetch(`https://study.duyiedu.com/api/user/exists?loginId=${doms.user.value.trim()}`);
		const datas = await data.json();
		if(datas.data) {
			alert('该账号已经存在');
		}else {
			isUser = true;
		}
	};
})();