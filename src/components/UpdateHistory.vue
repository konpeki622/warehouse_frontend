<template>
  <el-container>
    <el-main>
      <el-row>
        <!-- 根据用户名 日期 操作筛选 -->
      </el-row>
      <el-row>
        <el-table :data="updateData" v-loading="updateLoading" :default-sort = "{prop: 'update_date', order: 'descending'}">
          <el-table-column label="日期" align="center" sortable>
            <template slot-scope="scope">
              {{scope.row.update_date}}
            </template>
          </el-table-column>
          <el-table-column label="用户名" align="center">
            <template slot-scope="scope">
              {{scope.row.username}}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.behavior === 0">
                添加入库信息
              </div>
              <div v-if="scope.row.behavior === 1">
                添加出库信息
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单号" align="center">
            <template slot-scope="scope">
              {{scope.row.goods_id}}
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
          getUpdateData: function () {
              this.updateData = [];
                this.updateLoading = true;
                this.$http.get('/apis/account', {headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem("token")
                  }}).then(response => {
                    if (response.status === 200) {
                        let accountList = JSON.parse(response.bodyText);
                        let i = 0;
                        while (i < accountList.data.length) {
                            this.updateData.push({
                                id: accountList.data[i].id,
                                update_date: accountList.data[i].update_date,
                                username: accountList.data[i].username,
                                behavior: accountList.data[i].behavior,
                                goods_id: accountList.data[i].goods_id
                            });
                            i++;
                        }
                        this.updateLoading = false;
                    }
                    else {
                        this.$message({type: 'error', message: '加载失败!'});
                        this.updateLoading = false;
                    }
                }, response => {
                    this.$message({type: 'error', message: '加载失败!'});
                    this.updateLoading = false;
                });
            },
      },
      mounted() {
        this.getUpdateData();
      }
    }
</script>

<style scoped>

</style>
