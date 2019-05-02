<template>
  <el-container>
    <el-row class="container">
      <el-col :span="24" class="header">
        <el-col :span="10" class="logo logo-width">{{sysName}}</el-col>
        <el-col :span="10"></el-col>

        <el-col :span="4" class="userinfo">
          <el-dropdown trigger="hover">
            <span class="el-dropdown-link userinfo-inner">{{sysUserName}}</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="changePass">修改密码</el-dropdown-item>
              <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-col>
      <el-col :span="24" class="main">
        <aside class="menu-expanded">
          <!--导航菜单-->
          <el-menu
            :default-active="$route.path"
            class="el-menu"
            @open="handleopen"
            @close="handleclose"
            @select="handleselect"
            background-color="#434757"
            text-color="#fff"
            active-text-color="#92D4E4"
            unique-opened
            router
          >
            <template>
              <el-submenu index="1">
                <template slot="title">
                  <div align="center" style="margin-left: -45px">
                    <i :class="menu.iconCls"></i>
                    <span style="letter-spacing: 0.8px">{{menu.name}}</span>
                  </div>
                </template>
                <el-menu-item
                  v-for="(child, index) in menu.children"
                  :index="child.path"
                  :key="index"
                  :hidden="child.hidden"
                >
                  <div align="center" style="letter-spacing: 0.8px">{{child.name}}</div>
                </el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
        </aside>
        <section class="content-container">
          <div class="grid-content bg-purple-light">
            <el-col :span="6">
              <div v-if="$route.matched[1].name === '单个流水'" style="height: 12px; margin-top: -3px">
                <el-button
                  type="text"
                  style="padding: 0 0 0 15px; color: #475669; font-size: 12px"
                  @click="goBack"
                >
                  <i class="el-icon-back" style="margin-right: 5px"></i>返回
                </el-button>
              </div>
              <div v-else style="height: 12px; margin-top: -3px">&nbsp;</div>
            </el-col>
            <el-col :span="18" class="breadcrumb-container">
              <el-breadcrumb separator="/" class="breadcrumb-inner">
                <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">{{ item.name }}</el-breadcrumb-item>
              </el-breadcrumb>
            </el-col>
            <el-col :span="24" class="content-wrapper">
              <transition name="fade" mode="out-in">
                <router-view></router-view>
              </transition>
            </el-col>
          </div>
        </section>
      </el-col>
    </el-row>
    <el-row>
      <!--修改密码-->
      <el-dialog title="修改密码" :visible.sync="formVisible" class="dialog">
        <el-form :model="changeForm" :rules="rules" ref="changeForm" label-width="0" class="form">
          <el-form-item prop="oldPass" align="center">
            <el-input
              type="password"
              v-model="changeForm.oldPass"
              placeholder="输入旧密码"
              size="small"
              class="form-input"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" style="margin-top: 20px" align="center">
            <el-input
              type="password"
              v-model="changeForm.password"
              placeholder="输入新密码"
              size="small"
              class="form-input"
            ></el-input>
          </el-form-item>
          <el-form-item prop="passConfirm" style="margin-top: 20px" align="center">
            <el-input
              type="password"
              v-model="changeForm.passConfirm"
              placeholder="确认新密码"
              size="small"
              class="form-input"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button @click="formVisible = false" size="small">取消</el-button>
          <el-button
            type="primary"
            @click="submitChange"
            v-loading="changeLoading"
            class="button-primary"
            size="small"
          >确认</el-button>
        </div>
      </el-dialog>
    </el-row>
  </el-container>
</template>

