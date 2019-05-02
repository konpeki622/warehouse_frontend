<template>
  <el-container>
    <el-main>
      <el-row :gutter="10" class="header-banner">
        <el-col :span="4">
          <el-select v-model="graphType" placeholder="请选择" @change="handleGraph" size="small">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4" v-if="graphType === 0">
          <el-select v-model="searchType" placeholder="请选择" @change="handleSearch" size="small">
            <el-option
              v-for="item in dateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4" v-if="graphType === 0 && searchType < 3">
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
        <el-col :span="4" v-if="graphType === 0 && searchType === 1">
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
        <el-col :span="4" v-if="graphType === 0 && searchType === 2">
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
      <el-row v-if="graphType === 0">
        <div id="chartDate" class="my-chart"></div>
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
      </el-row>
      <el-row v-else>
        <el-row>
          <el-col :span="12">
            <div id="chartStore" class="my-chart"></div>
          </el-col>
          <el-col :span="12">
            <div id="chartDeliver" class="my-chart"></div>
          </el-col>
        </el-row>
      </el-row>
      <el-row>
        <div id="chartSum" class="my-chart"></div>
      </el-row>
      <el-row>
        <div id="chartSell" class="my-chart"></div>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import echarts from "echarts";
export default {
  name: "StockGraph",
  data() {
    return {
      accountData: [],
      storeData: [],
      deliverData: [],
      sellData: [],
      remainData: [],
      materialData: [],
      areaData: [],
      listLoading: false,
      printLoading: false,
      year: Date(),
      month: Date(),
      week: "",
      day: "",
      season: 0,
      searchType: 0,
      graphType: 0,
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
          value: 0,
          label: "按时间"
        },
        {
          value: 1,
          label: "按材料"
        },
        {
          value: 2,
          label: "按产地"
        }
      ],
      dateOptions: [
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
      totalCount: 0,
      chart: {}
    };
  },
  methods: {
    getMaterialData: function() {
      this.$http
        .get("/apis/material", {
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(
          response => {
            if (response.status === 200) {
              let materialList = JSON.parse(response.bodyText);
              let i = 0;
              while (i < materialList.data.length) {
                this.materialData.push({
                  value: materialList.data[i].material_id,
                  label: materialList.data[i].material_name
                });
                i++;
              }
            } else {
              this.$message({ type: "error", message: "加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "加载失败!" });
          }
        );
    },
    getAreaData: function() {
      this.$http
        .get("/apis/area", {
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(response => {
          if (response.status === 200) {
            let areaList = JSON.parse(response.bodyText);
            let i = 0;
            while (i < areaList.data.length) {
              this.areaData.push({
                value: areaList.data[i].area_id,
                label: areaList.data[i].area_name
              });
              i++;
            }
          } else {
            this.$message({ type: "error", message: "加载失败!" });
          }
        });
    },
    drawDateChart(deliverData, storeData, subData) {
      let chart = echarts.init(document.getElementById("chartDate"));
      chart.clear();
      chart.setOption({
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
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        color: ["#3fc1e2", "#6f9f4f", "#b73851"],
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
    drawStoreChart(xData) {
      var chart = echarts.init(document.getElementById("chartStore"));
      chart.clear();
      chart.setOption({
        title: { text: "入库量对比" },
        color: ["#b73851"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        dataZoom: [
          {
            type: "inside",
            filterMode: "filter",
            xAxisIndex: [0],
            startValue: 0,
            endValue: 7,
            orient: "horizontal",
            minValueSpan: 5
          }
        ],
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: xData
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: this.storeData
      });
    },
    drawDeliverChart(xData) {
      var chart = echarts.init(document.getElementById("chartDeliver"));
      chart.clear();
      chart.setOption({
        title: { text: "出库量对比" },
        color: ["#6f9f4f"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        dataZoom: [
          {
            type: "inside",
            filterMode: "filter",
            xAxisIndex: [0],
            startValue: 0,
            endValue: 7,
            orient: "horizontal",
            minValueSpan: 5
          }
        ],
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: xData
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: this.deliverData
      });
    },
    drawRemainChart(xData) {
      var chart = echarts.init(document.getElementById("chartSum"));
      chart.clear();
      chart.setOption({
        title: { text: "现有库存余量" },
        color: ["#3fc1e2"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        dataZoom: [
          {
            type: "inside",
            filterMode: "filter",
            xAxisIndex: [0],
            startValue: 0,
            endValue: 15,
            orient: "horizontal",
            minValueSpan: 5
          }
        ],
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: xData
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: this.remainData
      });
    },
    drawSellChart(xData) {
      var chart = echarts.init(document.getElementById("chartSell"));
      chart.clear();
      chart.setOption({
        title: { text: "净销售量对比（数据太少）" },
        color: ["#CCAE33"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        dataZoom: [
          {
            type: "inside",
            filterMode: "filter",
            xAxisIndex: [0],
            startValue: 0,
            endValue: 15,
            orient: "horizontal",
            minValueSpan: 5
          }
        ],
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: xData
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: this.sellData
      });
    },
    handleGraph(val) {
      switch (val) {
        case 0: {
          this.year = new Date();
          this.month = new Date();
          this.searchType = 0;
          this.currentPage = 1;
          this.searchByYear(this.currentPage);
          this.drawYearGraph();
          break;
        }
        case 1: {
          for (let type = 0; type < 3; type++) {
            this.getMaterialSum(type);
          }
          let xData = new Array();
          this.sellData = new Array();
          this.sellData.push({
            name: "销售量",
            type: "bar",
            label: {
              normal: {
                show: true
              }
            },
            data: new Array(this.materialData.length)
          });
          for (let i = 0; i < this.materialData.length; i++) {
            xData.push(this.materialData[i].label);
            this.getSellSum(0, this.materialData[i].value, i, xData);
          }
          break;
        }
        case 2: {
          for (let type = 0; type < 3; type++) {
            this.getAreaSum(type);
          }
          let xData = new Array();
          this.sellData = new Array();
          this.sellData.push({
            name: "销售量",
            type: "bar",
            label: {
              normal: {
                show: true
              }
            },
            data: new Array(this.materialData.length)
          });
          for (let i = 0; i < this.areaData.length; i++) {
            xData.push(this.areaData[i].label);
            this.getSellSum(1, this.areaData[i].value, i, xData);
          }
          break;
        }
        default:
          break;
      }
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
    getMaterialSum(type) {
      this.$http
        .get("/apis/goodsSum/material?type=" + type, {
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(
          response => {
            if (response.status === 200) {
              let xData = new Array();
              let res = JSON.parse(response.bodyText);
              res.data.sort(this.compare("goods_sum"));
              let i = 0;
              switch (type) {
                case 2: {
                  this.deliverData = new Array();
                  this.deliverData[0] = {
                    name: "出库量",
                    type: "bar",
                    label: {
                      normal: {
                        show: true
                      }
                    },
                    data: new Array()
                  };
                  while (i < res.data.length) {
                    this.deliverData[0].data.push(res.data[i].goods_sum);
                    xData.push(res.data[i].key_name);
                    i++;
                  }
                  this.drawDeliverChart(xData, type);
                  break;
                }
                case 1: {
                  this.storeData = new Array();
                  this.storeData[0] = {
                    name: "入库量",
                    type: "bar",
                    label: {
                      normal: {
                        show: true
                      }
                    },
                    data: new Array()
                  };
                  while (i < res.data.length) {
                    this.storeData[0].data.push(res.data[i].goods_sum);
                    xData.push(res.data[i].key_name);
                    i++;
                  }
                  this.drawStoreChart(xData, type);
                  break;
                }
                case 0: {
                  this.remainData = new Array();
                  this.remainData[0] = {
                    name: "库存余量",
                    type: "bar",
                    label: {
                      normal: {
                        show: true
                      }
                    },
                    data: new Array()
                  };
                  while (i < res.data.length) {
                    this.remainData[0].data.push(res.data[i].goods_sum);
                    xData.push(res.data[i].key_name);
                    i++;
                  }
                  this.drawRemainChart(xData, type);
                  break;
                }
                default:
                  break;
              }
            } else {
              this.$message({ type: "error", message: "图表加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "图表加载失败!" });
          }
        );
    },
    getAreaSum(type) {
      this.$http
        .get("/apis/goodsSum/area?type=" + type, {
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(
          response => {
            if (response.status === 200) {
              let xData = new Array();
              let res = JSON.parse(response.bodyText);
              res.data.sort(this.compare("goods_sum"));
              let i = 0;
              switch (type) {
                case 2: {
                  this.deliverData = new Array();
                  this.deliverData[0] = {
                    name: "出库量",
                    type: "bar",
                    label: {
                      normal: {
                        show: true
                      }
                    },
                    data: new Array()
                  };
                  while (i < res.data.length) {
                    this.deliverData[0].data.push(res.data[i].goods_sum);
                    xData.push(res.data[i].key_name);
                    i++;
                  }
                  this.drawDeliverChart(xData, type);
                  break;
                }
                case 1: {
                  this.storeData = new Array();
                  this.storeData[0] = {
                    name: "入库量",
                    type: "bar",
                    label: {
                      normal: {
                        show: true
                      }
                    },
                    data: new Array()
                  };
                  while (i < res.data.length) {
                    this.storeData[0].data.push(res.data[i].goods_sum);
                    xData.push(res.data[i].key_name);
                    i++;
                  }
                  this.drawStoreChart(xData, type);
                  break;
                }
                case 0: {
                  this.remainData = new Array();
                  this.remainData[0] = {
                    name: "库存余量",
                    type: "bar",
                    label: {
                      normal: {
                        show: true
                      }
                    },
                    data: new Array()
                  };
                  while (i < res.data.length) {
                    this.remainData[0].data.push(res.data[i].goods_sum);
                    xData.push(res.data[i].key_name);
                    i++;
                  }
                  this.drawRemainChart(xData, type);
                  break;
                }
                default:
                  break;
              }
            } else {
              this.$message({ type: "error", message: "图表加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "图表加载失败!" });
          }
        );
    },
    getSellSum(type, id, index, xData) {
      this.$http
        .get("/apis/goodsSum/sell?type=" + type + "&id=" + id, {
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(
          response => {
            if (response.status === 200) {
              let res = JSON.parse(response.bodyText);
              if (Number(res.count) === 2) {
                res.data.sort(this.compare("key_name"));
                let sell =
                  Number(res.data[0].goods_sum) - Number(res.data[1].goods_sum);
                if (sell > 0) {
                  this.sellData[0].data[index] = sell;
                } else {
                  this.sellData[0].data[index] = 0;
                }
              } else {
                this.sellData[0].data[index] = 0;
              }
              this.drawSellChart(xData);
            } else {
              this.$message({ type: "error", message: "图表加载失败!" });
            }
          },
          response => {
            this.$message({ type: "error", message: "图表加载失败!" });
          }
        );
    },
    drawYearGraph() {
      let today = new Date();
      let interval =
        Number(today.getFullYear()) - Number(this.year.getFullYear());
      this.$http
        .get("/apis/account/graph?type=5&condition=" + interval + "&page=0", {
          headers: {
            token: localStorage.getItem("token")
          }
        })
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
              this.drawDateChart(deliverData, storeData, subData);
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
      this.accountData = [];
      this.listLoading = true;
      let today = new Date();
      let interval =
        Number(today.getFullYear()) - Number(this.year.getFullYear());
      this.$http
        .get(
          "/apis/account/graph?type=5&condition=" + interval + "&page=" + page,
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
          "/apis/account/graph?type=4&condition=" + interval + "&page=" + page,
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
          "/apis/account/graph?type=3&condition=" + interval + "&page=" + page,
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
        .get("/apis/account/graph?type=2&page=" + page, {
          headers: {
            token: localStorage.getItem("token")
          }
        })
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
        .get("/apis/account/graph?type=1&page=" + page, {
          headers: {
            token: localStorage.getItem("token")
          }
        })
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
        .get("/apis/account/graph?type=0&page=" + page, {
          headers: {
            token: localStorage.getItem("token")
          }
        })
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
        goods_id: 0
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
    // 比较器
    compare(propertyName) {
      return function(object1, object2) {
        var value1 = Number(object1[propertyName]);
        var value2 = Number(object2[propertyName]);
        if (value2 > value1) {
          return 1;
        } else if (value2 < value1) {
          return -1;
        } else {
          return 0;
        }
      };
    }
  },
  created() {
    this.year = new Date();
    this.month = new Date();
    this.searchByYear(this.currentPage);
    this.drawYearGraph();
    this.getMaterialData();
    this.getAreaData();
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

.foot-banner {
  margin: 20px 0 0 -10px;
}
</style>