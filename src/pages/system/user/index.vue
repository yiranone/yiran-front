<template>
  <page-layout title=" ">
    <div slot="headerContent">
    </div>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
              <a-col class="auto" v-if="user.isAdmin">
                  <a-form-item :label="$t('channelName')">
                      <a-select placeholder="请选择" v-model="queryParam.channelId" allow-clear>
                          <a-select-option v-for="(d, index) in this.channelList" :key="index" :value="d.channelId">{{ d.channelName }}</a-select-option>
                      </a-select>
                  </a-form-item>
              </a-col>
              <a-col class="auto">
              <a-form-item label="登录名">
                <a-input v-model="queryParam.loginName" placeholder="" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col class="auto">
              <a-form-item label="手机号">
                <a-input v-model="queryParam.phoneNumber" placeholder="" allow-clear/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col class="auto">
                <a-form-item label="用户ID">
                  <a-input v-model="queryParam.userId" placeholder="" allow-clear/>
                </a-form-item>
              </a-col>
              <a-col class="auto">
                <a-form-item label="用户名称">
                  <a-input v-model="queryParam.userName" placeholder="" allow-clear/>
                </a-form-item>
              </a-col>
              <a-col class="auto">
                <a-form-item label="部门">
                  <a-tree-select
                      v-model="queryParam.deptId"
                      :tree-data="deptOptions"
                      placeholder=""
                      :replaceFields="replaceFields"
                      :treeExpandedKeys.sync="deptTreeExpandedKeys"
                      allowClear/>
                </a-form-item>
              </a-col>
              <a-col class="auto">
                <a-form-item label="状态">
                  <a-select placeholder="请选择" v-model="queryParam.status" style="width: 100%" allow-clear>
                    <a-select-option v-for="(d, index) in this.$store.getters.system_user_status" :key="index" :value="d.value">{{ d.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col class="auto" v-if="hasPermission('system:role:view')">
                <a-form-item label="角色">
                  <a-select placeholder="请选择" v-model="queryParam.roleId" :filterOption="filterOption" :showSearch="true" style="width: 100%" allow-clear>
                    <a-select-option v-for="(d, index) in roleList" :key="index" :value="d.roleId"> {{ d.roleName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <a-col class="auto">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleQuery"><a-icon type="search" />查询</a-button>
                <a-button style="margin-left: 8px" @click="resetQuery"><a-icon type="redo" />重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 操作 -->
      <div class="table-operations">
        <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPerm="['system:user:add']">
          <a-icon type="plus" />新增
        </a-button>
        <a-button type="danger" :disabled="!isSelected" @click="handleDelete" v-hasPerm="['system:user:delete']">
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
          rowKey="userId"
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
        <template slot="avatar" slot-scope="{text}">
          <a-avatar :src="text" :size="26" icon="user"></a-avatar>
        </template>
        <template slot="roleNames" slot-scope="{text}">
          <a-tag color="blue" v-for="(item) in text" :key="item">{{item}}</a-tag>
        </template>
        <template slot="status" slot-scope="{text,record}">
          <span v-html="statusStr(text)"></span>
          <a-icon v-if="record.isLock" type="lock" theme="twoTone" two-tone-color="red"/>
        </template>
        <template slot="time" slot-scope="{text, record}">
          {{record | timeStr}}
        </template>
        <template slot="action" slot-scope="{text, record}">
          <a class="action-editor" v-if="hasPermission('system:user:edit')" :class="{'disabled': record.admin}" style="margin-right: 8px" @click="$refs.createForm.handleUpdate(record, undefined)">
            <a-icon type="edit"/>
            编辑
          </a>
          <a-divider type="vertical" v-if="hasPermission('system:user:resetPwd') || hasPermission('system:user:unlock') && record.isLock"/>
          <a-dropdown v-if="hasPermission('system:user:resetPwd') || hasPermission('system:user:unlock') && record.isLock">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              更多操作 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-if="hasPermission('system:user:resetPwd')">
                <a @click="$refs.resetPasswordForm.handleResetPwd(record)" >
                  <a-icon type="key" />重置密码
                </a>
              </a-menu-item>
              <a-menu-item v-if="hasPermission('system:user:unlock') && record.isLock">
                <a @click="unlock(record)">
                  <a-icon type="unlock" />解锁用户
                </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </standard-table>
      <m-form ref="createForm" :deptOptions="deptOptions"
                :statusOptions="statusOptions"
                :sexOptions="sexOptions"
                :channelOptions="channelList"
                :roleList="roleList"
              @ok="getList"/>
      <reset-password ref="resetPasswordForm"/>
    </a-card>
  </page-layout>
</template>

<script>
  import PageLayout from '@/layouts/PageLayout'
  import StandardTable from '@/components/table/StandardTable'
  import { tableMixin } from '@/store/table-mixin'

  import MForm from './user-form'
  import ResetPassword from "./reset-password";
  import {dataSource, metadataSource as ms} from '@/services/index'
  import {mapGetters} from "vuex";

  const columns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      sorter: true,
      align: 'center',
      width: 80
    }, {
      title: '头像',
      dataIndex: 'avatar',
      align: 'center',
      width: 90,
      scopedSlots: {customRender: 'avatar'}
    },{
      title: '登录账号',
      dataIndex: 'loginName',
      sorter: true,
      align: 'center',
      width: 90
    }, {
      title: '用户名称',
      dataIndex: 'userName',
      sorter: true,
      align: 'center',
      width: 90
    }, {
      title: '手机',
      dataIndex: 'phoneNumber',
      sorter: true,
      align: 'center',
      width: 100
    }, {
      title: '邮箱',
      dataIndex: 'email',
      sorter: true,
      align: 'center',
      width: 100
    },{
      title: '部门',
      dataIndex: 'deptName',
      sorter: true,
      align: 'center',
      width: 100
    }, {
      title: '角色',
      dataIndex: 'roleNames',
      align: 'left',
      ellipsis: true,
      width: 120,
      scopedSlots: {customRender: 'roleNames'}
    }, {
      title: '状态',
      dataIndex: 'status',
      sorter: true,
      align: 'center',
      width: 80,
      scopedSlots: {customRender: 'status'}
    }, {
      title: '登录时间',
      dataIndex: 'loginDate',
      align: 'center',
      sorter: true,
      width: 180
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      sorter: true,
      width: 180,
      scopedSlots: {customRender: 'time'}
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'center',
      hidden: true,
      sorter: true,
      width: 180,
      scopedSlots: {customRender: 'time'}
    }, {
      title: '修改人',
      dataIndex: 'updateBy',
      sorter: true,
      hidden: true,
      align: 'center',
      width: 80
    }, {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'action'},
      align: 'center',
      width: 180,
    }
  ]

  export default {
    components: {PageLayout, StandardTable, MForm, ResetPassword},
    mixins: [tableMixin],
    data() {
      return {
        list: [],
        total: 0,
        loading: false,
        columns: columns,

        // 状态数据字典
        statusOptions: [],
        sexOptions: [],
        // 部门树选项
        deptOptions: [],
        roleList: [],
        replaceFields: {
          key: 'id',
          value: 'id',
          title: 'name'
        },
        deptTreeExpandedKeys: [1],
      }
    },

    created() {
      this.getRoleList()
      this.getDeptTree()
      this.statusOptions = this.$store.getters.system_user_status
      this.getList()
    },

    computed: {
        ...mapGetters(['user','channelList'])
    },

    filters: {
      timeStr(val) {
        return val.updateTime || val.createTime || '-'
      }
    },

    // beforeRouteLeave(to, from, next) {
    //   this.formVisible = false
    //   next()
    // },

    methods: {
      statusStr(val) {
        return this.selectDictLabel(this.statusOptions, val)
      },
      filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      },
      showDropMenu(row){
        const hasReset = this.hasPermission('system:user:resetPwd')
        const hasUnlock = this.hasPermission('system:user:unlock')
        return hasReset || (row.isLock && hasUnlock)
      },
      /*获取数据列表*/
      getList() {
        this.loading = true
        dataSource.userList(this.queryParam).then(res => {
          const {rows, count} = res
          this.list = rows
          this.total = count
          this.loading = false
        }).catch(res => {
          this.loading = false
        })
      },

      /*获取角色列表*/
      getRoleList() {
        const hasRole = this.hasPermission('system:role:view')
        if(hasRole) {
          dataSource.roleList({pageNum: 1, pageSize: 1000}).then(res => {
            const {rows, count} = res
            this.roleList = rows
          })
        } else {
          this.roleList = []
        }
      },

      getDeptTree () {
        ms.deptTree().then(data => {
          this.deptOptions = data
        })
      },
      /** 解锁用户 */
      unlock (row) {
        var that = this
        this.$confirm({
          title: '确认解锁用户?',
          content: '当前选中用户为' + row.loginName + '',
          onOk () {
            return dataSource.userUnlock({userId:row.userId})
                .then(() => {
                  that.getList()
                  that.$message.success('解锁成功')
                }).finally(()=>{
                })
          },
          onCancel () {}
        })
      },
      /** 删除按钮操作 */
      handleDelete (row) {
        var that = this
        const selectedIds = row.userId ?  [row.userId] : this.selectedRowKeys
        this.$confirm({
          title: '确认删除所选中数据?',
          content: '当前选中编号为' + selectedIds + '的数据',
          onOk () {
            return dataSource.userDelete({userIds:selectedIds})
                .then(() => {
                  that.onSelectChange([], [])
                  that.getList()
                  that.$message.success('删除成功')
                }).finally(()=>{
                })
          },
          onCancel () {}
        })
      }
    }
  }
</script>