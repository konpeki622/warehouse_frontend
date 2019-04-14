<template>
  <el-container>
    <el-main>
      <el-row>
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="keywords" placeholder="输入关键字"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchType">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getStockData">
              <i class="el-icon-search" style="margin-right: 5px"></i>查找
            </el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-table :data="stockData" v-loading="listLoading" style="width: 100%">
          <el-table-column label="编号" width="100" align="center">
            <template slot-scope="scope">{{scope.row.id}}</template>
          </el-table-column>
          <el-table-column label="原料名" align="center">
            <template slot-scope="scope">{{scope.row.material_name}}</template>
          </el-table-column>
          <el-table-column label="产地" align="center">
            <template slot-scope="scope">{{scope.row.area_name}}</template>
          </el-table-column>
          <el-table-column label="数量" width="150" align="center">
            <template slot-scope="scope">{{scope.row.material_size}}</template>
          </el-table-column>
          <el-table-column label="实际库存" width="150" align="center">
            <template slot-scope="scope">
              <el-input v-model="realStock[scope.$index]" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="比对结果" width="150" align="center">
            <template slot-scope="scope">
              <span v-if="onlineStock[scope.$index]-Number(realStock[scope.$index]) > 0">+</span>
              {{onlineStock[scope.$index]-Number(realStock[scope.$index])}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300" align="center">
            <template slot-scope="scope">
              <el-button size="small" @click="handleAdd(scope.$index)">库存更新</el-button>
              <el-button size="small" @click="toInventory(scope.row.id)">更新记录</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top: 15px">
        <el-col :span="24" align="end">
          <el-button @click="handlePrint" v-loading="printLoading">打印</el-button>
        </el-col>
      </el-row>
      <div>
        <!--新增界面-->
        <el-dialog title="新增入库信息" :visible.sync="addFormVisible" v-loading="addLoading" style="width: 70%; margin: 0 auto">
          <el-form :model="goods" label-width="80px" ref="goods" style="width: 80%; margin: 0 auto">
            <el-form-item label>
              <el-radio v-model="goods.behavior" :label="0">入库</el-radio>
              <el-radio v-model="goods.behavior" :label="1">出库</el-radio>
            </el-form-item>
            <el-form-item label="原料名" style="width: 70%">
              <el-input v-model="material_name" disabled></el-input>
            </el-form-item>
            <el-form-item label="产地" style="width: 70%">
              <el-input v-model="area_name" disabled></el-input>
            </el-form-item>
            <el-form-item label="数量">
              <el-input-number v-model="goods.update_size" :min="0" :max="10000"></el-input-number>
            </el-form-item>
            <el-form-item label="交易人" v-if="goods.behavior === 1" style="width: 70%">
              <el-input v-model="goods.deliver_owner"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="cancelAdd">取消</el-button>
            <el-button type="primary" @click="submitAdd" v-loading="addLoading">提交</el-button>
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
      onlineStock: [],
      realStock: [],
      area_name: "",
      material_name: "",
      materialData: [],
      listLoading: false,
      addLoading: false,
      printLoading: false,
      keywords: "",
      searchType: "1",
      addFormVisible: false
    };
  },
  methods: {
    getStockData() {
      this.stockData = [];
      this.onlineStock = [];
      this.realStock = [];
      let url = "";
      if (this.keywords === "") {
        url = "/apis/goods";
      } else {
        let arr = this.keywords.split(" ");
        url = "/apis/goods?type=" + this.searchType;
        for (let i in arr) {
          url += "&keywords=" + arr[i];
        }
      }
      this.$http
        .get(url, {
          headers: {
            "Content-Type": "application/json",
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
                material_size: goodsList.data[i].material_size
              });
              this.onlineStock.push(goodsList.data[i].material_size);
              this.realStock.push("");
              i++;
            }
            this.listLoading = false;
          } else {
            this.listLoading = false;
            this.$message({ type: "error", message: "加载失败!" });
          }
        });
    },
    handleAdd(index) {
      this.addFormVisible = true;
      this.material_name = this.stockData[index].material_name;
      this.area_name = this.stockData[index].area_name;
      this.goods.goods_id = this.stockData[index].id;
    },
    cancelAdd() {
      this.addFormVisible = false;
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
    },
    submitAdd() {
      if (this.goods.update_size === 0) {
        this.$message({ type: "error", message: "请选择数量!" });
        return;
      }
      if (this.goods.behavior === 1 && this.goods.deliver_owner === "") {
        this.$message({ type: "error", message: "请填写交易人!" });
        return;
      }
      this.goods.username = localStorage.getItem("username");
      let t = new Date();
      this.goods.update_date = t.format("yyyy-MM-dd HH:mm:ss");
      let url =
        "/apis/goods/update?goods_id=" +
        this.goods.goods_id +
        "&update_date=" +
        this.goods.update_date +
        "&update_size=" +
        this.goods.update_size +
        "&behavior=" +
        this.goods.behavior +
        "&username=" +
        this.goods.username;
      if (this.goods.behavior === 1)
        url += "&deliver_owner=" + this.goods.deliver_owner;
      this.addLoading = true;
      this.$http
        .post(url, {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token")
          }
        })
        .then(
          response => {
            if (response.status === 200) {
              this.$message({ type: "success", message: "添加成功!" });
              this.addLoading = false;
              this.addFormVisible = false;
              this.getStockData();
            } else {
              this.$message({ type: "error", message: "添加失败!" });
              this.addLoading = false;
            }
          },
          response => {
            this.$message({ type: "error", message: "添加失败!" });
            this.addLoading = false;
          }
        );
    },
    toInventory(id) {
      this.$router.push({
        path: "/manager/goodsInventory",
        query: {
          id: id
        }
      });
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
    },
    handleChange(stock) {
      this.onlineStock = stock;
    }
  },
  mounted() {
    this.getStockData();
  }
};
</script>

<style scoped>
</style>
