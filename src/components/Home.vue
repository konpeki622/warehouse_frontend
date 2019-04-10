<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo logo-width">
				{{sysName}}
			</el-col>
			<el-col :span="10"></el-col>

			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner">{{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>设置</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside class="menu-expanded">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router>
					<template>
						<el-submenu :index="index+''" v-if="!menu.leaf">
							<template slot="title"><i :class="menu.iconCls"></i>{{menu.name}}</template>
							<el-menu-item v-for="child in menu.children" :index="child.path" :key="child.path">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="menu.leaf&&menu.children.length>0" :index="menu.children[0].path"><i :class="menu.iconCls"></i>{{menu.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
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
</template>

<script>
	export default {
		data() {
			return {
				sysName:'VUEADMIN',
				sysUserName: '',
        menu: '',
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect: function (a, b) {
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示').then(() => {
					localStorage.removeItem('user');
					_this.$router.push('/login');
				}).catch(() => {
          this.$notify.error({
            title: '注销失败',
            message: '请重试',
            duration:2000
          });
				});
			}
		},
		mounted() {
			let user = localStorage.getItem('username');
			this.sysUserName = user? user : '';
			const index = localStorage.getItem('auth');
			this.menu = this.$router.options.routes[index];
		}
	}

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
			color:#fff;
			background-color: #7777bf;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
				}
			}
			.logo {
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:230px;
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
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
				flex:0 0 230px;
				width: 230px;
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				flex:1;
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
