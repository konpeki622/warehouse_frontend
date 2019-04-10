<template>
  <el-container>
    <el-main>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-select v-model="searchType" placeholder="请选择">
             <el-option
              v-for="item in typeOptions" 
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" v-if="Number(searchType) < 3">
          <span>
            <el-date-picker
            v-model="year"
            type="year"
            style="width: 150px;"
            placeholder="选择年" @change="selectByYear">
            </el-date-picker>
          </span>
          <span style="margin-left: 5px">年</span>
        </el-col>
        <el-col :span="4" v-if="searchType === '1'">
          <el-select v-model="season" placeholder="请选择">
             <el-option
              v-for="item in seasonOptions" 
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" v-if="searchType === '2'">
          <span>
            <el-date-picker
            v-model="month"
            type="month"
            format="M"
            style="width: 150px;"
            placeholder="选择月" @change="selectByMonth">
            </el-date-picker>
          </span>
          <span style="margin-left: 5px">月</span>
        </el-col>
        <el-col></el-col>
      </el-row>
      <el-row style="margin-top: 50px;">
        <div id="chartColumn" style="width:100%; height:400px;"></div>
      </el-row>
      <el-row>
        <el-table
          :data="accountData"
          v-loading="listLoading"
          style="width: 100%">
          <el-table-column
            label="单号"
            align="center"
            width="80">
            <template slot-scope="scope">
              {{scope.row.id}}
            </template>
          </el-table-column>
          <el-table-column
            label="日期"
            align="center"
            width="180">
            <template slot-scope="scope">
              {{scope.row.update_date}}
            </template>
          </el-table-column>
          <el-table-column
            label="原料名"
            align="center"
            width="180">
            <template slot-scope="scope">
              {{scope.row.material_name}}
            </template>
          </el-table-column>
          <el-table-column
            label="产地"
            align="center"
            width="180">
            <template slot-scope="scope">
              {{scope.row.area_name}}
            </template>
          </el-table-column>
          <el-table-column
            label="数量"
            align="center"
            width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.behavior === 0">
                +{{scope.row.update_size}}
              </div>
              <div v-else>
                -{{scope.row.update_size}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="交易人"
            align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.behavior === 1">
                {{scope.row.deliver_owner}}
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import echarts from 'echarts'
  export default {
      name: "GoodsInventory",
      data() {
        return {
          accountData: [],
          listLoading: false,
          year: Date(),
          month: Date(),
          season: '',
          week: '',
          day: '',
          season: '0',
          searchType: '0',
          seasonOptions: [
            {
              value: '0',
              label: '第一季度'
            },
            {
              value: '1',
              label: '第二季度'
            },
            {
              value: '2',
              label: '第三季度'
            },
            {
              value: '3',
              label: '第四季度'
            }
          ],
          typeOptions: [
            {
              value: '0',
              label: '按年份'
            },
            {
              value: '1',
              label: '按季度'
            },
            {
              value: '2',
              label: '按月份'
            },
            {
              value: '3',
              label: '近7天'
            },
            {
              value: '4',
              label: '昨天'
            },
            {
              value: '5',
              label: '今天'
            }
          ]
        }
      },
        methods: {
            getAccount: function (id) {
                this.accountData = [];
                this.listLoading = true;
                this.$http.get('/apis/account?type=1&goodsId=' + id, {headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem("token")
                  }}).then(response => {
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
                    }
                    else {
                        this.$message({type: 'error', message: '加载失败!'});
                        this.listLoading = false;
                    }
                }, response => {
                    this.$message({type: 'error', message: '加载失败!'});
                    this.listLoading = false;
                });
            },
          drawColumnChart() {
            this.chartColumn = echarts.init(document.getElementById('chartColumn'));
            let x = [];
            let data = [];
            for (let i = 0;i < this.accountData.length;i++) {
              x.push(i+1);
              data.push(this.accountData[i].update_size)
            }
            this.chartColumn.setOption({
              title: { text: 'Column Chart' },
              dataZoom: [
                {
                  type: 'slider',
                  show: true,
                  yAxisIndex: [0],
                  left: '97%',
                  start: 0, //数据窗口范围的起始百分比
                  end: 36
                },
              ],
              tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                  type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              legend: {
                data:['总量', '出库', '入库']
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis : [
                {
                  type : 'value'
                }
              ],
              yAxis : [
                {
                  type : 'category',
                  axisTick : {show: false},
                  data : ['周一','周二','周三','周四','周五','周六','周日']
                }
              ],
              series : [
                {
                  name:'总量',
                  type:'bar',
                  label: {
                    normal: {
                      show: true,
                      position: 'inside'
                    }
                  },
                  data:[200, 170, 240, 244, 200, 220, 210]
                },
                {
                  name:'入库',
                  type:'bar',
                  stack: '总量',
                  label: {
                    normal: {
                      show: true
                    }
                  },
                  data:[320, 302, 341, 374, 390, 450, 420]
                },
                {
                  name:'出库',
                  type:'bar',
                  stack: '总量',
                  label: {
                    normal: {
                      show: true,
                      position: 'left'
                    }
                  },
                  data:[-120, -132, -101, -134, -190, -230, -210]
                }
              ],
            });
          },
          selectByYear(val) {
            alert(this.year.getFullYear())
          },
          selectByMonth(val) {
            alert(this.month.getMonth())
          }
        },
        created() {
          this.getAccount(this.$route.query.id);
          this.drawColumnChart();
        },
    updated() {
      this.drawColumnChart();
    }
  }
</script>

<style scoped>

</style>
