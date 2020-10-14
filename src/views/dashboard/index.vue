<template>
  <div class="dashboard-container">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="公司基本信息-用户不可见" name="2">
        <el-row>
          <el-col :span="6">公司名称：</el-col>
          <el-col :span="18">{{ organizerBean.name }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">公司地址：</el-col>
          <el-col :span="18">{{ organizerBean.address }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">法人姓名：</el-col>
          <el-col :span="18">{{ organizerBean.corporationName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">法人电话：</el-col>
          <el-col :span="18">{{ organizerBean.corporationPhoneNumber }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">法人身份证号码：</el-col>
          <el-col :span="18">{{ organizerBean.corporationIDCard }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">营业执照编号：</el-col>
          <el-col :span="18">{{ organizerBean.businessLicenseNo }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">营业执照名称：</el-col>
          <el-col :span="18">{{ organizerBean.businessLicenseName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">营业执照有效期：</el-col>
          <el-col :span="18">{{ organizerBean.businessLicenseDeadLine }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">营业执照所在地：</el-col>
          <el-col :span="18">{{ organizerBean.businessLicenseAddress }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">营业执照所在地：</el-col>
          <el-col :span="18">{{ organizerBean.businessLicenseAddress }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">结算银行户主：</el-col>
          <el-col :span="18">{{ organizerBean.settleBankHead }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">结算银行名称：</el-col>
          <el-col :span="18">{{ organizerBean.settleBankName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">结算银行卡号：</el-col>
          <el-col :span="18">{{ organizerBean.settleCardNo }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">创建时间：</el-col>
          <el-col :span="18">{{ organizerBean.createTime }}</el-col>
        </el-row>
      </el-collapse-item>

      <el-collapse-item title="公司介绍-用户可见" name="1">
        <div style="overflow: auto; margin:30px auto; padding-left: 10px; padding-right: 10px; padding-top: 10px; width: 375px; height: 667px; background-color: #FFFFFF; box-shadow: inset 0px 0px 10px 0px;" v-html="organizerBean.description"></div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { queryOrganizerDetail } from '@/api/organizer.js'
export default {
  name: 'Dashboard',
  data() {
    return {
      activeNames: [
        '1',
        '2'
      ],
      organizerBean: {

      }
    }
  },
  created() {
    this.queryOrganizer()
  },
  methods: {
    queryOrganizer() {
      var postData = {

      }
      postData.organizerId = this.$store.state.user.organizerId
      queryOrganizerDetail(postData).then(response => {
        if (response.status === 200) {
          const data = response.data
          if (data !== null && data.status === true) {
            this.organizerBean = data.organizerDetailBean
          } else {
            this.$alert(data.errMsg, '加载个人/公司基本信息失败', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
          }
        } else {
          this.$alert(response.statusText, '加载个人/公司基本信息失败', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        }
      }).catch(error => {
        this.$alert(error, '加载个人/公司基本信息失败', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 30px;
}
</style>
