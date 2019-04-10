<template>
    <el-container>
      <el-main>
        <el-row>
          <!-- 根据用户名 日期 操作筛选 -->
        </el-row>
        <el-row>
          <el-table :data="printData" v-loading="printLoading">
            <el-table-column label="日期" align="center">
              <template slot-scope="scope">
                {{scope.row.printTime}}
              </template>
            </el-table-column>
            <el-table-column label="用户名" align="center">
              <template slot-scope="scope">
                {{scope.row.printUser}}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                {{scope.row.printDetail}}
              </template>
            </el-table-column>
            <el-table-column label="单号" align="center">
              <template slot-scope="scope">
                {{scope.row.printID}}
              </template>
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
            printLoading: false
          }
      },
      methods: {
          getPrintData() {
            this.printData.push({
              printTime: '2019-02-05',
              printUser: 'maomao381',
              printDetail: '打印入库信息',
              printID: 2
            })
          }
      },
      mounted() {
          this.getPrintData();
      }
    }
</script>

<style scoped>

</style>