<script>
export default {
  data() {
    let passwordValidity = (rule, value, callback) => {
      // Evan: 这里设定密码的规则，value值是输入框中的值
      // 密码必须含有字母和数字，长度为6-18位
      let myReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,16}$/;
      if (!value) {
        return callback(new Error("请输入密码"));
      } else if (!myReg.test(value)) {
        return callback(new Error("包含字母和数字，且不小于6位"));
      } else {
        return callback();
      }
    };
    let repasswordValidity = (rule, value, callback) => {
      let myReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,16}$/;
      if (!value) {
        return callback(new Error("请再次输入密码以确认"));
      }
      if (value !== this.changeForm.password) {
        return callback(new Error("两次输入的密码不一致"));
      } else if (!myReg.test(value)) {
        return callback(new Error("包含大写字母和数字，且不小于6位"));
      } else {
        callback();
      }
    };
    return {
      changeForm: {
        oldPass: "",
        password: "",
        passConfirm: ""
      },
      rules: {
        oldPass: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
        password: [
          { required: true, validator: passwordValidity, trigger: "blur" }
        ],
        passConfirm: [
          { required: true, validator: repasswordValidity, trigger: "blur" }
        ]
      },
      sysName: "服饰原料管理系统",
      sysUserName: "",
      formVisible: false,
      menu: {},
      changeLoading: false
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    handleopen() {
      //console.log('handleopen');
    },
    handleclose() {
      //console.log('handleclose');
    },
    handleselect: function(a, b) {},
    changePass() {
      this.formVisible = true;
    },
    submitChange() {
      this.$refs.changeForm.validate(valid => {
        if (valid) {
          this.changeLoading = true;
          const url =
            "/apis/password?username=" +
            localStorage.getItem("username") +
            "&oldPassword=" +
            this.changeForm.oldPass +
            "&newPassword=" +
            this.changeForm.password;
          this.$http.post(url).then(
            response => {
              if (response.status === 200) {
                this.$notify({
                  title: "密码修改成功",
                  message: "",
                  type: "success",
                  duration: 2000
                });
                this.formVisible = false;
                this.changeLoading = false;
              } else if (response.status === 205) {
                this.$notify.error({
                  title: "密码修改失败",
                  message: "旧密码错误",
                  duration: 2000
                });
                this.changeLoading = false;
              } else {
                this.$notify.error({
                  title: "密码修改失败",
                  message: "网络错误",
                  duration: 2000
                });
                this.changeLoading = false;
              }
            },
            response => {
              this.$notify.error({
                title: "密码修改失败",
                message: "网络错误",
                duration: 2000
              });
              this.changeLoading = false;
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //退出登录
    logout: function() {
      var _this = this;
      this.$confirm("确认退出吗?", "提示")
        .then(() => {
          localStorage.removeItem("user");
          _this.$router.push("/login");
        })
        .catch(() => {});
    },
    goBack() {
      this.$router.push("/manager/stock");
    }
  },
  mounted() {
    let user = localStorage.getItem("username");
    this.sysUserName = user ? user : "";
    const index = Number(localStorage.getItem("menu_id"));
    this.menu = this.$router.options.routes[index];
  }
};
</script>

<style scoped lang="scss">
.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}

.container .header {
  height: 60px;
  line-height: 60px;
  color: #fff;
  background-color: #3b3f4d;
}

.container .header .userinfo {
  text-align: right;
  padding-right: 35px;
  float: right;
}

.container .header .userinfo .userinfo-inner {
  cursor: pointer;
  color: #fff;
}

.container .header .logo {
  height: 60px;
  font-size: 16px;
  padding-left: 35px;
  padding-right: 20px;
  letter-spacing: 3px;
  font-weight: 450;
}

.container .header .logo-width {
  width: 230px;
}

.container .header .tools {
  padding: 0px 23px;
  width: 14px;
  height: 60px;
  line-height: 60px;
  cursor: pointer;
}

.container .main {
  display: flex;
  position: absolute;
  top: 60px;
  bottom: 0px;
  overflow: hidden;
}

.container .main .aside {
  flex: 0 0 230px;
  width: 230px;
}

.container .main .menu-expanded .el-menu {
  height: 100%;
}

.container .main .menu-expanded {
  flex: 0 0 230px;
  width: 230px;
}

.container .main .content-container {
  flex: 1;
  overflow-y: scroll;
  padding: 20px;
}

.container .main .content-container .content-wrapper {
  background-color: #fff;
  box-sizing: border-box;
}

.container .main .content-container .breadcrumb-container .title {
  width: 200px;
  float: left;
  color: #475669;
}

.container .main .content-container .breadcrumb-container .breadcrumb-inner {
  float: right;
  margin-right: 20px;
  font-size: 12px;
  letter-spacing: 0.4px;
}

.button-primary {
  background-color: #3fc1e2;
  border-color: #3fc1e2;
}

.dialog {
  width: 70%;
  margin: 0 auto;
}

.dialog .form {
  width: 100%;
  margin: 0 auto;
}

.dialog .form .form-label {
  font-size: 13px;
}

.dialog .form .form-input {
  width: 200px;
}

.dialog .dialog-footer {
  margin: 0 0 20px -10px;
}
</style>
