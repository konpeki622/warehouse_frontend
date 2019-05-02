<template>
  <el-container>
    <el-main>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        label-position="left"
        label-width="0px"
        class="demo-ruleForm login-container"
      >
        <h3 class="title">系统登录</h3>
        <el-form-item prop="account">
          <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass" style="margin-top: 25px">
          <el-input
            type="password"
            v-model="loginForm.checkPass"
            auto-complete="off"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-checkbox v-model="checked" class="remember" style="margin-top: 20px">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click="handleSubmit" :loading="logining">登录</el-button>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button type="text" style="width:100%;" @click="toRegister">注册</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      logining: false,
      loginForm: {
        account: "",
        checkPass: ""
      },
      rules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        checkPass: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      checked: false
    };
  },
  methods: {
    handleSubmit(ev) {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.logining = true;
          this.$http
            .post(
              "/apis/checkLogin?username=" +
                this.loginForm.account +
                "&password=" +
                this.loginForm.checkPass
            )
            .then(
              response => {
                if (response.status === 200) {
                  const result = JSON.parse(response.bodyText);
                  let user = result.data.user;
                  localStorage.setItem("token", result.data.token);
                  localStorage.setItem("menu_id", user.menu_id);
                  localStorage.setItem("username", this.loginForm.account);
                  if (this.checked) {
                    localStorage.setItem("checked", 1);
                    localStorage.setItem("password", user.password);
                  } else if (localStorage.getItem("checked")) {
                    localStorage.removeItem("checked");
                  }
                  this.$notify({
                    title: "登录成功",
                    message: "稍后将转向首页",
                    type: "success",
                    duration: 2000
                  });
                  window.setTimeout(_ => {
                    switch (localStorage.getItem("menu_id")) {
                      case "0": {
                        this.$router.push("/worker");
                        break;
                      }
                      case "1": {
                        this.$router.push("/manager");
                        break;
                      }
                      default: {
                        this.$router.push("/admin");
                        break;
                      }
                    }
                  }, 1000 * 3);
                  this.logining = false;
                } else {
                  console.log("登录失败：", response);
                  this.$notify.error({
                    title: "登录失败",
                    message: "用户名密码不匹配或网络错误",
                    duration: 2000
                  });
                  this.logining = false;
                }
              },
              response => {
                console.log("登录失败：", response);
                this.$notify.error({
                  title: "登录失败",
                  message: "用户名密码不匹配或网络错误",
                  duration: 2000
                });
                this.logining = false;
              }
            );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    toRegister() {
      this.$router.push("/register");
    }
  },
  mounted() {
    this.loginForm.account = localStorage.getItem("username");
    if (localStorage.getItem("checked")) {
      this.checked = true;
      this.loginForm.checkPass = localStorage.getItem("password");
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>
