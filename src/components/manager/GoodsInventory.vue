<template>
  <el-container>
    <el-main>
      <el-row :gutter="10" class="header-banner">
        <el-col :span="4">
          <el-select v-model="searchType" placeholder="请选择" @change="handleSearch" size="small">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4" v-if="searchType < 3">
          <span>
            <el-date-picker
              v-model="year"
              type="year"
              style="width: 150px;"
              placeholder="选择年"
              @change="handleSearchByYear"
              size="small"
            ></el-date-picker>
          </span>
          <span style="margin-left: 5px; font-size: 13px">年</span>
        </el-col>
        <el-col :span="4" v-if="searchType === 1">
          <el-select
            v-model="season"
            placeholder="请选择"
            @change="handleSearchBySeason(1)"
            size="small"
          >
            <el-option
              v-for="item in seasonOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4" v-if="searchType === 2">
          <span>
            <el-date-picker
              v-model="month"
              type="month"
              format="M"
              style="width: 150px;"
              placeholder="选择月"
              @change="handleSearchByMonth(1)"
              size="small"
            ></el-date-picker>
          </span>
          <span style="margin-left: 5px">月</span>
        </el-col>
        <el-col></el-col>
      </el-row>
      <el-row>
        <div id="chartColumn" class="my-chart" v-if="searchType === 0"></div>
      </el-row>
      <el-row>
        <el-table
          id="table-content"
          :data="accountData"
          v-loading="listLoading"
          style="width: 100%"
        >
          <el-table-column label="编号" align="center" width="100">
            <template slot-scope="scope">
              <div class="table-text">{{scope.row.id}}</div>
            </template>
          </el-table-column>
          <el-table-column label="日期" align="center" width="300">
            <template slot-scope="scope">
              <div class="table-text">{{scope.row.update_date}}</div>
            </template>
          </el-table-column>
          <el-table-column label="原料名" align="center">
            <template slot-scope="scope">
              <div class="table-text">{{scope.row.material_name}}</div>
            </template>
          </el-table-column>
          <el-table-column label="产地" align="center" width="180">
            <template slot-scope="scope">
              <div class="table-text">{{scope.row.area_name}}</div>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="center" width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.behavior === 0" class="result-more">+{{scope.row.update_size}}</div>
              <div v-else class="result-less">-{{scope.row.update_size}}</div>
            </template>
          </el-table-column>
          <el-table-column label="交易人" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.behavior === 1">
                <div class="table-text">{{scope.row.deliver_owner}}</div>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row class="foot-banner">
        <el-col :span="16" align="start">
          <el-pagination
            background
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
            class="button-primary"
            type="primary"
          >打印本页</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import echarts from "echarts";
