<template>
  <el-container>
    <el-main>
      <el-row class="header-banner">
        <el-col :span="18">
          <el-radio-group v-model="accountType" @change="handleChange" style="margin-top: 10px">
            <el-radio :label="0">
              <span style="font-size: 13px">全部</span>
            </el-radio>
            <el-radio :label="1">
              <span style="font-size: 13px">只看入库</span>
            </el-radio>
            <el-radio :label="2">
              <span style="font-size: 13px">只看出库</span>
            </el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="6" align="end">
          <el-button type="primary" @click="handleAdd" size="small" class="button-primary">更新库存</el-button>
        </el-col>
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
      <div>
        <!--新增界面-->
        <el-dialog title="更新库存信息" :visible.sync="addFormVisible" class="dialog">
          <el-form
            :model="goods"
            label-width="80px"
            ref="goods"
            class="form"
            v-loading="addLoading"
          >
            <el-form-item>
              <el-row style="padding-left: 80px">
                <el-radio v-model="goods.behavior" :label="0">
                  <span class="form-label">入库</span>
                </el-radio>
                <el-radio v-model="goods.behavior" :label="1">
                  <span class="form-label">出库</span>
                </el-radio>
              </el-row>
            </el-form-item>
            <el-form-item style="margin-top: 10px">
              <el-row :gutter="10">
                <el-col :span="4">
                  <div class="form-label">原料名</div>
                </el-col>
                <el-col :span="20">
                  <el-select v-model="goods.material_id" size="small" class="form-input" filterable>
                    <el-option
                      v-for="item in materialData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item style="margin-top: 10px">
              <el-row :gutter="5">
                <el-col :span="4">
                  <div class="form-label">产地</div>
                </el-col>
                <el-col :span="20">
                  <el-select v-model="goods.area_id" size="small" class="form-input" filterable>
                    <el-option
                      v-for="item in areaData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item style="margin-top: 10px">
              <el-row :gutter="5">
                <el-col :span="4">
                  <div class="form-label">长度(米)</div>
                </el-col>
                <el-col :span="20">
                  <el-input-number
                    v-model="goods.update_size"
                    :min="0"
                    :max="10000"
                    :step="0.5"
                    size="small"
                    class="form-input"
                  ></el-input-number>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item style="margin-top: 10px" v-if="goods.behavior === 1">
              <el-row :gutter="5">
                <el-col :span="4">
                  <div class="form-label">交易人</div>
                </el-col>
                <el-col :span="20">
                  <el-input v-model="goods.deliver_owner" size="small" class="form-input"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" align="center">
            <el-button @click.native="addFormVisible = false" size="small">取消</el-button>
            <el-button type="primary" @click="submitAdd" class="button-primary" size="small">提交</el-button>
          </div>
        </el-dialog>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "Inventory",
  data() {
    return {
      materialData: [],
      areaData: [],
      accountData: [],
      accountType: 0,
      listLoading: false,
      addLoading: false,
      printLoading: false,
      addFormVisible: false,
      currentPage: 1,
      totalCount: 0,
      goods: {
        material_id: 1,
        area_id: 1,
        update_date: "",
        goods_id: 0,
        deliver_owner: "",
        update_size: 0,
        behavior: 0,
        username: ""
      }
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
    getAccountAll: function(page) {
      this.accountData = [];
      this.listLoading = true;
      this.$http
        .get("/apis/account?page=" + page, {
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
    getAccountStore(page) {
      this.accountData = [];
      this.listLoading = true;
      this.$http
        .get("/apis/store?page=" + page, {
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
    getAccountDeliver(page) {
      this.accountData = [];
      this.listLoading = true;
      this.$http
        .get("/apis/deliver?page=" + page, {
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
    handleAdd: function() {
      this.addFormVisible = true;
    },
    submitAdd: function() {
      if (this.goods.update_size === 0) {
        this.$message({ type: "error", message: "请填写长度!" });
        return;
      }
      if (this.goods.behavior === 1 && this.goods.deliver_owner === "") {
        this.$message({ type: "error", message: "请填写交易人!" });
        return;
      }
      this.goods.username = localStorage.getItem("username");
      let t = new Date();
      this.goods.update_date = t.format("yyyy-MM-dd HH:mm:ss");
      this.addLoading = true;
      this.$http
        .post(
          "/apis/goods/update",
          {},
          {
            params: {
              material_id: this.goods.material_id,
              area_id: this.goods.area_id,
              update_date: this.goods.update_date,
              update_size: this.goods.update_size,
              behavior: this.goods.behavior,
              username: this.goods.username,
              deliver_owner: this.goods.deliver_owner
            },
            headers: {
              token: localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              this.$message({ type: "success", message: "添加成功" });
              this.addFormVisible = false;
              this.addLoading = false;
              this.goods = {
                material_id: this.materialData[0].value,
                area_id: this.areaData[0].value,
                update_date: "",
                goods_id: 0,
                deliver_owner: null,
                update_size: 0,
                behavior: 0,
                username: ""
              };
              this.currentPage = 1;
              this.getAccountAll(this.currentPage);
            } else {
              this.$message({ type: "error", message: "添加失败" });
              this.addLoading = false;
            }
          },
          response => {
            this.$message({ type: "error", message: "添加失败" });
            this.addLoading = false;
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
      switch (this.accountType) {
        case 0: {
          print.behavior = 1;
          break;
        }
        case 1: {
          print.behavior = 2;
          break;
        }
        case 2: {
          print.behavior = 3;
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
    handleChange(val) {
      switch (val) {
        case 0: {
          this.currentPage = 1;
          this.getAccountAll(this.currentPage);
          break;
        }
        case 1: {
          this.currentPage = 1;
          this.getAccountStore(this.currentPage);
          break;
        }
        case 2: {
          this.currentPage = 1;
          this.getAccountDeliver(this.currentPage);
          break;
        }
        default:
          break;
      }
      this.accountType = val;
    },
    handlePage(val) {
      switch (this.accountType) {
        case 0: {
          this.currentPage = val;
          this.getAccountAll(this.currentPage);
          break;
        }
        case 1: {
          this.currentPage = val;
          this.getAccountStore(this.currentPage);
          break;
        }
        case 2: {
          this.currentPage = val;
          this.getAccountDeliver(this.currentPage);
          break;
        }
        default:
          break;
      }
    }
  },
  created() {
    this.currentPage = 1;
    this.getAccountAll(this.currentPage);
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

.table-text {
  font-size: 13px;
  letter-spacing: 0.8px;
  padding: 5px 0 5px 0;
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

.dialog {
  width: 70%;
  margin: 0 auto;
}

.dialog .form {
  width: 100%;
  margin: 0 auto;
}

.dialog .form .form-label {
  font-size: 13px;
}

.dialog .form .form-input {
  width: 200px;
}

.dialog .dialog-footer {
  margin: 0 0 20px -10px;
}
</style>
