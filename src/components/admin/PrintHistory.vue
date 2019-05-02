<template>
  <el-container>
    <el-main>
      <el-row class="search-banner">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="keywords" placeholder="输入关键字" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch" size="small" class="button-primary">
              <i class="el-icon-search" style="margin-right: 5px"></i>查找
            </el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-table :data="printData" v-loading="printLoading">
          <el-table-column label="日期" align="center">
            <template slot-scope="scope">
              <div class="table-text">{{scope.row.print_date}}</div>
            </template>
          </el-table-column>
          <el-table-column label="用户名" align="center">
            <template slot-scope="scope">
              <div class="table-text">{{scope.row.username}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div class="table-text">{{scope.row.behavior}}</div>
            </template>
          </el-table-column>
          <el-table-column label="库存编号" align="center">
            <template slot-scope="scope">
              <div class="table-text" v-if="scope.row.goods_id !== 0">{{scope.row.goods_id}}</div>
              <div class="table-text" v-else>-</div>
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
  name: "PrintHistory",
  data() {
    return {
      printData: [],
      printLoading: false,
      keywords: "",
      currentPage: 1,
      totalCount: 0
    };
  },
  methods: {
    getPrintData(page) {
      this.printData = [];
      this.printLoading = true;
      let url = "";
      if (this.keywords === "") {
        url = "/apis/history/print?page=" + page;
      } else {
        let arr = this.keywords.split(" ");
        url = "/apis/history/print?type=1";
        for (let i in arr) {
          url += "&keywords=" + arr[i];
        }
        url += "&page=" + page;
      }
      this.$http
        .get(url, {
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(
          response => {
            if (response.status === 200) {
              let printList = JSON.parse(response.bodyText);
              let i = 0;
              while (i < printList.data.length) {
                this.printData.push({
                  id: printList.data[i].id,
                  print_date: printList.data[i].print_date,
                  username: printList.data[i].username,
                  behavior: printList.data[i].behavior_name,
                  goods_id: printList.data[i].goods_id
                });
                i++;
              }
              this.totalCount = printList.count;
              this.printLoading = false;
            } else {
              this.$message({ type: "error", message: "加载失败!" });
              this.printLoading = false;
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
            this.printLoading = false;
          }
        );
    },
    handlePage(val) {
      this.currentPage = val;
      this.getPrintData(this.currentPage);
    },
    handleSearch() {
      this.currentPage = 1;
      this.getPrintData(this.currentPage);
    }
  },
  mounted() {
    this.getPrintData(this.currentPage);
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
