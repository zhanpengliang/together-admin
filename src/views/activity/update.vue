<template>
  <div class="app-container">
    <el-form ref="activityForm" :model="activity" label-width="120px" :rules="rules" style="margin: 0 auto; width: 550px;">

      <el-form-item label="活动标题" prop="subject">
        <el-input v-model="activity.subject" />
      </el-form-item>

      <el-form-item label="活动描述">
        <div id="editorMenu" />
        <div id="editor" ref="editor" style="height: 600px; resize: vertical; border:1px solid #ccc; text-align:left;" />
      </el-form-item>

      <el-form-item label="活动类型" prop="activityType">
        <el-select :disabled="isDisabled" v-model="activity.activityType" placeholder="请选择活动类型">
          <el-option label="相亲" value="1" />
          <el-option label="旅游" value="2" />
          <el-option label="KTV" value="3" />
          <el-option label="酒吧" value="4" />
          <el-option label="扑克类游戏" value="5" />
          <el-option label="球类游戏" value="6" />
          <el-option label="其他" value="7" />
        </el-select>
      </el-form-item>

      <el-form-item label="活动开始时间" required>
        <el-col :span="11">
          <el-form-item prop="beginDate">
            <el-date-picker :disabled="isDisabled" v-model="activity.beginDate" value-format="yyyy-MM-dd" type="date" placeholder="请选择活动日期" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-form-item prop="beginTime">
            <el-time-picker :disabled="isDisabled" v-model="activity.beginTime" format="HH:mm" value-format="HH:mm" type="fixed-time" placeholder="请选择活动时间" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="活动结束时间" required>
        <el-col :span="11">
          <el-form-item prop="endDate">
            <el-date-picker :disabled="isDisabled" v-model="activity.endDate" value-format="yyyy-MM-dd" type="date" placeholder="请选择活动日期" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-form-item prop="endTime">
            <el-time-picker :disabled="isDisabled" v-model="activity.endTime" format="HH:mm" value-format="HH:mm" type="fixed-time" placeholder="请选择活动时间" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="活动地点" required>
        <el-cascader style="width: 100%" :disabled="isDisabled" expand-trigger="hover" :props="citysProps" :options="citys" v-model="selectedCitys" @change="handleCitysChange">
        </el-cascader>
      </el-form-item>

      <el-form-item label="活动详细地点" prop="detailAddress">
        <el-input :disabled="isDisabled" v-model="activity.detailAddress" />
      </el-form-item>

      <el-form-item label="退款说明" required>
        <el-col style="width: 190px;">
          <el-form-item prop="refundTime">
            <el-date-picker :disabled="isDisabled" style="width: 190px;"  v-model="activity.refundTime" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col style="width: 70px;" class="line">前手续费</el-col>
        <el-col style="width: 170px;">
          <el-form-item prop="rateBeforeRefundTime">
            <el-input-number :disabled="isDisabled" style="width: 140px;" v-model="activity.rateBeforeRefundTime" :min="0" :max="100">
            </el-input-number>
            <span>&emsp;%</span>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-col style="width: 190px;">
          <el-form-item>
            <el-date-picker style="width: 190px;" :disabled="isDisabled" v-model="activity.refundTime" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col style="width: 70px;" class="line">后手续费</el-col>
        <el-col style="width: 170px;">
          <el-form-item prop="rateAfterRefundTime">
            <el-input-number :disabled="isDisabled" style="width: 140px;" v-model="activity.rateAfterRefundTime" :min="0" :max="100">
            </el-input-number>
            <span>&emsp;%</span>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="报名截止时间" required>
        <el-col :span="11">
          <el-form-item prop="orderDeadlineDate">
            <el-date-picker v-model="activity.orderDeadlineDate" value-format="yyyy-MM-dd" type="date" placeholder="请选择活动日期" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-form-item prop="orderDeadlineTime">
            <el-time-picker v-model="activity.orderDeadlineTime" format="HH:mm" value-format="HH:mm" type="fixed-time" placeholder="请选择活动时间" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="人数要求" required>
        <el-col>
          <el-form-item label="人数上限" prop="maxParticipantCount">
            <el-input v-model.number="activity.maxParticipantCount" type="number" />
          </el-form-item>
        </el-col>
        <el-col style="margin-top: 20px;">
          <el-form-item label="女生占比" prop="femaleParticipantPercent">
            <el-switch style="margin-right: 50px;" v-model="activity.femaleParticipantPercentOpen" @change="changeFemaleParticipantPercentOpen"></el-switch>
            <span v-bind:style="femaleParticipantPercentStyle">
              <el-input-number v-model="activity.femaleParticipantPercent" :min="0" :max="100">
              </el-input-number>
              <label >&emsp;%</label>
            </span>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="活动费用(元)" prop="fee">
        <el-input v-model="activity.fee" type="number" />
      </el-form-item>

      <el-form-item label="费用说明" prop="feeDescription">
        <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="向用户说明费用包括的东西、不含的东西" v-model="activity.feeDescription" />
      </el-form-item>

      <el-form-item label="联系方式" prop="organizerContactWay">
        <el-input placeholder="用于用户咨询" v-model="activity.organizerContactWay" />
      </el-form-item>

      <el-form-item>
        <el-button style="width: 140px;" type="primary" @click="updateActivity()">更新活动</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updateActivityInfo } from '@/api/activityUpdate.js'