export default {
  name: "GoodsInventory",
  data() {
    return {
      accountData: [],
      listLoading: false,
      printLoading: false,
      year: Date(),
      month: Date(),
      week: "",
      day: "",
      season: 0,
      searchType: 6,
      seasonOptions: [
        {
          value: 0,
          label: "第一季度"
        },
        {
          value: 1,
          label: "第二季度"
        },
        {
          value: 2,
          label: "第三季度"
        },
        {
          value: 3,
          label: "第四季度"
        }
      ],
      typeOptions: [
        {
          value: 6,
          label: "全部"
        },
        {
          value: 0,
          label: "按年份"
        },
        {
          value: 1,
          label: "按季度"
        },
        {
          value: 2,
          label: "按月份"
        },
        {
          value: 3,
          label: "近7天"
        },
        {
          value: 4,
          label: "昨天"
        },
        {
          value: 5,
          label: "今天"
        }
      ],
      currentPage: 1,
      totalCount: 0
    };
  },
  methods: {
    drawColumnChart(deliverData, storeData, subData) {
      this.chartColumn = echarts.init(document.getElementById("chartColumn"));
      console.log(deliverData[0]);
      this.chartColumn.setOption({
        title: { text: "年度报表" },
        dataZoom: [
          {
            type: "slider",
            show: true,
            yAxisIndex: [0],
            left: "97%",
            start: 0, //数据窗口范围的起始百分比
            end: 36
          }
        ],
        color: ["#3fc1e2", "#6f9f4f", "#b73851"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["销售量", "出库", "入库"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "value"
          }
        ],
        yAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月"
            ]
          }
        ],
        series: [
          {
            name: "销售量",
            type: "bar",
            label: {
              normal: {
                show: true
              }
            },
            data: subData
          },
          {
            name: "入库",
            type: "bar",
            stack: "销售量",
            label: {
              normal: {
                show: true
              }
            },
            data: storeData
          },
          {
            name: "出库",
            type: "bar",
            stack: "销售量",
            label: {
              normal: {
                show: true
              }
            },
            data: deliverData
          }
        ]
      });
    },
    getAccountAll: function(page) {
      this.accountData = [];
      this.listLoading = true;
      this.$http
        .get(
          "/apis/account?type=1&page=1&" + "goodsId=" + this.$route.query.id,
          {
            headers: {
              token: localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let accountList = JSON.parse(response.bodyText);
              let i = 0;
              while (i < accountList.data.length) {
                this.accountData.push({
                  id: accountList.data[i].id,
                  material_name: accountList.data[i].material_name,
                  area_name: accountList.data[i].area_name,
                  deliver_owner: accountList.data[i].deliver_owner,
                  update_date: accountList.data[i].update_date,
                  update_size: accountList.data[i].update_size,
                  behavior: accountList.data[i].behavior
                });
                i++;
              }
              this.totalCount = accountList.count;
              this.listLoading = false;
            } else {
              this.$message({ type: "error", message: "加载失败!" });
              this.listLoading = false;
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
            this.listLoading = false;
          }
        );
    },
    handleSearch(val) {
      this.year = new Date();
      this.month = new Date();
      this.season = 0;
      switch (val) {
        case 0: {
          this.currentPage = 1;
          this.searchByYear(this.currentPage);
          this.drawYearGraph();
          break;
        }
        case 1: {
          this.currentPage = 1;
          this.handleSearchBySeason(this.currentPage);
          break;
        }
        case 2: {
          this.currentPage = 1;
          this.handleSearchByMonth(this.currentPage);
          break;
        }
        case 3: {
          // 近七天
          this.currentPage = 1;
          this.searchByWeek(this.currentPage);
          break;
        }
        case 4: {
          //昨天
          this.currentPage = 1;
          this.searchYesterday(this.currentPage);
          break;
        }
        case 5: {
          // 今天
          this.currentPage = 1;
          this.searchToday(this.currentPage);
          break;
        }
        case 6: {
          this.currentPage = 1;
          this.getAccountAll(this.currentPage);
          break;
        }
        default:
          break;
      }
      this.searchType = val;
    },
    handlePage(val) {
      switch (this.searchType) {
        case 0: {
          this.currentPage = val;
          this.searchByYear(this.currentPage);
          break;
        }
        case 1: {
          this.currentPage = val;
          this.handleSearchBySeason(this.currentPage);
          break;
        }
        case 2: {
          this.currentPage = val;
          this.handleSearchByMonth(this.currentPage);
          break;
        }
        case 3: {
          // 近七天
          this.currentPage = val;
          this.searchByWeek(this.currentPage);
          break;
        }
        case 4: {
          //昨天
          this.currentPage = val;
          this.searchYesterday(this.currentPage);
          break;
        }
        case 5: {
          // 今天
          this.currentPage = val;
          this.searchToday(this.currentPage);
          break;
        }
        case 6: {
          this.currentPage = val;
          this.getAccountAll(this.currentPage);
          break;
        }
        default:
          break;
      }
    },
    handleSearchByYear(val) {
      switch (this.searchType) {
        case 0: {
          this.currentPage = 1;
          this.searchByYear(this.currentPage);
          this.drawYearGraph();
          break;
        }
        case 1: {
          this.currentPage = 1;
          this.handleSearchBySeason(this.currentPage);
          break;
        }
        case 2: {
          this.currentPage = 1;
          this.handleSearchByMonth(this.currentPage);
          break;
        }
        default:
          break;
      }
    },
    drawYearGraph() {
      let today = new Date();
      let interval =
        Number(today.getFullYear()) - Number(this.year.getFullYear());
      this.$http
        .get(
          "/apis/account/graph?type=5&goodsId=" +
            this.$route.query.id +
            "&condition=" +
            interval +
            "&page=0",
          {
            headers: {
              token: localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let accountList = JSON.parse(response.bodyText);
              var storeData = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
              var deliverData = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
              var subData = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
              let i = 0;
              let j = 11;
              while (i < accountList.data.length) {
                let m = Number(accountList.data[i].update_date.slice(5, 7));
                while (j > m - 1) {
                  j--;
                }
                if (accountList.data[i].behavior === 0) {
                  storeData[j] -= accountList.data[i].update_size;
                  subData[j] -= accountList.data[i].update_size;
                } else {
                  deliverData[j] += accountList.data[i].update_size;
                  subData[j] += accountList.data[i].update_size;
                }
                i++;
              }
              this.drawColumnChart(deliverData, storeData, subData);
            } else {
              this.$message({ type: "error", message: "图表加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "图表加载失败!" });
          }
        );
    },
    searchByYear(page) {
      if (this.searchType === 0) {
        this.accountData = [];
        this.listLoading = true;
        let today = new Date();
        let interval =
          Number(today.getFullYear()) - Number(this.year.getFullYear());
        this.$http
          .get(
            "/apis/account/graph?type=5&goodsId=" +
              this.$route.query.id +
              "&condition=" +
              interval +
              "&page=" +
              page,
            {
              headers: {
                token: localStorage.getItem("token")
              }
            }
          )
          .then(
            response => {
              if (response.status === 200) {
                let accountList = JSON.parse(response.bodyText);
                let i = 0;
                while (i < accountList.data.length) {
                  this.accountData.push({
                    id: accountList.data[i].id,
                    material_name: accountList.data[i].material_name,
                    area_name: accountList.data[i].area_name,
                    deliver_owner: accountList.data[i].deliver_owner,
                    update_date: accountList.data[i].update_date,
                    update_size: accountList.data[i].update_size,
                    behavior: accountList.data[i].behavior
                  });
                  i++;
                }
                this.totalCount = accountList.count;
                this.listLoading = false;
              } else {
                this.$message({ type: "error", message: "加载失败!" });
                this.listLoading = false;
              }
            },
            response => {
              this.$message({ type: "error", message: "加载失败!" });
              this.listLoading = false;
            }
          );
      }
    },
    handleSearchBySeason(page) {
      this.accountData = [];
      this.listLoading = true;
      let today = new Date();
      let intervalYear =
        Number(today.getFullYear()) - Number(this.year.getFullYear());
      let intervalSeason =
        Math.floor(Number(today.getMonth()) / 3 - this.season) + 4;
      let interval = intervalYear * 10 + intervalSeason;
      this.$http
        .get(
          "/apis/account/graph?type=4&goodsId=" +
            this.$route.query.id +
            "&condition=" +
            interval +
            "&page=" +
            page,
          {
            headers: {
              token: localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let accountList = JSON.parse(response.bodyText);
              let i = 0;
              while (i < accountList.data.length) {
                this.accountData.push({
                  id: accountList.data[i].id,
                  material_name: accountList.data[i].material_name,
                  area_name: accountList.data[i].area_name,
                  deliver_owner: accountList.data[i].deliver_owner,
                  update_date: accountList.data[i].update_date,
                  update_size: accountList.data[i].update_size,
                  behavior: accountList.data[i].behavior
                });
                i++;
              }
              this.totalCount = accountList.count;
              this.listLoading = false;
            } else {
              this.$message({ type: "error", message: "加载失败!" });
              this.listLoading = false;
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
            this.listLoading = false;
          }
        );
    },
    handleSearchByMonth(page) {
      this.accountData = [];
      this.listLoading = true;
      let today = new Date();
      let intervalYear =
        Number(today.getFullYear()) - Number(this.year.getFullYear());
      let interval =
        intervalYear * 12 +
        (Number(today.getMonth()) - Number(this.month.getMonth()));
      this.$http
        .get(
          "/apis/account/graph?type=3&goodsId=" +
            this.$route.query.id +
            "&condition=" +
            interval +
            "&page=" +
            page,
          {
            headers: {
              token: localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let accountList = JSON.parse(response.bodyText);
              let i = 0;
              while (i < accountList.data.length) {
                this.accountData.push({
                  id: accountList.data[i].id,
                  material_name: accountList.data[i].material_name,
                  area_name: accountList.data[i].area_name,
                  deliver_owner: accountList.data[i].deliver_owner,
                  update_date: accountList.data[i].update_date,
                  update_size: accountList.data[i].update_size,
                  behavior: accountList.data[i].behavior
                });
                i++;
              }
              this.totalCount = accountList.count;
              this.listLoading = false;
            } else {
              this.$message({ type: "error", message: "加载失败!" });
              this.listLoading = false;
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
            this.listLoading = false;
          }
        );
    },
    searchByWeek(page) {
      this.accountData = [];
      this.listLoading = true;
      this.$http
        .get(
          "/apis/account/graph?type=2&goodsId=" +
            this.$route.query.id +
            "&page=" +
            page,
          {
            headers: {
              token: localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let accountList = JSON.parse(response.bodyText);
              let i = 0;
              while (i < accountList.data.length) {
                this.accountData.push({
                  id: accountList.data[i].id,
                  material_name: accountList.data[i].material_name,
                  area_name: accountList.data[i].area_name,
                  deliver_owner: accountList.data[i].deliver_owner,
                  update_date: accountList.data[i].update_date,
                  update_size: accountList.data[i].update_size,
                  behavior: accountList.data[i].behavior
                });
                i++;
              }
              this.totalCount = accountList.count;
              this.listLoading = false;
            } else {
              this.$message({ type: "error", message: "加载失败!" });
              this.listLoading = false;
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
            this.listLoading = false;
          }
        );
    },
    searchYesterday(page) {
      this.accountData = [];
      this.listLoading = true;
      this.$http
        .get(
          "/apis/account/graph?type=1&goodsId=" +
            this.$route.query.id +
            "&page=" +
            page,
          {
            headers: {
              token: localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let accountList = JSON.parse(response.bodyText);
              let i = 0;
              while (i < accountList.data.length) {
                this.accountData.push({
                  id: accountList.data[i].id,
                  material_name: accountList.data[i].material_name,
                  area_name: accountList.data[i].area_name,
                  deliver_owner: accountList.data[i].deliver_owner,
                  update_date: accountList.data[i].update_date,
                  update_size: accountList.data[i].update_size,
                  behavior: accountList.data[i].behavior
                });
                i++;
              }
              this.totalCount = accountList.count;
              this.listLoading = false;
            } else {
              this.$message({ type: "error", message: "加载失败!" });
              this.listLoading = false;
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
            this.listLoading = false;
          }
        );
    },
    searchToday(page) {
      this.accountData = [];
      this.listLoading = true;
      this.$http
        .get(
          "/apis/account/graph?type=0&goodsId=" +
            this.$route.query.id +
            "&page=" +
            page,
          {
            headers: {
              token: localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              let accountList = JSON.parse(response.bodyText);
              let i = 0;
              while (i < accountList.data.length) {
                this.accountData.push({
                  id: accountList.data[i].id,
                  material_name: accountList.data[i].material_name,
                  area_name: accountList.data[i].area_name,
                  deliver_owner: accountList.data[i].deliver_owner,
                  update_date: accountList.data[i].update_date,
                  update_size: accountList.data[i].update_size,
                  behavior: accountList.data[i].behavior
                });
                i++;
              }
              this.totalCount = accountList.count;
              this.listLoading = false;
            } else {
              this.$message({ type: "error", message: "加载失败!" });
              this.listLoading = false;
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
            this.listLoading = false;
          }
        );
    },
    handlePrint() {
      let t = new Date();
      let print = {
        print_date: t.format("yyyy-MM-dd HH:mm:ss"),
        username: localStorage.getItem("username"),
        behavior: 0,
        behavior_name: "",
        goods_id: this.$route.query.id
      };
      switch (this.searchType) {
        case 0: {
          print.behavior = 4;
          break;
        }
        case 1: {
          print.behavior = 5;
          break;
        }
        case 2: {
          print.behavior = 6;
          break;
        }
        case 3: {
          print.behavior = 7;
          break;
        }
        case 4: {
          print.behavior = 8;
          break;
        }
        case 5: {
          print.behavior = 8;
          break;
        }
        case 6: {
          print.behavior = 1;
          break;
        }
        default:
          break;
      }
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
    }
  },
  created() {
    this.year = new Date();
    this.month = new Date();
    this.getAccountAll(this.currentPage);
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
.header-banner {
  border-top: 1px solid #eceef0;
  border-bottom: 1px solid #eceef0;
  padding-top: 10px;
  padding-left: 5px;
  padding-bottom: 10px;
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

.my-chart {
  width: 100%;
  height: 400px;
  border-bottom: 1px solid #eceef0;
  padding-bottom: 50px;
  padding-top: 50px;
}

.table-text {
  font-size: 13px;
  letter-spacing: 0.8px;
}

.button-primary {
  background-color: #3fc1e2;
  border-color: #3fc1e2;
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
