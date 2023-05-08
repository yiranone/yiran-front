<template>
  <page-layout title="会员列表">
    <div slot="headerContent">
    </div>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item :label="$t('memberId')">
                <a-input v-model="queryParam.memberId" placeholder="" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item :label="$t('phone')">
                <a-input v-model="queryParam.phone" placeholder="" allow-clear/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item :label="$t('name')">
                  <a-input v-model="queryParam.name" placeholder="" allow-clear/>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="handleQuery"><a-icon type="search" />{{$t('query_button')}}</a-button>
                <a-button style="margin-left: 8px" @click="resetQuery"><a-icon type="redo" />{{$t('reset_button')}}</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? $t('fold') : $t('expand') }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 操作 -->
      <div class="table-operations">
        <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPerm="['biz:member:add']">
          <a-icon type="plus" />{{$t('add_button')}}
        </a-button>
        <a-button type="danger" :disabled="!isSelected" @click="handleDelete" v-hasPerm="['biz:member:remove']">
          <a-icon type="delete" />{{$t('remove_button')}}
        </a-button>
        <table-setting
            :style="{float: 'right'}"
            :table-size.sync="tableSize"
            v-model="columns"
            :refresh-loading="loading"
            @refresh="getList" />
      </div>

      <standard-table
          :columns="columns"
          :dataSource="list"
          :size="tableSize"
          rowKey="memberId"
          :loading="loading"
          :total="total"
          :showSelectInfo='false'
          :showRowSelection='true'
          :pageSizeOptions="pageSizeOptions"
          :selectedRowKeys='selectedRowKeys'
          :selectedRows='selectedRows'
          :pageNum="pageNum"
          :pageSize="pageSize"
          :sortChange="onSortChange"
          :selectedRowChange="onSelectChange"
          :pageSizeChange="onPageSizeChange"
          :pageNumChange="onPageNumChange"
      >
        <template slot="status" slot-scope="{text,record}">
          <span v-html="statusStr(text,record)"></span>
        </template>
        <template slot="action" slot-scope="{text, record}">
          <a class="action-editor" style="margin-right: 8px" @click="$refs.createForm.handleUpdate(record, undefined)">
            <a-icon type="edit"/> {{$t('edit_button')}}
          </a>
          <a @click="handleDelete(record)" v-hasPerm="['biz:member:remove']">
            <a-icon type="delete" />{{$t('remove_button')}}
          </a>
          <a class="action-rest" style="margin-right: 8px" @click="$refs.passwordForm.handleUpdate(record, undefined)">
            <a-icon type="key"/> {{$t('reset_password_button')}}
          </a>
        </template>
      </standard-table>
      <MemberFrom ref="createForm" @ok="getList"/>
      <MemberPasswordForm ref="passwordForm"/>
    </a-card>
  </page-layout>
</template>

<script>
  import PageLayout from '@/layouts/PageLayout'
  import StandardTable from '@/components/table/StandardTable'
  import { tableMixin } from '@/store/table-mixin'

  import MemberFrom from './member-from'
  import MemberPasswordForm from './member-password-from'
  import {dataSource, dataSource as ds} from '@/services'
  import mapGetters, {mapState} from "vuex";

  const columns = [
    {
      title: '会员ID',
      key: 'memberId',
      dataIndex: 'memberId',
      sorter: true,
      align: 'center',
      width: 80
    }, {
      title: '手机号',
      key: 'phone',
      dataIndex: 'phone',
      sorter: true,
      align: 'center',
      width: 90
    }, {
      title: '会员名称',
      key: 'name',
      dataIndex: 'name',
      sorter: true,
      align: 'center',
      width: 90
    },{
      title: '渠道',
      key: 'channelName',
      dataIndex: 'channelName',
      sorter: true,
      align: 'center',
      width: 90
    }, {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      sorter: true,
      align: 'center',
      width: 80,
      scopedSlots: {customRender: 'status'}
    },{
      title: '最近登陆时间',
      key: 'loginDate',
      dataIndex: 'loginDate',
      align: 'center',
      sorter: true,
      width: 180
    }, {
      title: '更新时间',
      key: 'updateTime',
      dataIndex: 'updateTime',
      align: 'center',
      sorter: true,
      width: 180
    }, {
      title: '修改人',
      key: 'updateBy',
      dataIndex: 'updateBy',
      align: 'center',
      hidden: true,
      width: 80
    }, {
      title: '操作',
      key: 'operation',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'action'},
      align: 'center',
      width: 180,
    }
  ]

  export default {
    components: {MemberFrom, MemberPasswordForm, PageLayout, StandardTable},
    mixins: [tableMixin],
    i18n: require('./i18n'),
    data() {
      return {
        list: [],
        total: 0,
        loading: false,
        columns: columns,
      }
    },
    computed: {
      ...mapState('setting', ['lang']),
    },

    watch: {
      lang(val) {
        console.info("new lang:" + val)
        return columns.map(column => {
          column.title = this.$t(column.key)
        })
      }
    },

    filters: {
    },

    created() {
      columns.map(column => {
        column.title = this.$t(column.key)
      })
      this.getList()
    },

    methods: {
      statusStr(val,record) {
        return this.selectDictLabel(this.dictTypes.system_user_status, val)
      },
      /*获取数据列表*/
      getList() {
        this.loading = true
        ds.memberList(this.queryParam).then(data => {
          this.list = data.rows
          this.total = data.count
          this.loading = false
        }).catch(res => {
          this.loading = false
        })
      },

      /** 删除按钮操作 */
      handleDelete (row) {
        const that = this
        const selectedIds = row.memberId ?  [row.memberId] : this.selectedRowKeys
        this.$confirm({
          title: this.$t('delete_confirm_notice'),
          content: this.$t('current_select_data') + selectedIds,
          onOk () {
            return dataSource.memberRemove({ids:selectedIds})
                .then(() => {
                  that.onSelectChange([], [])
                  that.getList()
                  that.$message.success(that.$t('notice_delete_success'))
                })
          },
          onCancel () {}
        })
      }

    }
  }
</script>