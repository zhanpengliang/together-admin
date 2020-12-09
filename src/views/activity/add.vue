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
        <el-select v-model="activity.activityType" placeholder="请选择活动类型">
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
            <el-date-picker v-model="activity.beginDate" value-format="yyyy-MM-dd" type="date" placeholder="请选择活动日期" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-form-item prop="beginTime">
            <el-time-picker v-model="activity.beginTime" format="HH:mm" value-format="HH:mm" type="fixed-time" placeholder="请选择活动时间" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="活动结束时间" required>
        <el-col :span="11">
          <el-form-item prop="endDate">
            <el-date-picker v-model="activity.endDate" value-format="yyyy-MM-dd" type="date" placeholder="请选择活动日期" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-form-item prop="endTime">
            <el-time-picker v-model="activity.endTime" format="HH:mm" value-format="HH:mm" type="fixed-time" placeholder="请选择活动时间" style="width: 100%" />
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

      <el-form-item label="活动地点" required>
        <el-cascader style="width: 100%" expand-trigger="hover" :props="citysProps" :options="citys" v-model="selectedCitys" @change="handleCitysChange">
        </el-cascader>
      </el-form-item>

      <el-form-item label="活动详细地点" prop="detailAddress">
        <el-input v-model="activity.detailAddress" />
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
              <el-input-number  v-model="activity.femaleParticipantPercent" :min="0" :max="100">
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

      <el-form-item label="退款说明" required>
        <el-col style="width: 190px;">
          <el-form-item prop="refundTime">
            <el-date-picker style="width: 190px;"  v-model="activity.refundTime" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col style="width: 70px;" class="line">前手续费</el-col>
        <el-col style="width: 170px;">
          <el-form-item prop="rateBeforeRefundTime">
            <el-input-number style="width: 140px;" v-model="activity.rateBeforeRefundTime" :min="0" :max="100">
            </el-input-number>
            <span>&emsp;%</span>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-col style="width: 190px;">
          <el-form-item>
            <el-date-picker style="width: 190px;" disabled="true" v-model="activity.refundTime" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col style="width: 70px;" class="line">后手续费</el-col>
        <el-col style="width: 170px;">
          <el-form-item prop="rateAfterRefundTime">
            <el-input-number style="width: 140px;" v-model="activity.rateAfterRefundTime" :min="0" :max="100">
            </el-input-number>
            <span>&emsp;%</span>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="联系方式" prop="organizerContactWay">
        <el-input placeholder="用于用户咨询" v-model="activity.organizerContactWay" />
      </el-form-item>

      <el-form-item>
        <el-col :span="16">
          <el-button style="width: 140px;" type="primary" @click="insertActivity(0)">创建草稿</el-button>
        </el-col>
        <el-col :span="8">
          <el-button style="width: 140px;" @click="insertActivity(1)">创建并发布活动</el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addActivity } from '@/api/activityAdd.js'
import { queryCredential } from '@/api/getCredential.js'
import { getRandom } from '@/utils/random.js'
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
      editor: null,
      cos: null,
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
        femaleParticipantPercent: 50,
        fee: '',
        feeDescription: '',
        refundTime: '',
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
      }
    }
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
    this.editor = new WangEditor('#editorMenu', '#editor')
    this.initEditor(this.editor)
    this.editor.create()
  },
  methods: {
    changeFemaleParticipantPercentOpen() {
      if (this.activity.femaleParticipantPercentOpen) {
        this.femaleParticipantPercentStyle.display = 'inline-block';
      } else {
        this.femaleParticipantPercentStyle.display = 'none';
      }
    },
    insertActivity(activityStatus) {
      this.$refs.activityForm.validate((valid) => {
        if (valid) {
          if (activityStatus === 1) { // 直接发布活动
            this.$confirm('发布活动后，活动类型、时间、地点与退款规则，不再允许修改，是否继续？', '发布说明', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              console.log("test 1")
              this.doInsertActivity(activityStatus)
              console.log("test 2")
            }).catch(() => {
              console.log("test 3")
            });
          } else { // 存为草稿
            this.doInsertActivity(activityStatus)
          }
        } else {
          return false
        }
      })
    },
    doInsertActivity(activityStatus) {
      var postData = {
        activityBean: {
          address: {
          }
        }
      }
      postData.activityBean.accountId = this.$store.state.user.accountId
      postData.activityBean.activityStatus = activityStatus

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
        beginTime: null,
        endTime: this.activity.refundTime,
        refundRate: this.activity.rateBeforeRefundTime
      }
      refundRuleModelList[1] = {
        beginTime: this.activity.refundTime,
        endTime: null,
        refundRate: this.activity.rateAfterRefundTime
      }
      postData.activityBean.refundRuleModelList = refundRuleModelList

      postData.activityBean.description = ''
      postData.activityBean.flow = ''


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

      addActivity(postData).then(response => {
        if (response.status === 200) {
          const data = response.data
          if (data !== null && data.status === true) {
            this.$router.push({ path: '/activity/detail', query: { activityId: data.activityId }})
          } else {
            this.$alert(data.errMsg, '创建活动失败', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
          }
        } else {
          this.$alert(response.statusText, '创建活动失败', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
          return
        }
      }).catch(error => {
        this.$alert(error, '创建活动失败', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
      })
    },
    initEditor(editor) {
      editor.config.zIndex = 100

      // 显示本地图片上传的tab
      editor.config.uploadImgServer = 'https://www.liangqingzaixian.com:9999/image/upload'
      // this.editor.config.uploadImgServer = 'http://127.0.0.1:9999/image/upload'
      // 隐藏网络图片上传的tab
      editor.config.showLinkImg = false
      // 一次最多传递1张图片
      editor.config.uploadImgMaxLength = 1
      // 关闭粘贴样式的过滤
      editor.config.pasteFilterStyle = false

      var that = this;
      editor.config.customUploadImg = function (resultFiles, insertImgFn) {
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
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center
}
.w-e-toolbar{
  background-color: #f1f1f1;
  border: 1px solid #ccc;
}
</style>
