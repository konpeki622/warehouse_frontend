<template>
  <el-container>
    <el-main>
      <el-row class="search-banner">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="keyText" placeholder="输入关键字" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchType" size="small" style="width: 100px">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch" size="small" class="button-primary">
              <i class="el-icon-search" style="margin-right: 5px"></i>查找
            </el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-table id="table-content" :data="stockData" v-loading="listLoading" style="width: 100%">
          <el-table-column label="编号" width="100" align="center">
            <template slot-scope="scope">
              <div class="table-text">{{scope.row.id}}</div>
            </template>
          </el-table-column>
          <el-table-column label="原料名" align="center">
            <template slot-scope="scope">
              <div class="table-text">{{scope.row.material_name}}</div>
            </template>
          </el-table-column>
          <el-table-column label="产地" align="center">
            <template slot-scope="scope">
              <div class="table-text">{{scope.row.area_name}}</div>
            </template>
          </el-table-column>
          <el-table-column label="余量(米)" align="center">
            <template slot-scope="scope">
              <div class="table-text">{{scope.row.material_size}}</div>
            </template>
          </el-table-column>
          <el-table-column label="实际余量(米)" align="center">
            <template slot-scope="scope">
              <el-input v-model="realStock[scope.$index]" size="small" style="width: 80px"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="比对结果" align="center">
            <template slot-scope="scope">
              <div v-if="realStock[scope.$index] === ''">-</div>
              <div v-else>
                <div v-if="Number(realStock[scope.$index]) - onlineStock[scope.$index] > 0">
                  <span
                    class="result-more"
                  >+{{toFourDecimal(Number(realStock[scope.$index]) - onlineStock[scope.$index])}}</span>
                  <span>
                    (
                    <el-button type="text" @click="alterStock(scope.$index)" class="button-text">修正</el-button>)
                  </span>
                </div>
                <div v-else-if="Number(realStock[scope.$index]) - onlineStock[scope.$index] === 0">
                  <i class="el-icon-success"></i>
                </div>
                <div v-else>
                  <span
                    class="result-less"
                  >{{toFourDecimal(Number(realStock[scope.$index]) - onlineStock[scope.$index])}}</span>
                  <span>
                    (
                    <el-button type="text" @click="alterStock(scope.$index)" class="button-text">修正</el-button>)
                  </span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="toInventory(scope.row.id)"
                class="button-plain"
                round
              >统计报表</el-button>
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
        <el-col :span="8" align="end">
          <el-button
            @click="handlePrint"
            :loading="printLoading"
            size="small"
            type="primary"
            class="button-primary"
          >打印本页</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "StockList",
  data() {
    return {
      stockData: [],
      typeOptions: [
        {
          value: "1",
          label: "按全部"
        },
        {
          value: "2",
          label: "按材料"
        },
        {
          value: "3",
          label: "按地区"
        }
      ],
      onlineStock: [],
      realStock: [],
      realStockReset: true,
      materialData: [],
      totalCount: 0,
      listLoading: false,
      printLoading: false,
      keyText: "",
      keywords: "",
      searchType: "1",
      currentPage: 1
    };
  },
  methods: {
    getStockData(page) {
      this.stockData = [];
      this.onlineStock = [];
      if (this.realStockReset) {
        this.realStock = [];
      }
      let url = "";
      if (this.keywords === "") {
        url = "/apis/goods?page=" + page;
      } else {
        let arr = this.keywords.split(" ");
        url = "/apis/goods?type=" + this.searchType;
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
        .then(response => {
          this.listLoading = true;
          if (response.status === 200) {
            let goodsList = JSON.parse(response.bodyText);
            let i = 0;
            while (i < goodsList.data.length) {
              this.stockData.push({
                id: goodsList.data[i].id,
                material_id: goodsList.data[i].material_id,
                area_id: goodsList.data[i].area_id,
                material_name: goodsList.data[i].material_name,
                area_name: goodsList.data[i].area_name,
                material_size: goodsList.data[i].material_size
              });
              this.onlineStock.push(goodsList.data[i].material_size);
              if (this.realStockReset) {
                this.realStock.push("");
              }
              i++;
            }
            this.totalCount = goodsList.count;
            this.listLoading = false;
            this.realStockReset = true;
          } else {
            this.listLoading = false;
            this.$message({ type: "error", message: "加载失败!" });
          }
        });
    },
    handleSearch() {
      this.currentPage = 1;
      this.keywords = this.keyText;
      this.getStockData(this.currentPage);
    },
    alterStock(index) {
      this.$confirm(
        "确认修正库存编号[" + this.stockData[index].id + "]吗?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let type = 0;
          let gap = Number(this.realStock[index]) - this.onlineStock[index];
          if (gap > 0) {
            type = 0;
          } else {
            type = 1;
            gap = gap * -1;
          }
          this.listLoading = true;
          this.$http
            .post(
              "/apis/goods/alter",
              {},
              {
                params: {
                  type: type,
                  updateSize: gap,
                  goodsId: this.stockData[index].id
                },
                headers: {
                  token: localStorage.getItem("token")
                }
              }
            )
            .then(
              response => {
                if (response.status === 200) {
                  this.$message({ type: "success", message: "修正成功!" });
                  this.listLoading = false;
                  this.realStockReset = false;
                  this.getStockData(this.currentPage);
                } else {
                  this.$message({ type: "error", message: "修正失败!" });
                  this.listLoading = false;
                }
              },
              response => {
                this.$message({ type: "error", message: "修正失败!" });
                this.listLoading = false;
              }
            );
        })
        .catch(error => {
          this.$message({
            type: "info",
            message: "已取消修正"
          });
        });
    },
    toInventory(id) {
      this.$router.push({
        path: "/manager/goodsInventory",
        query: {
          id: id
        }
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
      this.realStockReset = true;
      this.getStockData(this.currentPage);
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
    this.getStockData(this.currentPage);
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
</style>
