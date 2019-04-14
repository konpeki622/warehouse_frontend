<template>
  <el-container>
    <el-main>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-select v-model="searchType" placeholder="请选择" @change="handleSearch">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4" v-if="Number(searchType) < 3">
          <span>
            <el-date-picker
              v-model="year"
              type="year"
              style="width: 150px;"
              placeholder="选择年"
              @change="handleSearchByYear"
            ></el-date-picker>
          </span>
          <span style="margin-left: 5px">年</span>
        </el-col>
        <el-col :span="4" v-if="searchType === '1'">
          <el-select v-model="season" placeholder="请选择" @change="handleSearchBySeason">
            <el-option
              v-for="item in seasonOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4" v-if="searchType === '2'">
          <span>
            <el-date-picker
              v-model="month"
              type="month"
              format="M"
              style="width: 150px;"
              placeholder="选择月"
              @change="handleSearchByMonth"
            ></el-date-picker>
          </span>
          <span style="margin-left: 5px">月</span>
        </el-col>
        <el-col></el-col>
      </el-row>
      <el-row style="margin-top: 50px;">
        <div id="chartColumn" style="width:100%; height:400px;" v-if="searchType === '0'"></div>
      </el-row>
      <el-row>
        <el-table :data="accountData" v-loading="listLoading" style="width: 100%">
          <el-table-column label="单号" align="center" width="80">
            <template slot-scope="scope">{{scope.row.id}}</template>
          </el-table-column>
          <el-table-column label="日期" align="center" width="180">
            <template slot-scope="scope">{{scope.row.update_date}}</template>
          </el-table-column>
          <el-table-column label="原料名" align="center" width="180">
            <template slot-scope="scope">{{scope.row.material_name}}</template>
          </el-table-column>
          <el-table-column label="产地" align="center" width="180">
            <template slot-scope="scope">{{scope.row.area_name}}</template>
          </el-table-column>
          <el-table-column label="数量" align="center" width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.behavior === 0">+{{scope.row.update_size}}</div>
              <div v-else>-{{scope.row.update_size}}</div>
            </template>
          </el-table-column>
          <el-table-column label="交易人" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.behavior === 1">{{scope.row.deliver_owner}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top: 15px">
        <el-col :span="24" align="end">
          <el-button @click="handlePrint" v-loading="printLoading">打印</el-button>
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
      searchType: "6",
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
          value: "6",
          label: "全部"
        },
        {
          value: "0",
          label: "按年份"
        },
        {
          value: "1",
          label: "按季度"
        },
        {
          value: "2",
          label: "按月份"
        },
        {
          value: "3",
          label: "近7天"
        },
        {
          value: "4",
          label: "昨天"
        },
        {
          value: "5",
          label: "今天"
        }
      ]
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
                show: true,
                position: "inside"
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
                show: true,
                position: "left"
              }
            },
            data: deliverData
          }
        ]
      });
    },
    getAccountAll: function() {
      this.accountData = [];
      this.listLoading = true;
      this.$http
        .get("/apis/account?type=1&" + "goodsId=" + this.$route.query.id, {
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
      switch (val) {
        case "0": {
          this.handleSearchByYear();
          break;
        }
        case "1": {
          this.handleSearchBySeason();
          break;
        }
        case "2": {
          this.handleSearchByMonth();
          break;
        }
        case "3": {
          // 近七天
          this.searchByWeek(this.$route.query.id);
          break;
        }
        case "4": {
          //昨天
          this.searchYesterday(this.$route.query.id);
          break;
        }
        case "5": {
          // 今天
          this.searchToday(this.$route.query.id);
          break;
        }
        case "6": {
          this.getAccountAll();
          break;
        }
        default:
          break;
      }
    },
    handleSearchByYear() {
      if (this.searchType === "0") {
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
              interval,
            {
              headers: {
                "Content-Type": "application/json",
                token: localStorage.getItem("token")
              }
            }
          )
          .then(
            response => {
              if (response.status === 200) {
                let storeData = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                let deliverData = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                let subData = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                let accountList = JSON.parse(response.bodyText);
                let i = 0;
                let j = 11;
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
    handleSearchBySeason() {
      this.accountData = [];
      this.listLoading = true;
      let today = new Date();
      let intervalYear =
        Number(today.getFullYear()) - Number(this.year.getFullYear());
      let intervalSeason = Number(today.getMonth()) / 3 - this.season;
      let interval = intervalYear * 4 + intervalSeason;
      this.$http
        .get(
          "/apis/account/graph?type=4&goodsId=" +
            this.$route.query.id +
            "&condition=" +
            interval,
          {
            headers: {
              "Content-Type": "application/json",
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
    handleSearchByMonth() {
      this.accountData = [];
      this.listLoading = true;
      let today = new Date();
      let interval = Number(today.getMonth()) - Number(this.month.getMonth());
      this.$http
        .get(
          "/apis/account/graph?type=3&goodsId=" +
            this.$route.query.id +
            "&condition=" +
            interval,
          {
            headers: {
              "Content-Type": "application/json",
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
    searchByWeek(id) {
      this.accountData = [];
      this.listLoading = true;
      this.$http
        .get("/apis/account/graph?type=2&goods_id=" + id, {
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
    searchYesterday(id) {
      this.accountData = [];
      this.listLoading = true;
      this.$http
        .get("/apis/account/graph?type=1&goods_id=" + id, {
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
    searchToday(id) {
      this.accountData = [];
      this.listLoading = true;
      this.$http
        .get("/apis/account/graph?type=0&goods_id=" + id, {
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
        case "0": {
          print.behavior = 4;
          break;
        }
        case "1": {
          print.behavior = 5;
          break;
        }
        case "2": {
          print.behavior = 6;
          break;
        }
        case "3": {
          print.behavior = 7;
          break;
        }
        case "4": {
          print.behavior = 8;
          break;
        }
        case "5": {
          print.behavior = 8;
          break;
        }
        case "6": {
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
            "Content-Type": "application/json",
            token: localStorage.getItem("token")
          }
        })
        .then(
          response => {
            if (response.status === 200) {
              this.$message({ type: "success", message: "打印成功!" });
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
    this.getAccountAll();
  }
};
</script>

<style scoped>
</style>
