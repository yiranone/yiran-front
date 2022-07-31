<template>
  <a-modal :visible="openView"
           :title="form.title"
           :width="900"
           :destroyOnClose="true"
           @cancel="handleCancel"
  >
    <template slot="footer" >
      <a-button @click="handleCancel">关闭</a-button>
    </template>
    <a-descriptions title="操作信息" layout="vertical">
      <a-descriptions-item label="操作模块">
        {{ form.title }}
      </a-descriptions-item>
      <a-descriptions-item label="登录信息">
        {{ form.operateName }} / {{ form.operateIp }} / {{ form.operateLocation }}
      </a-descriptions-item>
      <a-descriptions-item label="请求地址">
        {{ form.operateUrl }}
      </a-descriptions-item>
      <a-descriptions-item label="操作方法" span="2">
        <div style="word-break: break-all;">{{ form.method }}</div>
      </a-descriptions-item>
      <a-descriptions-item label="请求方式">
        {{ form.requestMethod }}
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions title="接口信息" layout="vertical">
      <a-descriptions-item label="请求参数" span="3">
        {{ form.operateParam }}
      </a-descriptions-item>
      <a-descriptions-item label="返回参数" span="3">
        {{ form.jsonResult }}
      </a-descriptions-item>
      <a-descriptions-item label="操作状态" span="2">
        <a-badge v-if="form.status === 'SUCCESS'" status="processing" text="正常" />
        <a-badge v-if="form.status === 'FAIL'" status="error" text="失败" />
      </a-descriptions-item>
      <a-descriptions-item label="操作时间" span="2">
        {{ form.operateTime}}
      </a-descriptions-item>
      <a-descriptions-item label="异常信息" span="3" v-if="form.status === 'FAIL'">
        {{ form.errorMsg }}
      </a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>

<script>

export default {
  name: 'ViewForm',
  props: {
  },
  data () {
    return {
      // 表单参数
      form: {},
      openView: false
    }
  },
  filters: {
  },
  created () {
  },
  computed: {
  },
  watch: {
  },
  methods: {
    handleView (row) {
      this.openView = true
      this.form = row
    },
    handleCancel () {
      this.openView = false
    }
  }
}
</script>