import { queryActivityDetail } from '@/api/activityDetail.js'
import { getRandom } from '@/utils/random.js'
import { queryCredential } from '@/api/getCredential.js'
import { citys } from '@/utils/citys.js'

import WangEditor from 'wangeditor'
import COS from 'cos-js-sdk-v5'

export default {
  data() {
    return {
      citysProps: {
        value: "label",
        label: "label",
        children: "children"
      },
      citys: citys,
      selectedCitys: [],
      femaleParticipantPercentStyle: {
        display: 'none'
      },
      isDisabled: true,
      cos: null,
      editor: null,
      activity: {
        subject: '',
        activityType: '1',
        beginDate: '',
        beginTime: '',
        endDate: '',
        endTime: '',
        orderDeadlineDate: '',
        orderDeadlineTime: '',
        province: '',
        city: '',
        district: '',
        detailAddress: '',
        maxParticipantCount: '',
        femaleParticipantPercentOpen: false,
        femaleParticipantPercent: 0,
        fee: '',
        feeDescription: '',
        refundTime: '',
        refundRuleOne: 0,
        refundRuleTwo: 0,
        rateBeforeRefundTime: 50,
        rateAfterRefundTime: 100,
        organizerContactWay: ''
      },
      rules: {
        subject: [
          { required: true, message: '请输入活动主题', trigger: 'blur' }
        ],
        activityType: [
          { required: true, message: '请选择活动类型', trigger: 'blur' }
        ],
        beginDate: [
          { required: true, message: '请选择活动开始日期', trigger: 'blur' }
        ],
        beginTime: [
          { required: true, message: '请选择活动开始时间', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '请选择活动结束日期', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请选择活动结束时间', trigger: 'blur' }
        ],
        orderDeadlineDate: [
          { required: true, message: '请选择活动报名截止日期', trigger: 'blur' }
        ],
        orderDeadlineTime: [
          { required: true, message: '请选择活动报名截止时间', trigger: 'blur' }
        ],
        detailAddress: [
          { required: true, message: '请选择活动详细地点', trigger: 'blur' }
        ],
        maxParticipantCount: [
          { required: true, message: '请输入报名人数', trigger: 'blur' }
        ],
        femaleParticipantPercent: [
          { required: true, message: '请选择女生比例', trigger: 'blur' }
        ],
        fee: [
          { required: true, message: '请输入活动费用', trigger: 'blur' }
        ],
        refundTime: [
           { required: true, message: '请选择退款时间', trigger: 'blur' }
        ],
        rateBeforeRefundTime: [
           { required: true, message: '请输入退款手续费', trigger: 'blur' }
        ],
        rateAfterRefundTime: [
          { required: true, message: '请输入退款手续费', trigger: 'blur' }
        ]
      },
      activityId: null
    }
  },
  beforeCreate() {
    console.log('beforeCreate')
  },
  created() {
    console.log('created')
  },
  mounted() {
    // 初始化实例
    this.cos = new COS({
        getAuthorization: function (options, callback) {
            queryCredential().then(response => {
              if (response.status === 200) {
                if (response.data.status === true) {
                  callback({
                      TmpSecretId: response.data.credentials.tmpSecretId,
                      TmpSecretKey: response.data.credentials.tmpSecretKey,
                      XCosSecurityToken: response.data.credentials.sessionToken,
                      StartTime: response.data.startTime, // 时间戳，单位秒，如：1580000000，建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
                      ExpiredTime: response.data.expiredTime, // 时间戳，单位秒，如：1580000900
                  });
                } else {
                  this.$alert(response.statusText, '上传图片失败', {
                    confirmButtonText: '确定',
                    callback: action => {
                    }
                  })
                }
              } else {
                this.$alert(response.statusText, '上传图片失败', {
                  confirmButtonText: '确定',
                  callback: action => {
                  }
                })
              }
            }).catch(error => {
              this.$alert(error, '上传图片失败', {
                confirmButtonText: '确定',
                callback: action => {
                }
              })
            })
        }
    })
    this.createEditor()
    this.initData()
  },
  beforeUpdate() {
    console.log('beforeUpdate')
  },
  updated() {
    console.log('updated')
  },
  methods: {
    changeFemaleParticipantPercentOpen() {
      if (this.activity.femaleParticipantPercentOpen) {
        this.femaleParticipantPercentStyle.display = 'inline-block';
      } else {
        this.femaleParticipantPercentStyle.display = 'none';
      }
    },
    async initData() {
      this.activityId = this.$route.query.activityId

      var postData = {
      }
      postData.accountId = this.$store.state.user.accountId
      postData.id = this.activityId
      await queryActivityDetail(postData).then(response => {
        if (response.status === 200) {
          const data = response.data
          if (data !== null && data.status === true) {
            const activityBean = data.activityBean
            if (activityBean.activityStatus === 0) { // 非草稿态，部分属性不可编辑
              this.isDisabled = false;
            } else {
              this.isDisabled = true;
            }
            this.activity.subject = activityBean.subject
            this.activity.activityType = activityBean.type + ''

            const beginDateTime = activityBean.beginTime.split(' ')
            this.activity.beginDate = beginDateTime[0]
            this.activity.beginTime = beginDateTime[1]

            const endDateTime = activityBean.endTime.split(' ')
            this.activity.endDate = endDateTime[0]
            this.activity.endTime = endDateTime[1]

            const orderDeadlineDateTime = activityBean.orderDeadline.split(' ')
            this.activity.orderDeadlineDate = orderDeadlineDateTime[0]
            this.activity.orderDeadlineTime = orderDeadlineDateTime[1]

            var selectedCitys = []
            selectedCitys[0] = activityBean.address.province
            selectedCitys[1] = activityBean.address.city
            selectedCitys[2] = activityBean.address.district
            this.selectedCitys = selectedCitys
            this.activity.detailAddress = activityBean.address.detail
            this.activity.maxParticipantCount = activityBean.maxParticipantCount
            if (activityBean.femaleParticipantPercent !== -1) {
              this.activity.femaleParticipantPercentOpen = true
              this.femaleParticipantPercentStyle.display = 'inline-block';
              this.activity.femaleParticipantPercent = activityBean.femaleParticipantPercent
            } else {
              this.activity.femaleParticipantPercentOpen = false
              this.femaleParticipantPercentStyle.display = 'none';
            }
            this.activity.fee = activityBean.fee
            this.activity.feeDescription = activityBean.feeDescription
            this.activity.organizerContactWay = activityBean.organizerContactWay


            var refundRuleModelList = activityBean.refundRuleModelList
            if (refundRuleModelList !== null && refundRuleModelList !== undefined) {
              this.activity.refundTime = refundRuleModelList[0].endTime
              this.activity.refundRuleOne = refundRuleModelList[0].id
              this.activity.refundRuleTwo = refundRuleModelList[1].id
              this.activity.rateBeforeRefundTime = refundRuleModelList[0].refundRate
              this.activity.rateAfterRefundTime = refundRuleModelList[1].refundRate
            }

            this.editor.txt.html(activityBean.otherInfo)
          } else {
            this.$alert(response.errMsg, '查询活动详情失败', {
              confirmButtonText: '确定',
              callback: action => {
                location.reload(true)
              }
            })
          }
        } else {
          this.$alert(response.statusText, '查询活动详情失败', {
            confirmButtonText: '确定',
            callback: action => {
              location.reload(true)
            }
          })
        }
      }).catch(error => {
        this.$alert(error, '查询活动详情失败', {
          confirmButtonText: '确定',
          callback: action => {
            location.reload(true)
          }
        })
      })
      this.editor.txt.html(this.activity.otherInfo)
    },
    createEditor() {
      this.editor = new WangEditor('#editorMenu', '#editor')

      this.editor.config.zIndex = 100
      // 隐藏网络图片上传的tab
      this.editor.config.showLinkImg = false
      // 一次最多传递1张图片
      this.editor.config.uploadImgMaxLength = 1
      // 关闭粘贴样式的过滤
      this.editor.config.pasteFilterStyle = false

      var that = this;
      this.editor.config.customUploadImg = function (resultFiles, insertImgFn) {
        var localFile = resultFiles[0]
        //var remoteFileName = getRandom(10) + localFile.name.substr(localFile.lastIndexOf('.'))
        var remoteFileName = localFile.name
        that.cos.putObject({
            Bucket: 'liangqing-1258329435', /* 必须 */
            Region: 'ap-beijing',     /* 存储桶所在地域，必须字段 */
            Key: 'activityPhotos/' + remoteFileName,              /* 必须 */
            StorageClass: 'STANDARD',
            Body: localFile, // 上传文件对象
            onProgress: function(progressData) {
                console.log(JSON.stringify(progressData))
            }
          }, function(err, data) {
            insertImgFn("https://liangqing-1258329435.cos.ap-beijing.myqcloud.com/activityPhotos/" + remoteFileName);
            console.log(err || data)
          });
      }

      this.editor.create()
    },
    updateActivity() {
      this.$refs.activityForm.validate((valid) => {
        if (valid) {
          var postData = {
            activityBean: {
              address: {
              }
            }
          }
          postData.activityBean.accountId = this.$store.state.user.accountId
          postData.activityBean.id = this.activityId

          postData.activityBean.subject = this.activity.subject
          postData.activityBean.otherInfo = this.editor.txt.html()
          postData.activityBean.type = this.activity.activityType
          postData.activityBean.beginTime = this.activity.beginDate + ' ' + this.activity.beginTime
          postData.activityBean.endTime = this.activity.endDate + ' ' + this.activity.endTime
          postData.activityBean.orderDeadline = this.activity.orderDeadlineDate + ' ' + this.activity.orderDeadlineTime
          if (this.selectedCitys === null || this.selectedCitys.length !== 3) {
            this.$alert('请补充活动所在省市县', '创建活动失败', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
            return
          }
          postData.activityBean.address.province = this.selectedCitys[0]
          postData.activityBean.address.city = this.selectedCitys[1]
          postData.activityBean.address.district = this.selectedCitys[2]
          postData.activityBean.address.detail = this.activity.detailAddress
          postData.activityBean.maxParticipantCount = this.activity.maxParticipantCount
          if (this.activity.femaleParticipantPercentOpen) {
            postData.activityBean.femaleParticipantPercent = this.activity.femaleParticipantPercent
          } else {
            postData.activityBean.femaleParticipantPercent = -1
          }
          postData.activityBean.fee = this.activity.fee
          postData.activityBean.feeDescription = this.activity.feeDescription
          postData.activityBean.organizerContactWay = this.activity.organizerContactWay

          var refundRuleModelList = []
          refundRuleModelList[0] = {
            id: this.activity.refundRuleOne,
            beginTime: null,
            endTime: this.activity.refundTime,
            refundRate: this.activity.rateBeforeRefundTime
          }
          refundRuleModelList[1] = {
            id: this.activity.refundRuleTwo,
            beginTime: this.activity.refundTime,
            endTime: null,
            refundRate: this.activity.rateAfterRefundTime
          }
          postData.activityBean.refundRuleModelList = refundRuleModelList

          postData.activityBean.description = ''
          postData.activityBean.flow = ''

          postData.activityBean.description = ''
          postData.activityBean.flow = ''
          console.log(postData)

          var _beginTime = new Date(postData.activityBean.beginTime.replace(/-/g, '/'))
          var _endTime = new Date(postData.activityBean.endTime.replace(/-/g, '/'))
          if (new Date() >= _beginTime) {
            this.$alert('开始时间已经过去，请修正！', '创建活动失败', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
            return
          }

          if (_beginTime >= _endTime) {
            this.$alert('活动开始时间迟于活动结束时间，请修正！', '创建活动失败', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
            return
          }

          updateActivityInfo(postData).then(response => {
            if (response.status === 200) {
              const data = response.data
              if (data !== null && data.status === true) {
                this.$router.push({ path: '/activity/detail', query: { activityId: this.activityId }})
              } else {
                this.$alert(data.errMsg, '更新活动失败', {
                  confirmButtonText: '确定',
                  callback: action => {
                    location.reload(true)
                  }
                })
              }
            } else {
              this.$alert(response.statusText, '更新活动失败', {
                confirmButtonText: '确定',
                callback: action => {
                }
              })
            }
          }).catch(error => {
            this.$alert(error, '更新活动失败', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center
}
#editor{
  height: 600px;
  resize: vertical;
  border:1px solid #ccc;
}
.w-e-toolbar{
  background-color: #f1f1f1;
  border: 1px solid #ccc;
}
</style>
