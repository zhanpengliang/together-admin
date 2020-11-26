<template>
  <div class="app-container">
    <div>
      <el-row>
        <el-col :span="3">已支付人数：{{ participantCountInfoBean.payCount }}</el-col>
        <el-col :span="3">下单未支付人数：{{ participantCountInfoBean.orderCount }}</el-col>
        <el-col :span="3">已取消人数：{{ participantCountInfoBean.cancelCount }}</el-col>
        <el-col :span="3">报名总人数：{{ participantCountInfoBean.participantCount }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="3">已支付男生人数：{{ participantCountInfoBean.maleParticipantCount }}</el-col>
        <el-col :span="3">已支付女生人数：{{ participantCountInfoBean.femalParticipantCount }}</el-col>
      </el-row>
    </div>
    <br />
    <br />
    <el-collapse @change="handleChange">
      <el-collapse-item v-for="(participant, index) in list" :key="participant.participantId" :title="participant.name + ' ' + participant.sex + ' ' + participant.age + '岁 ' + participant.orderStatusMsg" :name="index">
        <el-row>
          <el-col :span="6">
            <div>身份证号码：{{ participant.idCard }}</div>
            <div>籍贯：{{ participant.province + ' ' + participant.city + ' ' + participant.district + ' ' + participant.addressDetail }}</div>
            <div>所在公司：{{ participant.company }}</div>
            <div>公司任职：{{ participant.profession }}</div>
            <div>年收入：{{ participant.income }} 万元</div>
          </el-col>
          <el-col :span="18">
            <el-image v-for="url in participant.imageList" :key="url" style="width: 200px; height: 200px" :src="url" :preview-src-list="participant.imageList" />
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
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
              const participantBean = data.orderAndParticipantBeans[index].participantBean
              var participant = {}
              participant.orderStatusMsg = data.orderAndParticipantBeans[index].orderInfoBean.orderStatusMsg
              participant.participantId = participantBean.id
              participant.accountId = participantBean.accountId
              participant.name = participantBean.name
              participant.sex = participantBean.sexStr
              participant.age = participantBean.age
              participant.idCard = participantBean.idCard
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

          if (data.participantCountInfoBean === null) {
            this.participantCountInfoBean = {
              payCount: 0,
              orderCount: 0,
              cancelCount: 0,
              participantCount: 0,
              maleParticipantCount: 0,
              femalParticipantCount: 0
            }
          } else {
            this.participantCountInfoBean = data.participantCountInfoBean
          }

          this.listLoading = false
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
        return
      })
    },

    handleChange(participantIndexs) {
      console.log(participantIndexs)

      // 已经全部关闭
      if (participantIndexs === null || participantIndexs.length === 0) {
        this.openCount = 0
        return
      }

      // 关闭面板
      if (this.openCount > participantIndexs.length) {
        this.openCount = participantIndexs.length
        return
      }

      // 打开面板
      /**
       * 已经加载过，不再重新加载
       */
      const participantIndex = participantIndexs[participantIndexs.length - 1]
      if (this.list[participantIndex].imageBeanList !== undefined && this.list[participantIndex].imageBeanList !== null && this.list[participantIndex].imageBeanList.length !== 0) {
        return
      }

      var postData = {

      }
      postData.accountId = this.list[participantIndex].accountId
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
            this.list[participantIndex].imageList = tmptImg
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
