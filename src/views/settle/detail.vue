<template>
  <div class="app-container">
    <div style="padding: 10px; box-shadow: 0px 0px 6px 0px; width: 100%;">
      <el-row>
        <el-col :span="3">结算人数：{{ participantCountInfoBean.payCount }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="3">结算男生人数www：{{ participantCountInfoBean.maleParticipantCount }}</el-col>
        <el-col :span="3">结算女生人数：{{ participantCountInfoBean.femalParticipantCount }}</el-col>
      </el-row>
    </div>

    <br />
    <br />

    <div>
      <el-row style="padding: 2px; box-shadow: 0px 0px 6px 0px; width: 100%;">
        <el-col :span="24">
          <el-table v-loading="listLoading" element-loading-text="Loading" :data="list">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="身份证号码">
                    <span>{{ scope.row.idCard }}</span>
                  </el-form-item>
                  <el-form-item label="籍贯">
                    <span>{{ scope.row.province + ' ' + scope.row.city + ' ' + scope.row.district + ' ' + scope.row.addressDetail }}</span>
                  </el-form-item>
                  <el-foww
                  rm-item label="所在公司">
                    <span>{{ scope.row.company }}</span>
                  </el-form-item>
                  <el-form-item label="公司任职">
                    <span>{{ scope.row.profession }}</span>
                  </el-form-item>
                  <el-form-item label="年收入">
                    <span>{{ scope.row.income }}万元</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="姓名">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column label="性别" prop="sex" sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.sex }}</span>
              </template>
            </el-table-column>
            <el-table-column label="年龄" >
              <template slot-scope="scope">
                {{ scope.row.age }}
              </template>
            </el-table-column>
            <el-table-column label="结算金额">
              <template slot-scope="scope">
                {{ scope.row.settleFee }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
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
import { getOrderList } from '@/api/settleDetailQuery.js'
import { RECODE_NOT_EXIT } from '@/utils/error.js'

export default {
  data() {
    return {
      list: null,
      participantCountInfoBean: {
      },
      listLoading: true,
      openCount: 0
    }
  },
  created() {
    this.activityId = this.$route.query.activityId
    this.queryOrderList()
  },
  methods: {
    queryOrderList() {
      this.listLoading = true
      var postDate = {
      }
      postDate.activityId = this.activityId
      getOrderList(postDate).then(response => {
        this.listLoading = false
        if (response.status === 200) {
          const data = response.data
          if (data === null || data.status === false) {
            this.loading = false
            if (data.errCode === RECODE_NOT_EXIT.code) { // 不存在订单信息
              this.participantCountInfoBean = {
                payCount: 0,
                orderCount: 0,
                cancelCount: 0,
                participantCount: 0,
                maleParticipantCount: 0,
                femalParticipantCount: 0
              }
            } else {
              this.$alert(data.errMsg, '获取活动参与者列表失败', {
                confirmButtonText: '确定',
                callback: action => {
                }
              })
            }
            return
          }

          var tempList = []
          if (data.orderAndParticipantBeans !== null && data.orderAndParticipantBeans.length !== 0) {
            let index
            for (index in data.orderAndParticipantBeans) {
              if (data.orderAndParticipantBeans[index].orderInfoBean.orderStatus !== 3) {//活动完成的订单状态才参与结算
                continue
              }
              const participantBean = data.orderAndParticipantBeans[index].participantBean
              var participant = {}
              participant.settleStatus = data.orderAndParticipantBeans[index].orderInfoBean.orderStatusMsg
              participant.settleFee = data.orderAndParticipantBeans[index].orderInfoBean.payAmount
              participant.name = participantBean.name
              participant.sex = participantBean.sexStr
              participant.age = participantBean.age
              participant.idCard = participantBean.idCard
              if (participantBean.bornAddress !== null) {
                participant.province = participantBean.bornAddress.province
                participant.city = participantBean.bornAddress.city
                participant.district = participantBean.bornAddress.district
                participant.addressDetail = participantBean.bornAddress.detail
              }
              participant.company = participantBean.company
              participant.profession = participantBean.profession
              participant.income = participantBean.income
              tempList.push(participant)
            }
          }
          this.list = tempList

          if (data.participantCountInfoBean !== null) {
            this.participantCountInfoBean = data.participantCountInfoBean
          }
        } else {
          this.loading = false
          this.$alert(response.statusText, '获取活动列表信息失败', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        }
      }).catch(error => {
        this.loading = false
        this.$alert(error, '获取活动列表信息失败', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
      })
    }
  }
}
</script>
