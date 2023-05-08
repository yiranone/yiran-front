import {mapGetters, mapState} from 'vuex'

const tableMixin = {
  data () {
    return {
      // tableSize1: '',
      tableSize: this.$store.state.setting.tableSize,
      // 高级搜索 展开/关闭
      advanced: false,
      pageNum: 1,
      pageSize: 10,
      pageSizeOptions: ['10','20','50','100','500'],
      lastName: '',
      queryParam: {
        pageNum: 1,
        pageSize: 10,
      },
      selectedRowKeys: [],
      selectedRows: [],
      isSelected: false,
      isSelectedMultiple: false,
      isSelectedSingle: false,
      timeRange:
          {
            今天: [this.$moment().startOf('day'), this.$moment()],
            昨天: [this.$moment().startOf('day').subtract(1,'days'), this.$moment().endOf('day').subtract(1, 'days')],
            最近三天: [this.$moment().startOf('day').subtract(2, 'days'), this.$moment().endOf('day')],
            最近一周: [this.$moment().startOf('day').subtract(1, 'weeks'), this.$moment()],
            最近一月: [this.$moment().startOf('day').subtract(1, 'month'), this.$moment()],
            本月: [this.$moment().startOf('month'), this.$moment().endOf('month')],
            本年: [this.$moment().startOf('year'), this.$moment().endOf('year')]
          },
    }
  },

  computed: {
    ...mapGetters('account', ['dictTypes']),
    ...mapState({
      tableBordered: state => state.setting.tableBordered
    }),
    // tableSize: {
    //   get () {
    //     return this.tableSize1 || this.$store.state.setting.tableSize
    //   },
    //   set (value) {
    //     this.tableSize1 = value
    //   }
    // }
  },
  methods:{
    doGetData(){
      this.getList()
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.pageNum = 1
      this.queryParam.pageNum = 1
      if(this.whenHandleQuery != null) {
        this.whenHandleQuery()
      }
      if(this.getList != null) {
        this.doGetData()
      }
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.dateRange = []
      this.queryParam = {
        pageNum: 1,
        pageSize: this.pageSize,
        orderByColumn: this.queryParam.orderByColumn,
        orderDirection: this.queryParam.orderDirection,
      }
      if(this.whenResetQuery != null) {
        this.whenResetQuery()
      }
      this.doGetData()
    },
    //每页展示数量改变
    onShowSizeChange (current, pageSize) {
      this.queryParam.pageNum = current
      this.queryParam.pageSize = pageSize
      this.pageNum = current
      this.pageSize = pageSize
      this.doGetData()
    },
    onPageSizeChange (current, pageSize) {
      this.queryParam.pageNum = current
      this.queryParam.pageSize = pageSize
      this.pageNum = current
      this.pageSize = pageSize
      this.doGetData()
    },
    //第几页改变
    changeSize (current, pageSize) {
      this.queryParam.pageNum = current
      this.queryParam.pageSize = pageSize
      this.pageNum = current
      this.pageSize = pageSize
      this.doGetData()
    },
    onPageNumChange (current, pageSize) {
      this.queryParam.pageNum = current
      this.queryParam.pageSize = pageSize
      this.pageNum = current
      this.pageSize = pageSize
      this.doGetData()
    },
    //排序改变
    onSortChange(pagination, filters, sorter, {currentDataSource}) {
      this.queryParam = {
        ...this.queryParam,
        orderByColumn: sorter.columnKey,
        orderDirection: sorter.order ? sorter.order == 'ascend' ? 'ASC' : 'DESC' : undefined
      }
      this.doGetData()
    },
    //表格选择行改变
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      //this.selectedIds = this.selectedRows.map(item => item[this.rowKey])
      this.isSelected = selectedRowKeys.length > 0
      this.isSelectedMultiple = selectedRowKeys.length > 1
      this.isSelectedSingle = selectedRowKeys.length == 1
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
  }
}

export {
  tableMixin
}
