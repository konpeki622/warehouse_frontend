<template>
  <el-container>
    <el-main>
      <el-row class="header-banner">
        <el-radio-group v-model="floor" size="small" @change="getShelveInfo">
          <el-radio-button v-for="fIndex in 5" :key="fIndex" :label="fIndex">F{{fIndex}}</el-radio-button>
        </el-radio-group>
      </el-row>
      <el-row v-loading="listLoading" style="margin-top: 20px">
        <div class="content">
          <div v-for="(item, index) in shelveData" :key="index">
            <div class="content-box">
              <div class="box" @click="queryShelveInfo(item.id)">
                <div class="box-back"></div>
                <div class="box-inner" :style="{'height' : item.perc + '%', 'background-color' : item.perc > 75? '#ff947a' : '#83ff98'}"></div>
                <div class="box-inner-text" align="center">{{item.space_name}}</div>
              </div>
            </div>
          </div>
        </div>
      </el-row>
      <el-dialog title="库存信息" :visible.sync="positionVisible" class="dialog">
        <el-row>
          <el-table :data="placeList" style="width: 100%">
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
            <el-table-column label="余量(米)" align="center">
              <template slot-scope="scope">
                <div class="table-text">{{scope.row.occupy}}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button @click="positionVisible = false" size="small">确认</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "Inventory",
  data() {
    return {
      shelveData: [],
      floor: 1,
      listLoading: false,
      positionVisible: false,
      placeList: []
    };
  },
  methods: {
    getShelveInfo() {
      this.listLoading = true;
      this.$http
        .get("/apis/shelve/get?floor=" + this.floor, {
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(response => {
          if (response.status === 200) {
            let list = JSON.parse(response.bodyText);
            this.shelveData = list.data;
            for (let item of this.shelveData) {
              item.occupy = item.occupy ? item.occupy : 0;
              item.perc = (item.occupy * 0.2) / item.capacity;
            }
            this.listLoading = false;
          } else {
            this.listLoading = false;
            this.$message({ type: "error", message: "加载失败!" });
          }
        });
    },
    queryShelveInfo(id) {
      this.$http
        .get("/apis/shelve/query?place=" + id, {
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(response => {
          if (response.status === 200) {
            let list = JSON.parse(response.bodyText);
            this.placeList = list.data;
            this.positionVisible = true;
          } else {
            this.$message({ type: "error", message: "加载失败!" });
          }
        });
    },
  },
  created() {
    this.getShelveInfo();
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
.content {
  display: flex;
  flex-flow: column;
  flex-wrap: wrap;
  height: 500px;
}
.content-box {
  width: 100px;
  height: 60px;
  /* position: relative; */
  cursor: pointer;
  box-shadow: 0px 0px 0px 0px #ccecfb; 
  transition: box-shadow 1s;
  -moz-transition: 1s;
  -webkit-transition: 1s;
  -o-transition: 1s;
}
.box {
  width: 100%;
  height: 100%;
  border: solid 1px #ccecfb;
  /* background-color: #f37150; */
  position: relative;
}
.box-back {
  position: absolute;
  width: 100%;
  height: 98%;
  top: 0;
  z-index: 1;
  background-color: #fbfeff;
}
.content-box:hover {
  box-shadow: 0px 0px 10px 5px #ccecfb; 
  transition: box-shadow 0.5s;
}
.box-inner {
  position: absolute;
  bottom: 0;
  transition: height 1s;
  width: 100%;
  z-index: 2;
}
.box-inner-text {
  position: absolute;
  top: 0;
  line-height: 60px;
  width: 100%;
  z-index: 3;
  color: #909399;
  font-size: 13px;
  font-weight: 500;
}
</style>
