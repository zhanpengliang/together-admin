<template>
  <div class="app-container">
    <el-row>
      <el-col :span="8">
        手机端预览效果大致如下，实际情况以手机端为准。
      </el-col>
      <el-col :span="16">
        <el-button type="primary" plain size="small" @click="toActivityList">返回活动列表页</el-button>
      </el-col>
    </el-row>

    <el-row style="overflow: auto; margin:30px auto; padding-left: 10px; padding-right: 10px; padding-top: 10px; width: 375px; height: 667px; background-color: #FFFFFF; box-shadow: inset 0px 0px 10px 0px;">
      <el-col :span="24">
        <div style="text-align:center">
          {{ activityBean.subject }}
        </div>
        <div v-html="activityBean.otherInfo">

        </div>
        <div>
          活动类型：{{ activityBean.typeDescription }}
        </div>
        <div>
          活动开始时间：{{ activityBean.beginTimeStr }}

        </div>
        <div>
          活动结束时间：{{ activityBean.endTimeStr }}
        </div>
        <div>
          活动报名截止时间：{{ activityBean.orderDeadlineStr }}
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { queryActivityDetail } from '@/api/activityDetail.js'

export default {
  data() {
    return {
      activityId: null,
      activityBean: null
    }
  },
  created() {
    this.activityId = this.$route.query.activityId
    this.queryActivity()
  },
  methods: {
    queryActivity() {
      var postData = {
      }
      postData.accountId = this.$store.state.user.accountId
      postData.id = this.activityId
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
    toActivityList() {
      this.$router.push({ path: '/activity/list'})
    }
  }
}
</script>

<style>
</style>
