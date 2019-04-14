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
              <el-dropdown-item @click.native="changePass">设置</el-dropdown-item>
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
            unique-opened
            router
          >
            <template>
              <el-submenu index="1">
                <template slot="title">
                  <i :class="menu.iconCls"></i>
                  {{menu.name}}
                </template>
                <el-menu-item
                  v-for="(child, index) in menu.children"
                  :index="child.path"
                  :key="index"
                  :hidden="child.hidden"
                >{{child.name}}</el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
        </aside>
        <section class="content-container">
          <div class="grid-content bg-purple-light">
            <el-col :span="24" class="breadcrumb-container">
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
      <el-dialog title="修改密码" :visible.sync="formVisible" style="width: 70%; margin: 0 auto">
        <el-form :model="changeForm" :rules="rules" ref="changeForm" label-width="0" style="width: 70%; margin: 0 auto">
          <el-form-item prop="oldPass">
            <el-input type="password" v-model="changeForm.oldPass" placeholder="输入旧密码"></el-input>
          </el-form-item>
          <el-form-item prop="password" style="margin-top: 20px">
            <el-input type="password" v-model="changeForm.password" placeholder="输入新密码"></el-input>
          </el-form-item>
          <el-form-item prop="passConfirm" style="margin-top: 20px">
            <el-input type="password" v-model="changeForm.passConfirm" placeholder="确认新密码"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" @click="submitChange" v-loading="changeLoading">确认</el-button>
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
        oldPass: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [
          { required: true, validator: passwordValidity, trigger: "blur" }
        ],
        passConfirm: [
          { required: true, validator: repasswordValidity, trigger: "blur" }
        ]
      },
      sysName: "VUEADMIN",
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
    }
  },
  mounted() {
    let user = localStorage.getItem("username");
    this.sysUserName = user ? user : "";
    const index = Number(localStorage.getItem("auth"));
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
  .header {
    height: 60px;
    line-height: 60px;
    color: #fff;
    background-color: #7777bf;
    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
      }
    }
    .logo {
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: rgba(238, 241, 146, 0.3);
      border-right-width: 1px;
      border-right-style: solid;
      img {
        width: 40px;
        float: left;
        margin: 10px 10px 10px 18px;
      }
      .txt {
        color: #fff;
      }
    }
    .logo-width {
      width: 230px;
    }
    .logo-collapse-width {
      width: 60px;
    }
    .tools {
      padding: 0px 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
  }
  .main {
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
    aside {
      flex: 0 0 230px;
      width: 230px;
      .el-menu {
        height: 100%;
      }
      .collapsed {
        width: 60px;
        .item {
          position: relative;
        }
        .submenu {
          position: absolute;
          top: 0px;
          left: 60px;
          z-index: 99999;
          height: auto;
          display: none;
        }
      }
    }
    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }
    .menu-expanded {
      flex: 0 0 230px;
      width: 230px;
    }
    .content-container {
      flex: 1;
      overflow-y: scroll;
      padding: 20px;
      .breadcrumb-container {
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner {
          float: right;
        }
      }
      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
}
</style>
