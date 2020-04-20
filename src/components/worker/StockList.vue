<template>
  <el-container>
    <el-main>
      <el-row class="search-banner">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="keyText" placeholder="输入关键字" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchType" size="small" style="width: 100px">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch" size="small" class="button-primary">
              <i class="el-icon-search" style="margin-right: 5px"></i>查找
            </el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-table id="table-content" :data="stockData" v-loading="listLoading" style="width: 100%">
          <el-table-column label="编号" width="100" align="center">
            <template slot-scope="scope">
              <div class="table-text">{{scope.row.id}}</div>
            </template>
          </el-table-column>
          <el-table-column label="原料名" align="center">
            <template slot-scope="scope">
              <div class="table-text">{{scope.row.material_name}}</div>
            </template>
          </el-table-column>
          <el-table-column label="产地" align="center">
            <template slot-scope="scope">
              <div class="table-text">{{scope.row.area_name}}</div>
            </template>
          </el-table-column>
          <el-table-column label="库存余量(米)" width="150" align="center">
            <template slot-scope="scope">
              <div class="table-text">
                <div>{{scope.row.material_size}}</div>
                <div style="font-size: 7px; color: #bababa">{{scope.row.material_date}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="盘点余量(米)" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.inventory_size === null">-</div>
              <div v-else class="table-text">
                <div>{{scope.row.inventory_size}}</div>
                <div style="font-size: 7px; color: #bababa">{{scope.row.inventory_date}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="误差(米)" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.inventory_size === null">-</div>
              <div v-else>
                <div v-if="scope.row.inventory_size - scope.row.material_size > 0">
                  <span
                    class="result-more"
                  >+{{toFourDecimal(Number(scope.row.inventory_size - scope.row.material_size))}}</span>
                  <!-- <span>
                    <el-button type="text" @click="alterStock(scope.$index)" class="button-text">修正</el-button>
                  </span>-->
                </div>
                <div v-else-if="scope.row.inventory_size - scope.row.material_size === 0">
                  <i class="el-icon-success"></i>
                </div>
                <div v-else>
                  <span
                    class="result-less"
                  >{{toFourDecimal(Number(scope.row.inventory_size - scope.row.material_size))}}</span>
                  <!-- <span>
                    <el-button type="text" @click="alterStock(scope.$index)" class="button-text">修正</el-button>
                  </span>-->
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="handleAdd(scope.$index, 0)"
                class="button-plain"
                round
              >进货</el-button>
              <el-button
                size="small"
                @click="handleQuery(scope.row.id, scope.$index)"
                class="button-plain"
                round
              >查看位置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row class="foot-banner">
        <el-col :span="16" align="start">
          <el-pagination
            background
            class="pagination"
            layout="prev, pager, next"
            :current-page.sync="currentPage"
            @current-change="handlePage"
            :total="totalCount"
          ></el-pagination>
        </el-col>
        <!-- <el-col :span="8" align="end">
          <el-button
            @click="handlePrint"
            :loading="printLoading"
            size="small"
            type="primary"
            class="button-primary"
          >打印本页</el-button>
        </el-col> -->
      </el-row>
      <el-dialog title="库存位置" :visible.sync="positionVisible" class="dialog">
        <el-row>
          <el-table :data="placeList" style="width: 100%">
            <el-table-column label="位置" align="center">
              <template slot-scope="scope">
                <div class="table-text">{{scope.row.space_name}}</div>
              </template>
            </el-table-column>
            <el-table-column label="余量(米)" align="center">
              <template slot-scope="scope">
                <div class="table-text">{{scope.row.occupy}}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  @click="handleAdd(goodsIndex, 1, scope.row.place, scope.row.occupy)"
                  class="button-plain"
                  round
                >出库</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button @click="positionVisible = false" size="small">确认</el-button>
        </div>
      </el-dialog>
      <div>
        <!--新增界面-->
        <el-dialog title="填写订单" :visible.sync="addFormVisible" class="dialog" @close="cancelAdd">
          <el-form
            :model="goods"
            label-width="80px"
            ref="goods"
            class="form"
            v-loading="addLoading"
          >
            <el-form-item style="margin-top: 10px">
              <el-row :gutter="10">
                <el-col :span="4">
                  <div class="form-label">原料名</div>
                </el-col>
                <el-col :span="20">
                  <el-input v-model="material_name" disabled size="small" class="form-input"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item style="margin-top: 10px">
              <el-row :gutter="5">
                <el-col :span="4">
                  <div class="form-label">产地</div>
                </el-col>
                <el-col :span="20">
                  <el-input v-model="area_name" disabled size="small" class="form-input"></el-input>
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
                    :max="maxOccupy"
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
                  <div class="form-label">收件人</div>
                </el-col>
                <el-col :span="20">
                  <el-input class="form-input" v-model="goods.deliver_owner" size="small"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <!-- <el-form-item style="margin-top: 10px">
              <el-row :gutter="5">
                <el-col :span="4">
                  <div class="form-label">到货日期</div>
                </el-col>
                <el-col :span="20">
                  <el-input
                    v-model="goods.date"
                    size="small"
                  ></el-input>
                </el-col>
              </el-row>
            </el-form-item>-->
          </el-form>
          <div slot="footer" class="dialog-footer" align="center">
            <el-button @click="cancelAdd" size="small">取消</el-button>
            <el-button type="primary" @click="submitAdd" class="button-primary" size="small">提交</el-button>
          </div>
        </el-dialog>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "StockList",
  data() {
    return {
      stockData: [],
      goods: {
        material_id: 0,
        area_id: 0,
        update_date: "",
        goods_id: 0,
        deliver_owner: "",
        update_size: 0,
        behavior: 0,
        username: ""
      },
      typeOptions: [
        {
          value: "1",
          label: "按全部"
        },
        {
          value: "2",
          label: "按材料"
        },
        {
          value: "3",
          label: "按地区"
        }
      ],
      area_name: "",
      material_name: "",
      materialData: [],
      totalCount: 0,
      listLoading: false,
      addLoading: false,
      printLoading: false,
      keywords: "",
      keyText: "",
      searchType: "1",
      addFormVisible: false,
      currentPage: 1,
      positionVisible: false,
      placeList: [],
      placeId: 0,
      goodsIndex: 0,
      goodsId: 0,
      maxOccupy: 10000
    };
  },
  methods: {
    getStockData(page) {
      this.stockData = [];
      let url = "";
      if (this.keywords === "") {
        url = "/apis/goods?page=" + page;
      } else {
        let arr = this.keywords.split(" ");
        url = "/apis/goods?type=" + this.searchType;
        for (let i in arr) {
          url += "&keywords=" + arr[i];
        }
        url += "&page=" + page;
      }
      this.$http
        .get(url, {
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(response => {
          this.listLoading = true;
          if (response.status === 200) {
            let goodsList = JSON.parse(response.bodyText);
            let i = 0;
            while (i < goodsList.data.length) {
              this.stockData.push({
                id: goodsList.data[i].id,
                material_id: goodsList.data[i].material_id,
                area_id: goodsList.data[i].area_id,
                material_name: goodsList.data[i].material_name,
                area_name: goodsList.data[i].area_name,
                material_size: goodsList.data[i].material_size,
                inventory_size: goodsList.data[i].inventory_size,
                material_date: goodsList.data[i].material_date,
                inventory_date: goodsList.data[i].inventory_date
              });
              i++;
            }
            this.totalCount = goodsList.count;
            this.listLoading = false;
          } else {
            this.listLoading = false;
            this.$message({ type: "error", message: "加载失败!" });
          }
        });
    },
    handleSearch() {
      this.currentPage = 1;
      this.keywords = this.keyText;
      this.getStockData(this.currentPage);
    },
    handleQuery(id, index) {
      this.placeList = [];
      this.goodsIndex = index;
      this.$http
        .get("/apis/goods/query?goodsId=" + id, {
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(response => {
          let data = JSON.parse(response.bodyText);
          if (response.status === 200) {
            this.positionVisible = true;
            this.placeList = data.data;
          } else {
            this.$message({ type: "error", message: "加载失败!" });
          }
        });
    },
    alterStock(index) {
      this.$confirm(
        "确认修正库存编号[" + this.stockData[index].id + "]吗?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.listLoading = true;
          let t = new Date();
          this.$http
            .post(
              "/apis/goods/alter",
              {},
              {
                params: {
                  goodsId: this.stockData[index].id,
                  update_date: t.format("yyyy-MM-dd HH:mm:ss")
                },
                headers: {
                  token: localStorage.getItem("token")
                }
              }
            )
            .then(
              response => {
                if (response.status === 200) {
                  this.$message({ type: "success", message: "修正成功!" });
                  this.listLoading = false;
                  this.getStockData(this.currentPage);
                } else {
                  this.$message({ type: "error", message: "修正失败!" });
                  this.listLoading = false;
                }
              },
              response => {
                this.$message({ type: "error", message: "修正失败!" });
                this.listLoading = false;
              }
            );
        })
        .catch(error => {
          this.$message({
            type: "info",
            message: "已取消修正"
          });
        });
    },
    handleAdd(index, behavior, place, occupy) {
      this.addFormVisible = true;
      this.maxOccupy = 10000;
      this.material_name = this.stockData[index].material_name;
      this.area_name = this.stockData[index].area_name;
      this.goods.goods_id = this.stockData[index].id;
      this.goods.material_size = this.stockData[index].material_size;
      this.goods.behavior = behavior;
      if (place) {
        this.placeId = place;
        this.maxOccupy = occupy;
      }
    },
    cancelAdd() {
      this.addFormVisible = false;
      this.goods = {
        material_id: 0,
        area_id: 0,
        update_date: "",
        goods_id: 0,
        deliver_owner: "",
        update_size: 0,
        behavior: 0,
        username: ""
      };
    },
    submitAdd() {
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
      let arg = {
        goods_id: this.goods.goods_id,
        update_date: this.goods.update_date,
        update_size: this.goods.update_size,
        behavior: this.goods.behavior,
        username: this.goods.username,
        deliver_owner: this.goods.deliver_owner
      };
      if (this.goods.behavior === 1) {
        arg.place = this.placeId;
      }
      this.addLoading = true;
      this.$http
        .post(
          "/apis/goods/update",
          {},
          {
            params: arg,
            headers: {
              token: localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              this.$message({ type: "success", message: "处理成功!" });
              this.addLoading = false;
              this.addFormVisible = false;
              this.goodsId = this.goods.goods_id;
              if (this.goods.behavior === 1) {
                this.submitDeliver();
              }
              this.goods = {
                material_id: 0,
                area_id: 0,
                update_date: "",
                goods_id: 0,
                deliver_owner: null,
                update_size: 0,
                behavior: 0,
                username: ""
              };
              this.currentPage = 1;
              this.getStockData(this.currentPage);
            } else {
              this.$message({ type: "error", message: "处理失败!" });
              this.addLoading = false;
            }
          },
          response => {
            this.$message({ type: "error", message: "处理失败!" });
            this.addLoading = false;
          }
        );
    },
    submitDeliver() {
      this.$http
        .post(
          "/apis/goods/place",
          {},
          {
            params: {
              goods_id: this.goods.goods_id,
              update_size: this.goods.update_size,
              behavior: this.goods.behavior,
              place: this.placeId
            },
            headers: {
              token: localStorage.getItem("token")
            }
          }
        )
        .then(
          response => {
            if (response.status === 200) {
              this.$message({ type: "success", message: "处理成功" });
              this.handleQuery(this.goodsId);
            } else {
              that.$message({ type: "error", message: "处理失败" });
            }
          },
          response => {
            that.$message({ type: "error", message: "处理失败" });
            that.addLoading = false;
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
    handlePage(val) {
      this.currentPage = val;
      this.getStockData(this.currentPage);
    },
    toFourDecimal(num) {
      let str = num.toString();
      let dotIndex = str.indexOf(".");
      if (dotIndex === -1 || dotIndex + 6 > str.length) {
        return num;
      }
      return num.toFixed(2);
    }
  },
  mounted() {
    this.currentPage = 1;
    this.getStockData(this.currentPage);
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
.search-banner {
  border-top: 1px solid #eceef0;
  border-bottom: 1px solid #eceef0;
  padding-top: 10px;
  padding-left: 5px;
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
