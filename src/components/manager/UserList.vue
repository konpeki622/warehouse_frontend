<template>
  <el-container>
    <el-main>
      <el-row class="search-banner">
        <el-form :inline="true">
          <el-form-item>
            <el-select v-model="auth" size="small" style="width: 100px" @change="getUserData(1)">
              <el-option
                v-for="item in authOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="keyText" placeholder="输入关键字" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch" size="small" class="button-primary">
              <i class="el-icon-search" style="margin-right: 5px"></i>查找
            </el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-table id="table-content" :data="data" v-loading="listLoading" style="width: 100%">
          <el-table-column label="工号" width="100" align="center">
            <template slot-scope="scope">
              <div class="table-text">{{scope.row.workid}}</div>
            </template>
          </el-table-column>
          <el-table-column label="用户名" align="center">
            <template slot-scope="scope">
              <div class="table-text">{{scope.row.username}}</div>
            </template>
          </el-table-column>
          <el-table-column label="姓名" align="center">
            <template slot-scope="scope">
              <div class="table-text">{{scope.row.nickname}}</div>
            </template>
          </el-table-column>
          <el-table-column label="性别" width="150" align="center">
            <template slot-scope="scope">
              <div class="table-text">
                <div>{{scope.row.gender}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="电话" width="150" align="center">
            <template slot-scope="scope">
              <div class="table-text">
                <div>{{scope.row.phone}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="邮箱" width="150" align="center">
            <template slot-scope="scope">
              <div class="table-text">
                <div>{{scope.row.email}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="handleDelete(scope.row.id)"
                class="button-plain"
                round
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row class="foot-banner">
        <el-col :span="16" align="start">
          <el-pagination
            background
            class="pagination"
            layout="prev, pager, next"
            :current-page.sync="currentPage"
            @current-change="handlePage"
            :total="totalCount"
          ></el-pagination>
        </el-col>
        <!-- <el-col :span="8" align="end">
          <el-button
            @click="handlePrint"
            :loading="printLoading"
            size="small"
            type="primary"
            class="button-primary"
          >导出</el-button>
        </el-col> -->
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "UserList",
  data() {
    return {
      data: [],
      totalCount: 0,
      listLoading: false,
      addLoading: false,
      printLoading: false,
      deleteLoading: true,
      keywords: [],
      keyText: "",
      searchType: "1",
      addFormVisible: false,
      currentPage: 1,
      auth: null,
      authOptions: [
        {
          label: "全部",
          value: null
        },
        {
          label: "原料管理员",
          value: 0
        },
        {
          label: "财务经理",
          value: 1
        },
        {
          label: "系统管理员",
          value: 2
        }
      ]
    };
  },
  methods: {
    getUserData(page) {
      this.data = [];
      //   let url = "";
      //   if (this.keywords === "") {
      //     url = "/apis/user/list?page=" + page;
      //   } else {
      //     let arr = this.keywords.split(" ");
      //     url = "/apis/user/list?type=" + this.searchType;
      //     for (let i in arr) {
      //       url += "&keywords=" + arr[i];
      //     }
      //     url += "&page=" + page;
      //   }
      this.currentPage = page;
      let params = {};
      if (this.keywords.length !== 0) params.keywords = this.keywords;
      if (this.auth) params.auth = this.auth;
      params.page = page;
      this.$http
        .post(
          "/apis/user/list",
          {},
          {
            params: params,
            headers: {
              token: localStorage.getItem("token")
            }
          }
        )
        .then(response => {
          this.listLoading = true;
          if (response.status === 200) {
            let userList = JSON.parse(response.bodyText);
            this.data = userList.data;
            this.totalCount = userList.count;
            this.listLoading = false;
          } else {
            this.listLoading = false;
            this.$message({ type: "error", message: "加载失败!" });
          }
        });
    },
    handleSearch() {
      this.currentPage = 1;
      this.keywords = this.keyText.split(" ");
      this.getUserData(this.currentPage);
    },
    handleDelete(id) {
      this.$confirm("确认删除人员吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteLoading = true;
          this.$http
            .post(
              "/apis/user/delete",
              {},
              {
                params: {
                  id: id
                },
                headers: {
                  token: localStorage.getItem("token")
                }
              }
            )
            .then(response => {
              if (response.status === 200) {
                this.deleteLoading = false;
                this.$message({ type: "success", message: "删除成功!" });
                if (this.data.length - 1 === 0 && this.currentPage > 1) {
                  this.currentPage -= 1;
                }
                this.getUserData(this.currentPage);
              } else {
                this.deleteLoading = false;
                this.$message({ type: "error", message: "删除失败!" });
              }
            })
            .catch(() => {
              this.deleteLoading = false;
              this.$message({ type: "error", message: "删除失败!" });
            });
        })
        .catch(error => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handlePrint() {
      let t = new Date();
      let print = {
        print_date: t.format("yyyy-MM-dd HH:mm:ss"),
        username: localStorage.getItem("username"),
        behavior: 0,
        behavior_name: "",
        goods_id: 0
      };
      this.printLoading = true;
      this.$http
        .post("/apis/print/add", print, {
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(
          response => {
            if (response.status === 200) {
              this.$message({ type: "success", message: "打印成功!" });
              this.$message({ type: "success", message: "打印成功!" });
              let wpt = document.getElementById("table-content");
              let newContent = wpt.innerHTML;
              let oldContent = document.body.innerHTML;
              document.body.innerHTML = newContent;
              window.print(); //打印方法
              window.location.reload();
              document.body.innerHTML = oldContent;
              this.printLoading = false;
            } else {
              this.$message({ type: "error", message: "打印失败!" });
              this.printLoading = false;
            }
          },
          response => {
            this.$message({ type: "error", message: "打印失败!" });
            this.printLoading = false;
          }
        );
    },
    handlePage(val) {
      this.currentPage = val;
      this.getUserData(this.currentPage);
    },
    toFourDecimal(num) {
      let str = num.toString();
      let dotIndex = str.indexOf(".");
      if (dotIndex === -1 || dotIndex + 6 > str.length) {
        return num;
      }
      return num.toFixed(4);
    }
  },
  mounted() {
    this.currentPage = 1;
    this.getUserData(this.currentPage);
  }
};
</script>

<style>
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #3fc1e2 !important;
}
.el-pagination.is-background .el-pager li:hover {
  color: #3fc1e2 !important;
}
</style>

<style scoped>
.search-banner {
  border-top: 1px solid #eceef0;
  border-bottom: 1px solid #eceef0;
  padding-top: 10px;
  padding-left: 5px;
}

.result-more {
  color: #6f9f4f;
  font-weight: 450;
  font-size: 13px;
  letter-spacing: 0.8px;
}

.result-less {
  color: #b73851;
  font-weight: 450;
  font-size: 13px;
  letter-spacing: 0.8px;
}

.table-text {
  font-size: 13px;
  letter-spacing: 0.8px;
}

.button-primary {
  background-color: #3fc1e2;
  border-color: #3fc1e2;
}

.button-text {
  color: #5cbed6;
  font-size: 13px;
  letter-spacing: 0.8px;
  padding: 0 0 0 0;
}

.button-plain {
  border-color: #9cdceb;
  color: #5cbed6;
  background-color: #fdffff;
}

.button-plain:hover {
  background-color: #5cbed6;
  border-color: #5cbed6;
  color: #fff;
}

.foot-banner {
  margin: 20px 0 0 -10px;
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
