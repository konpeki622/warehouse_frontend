<template>
  <el-container>
    <el-main>
      <el-row>
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="keywords" placeholder="输入关键字"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getPrintData">
              <i class="el-icon-search" style="margin-right: 5px"></i>查找
            </el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-table :data="printData" v-loading="printLoading">
          <el-table-column label="日期" align="center">
            <template slot-scope="scope">{{scope.row.print_date}}</template>
          </el-table-column>
          <el-table-column label="用户名" align="center">
            <template slot-scope="scope">{{scope.row.username}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">{{scope.row.behavior}}</template>
          </el-table-column>
          <el-table-column label="单号" align="center">
            <template slot-scope="scope">{{scope.row.goods_id}}</template>
          </el-table-column>
        </el-table>
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
      keywords: ''
    };
  },
  methods: {
    getPrintData() {
      this.printData = [];
      this.printLoading = true;
      let url = "";
      if (this.keywords === "") {
        url = "/apis/history/print";
      } else {
        let arr = this.keywords.split(" ");
        url = "/apis/history/print?type=1";
        for (let i in arr) {
          url += "&keywords=" + arr[i];
        }
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
    }
  },
  mounted() {
    this.getPrintData();
  }
};
</script>

<style scoped>
</style>
