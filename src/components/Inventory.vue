<template>
  <el-container>
    <el-main>
      <el-row>
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="keywords" placeholder="输入关键字"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询信息</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">添加信息</el-button>
          </el-form-item>
        </el-form>
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
      <div>
        <!--新增界面-->
        <el-dialog title="新增信息" :visible.sync="addFormVisible" v-loading="addLoading">
          <el-form :model="goods" label-width="80px" ref="goods">
            <el-form-item label="">
              <el-radio v-model="goods.behavior" :label="0">入库</el-radio>
              <el-radio v-model="goods.behavior" :label="1">出库</el-radio>
            </el-form-item>
            <el-form-item label="原料名">
              <el-select v-model="goods.material_id">
                <el-option
                  v-for="item in materialData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产地">
              <el-select v-model="goods.area_id">
                <el-option
                  v-for="item in areaData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数量">
              <el-input-number v-model="goods.update_size" :min="0" :max="1000"></el-input-number>
            </el-form-item>
            <el-form-item label="交易人" v-if="goods.behavior === 1">
              <el-input v-model="goods.deliver_owner"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click="submitAdd">提交</el-button>
          </div>
        </el-dialog>
      </div>
    </el-main>
  </el-container>
</template>

<script>
    export default {
        name: "Inventory",
        data () {
            return {
                materialData: [],
                areaData: [],
                accountData: [],
                listLoading: false,
                addLoading: false,
                keywords: '',
                addFormVisible: false,
                goods: {
                  material_id: 1,
                  area_id: 1,
                  update_date: '',
                  goods_id: 0,
                  deliver_owner: '',
                  update_size: 0,
                  behavior: 0,
                  username: ''
                },
            };
        },
        methods: {
            getMaterialData: function () {
                this.$http.get('/apis/material?keywords=', {headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem("token")
                  }}).then(response => {
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
                    }
                    else {
                        this.$message({type: 'error', message: '加载失败!'});
                    }
                }, response => {
                    this.$message({type: 'error', message: '加载失败!'});
                });
            },
            getAreaData: function () {
                this.$http.get('/apis/area', {headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem("token")
                  }}).then(response => {
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
                    }
                    else {
                        this.$message({type: 'error', message: '加载失败!'});
                    }
                });
            },
            getAccountAll: function () {
                this.accountData = [];
                this.listLoading = true;
                this.$http.get('/apis/account', {headers: {
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
            handleAdd: function () {
                this.addFormVisible = true;
            },
            submitAdd: function () {
              if (this.goods.update_size === 0) {
                this.$message({type: 'error', message: '请选择数量!'});
                return;
              }
              if (this.goods.behavior === 1 && this.goods.deliver_owner === '') {
                this.$message({type: 'error', message: '请填写交易人!'});
                return;
              }
              this.goods.username = localStorage.getItem('username');
              let t = new Date();
              this.goods.update_date = t.format('yyyy-MM-dd HH:mm:ss');
              for (let key in this.goods) {
                alert(key);
                alert(this.goods[key]);
              }
                //TODO: 写入后台
                /*
                this.addLoading = true;
                this.$http.post('/apis/store/add', this.goods).then(response => {
                    if (response.status === 200) {
                        this.$message({type: 'success', message: '信息添加完成'});
                        this.addLoading = false;
                    }
                    else {
                        this.$message({type: 'error', message: '请重试'});
                        this.addLoading = false;
                    }
                }, response => {
                    this.$message({type: 'error', message: '请重试'});
                    this.addLoading = false;
                }).catch((response) => {
                    this.$message({type: 'error', message: '请重试'});
                    this.addLoading = false;
                });*/
            },
        },
        created() {
            this.getAccountAll();
            this.getMaterialData();
            this.getAreaData();
        }
    }
</script>

<style scoped>

</style>
