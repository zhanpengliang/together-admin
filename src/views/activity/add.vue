<template>
  <div class="app-container">
    <el-form ref="activityForm" :model="activity" label-width="120px" :rules="rules" style="width: 80%; padding-left: 20px">

      <el-form-item label="活动主题" prop="subject">
        <el-input v-model="activity.subject" />
      </el-form-item>

      <el-form-item label="活动描述">
        <div id="editorMenu" />
        <div id="editor" ref="editor" style="text-align:left;" />
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
            <el-time-picker v-model="activity.beginTime" value-format="HH:mm" type="fixed-time" placeholder="请选择活动时间" style="width: 100%" />
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
            <el-time-picker v-model="activity.endTime" value-format="HH:mm" type="fixed-time" placeholder="请选择活动时间" style="width: 100%" />
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
            <el-time-picker v-model="activity.orderDeadlineTime" value-format="HH:mm" type="fixed-time" placeholder="请选择活动时间" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="活动地点" required>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="province">
              <el-select v-model="activity.province" placeholder="请选择省">
                <el-option label="北京" value="北京" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="city">
              <el-select v-model="activity.city" placeholder="请选择市">
                <el-option label="北京" value="北京" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="district">
              <el-select v-model="activity.district" placeholder="请选择县">
                <el-option label="东城区" value="东城区" />
                <el-option label="西城区" value="西城区" />
                <el-option label="朝阳区" value="朝阳区" />
                <el-option label="丰台区" value="丰台区" />
                <el-option label="石景山区" value="石景山区" />
                <el-option label="海淀区" value="海淀区" />
                <el-option label="门头沟区" value="门头沟区" />
                <el-option label="房山区" value="房山区" />
                <el-option label="通州区" value="通州区" />
                <el-option label="顺义区" value="顺义区" />
                <el-option label="昌平区" value="昌平区" />
                <el-option label="大兴区" value="大兴区" />
                <el-option label="怀柔区" value="怀柔区" />
                <el-option label="平谷区" value="平谷区" />
                <el-option label="密云区" value="密云区" />
                <el-option label="延庆区" value="延庆区" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="活动详细地点" prop="detailAddress">
        <el-input v-model="activity.detailAddress" />
      </el-form-item>

      <el-form-item label="人数要求" required>
        <el-col>
          <el-form-item label="总人数" prop="maxParticipantCount">
            <el-input v-model.number="activity.maxParticipantCount" type="number" />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="女生占比" prop="femaleParticipantPercent">
            <el-slider v-model="activity.femaleParticipantPercent" />
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="活动费用(元)" prop="fee">
        <el-input v-model="activity.fee" type="number" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="insertActivity(0)">创建活动</el-button>
        <el-button @click="insertActivity(1)">创建并发布活动</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addActivity } from '@/api/activityAdd.js'
import { queryCredential } from '@/api/getCredential.js'
import { getRandom } from '@/utils/random.js'

import WangEditor from 'wangeditor'
import COS from 'cos-js-sdk-v5'


export default {
  data() {
    return {
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
        femaleParticipantPercent: 50,
        fee: ''
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
        province: [
          { required: true, message: '请选择活动省', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请选择活动市', trigger: 'blur' }
        ],
        district: [
          { required: true, message: '请选择活动县（区）', trigger: 'blur' }
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
    insertActivity(activityStatus) {
      this.$refs.activityForm.validate((valid) => {
        if (valid) {
          /**
          const result = validateParam()
          if (result.status === false) {
            this.$alert(result.errMsg, '填写有误，请更正', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
          }
          **/

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
          postData.activityBean.address.province = this.activity.province
          postData.activityBean.address.city = this.activity.city
          postData.activityBean.address.district = this.activity.district
          postData.activityBean.address.detail = this.activity.detailAddress
          postData.activityBean.maxParticipantCount = this.activity.maxParticipantCount
          postData.activityBean.femaleParticipantPercent = this.activity.femaleParticipantPercent
          postData.activityBean.fee = this.activity.fee
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
        } else {
          return false
        }
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
