<template>
  <page-layout title=" ">
    <div slot="headerContent">
    </div>
    <a-card>
      <!-- 操作 -->
      <div class="table-operations">
        <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPerm="['system:role:add']">
          <a-icon type="plus" />新增
        </a-button>
        <a-button type="danger" :disabled="!isSelected" @click="handleDelete" v-hasPerm="['system:role:delete']">
          <a-icon type="delete" />删除
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
          rowKey="roleId"
          :loading="loading"
          :total="total"
          :showSelectInfo='false'
          :showRowSelection='true'
          :selectedRowKeys='selectedRowKeys'
          :selectedRows='selectedRows'
          :pageNum="pageNum"
          :pageSize="pageSize"
          :pageSizeOptions="pageSizeOptions"
          :sortChange="onSortChange"
          :selectedRowChange="onSelectChange"
          :pageSizeChange="onPageSizeChange"
          :pageNumChange="onPageNumChange"
      >
        <template slot="status" slot-scope="{text, record}">
          <span v-html="statusStr(text, record)"></span>
        </template>
        <template slot="action" slot-scope="{text, record}">
          <a @click="$refs.createForm.handleUpdate(record, undefined)" v-hasPerm="['system:role:edit']">
            <a-icon type="edit" />
            修改
          </a>
          <a-divider type="vertical" v-hasPerm="['system:role:auth']" />
          <a-dropdown v-hasPerm="['system:role:auth']">
            <a-menu slot="overlay">
<!--              <a-menu-item>
                <a @click="$refs.createDataScopeForm.handleDataScope(record)">
                  <a-icon type="lock" />
                  数据权限
                </a>
              </a-menu-item>-->
              <a-menu-item>
                <a @click="handleAuthUser(record)">
                  <a-icon type="user-add" />
                  分配用户
                </a>
              </a-menu-item>
            </a-menu>
            <a class="" style="white-space: nowrap">
              更多操作 <a-icon type="down" />
            </a>
          </a-dropdown>
        </template>
      </standard-table>
      <CreateForm ref="createForm" :statusOptions="statusOptions" @ok="getList"/>
    </a-card>
  </page-layout>
</template>

<script>
  import PageLayout from '@/layouts/PageLayout'
  import StandardTable from '@/components/table/StandardTable'
  import { tableMixin } from '@/store/table-mixin'

  import CreateForm from './role-form'
  import {dataSource, dataSource as ds, metadataSource} from '@/services/index'
  import {mapState} from 'vuex'

  const columns = [
    {
      title: '角色编号',
      dataIndex: 'roleId',
      sorter: true,
      align: 'center',
      width: 60
    }, {
      title: '角色名称',
      dataIndex: 'roleName',
      sorter: true,
      align: 'center',
      width: 100
    }, {
      title: '权限字符',
      dataIndex: 'roleKey',
      sorter: true,
      align: 'center',
      width: 120
    }, {
      title: '显示顺序',
      dataIndex: 'roleSort',
      sorter: true,
      align: 'center',
      width: 100
    }, {
      title: '状态',
      dataIndex: 'status',
      sorter: true,
      align: 'center',
      width: 100,
      scopedSlots: {customRender: 'status'}
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'center',
      sorter: true,
      width: 100,
    }, {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'action'},
      align: 'center',
      width: 150,
    }
  ]

  export default {
    components: {PageLayout, StandardTable, CreateForm},
    mixins: [tableMixin],
    data() {
      return {
        list: [],
        total: 0,
        loading: false,
        columns: columns,
        permsList: [],
        statusOptions: [],
        batchDeleteLoading: false
      }
    },
    filters: {
      timeStr(val) {
        return val.updateTime || val.createTime || '-'
      }
    },

    computed: {
        ...mapState('account', ['user'])
    },

    created() {
      this.getList()
      //this.getPermsList()
    },

    methods: {
      statusStr (text, row) {
        return this.selectDictLabel(this.$store.getters.system_normal_disable, text)
      },
      /*获取数据列表*/
      getList() {
        this.loading = true
        ds.roleList(this.queryParam).then(res => {
          const {rows, count} = res
          this.list = rows
          this.total = count
          this.loading = false
        }).catch(res => {
          this.loading = false
        })
      },

      /*获取权限列表*/
      getPermsList() {
        // ds.permsList({pageNum: 1, pageSize: 10000}).then(res => {
        //   const {rows, count} = res
        //   this.permsList = rows
        // })
      },

      /** 删除按钮操作 */
      handleDelete (row) {
        var that = this
        const roleIds = row.roleId ?  [row.roleId] : this.selectedRowKeys
        this.$confirm({
          title: '确认删除所选中数据?',
          content: '当前选中编号为' + roleIds + '的数据',
          onOk () {
            return dataSource.roleRemove({roleIds:roleIds})
                .then(() => {
                  that.onSelectChange([], [])
                  that.getList()
                  that.$message.success('删除成功')
                })
          },
          onCancel () {}
        })
      },

      /** 导出按钮操作 */
      handleExport () {
        var that = this
        this.$confirm({
          title: '是否确认导出?',
          content: '此操作将导出当前条件下所有数据而非选中数据',
          onOk () {
            that.download('system/role/export', {
              ...that.queryParam
            }, `角色_${new Date().getTime()}.xlsx`)
          },
          onCancel () {}
        })
      },
      /** 分配用户操作 */
      handleAuthUser (row) {
        const roleId = row.roleId
        this.$router.push({ path: '/auth/authUser', query: { roleId: roleId } })
      }
    }
  }
</script>
