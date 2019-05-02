<template>
  <el-container>
    <el-main>
      <el-row class="search-banner">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="keywords" placeholder="输入关键字" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch" size="small" class="button-primary">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addItem" size="small" class="button-primary">添加原料</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-table
            :data="materialData.slice(0, sperateIndex)"
            v-loading="listLoading"
            style="width: 100%"
          >
            <el-table-column label="ID" align="center" width="80">
              <template slot-scope="scope">
                <div class="table-text">{{scope.row.id}}</div>
              </template>
            </el-table-column>
            <el-table-column label="原料名" align="center" width="200">
              <template slot-scope="scope">
                <div v-if="scope.row.isEdit">
                  <el-input v-model="materialNew.material_name" size="small"></el-input>
                </div>
                <div v-else class="table-text">{{scope.row.material_name}}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.isEdit">
                  <el-button
                    size="small"
                    type="primary"
                    @click="saveEdit()"
                    class="button-primary"
                    :loading="submitLoading"
                  >保存</el-button>
                  <el-button size="small" @click="cancelEdit(scope.row)">取消</el-button>
                </div>
                <div v-else>
                  <el-button size="small" @click="handleEdit(scope.row)" class="button-plain">编辑</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    plain
                    @click="deleteItem(scope.row)"
                    :loading="submitLoading"
                  >删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12" v-if="materialData.length !== 1">
          <el-table
            :data="materialData.slice(sperateIndex)"
            v-loading="listLoading"
            style="width: 100%"
          >
            <el-table-column label="ID" align="center" width="80">
              <template slot-scope="scope">
                <div class="table-text">{{scope.row.id}}</div>
              </template>
            </el-table-column>
            <el-table-column label="原料名" align="center" width="200">
              <template slot-scope="scope">
                <div v-if="scope.row.isEdit">
                  <el-input v-model="materialNew.material_name" size="small"></el-input>
                </div>
                <div v-else class="table-text">{{scope.row.material_name}}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.isEdit">
                  <el-button
                    size="small"
                    @click="saveEdit()"
                    type="primary"
                    class="button-primary"
                    :loading="submitLoading"
                  >保存</el-button>
                  <el-button size="small" @click="cancelEdit(scope.row)">取消</el-button>
                </div>
                <div v-else>
                  <el-button size="small" @click="handleEdit(scope.row)" class="button-plain">编辑</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    plain
                    @click="deleteItem(scope.row)"
                    :loading="submitLoading"
                  >删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row class="foot-banner">
        <el-col :span="24" align="start">
          <el-pagination
            background
            class="pagination"
            layout="prev, pager, next"
            :current-page.sync="currentPage"
            @current-change="handlePage"
            :total="totalCount"
            :page-size="20"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "MaterialList",
  data() {
    return {
      materialData: [],
      keywords: "",
      listLoading: false,
      submitLoading: false,
      isAdd: false,
      sperateIndex: 0,
      materialNew: {},
      currentPage: 1,
      totalCount: 0
    };
  },
  mounted() {
    this.getMaterialData(this.currentPage);
  },
  methods: {
    getMaterialData(page) {
      this.materialData = [];
      let url = "";
      if (this.keywords === "") {
        url = "/apis/material?page=" + page;
      } else {
        let arr = this.keywords.split(" ");
        url = "/apis/material?type=1&";
        for (let i = 0; i < arr.length; i++) {
          if (i === 1) {
            url += "keywords=" + arr[i];
          } else {
            url += "&keywords=" + arr[i];
          }
        }
        this.url += "&page=" + page;
      }
      this.listLoading = true;
      this.$http
        .get(url, {
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(response => {
          if (response.status === 200) {
            let materialList = JSON.parse(response.bodyText);
            let i = 0;
            while (i < materialList.data.length) {
              this.materialData.push({
                id: materialList.data[i].material_id,
                material_name: materialList.data[i].material_name,
                isEdit: false
              });
              i++;
            }
            this.totalCount = materialList.count;
            this.sperateIndex = (this.materialData.length + 1) / 2;
            this.listLoading = false;
          } else {
            this.listLoading = false;
            this.$message({ type: "error", message: "加载失败!" });
          }
        })
        .catch(error => {
          this.listLoading = false;
          this.$message({ type: "error", message: "加载失败!" });
        });
    },
    handleEdit(obj) {
      obj.isEdit = true;
      this.materialNew = this.objDeepCopy(obj);
    },
    saveEdit() {
      if (this.materialNew.material_name === "") {
        this.$message({ type: "error", message: "原料名不能为空!" });
        return;
      }
      this.submitLoading = true;
      if (this.materialNew.id === "") {
        this.$http
          .post(
            "/apis/material/add",
            {},
            {
              params: {
                material_name: this.materialNew.material_name
              },
              headers: {
                token: localStorage.getItem("token")
              }
            }
          )
          .then(response => {
            if (response.status === 200) {
              this.$message({ type: "success", message: "添加成功!" });
              this.getMaterialData(this.currentPage);
              this.materialNew = {};
              this.submitLoading = false;
            } else {
              this.submitLoading = false;
              this.$message({ type: "error", message: "添加失败!" });
            }
          })
          .catch(error => {
            this.submitLoading = false;
            this.$message({ type: "error", message: "添加失败!" });
          });
      } else {
        this.$http
          .post(
            "/apis/material/update",
            {},
            {
              params: {
                material_id: this.materialNew.id,
                newName: this.materialNew.material_name
              },
              headers: {
                token: localStorage.getItem("token")
              }
            }
          )
          .then(response => {
            if (response.status === 200) {
              this.submitLoading = false;
              this.$message({ type: "success", message: "编辑成功!" });
              this.getMaterialData(this.currentPage);
              this.materialNew = {};
            } else {
              this.submitLoading = false;
              this.$message({ type: "error", message: "编辑失败!" });
            }
          })
          .catch(error => {
            this.submitLoading = false;
            this.$message({ type: "error", message: "编辑失败!" });
          });
      }
    },
    cancelEdit(obj) {
      if (obj.id !== "") {
        obj.isEdit = false;
        this.materialNew = {};
      } else {
        obj.isEdit = false;
        this.materialData.pop();
      }
    },
    deleteItem(obj) {
      this.$confirm("确认删除原料[" + obj.material_name + "]吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.submitLoading = true;
          this.$http
            .post(
              "/apis/material/delete",
              {},
              {
                params: {
                  material_id: obj.id
                },
                headers: {
                  token: localStorage.getItem("token")
                }
              }
            )
            .then(response => {
              if (response.status === 200) {
                this.submitLoading = false;
                this.$message({ type: "success", message: "删除成功!" });
                if (
                  this.materialData.length - 1 === 0 &&
                  this.currentPage > 1
                ) {
                  this.currentPage -= 1;
                }
                this.getMaterialData(this.currentPage);
              } else {
                this.submitLoading = false;
                this.$message({ type: "error", message: "删除失败!" });
              }
            })
            .catch(() => {
              this.submitLoading = false;
              this.$message({ type: "error", message: "删除失败!" });
            });
        })
        .catch(error => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addItem() {
      this.materialData.push({
        id: "",
        material_name: "",
        isEdit: true
      });
      let last = this.materialData.length - 1;
      this.materialNew = this.objDeepCopy(this.materialData[last]);
    },
    objDeepCopy(source) {
      let sourceCopy = source instanceof Array ? [] : {};
      for (let item in source) {
        if (source.hasOwnProperty(item)) {
          sourceCopy[item] =
            typeof source[item] === "object"
              ? this.objDeepCopy(source[item])
              : source[item];
        }
      }
      return sourceCopy;
    },
    handlePage(val) {
      this.currentPage = val;
      this.getMaterialData(this.currentPage);
    },
    handleSearch() {
      this.currentPage = 1;
      this.getMaterialData(this.currentPage);
    }
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
</style>
