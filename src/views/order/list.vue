<template>
  <div class="app-container">
    <el-row style="padding: 2px;">
      <el-col :span="4">支付人数：{{ participantCountInfoBean.payCount }}人</el-col>
      <el-col :span="20">支付总金额：{{ participantCountInfoBean.totalPayAmount }}元</el-col>
    </el-row>
    <el-row style="padding: 2px;">
      <el-col :span="4">支付男生：{{ participantCountInfoBean.maleParticipantCount }}人</el-col>
      <el-col :span="20">支付女生：{{ participantCountInfoBean.femalParticipantCount }}人</el-col>
    </el-row>
    <br />
    <br />
    <el-row style="padding: 2px; box-shadow: 0px 0px 6px 0px; width: 100%;">
     <el-col :span="24">
      <el-table v-loading="listLoading" element-loading-text="Loading" :data="list" @expand-change="handleExpand">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-image v-for="url in scope.row.imageList" :key="url" style="width: 200px; height: 200px" :src="url" :preview-src-list="scope.row.imageList" />
          </template>
        </el-table-column>
        <el-table-column label="姓名" width="200">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="性别" width="150" prop="activityBeginTime">
          <template slot-scope="scope">
            <span>{{ scope.row.sex }}</span>
          </template>
        </el-table-column>
        <el-table-column label="年龄" width="200">
          <template slot-scope="scope">
            {{ scope.row.age }}
          </template>
        </el-table-column>
        <el-table-column label="籍贯" width="100">
          <template slot-scope="scope">
            {{ scope.row.province + ' ' + scope.row.city + ' ' + scope.row.district + ' ' + scope.row.addressDetail }}
          </template>
        </el-table-column>
        <el-table-column label="身份证" width="100">
          <template slot-scope="scope">
            {{ (scope.row.idCard === null || scope.row.idCard === undefined || scope.row.idCard === "") ? '-' : scope.row.idCard }}
          </template>
        </el-table-column>
        <el-table-column label="职业" width="100">
          <template slot-scope="scope">
            {{ scope.row.profession }}
          </template>
        </el-table-column>
        <el-table-column label="所在公司" width="150">
          <template slot-scope="scope">
            {{ (scope.row.company === null || scope.row.company === undefined || scope.row.company === "") ? '-' : scope.row.company }}
          </template>
        </el-table-column>
        <el-table-column label="年收入" width="100" prop="settleStatus" sortable>
          <template slot-scope="scope">
            {{ (scope.row.income === null || scope.row.income === 0) ? '-' : scope.row.income + '万元' }}
          </template>
        </el-table-column>
      </el-table>
     </el-col>
    </el-row>
  </div>
</template>

<script>
import { getOrderList } from '@/api/orderList.js'
import { queryImgAddress } from '@/api/image.js'
import { RECODE_NOT_EXIT } from '@/utils/error.js'
import { isEmpty } from '@/utils/string.js'

export default {
  data() {
    return {
      list: null,
      participantCountInfoBean: {
        payCount: 0,
        totalPayAmount: 0,
        maleParticipantCount: 0,
        femalParticipantCount: 0
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
      postDate.orderStatus = [2, 3,]

      getOrderList(postDate).then(response => {
        this.listLoading = false
        if (response.status === 200) {
          const data = response.data
          if (data === null || data.status === false) {
            this.loading = false
            if (data.errCode !== RECODE_NOT_EXIT.code) {
              this.$alert(data.errMsg, '获取订单信息失败', {
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
              const participantBean = data.orderAndParticipantBeans[index].participantBean
              var participant = {}
              participant.orderStatusMsg = data.orderAndParticipantBeans[index].orderInfoBean.orderStatusMsg
              participant.participantId = participantBean.id
              participant.accountId = participantBean.accountId
              participant.name = participantBean.name
              participant.sex = participantBean.sexStr
              participant.age = participantBean.age
              participant.idCard = participantBean.idCard
              participant.phoneNumber = data.orderAndParticipantBeans[index].accountBean.phoneNumber
              participant.nickName = data.orderAndParticipantBeans[index].accountBean.nickName
              participant.sign = data.orderAndParticipantBeans[index].accountBean.sign
              if (participantBean.bornAddress !== null) {
                participant.province = participantBean.bornAddress.province
                participant.city = participantBean.bornAddress.city
                participant.district = participantBean.bornAddress.district
                if (isEmpty(participantBean.bornAddress.detail)) {
                  participant.addressDetail = ""
                } else {
                  participant.addressDetail = participantBean.bornAddress.detail
                }
              }
              participant.company = participantBean.company
              participant.profession = participantBean.profession
              participant.income = participantBean.income
              participant.imageList = null
              tempList.push(participant)
            }
          }
          this.list = tempList
          this.participantCountInfoBean = data.participantCountInfoBean
        } else {
          this.$alert(response.statusText, '获取活动列表信息失败', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        }
      }).catch(error => {
        this.listLoading = false
        this.$alert(error, '获取活动列表信息失败', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
      })
    },

    handleExpand(row, expandedRows) {

      if (row.imageList !== undefined && row.imageList !== null && row.imageList.length !== 0) {
        return
      }

      var postData = {

      }
      postData.accountId = row.accountId
      postData.imageType = 2
      queryImgAddress(postData).then(response => {
        if (response.status === 200) {
          const data = response.data
          if (data !== null && data.status === true) {
            const tmptImg = []
            let index
            if (data.imageBeanList !== null && data.imageBeanList.length !== 0) {
              for (index in data.imageBeanList) {
                tmptImg.push(data.imageBeanList[index].imageAddress)
              }
            }
            row.imageList = tmptImg
          } else {
            this.$alert(data.errMsg, '加载生活照失败', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
          }
        } else {
          this.$alert(response.statusText, '加载生活照失败', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        }
      }).catch(error => {
        this.$alert(error, '加载生活照失败', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
      })
    }
  }
}
</script>
