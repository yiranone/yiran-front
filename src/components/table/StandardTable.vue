<template>
  <div class="standard-table">
    <div class="alert" v-if="showSelectInfo">
      <a-alert type="info" :show-icon="true" v-if="selectedRows">
        <div class="message" slot="message">
          已选择&nbsp;<a>{{selectedRows.length}}</a>&nbsp;项 <a class="clear" @click="onUnselectAll">清空</a>
          <template  v-for="(item, index) in needTotalList" >
            <div v-if="item.needTotal" :key="index">
              {{item.title}}总计&nbsp;
              <a>{{item.customRender ? item.customRender(item.total) : item.total}}</a>
            </div>
          </template>
        </div>
      </a-alert>
    </div>
    <a-table
        :lang="'EN'"
        :bordered="bordered"
        :loading="loading"
        :columns="columnNotHidden"
        :dataSource="dataSource"
        :pagination="pagination"
        :rowKey="rowKey"
        :size="size"
        :expandedRowKeys="expandedRowKeys"
        :defaultExpandedRowKeys="defaultExpandedRowKeys"
        :expandedRowRender="expandedRowRender"
        @change="sortChange"
        :rowSelection="showRowSelection ? {selectedRowKeys: selectedRowKeys, onChange: selectedRowChange} : undefined"
        @expand="expand"
    >
      <template slot-scope="text, record, index" :slot="slot" v-for="slot in Object.keys($scopedSlots).filter(key => key !== 'expandedRowRender') ">
        <slot :name="slot" v-bind="{text, record, index}"></slot>
      </template>
      <template :slot="slot" v-for="slot in Object.keys($slots)">
        <slot :name="slot"></slot>
      </template>
      <template slot-scope="record, index, indent, expanded" :slot="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''">
        <slot v-bind="{record, index, indent, expanded}" :name="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''"></slot>
      </template>
    </a-table>
    <!-- 分页 -->
    <a-pagination v-if="showPageButtons"
        class="ant-table-pagination"
        show-size-changer
        show-quick-jumper
        :current="pageNum"
        :total="total"
        :page-size="pageSize"
        :pageSizeOptions="pageSizeOptions"
        :hideOnSinglePage="hideOnSinglePage"
        :showTotal="totalDisplay"
        @showSizeChange="pageSizeChange"
        @change="pageNumChange"
    />
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: 'StandardTable',
  i18n: require('./i18n'),
  props: {
    showSelectInfo: {
      type: [Boolean],
      default: false
    },
    bordered: Boolean,
    loading: [Boolean, Object],
    columns: Array,
    dataSource: Array,
    size: {
      type: [String],
    },
    rowKey: {
      type: [String, Function],
      default: 'key'
    },
    showRowSelection: {
      type: [String, Boolean],
      default: true
    },
    showPageButtons: {
      type: [String, Boolean],
      default: true
    },
    hideOnSinglePage: {
      type: [String, Boolean],
      default: false
    },
    pageNum: Number,
    pageSize: Number,
    total: {
      type: [Number],
    },
    pageSizeOptions: Array,

    sortChange: {
      type: [Function],
      default : () => {}
    },
    selectedRowChange: {
      type: [Function],
      default : () => {}
    },
    pageSizeChange: {
      type: [Function],
      default : () => {}
    },
    pageNumChange: {
      type: [Function],
      default : () => {}
    },
    expand: {
      type: [Function],
      default : () => {}
    },

    selectedRows: Array,
    selectedRowKeys: Array,
    expandedRowKeys: Array,
    defaultExpandedRowKeys: Array,
    expandedRowRender: Function
  },
  data () {
    return {
      pagination:false,
      totalDisplay: total => this.$t('totalPrefix') + ` ${total} ` + this.$t('totalSuffix'),
      columnNotHidden:[],
      needTotalList: []
    }
  },
  methods: {
    initTotalList (columns) {
      // const totalList = columns.filter(item => item.needTotal)
      //     .map(item => {
      //       return {
      //         ...item,
      //         total: 0
      //       }
      //     })
      // return totalList
    },
    onUnselectAll() {
      this.selectedRowChange([], [])
      this.$emit('onUnselectAll')
    },
    onPageChange(pagination, filters, sorter, {currentDataSource}) {
      this.$emit('pageChange', pagination, filters, sorter, {currentDataSource})
    }
  },
  created () {
    this.needTotalList = this.initTotalList(this.columns);
    this.columnNotHidden = this.columns.filter(item => !item.hidden);
    //this.columnNotHidden = this.columns.filter(item => !item.hidden);
    // this.columnNotHidden = this.columns;
  },
  watch: {
    // 监控columns的hidden属性 为true的不显示
    columns : {
      handler (val) {
         this.columnNotHidden = this.columns.filter(item => !item.hidden);
      },
      deep : true
    },
    lang(val) {
      console.info("standard table listen new lang:" + val)
      // return this.columns.map(column => {
      //   if(column.key != null)
      //     column.title = this.$t(column.key)
      //   return column
      // })
    }
    // selectedRows (selectedRows) {
    //   this.needTotalList = this.needTotalList.map(item => {
    //     return {
    //       ...item,
    //       total: selectedRows.reduce((sum, val) => {
    //         let v
    //         try{
    //           v = val[item.dataIndex] ? val[item.dataIndex] : eval(`val.${item.dataIndex}`);
    //         }catch(_){
    //           v = val[item.dataIndex];
    //         }
    //         v = !isNaN(parseFloat(v)) ? parseFloat(v) : 0;
    //         return sum + v
    //       }, 0)
    //     }
    //   })
    // }
  },
  computed: {
    ...mapState('setting', ['lang']),
    // selectedRowKeys() {
    //   if(this.selectedRows == null)
    //     return []
    //   return this.selectedRows.map(record => {
    //     return (typeof this.rowKey === 'function') ? this.rowKey(record) : record[this.rowKey]
    //   })
    // }
  }
}
</script>

<style scoped lang="less">
.standard-table{
  .alert{
    margin-bottom: 16px;
    .message{
      a{
        font-weight: 600;
      }
    }
    .clear{
      float: right;
    }
  }
}
</style>
