<template>
  <el-container>
    <el-main>
      <el-row class="search-banner">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="keywords" placeholder="输入关键字" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch" class="button-primary" size="small">
              <i class="el-icon-search" style="margin-right: 5px"></i>查找
            </el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-table
          :data="updateData"
          v-loading="updateLoading"
          :default-sort="{prop: 'update_date', order: 'descending'}"
        >
          <el-table-column label="日期" align="center">
            <template slot-scope="scope">
              <div class="table-text">{{scope.row.update_date}}</div>
            </template>
          </el-table-column>
          <el-table-column label="用户名" align="center">
            <template slot-scope="scope">
              <div class="table-text">{{scope.row.username}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.behavior === 0" class="table-text">添加入库信息</div>
              <div v-if="scope.row.behavior === 1" class="table-text">添加出库信息</div>
            </template>
          </el-table-column>
          <el-table-column label="库存编号" align="center">
            <template slot-scope="scope">
              <div class="table-text">{{scope.row.goods_id}}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row class="foot-banner">
        <el-col :span="24" align="start">
          <el-pagination
            background
            class="pagination"
            layout="prev, pager, next"
            :current-page.sync="currentPage"
            @current-change="handlePage"
            :total="totalCount"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "UpdateHistory",
  data() {
    return {
      updateData: [],
      updateLoading: false,
      keywords: "",
      currentPage: 1,
      totalCount: 0
    };
  },
  methods: {
    getUpdateData: function(page) {
      this.updateData = [];
      this.updateLoading = true;
      let url = "";
      if (this.keywords === "") {
        url = "/apis/account?page=" + page;
      } else {
        let arr = this.keywords.split(" ");
        url = "/apis/account?type=2";
        for (let i in arr) {
          url += "&keywords=" + arr[i];
        }
        url += "&page=" + page;
      }
      this.$http
        .get(url, {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token")
          }
        })
        .then(
          response => {
            if (response.status === 200) {
              let accountList = JSON.parse(response.bodyText);
              let i = 0;
              while (i < accountList.data.length) {
                this.updateData.push({
                  id: accountList.data[i].id,
                  update_date: accountList.data[i].update_date,
                  username: accountList.data[i].username,
                  behavior: accountList.data[i].behavior,
                  goods_id: accountList.data[i].goods_id
                });
                i++;
              }
              this.totalCount = accountList.count;
              this.updateLoading = false;
            } else {
              this.$message({ type: "error", message: "加载失败!" });
              this.updateLoading = false;
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
            this.updateLoading = false;
          }
        );
    },
    handlePage(val) {
      this.currentPage = val;
      this.getUpdateData(this.currentPage);
    },
    handleSearch() {
      this.currentPage = 1;
      this.getUpdateData(this.currentPage);
    }
  },
  mounted() {
    this.getUpdateData(this.currentPage);
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

.table-text {
  font-size: 13px;
  letter-spacing: 0.8px;
}

.button-primary {
  background-color: #3fc1e2;
  border-color: #3fc1e2;
}

.foot-banner {
  margin: 20px 0 0 -10px;
}
</style>
