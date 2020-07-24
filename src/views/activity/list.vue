<template>
  <div class="app-container">
    <el-row style="padding: 2px; box-shadow: 0px 0px 6px 0px; width: 100%;">
      <el-col :span="24"><el-button type="primary" plain size="small" @click="addActivity()">创建活动</el-button></el-col>
    </el-row>

    <el-row>
      <el-col :span="24"><br /></el-col>
    </el-row>

    <el-row style="padding: 2px; box-shadow: 0px 0px 6px 0px; width: 100%;">
      <el-col :span="24">
        <el-table v-loading="listLoading" element-loading-text="Loading" :data="list">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="活动名称">
                  <span>{{ scope.row.subject }}</span>
                </el-form-item>
                <el-form-item label="活动类型">
                  <span>{{ scope.row.typeDescription }}</span>
                </el-form-item>
                <el-form-item label="活动费用">
                  <span>{{ scope.row.fee }}</span>
                </el-form-item>
                <el-form-item label="活动地点">
                  <span>{{ scope.row.address.province + "-" + scope.row.address.city + "-" + scope.row.address.district }}</span>
                </el-form-item>
                <el-form-item label="活动详细地点">
                  <span>{{ scope.row.address.detail }}</span>
                </el-form-item>
                <el-form-item label="活动开始时间">
                  <span>{{ scope.row.beginTime }}</span>
                </el-form-item>
                <el-form-item label="活动结束时间">
                  <span>{{ scope.row.endTime }}</span>
                </el-form-item>
                <el-form-item label="报名截止时间">
                  <span>{{ scope.row.orderDeadline }}</span>
                </el-form-item>
                <el-form-item label="活动创建时间">
                  <span>{{ scope.row.createTime }}</span>
                </el-form-item>
                <el-form-item label="总人数要求">
                  <span>{{ scope.row.maxParticipantCount }}</span>
                </el-form-item>
                <el-form-item label="女生比例">
                  <span>{{ scope.row.femaleParticipantPercent }}%</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="活动名称">
            <template slot-scope="scope">
              {{ scope.row.subject }}
            </template>
          </el-table-column>
          <el-table-column label="活动类型" prop="typeDescription" sortable>
            <template slot-scope="scope">
              <span>{{ scope.row.typeDescription }}</span>
            </template>
          </el-table-column>
          <el-table-column label="活动费用" >
            <template slot-scope="scope">
              {{ scope.row.fee + "元" }}
            </template>
          </el-table-column>
          <el-table-column label="活动开始时间" prop="beginTime" sortable>
            <template slot-scope="scope">
              {{ scope.row.beginTime }}
            </template>
          </el-table-column>
          <el-table-column label="活动状态" prop="activityStatusMsg" sortable>
            <template slot-scope="scope">
              {{ scope.row.activityStatusMsg }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="350">
            <template slot-scope="scope">
              <el-row :gutter="10">
                <el-col :span="4"><el-button plain size="mini" @click="queryActivityDetail(scope.$index, scope.row)">预览</el-button></el-col>
                <el-col :span="6"><el-button plain size="mini" @click="queryOrderList(scope.$index, scope.row)">下单信息</el-button></el-col>
                <el-col :span="4"><el-button plain size="mini" :disabled="scope.row.activityStatus !== 0 && scope.row.activityStatus !== 1 && scope.row.activityStatus !== 2" @click="editActivity(scope.$index, scope.row)">编辑</el-button></el-col>
                <el-col :span="4"><el-button plain size="mini" :disabled="scope.row.activityStatus !== 0" @click="publishActivity(scope.$index, scope.row)">发布</el-button></el-col>
                <el-col :span="4"><el-button plain size="mini" :disabled="scope.row.activityStatus !== 0 && scope.row.activityStatus !== 1 && scope.row.activityStatus !== 2" @click="cancelActivity(scope.$index, scope.row)">取消</el-button></el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <div>
      <el-drawer :visible.sync="openActivityDetail" direction="rtl" size="400px">
        <div style="overflow: auto; margin:0 auto; padding-left: 10px; padding-top: 10px; width: 375px; height: 667px; background-color: #FFFFFF; box-shadow: inset 0px 0px 10px 0px;">

          <div style="text-align:center">
            {{ activityBean.subject }}
          </div>
          <div v-html="activityBean.otherInfo">

          </div>
          <div>
            活动类型：{{ activityBean.typeDescription }}
          </div>
          <div>
            活动开始时间：{{ activityBean.beginTime }}

          </div>
          <div>
            活动结束时间：{{ activityBean.endTime }}
          </div>
          <div>
            活动报名截止时间：{{ activityBean.orderDeadline }}
          </div>
          <div>
            活动地点：{{ activityBean.address.province + "-"
              + activityBean.address.city + "-"
              + activityBean.address.district + "  "
              + activityBean.address.detail }}
          </div>
          <div>
            人数要求：{{ "总人数：" + activityBean.maxParticipantCount +
              "        女生比例：" + activityBean.femaleParticipantPercent + "%" }}
          </div>
          <div>
            活动费用：{{ activityBean.fee }} 元
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 120px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
</style>

<script>
import { getActivityList } from '@/api/activityList'
import { publishActivity } from '@/api/activityPublish.js'
import { cancelActivity } from '@/api/activityCancel.js'
import { queryActivityDetail } from '@/api/activityDetail.js'
export default {
  data() {
    return {
      list: null,
      listLoading: true,

      openActivityDetail: false,
      activityBean: {
        address: {

        }
      }
    }
  },
  created() {
    this.queryActivityList()
  },
  methods: {
    queryActivityList() {
      this.listLoading = true
      var postData = {
      }
      postData.organizerId = this.$store.state.user.organizerId
      getActivityList(postData).then(response => {
        if (response.status === 200) {
          const data = response.data
          if (data === null || data.status === false) {
            this.loading = false
            this.$alert(data.errMsg, '获取活动列表信息失败', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
            return
          }
          this.list = data.activityBeans
          this.listLoading = false
          return
        } else {
          this.loading = false
          this.$alert(response.statusText, '获取活动列表信息失败', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
          return
        }
      }).catch(error => {
        this.loading = false
        this.$alert(error, '获取活动列表信息失败', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
        return
      })
    },

    queryActivity(activityId) {
      var postData = {
      }
      postData.organizerId = this.$store.state.user.organizerId
      postData.id = activityId
      queryActivityDetail(postData).then(response => {
        if (response.status === 200) {
          const data = response.data
          if (data !== null && data.status === true) {
            this.activityBean = response.data.activityBean
          } else {
            this.$alert(response.errMsg, '查询活动详情失败', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
          }
        } else {
          this.$alert(response.statusText, '查询活动详情失败', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        }
      }).catch(error => {
        this.$alert(error, '查询活动详情失败', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
      })
    },

    addActivity() {
      // this.$router.push({ path: 'register', query: { plan: 'private' }})
      this.$router.push({ path: '/activity/add', query: { plan: 'private' }})
    },

    queryActivityDetail(index, row) {
      this.queryActivity(row.id)
      this.openActivityDetail = true
    },

    queryOrderList(index, row) {
      this.$router.push({ path: '/order/list', query: { activityId: row.id }})
    },

    editActivity(index, row) {
      this.$router.push({ path: '/activity/update', query: { activityId: row.id }})
    },

    publishActivity(index, row) {
      var postData = {
        activityBean: {
        }
      }
      postData.activityBean.id = row.id
      postData.activityBean.activityStatus = 1
      postData.activityBean.organizerId = this.$store.state.user.organizerId
      publishActivity(postData).then(response => {
        if (response.status === 200) {
          const data = response.data
          if (data !== null && data.status === true) {
            this.$alert('发布活动成功。请点击确定按钮，重新载入页面', '发布活动成功', {
              confirmButtonText: '确定',
              callback: action => {
                location.reload(true)
              }
            })
          } else {
            this.$alert(data.errMsg + '。请点击确定按钮，重新载入页面', '发布活动失败', {
              confirmButtonText: '确定',
              callback: action => {
                location.reload(true)
              }
            })
          }
        } else {
          this.$alert(response.statusText + '。请点击确定按钮，重新载入页面', '发布活动失败', {
            confirmButtonText: '确定',
            callback: action => {
              location.reload(true)
            }
          })
        }
      }).catch(error => {
        this.$alert(error + '。请点击确定按钮，重新载入页面', '发布活动失败', {
          confirmButtonText: '确定',
          callback: action => {
            location.reload(true)
          }
        })
      })
    },

    cancelActivity(index, row) {
      this.$confirm('此操作将取消此次活动, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var postData = {
        }
        postData.organizerId = this.$store.state.user.organizerId
        postData.activityId = row.id
        cancelActivity(postData).then(response => {
          if (response.status === 200) {
            const data = response.data
            if (data !== null && data.status === true) {
              this.$alert('取消活动成功。请点击确定按钮，重新载入页面', '取消活动成功', {
                confirmButtonText: '确定',
                callback: action => {
                  location.reload(true)
                }
              })
            } else {
              this.$alert(data.errMsg + '。请点击确定按钮，重新载入页面', '取消活动失败', {
                confirmButtonText: '确定',
                callback: action => {
                  location.reload(true)
                }
              })
            }
          } else {
            this.$alert(response.statusText  + '。请点击确定按钮，重新载入页面', '取消活动失败', {
              confirmButtonText: '确定',
              callback: action => {
                location.reload(true)
              }
            })
            return
          }
        }).catch(error => {
          this.$alert(error + '。请点击确定按钮，重新载入页面', '取消活动失败', {
            confirmButtonText: '确定',
            callback: action => {
              location.reload(true)
            }
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
