<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-table v-loading="listLoading" element-loading-text="Loading" :data="list">
          <el-table-column label="活动名称" width="200">
            <template slot-scope="scope">
              {{ scope.row.activitySubject }}
            </template>
          </el-table-column>
          <el-table-column label="活动开始时间" width="150" prop="activityBeginTime" sortable>
            <template slot-scope="scope">
              <span>{{ scope.row.activityBeginTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="活动地点" width="200">
            <template slot-scope="scope">
              {{ scope.row.activityDetailAddress }}
            </template>
          </el-table-column>
          <el-table-column label="应结金额" width="100">
            <template slot-scope="scope">
              {{ scope.row.settleFee }}
            </template>
          </el-table-column>
          <el-table-column label="实结金额" width="100">
            <template slot-scope="scope">
              {{ scope.row.realSettleFee }}
            </template>
          </el-table-column>
          <el-table-column label="结算完成时间" width="150">
            <template slot-scope="scope">
              {{ scope.row.settleTime === null ? '-' : scope.row.settleTime }}
            </template>
          </el-table-column>
          <el-table-column label="结算状态" width="100" prop="settleStatus" sortable>
            <template slot-scope="scope">
              {{ scope.row.settleStatusMsg }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button plain size="mini" @click="querySettleDetail(scope.$index, scope.row)">结算明细</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getSettleList } from '@/api/settleListQuery.js'
import { RECODE_NOT_EXIT } from '@/utils/error.js'
export default {
  data() {
    return {
      listLoading: true,
      list: null
    }
  },
  created() {
    this.querySettleList()
  },
  methods: {
    querySettleList() {
      var postData = {

      }
      postData.accountId = this.$store.state.user.accountId
      getSettleList(postData).then(response => {
        this.listLoading = false
        if (response.status === 200) {
          const data = response.data
          if (data !== null && data.status === true) {
            this.list = data.settleBeans
          } else {
            if (data.errCode === RECODE_NOT_EXIT.code) { // 不存在结算信息
              this.errMsg = '不存在结算信息'
            } else {
              this.$alert(data.errMsg, '加载结算信息失败', {
                confirmButtonText: '确定',
                callback: action => {
                }
              })
            }
          }
        } else {
          this.$alert(response.statusText, '加载结算信息失败', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        }
      }).catch(error => {
        this.listLoading = false
        this.$alert(error, '加载结算信息失败', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
      })
    },
    querySettleDetail(index, row) {
      this.$router.push({ path: '/settle/detail', query: { activityId: row.activityId }})
    }
  }
}
</script>

<style>
</style>
