<template>
  <el-container>
    <el-main>
      <el-row>
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="keywords" placeholder="输入关键字"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getMaterialData()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addItem">添加</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-table
            :data="materialData.slice(0, Math.ceil(count/2))"
            v-loading="listLoading"
            style="width: 100%">
            <el-table-column
              label="ID"
              align="center"
              width="80">
              <template slot-scope="scope" >
                <div>
                  {{scope.row.id}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="原料名"
              align="center"
              width="200">
              <template slot-scope="scope">
                <div v-if="scope.row.isEdit">
                  <el-input v-model="materialNew.material_name"></el-input>
                </div>
                <div v-else>
                  {{scope.row.material_name}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.isEdit">
                  <el-button size="small" @click="saveEdit()">保存</el-button>
                  <el-button size="small" @click="cancelEdit(scope.row)">取消</el-button>
                </div>
                <div v-else>
                  <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteItem(scope.row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <el-table
            :data="materialData.slice(Math.ceil(count/2))"
            v-loading="listLoading"
            style="width: 100%">
            <el-table-column
              label="ID"
              align="center"
              width="80">
              <template slot-scope="scope" >
                <div>
                  {{scope.row.id}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="原料名"
              align="center"
              width="200">
              <template slot-scope="scope">
                <div v-if="scope.row.isEdit">
                  <el-input v-model="materialNew.material_name"></el-input>
                </div>
                <div v-else>
                  {{scope.row.material_name}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.isEdit">
                  <el-button size="small" @click="saveEdit()">保存</el-button>
                  <el-button size="small" @click="cancelEdit(scope.row)">取消</el-button>
                </div>
                <div v-else>
                  <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteItem(scope.row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
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
          keywords: '',
          listLoading: false,
          isAdd: false,
          count: 0,
          materialNew: {}
        }
      },
      mounted() {
        this.getMaterialData();
      },
      methods: {
        getMaterialData() {
          this.materialData = [];
          let url = '';
          if(this.keywords === '') {
            url = '/apis/material';
          }
          else {
            let arr = this.keywords.split(' ');
            url = '/apis/material?type=1&';
            for(let i = 0;i < arr.length;i++) {
              if (i === 1) {
                url += 'keywords=' + arr[i];
              }
              else {
                url += '&keywords=' + arr[i];
              }
            }
          }
          this.count = 0;
          this.$http.get(url, {headers: {
              'Content-Type': 'application/json',
              'token': localStorage.getItem("token")
            }}).then(response => {
            this.listLoading = true;
            if (response.status === 200) {
              let materialList = JSON.parse(response.bodyText).data;
              let i = 0;
              while (i < (materialList.length)) {
                this.materialData.push({
                  id: materialList[i].material_id,
                  material_name: materialList[i].material_name,
                  isEdit: false
                });
                i++;
                this.count++;
              }
              this.listLoading = false;
            }
            else {
              this.listLoading = false;
              this.$message({type: 'error', message: '加载失败!'});
            }
          }).catch(error => {
            this.listLoading = false;
            this.$message({type: 'error', message: '加载失败!'});
          });
        },
        handleEdit(obj) {
          obj.isEdit = true;
          this.materialNew = this.objDeepCopy(obj);
        },
            saveEdit() {
                if (this.materialNew.material_name === '') {
                    this.$message({type: 'error', message: '原料名不能为空!'});
                    return;
                }
                if (this.materialNew.id === '') {
                    this.$http.post('/apis/material/add?material_name=' + this.materialNew.material_name, {headers: {
                        'Content-Type': 'application/json',
                        'token': localStorage.getItem("token")
                      }}).then(response => {
                        if (response.status === 200) {
                            this.$message({type: 'success', message: '添加成功!'});
                            this.getMaterialData();
                            this.materialNew = {};
                        }
                        else {
                            this.$message({type: 'error', message: '添加失败!'});
                        }
                    }).catch(error => {
            this.$message({type: 'error', message: '添加失败!'});
          });
                }
                else {
                    let url = '/apis/material/update?material_id=' + this.materialNew.id + '&newName=' + this.materialNew.material_name;
                    this.$http.post(url, {headers: {
                        'Content-Type': 'application/json',
                        'token': localStorage.getItem("token")
                      }}).then(response => {
                        if (response.status === 200) {
                            this.$message({type: 'success', message: '编辑成功!'});
                            this.getMaterialData();
                            this.materialNew = {};
                        }
                        else {
                            this.$message({type: 'error', message: '编辑失败!'});
                        }
                    }).catch(error => {
            this.$message({type: 'error', message: '编辑失败!'});
          });
                }
            },
            cancelEdit(obj) {
              if (obj.id !== '') {
                obj.isEdit = false;
                this.materialNew = {};
              }
              else {
                obj.isEdit = false;
                this.materialData.pop();
              }
            },
            deleteItem(obj) {
                this.$confirm('确认删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/apis/material/delete?material_id=' + obj.id, {headers: {
                        'Content-Type': 'application/json',
                        'token': localStorage.getItem("token")
                      }}).then(response => {
                        if (response.status === 200) {
                            this.$message({type: 'success', message: '删除成功!'});
                            this.getMaterialData();
                        }
                        else {
                            this.$message({type: 'error', message: '删除失败!'});
                        }
                    }).catch(() => {
            this.$message({type: 'error', message: '删除失败!'});
          });;
                }).catch(error => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            addItem() {
                this.materialData.push({
                    id: '',
                    material_name: '',
                    isEdit: true,
                });
                let last = this.materialData.length - 1;
                this.materialNew = this.objDeepCopy(this.materialData[last]);
            },
            objDeepCopy(source) {
              let sourceCopy = source instanceof Array ? [] : {};
              for (let item in source) {
                if (source.hasOwnProperty(item)) {
                  sourceCopy[item] = typeof source[item] === 'object' ? this.objDeepCopy(source[item]) : source[item];
                }
              }
              return sourceCopy;
            }
        }
    }
</script>

<style scoped>

</style>
