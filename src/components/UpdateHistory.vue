<template>
  <el-container>
    <el-main>
      <el-row>
        <!-- 根据用户名 日期 操作筛选 -->
      </el-row>
      <el-row>
        <el-table :data="updateData" v-loading="updateLoading" :default-sort = "{prop: 'updateTime', order: 'descending'}">
          <el-table-column label="日期" align="center" sortable>
            <template slot-scope="scope">
              {{scope.row.updateTime}}
            </template>
          </el-table-column>
          <el-table-column label="用户名" align="center">
            <template slot-scope="scope">
              {{scope.row.updateUser}}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              {{scope.row.updateDetail}}
            </template>
          </el-table-column>
          <el-table-column label="单号" align="center">
            <template slot-scope="scope">
              {{scope.row.updateID}}
            </template>
          </el-table-column>
        </el-table>
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
            updateLoading: false
          }
      },
      methods: {
          getUpdateData() {
            this.updateData.push({
              updateTime: '2019-04-04',
              updateUser: 'maomao381',
              updateDetail: '添加入库信息',
              updateID: 1
            })
          }
      },
      mounted() {
          this.getUpdateData();
      }
    }
</script>

<style scoped>

</style>
