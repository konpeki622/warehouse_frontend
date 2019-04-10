<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col>
           
        </el-col>
        <el-col>
          <el-date-picker
            v-model="year"
            type="year"
            placeholder="选择年" @click="selectByYear">
          </el-date-picker>
        </el-col>
        <el-col>年</el-col>
        <el-col>
          <el-date-picker
            v-model="month"
            type="month"
            format="M"
            placeholder="选择月" @click="selectByMonth">
          </el-date-picker>
        </el-col>
        <el-col>月</el-col>
        <el-col></el-col>
      </el-row>
      <el-row>
        <div id="chartColumn" style="width:100%; height:400px;"></div>
      </el-row>
      <el-row>
        <el-table :data="accountList" v-loading="listLoading">
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
        name: "GoodsGraph",
      data() {
          return {
            accountList: [],
            listLoading: false,
            chartColumn: null,
            year: '',
            month: '',
            season: '',
            week: '',
            day: '',
          }
      },
      methods: {
        drawColumnChart() {
          this.chartColumn = echarts.init(document.getElementById('chartColumn'));
          this.chartColumn.setOption({
            title: { text: 'Column Chart' },
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
      },
      mounted() {
          this.drawColumnChart();
      },
      updated() {
          this.drawColumnChart();
      }
    }
</script>

<style scoped>

</style>
