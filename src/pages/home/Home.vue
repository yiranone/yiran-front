<template>
    <div class="analysis">
        <a-row style="margin-top: 0" :gutter="[24, 24]">
            <!--会员注册数量-->
            <a-col :sm="24" :md="12" :xl="6">
                <chart-card :loading="loading" title="会员总数" :total="totalRegisterCount">
                    <a-tooltip title="用户信息" slot="action">
                        <a-icon type="info-circle-o" />
                    </a-tooltip>
                    <div>
                        <trend style="margin-right: 16px" term="昨日比上一天" :percent="lastDayPercent" :is-increase="lastDayPercent >= 0" :scale="0" />
                        <trend term="昨日比上一周" :percent="lastWeekPercent" :is-increase="lastWeekPercent >= 0" :scale="0"/>
                    </div>
                    <div slot="footer">昨日新增会员<span> {{lastDayRegisterCount}}</span> <span style="float: right">当日新增会员  {{todayRegisterCount}}</span></div>
                </chart-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6">
                <chart-card :loading="loading" title="最近2周登陆用户" :total="twoWeeksLoginCount">
                    <a-tooltip title="最近2周登陆过的用户是活跃用户" slot="action">
                        <a-icon type="info-circle-o" />
                    </a-tooltip>
                    <div class="mini-chart">
                        <div class="chart-content" :style="{height: 46}">
                            <v-chart :force-fit="true" :height="height" :data="loginCountDatas" :padding="[36, 5, 18, 5]">
                                <v-tooltip />
                                <v-smooth-area position="x*y"/>
                            </v-chart>
                        </div>
                    </div>
                    <div slot="footer">日均登陆<span>{{averageLoginCount}}</span></div>
                </chart-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6">
                <chart-card :loading="loading" title="最近2周注册用户" :total="twoWeeksRegisterCount">
                    <a-tooltip title="最近2周注册用户" slot="action">
                        <a-icon type="info-circle-o" />
                    </a-tooltip>
                    <div class="mini-chart">
                        <div class="chart-content" :style="{height: 46}">
                            <v-chart :force-fit="true" :height="height" :data="registerCountDatas" :padding="[36, 5, 18, 5]">
                                <v-tooltip />
                                <v-smooth-area position="x*y"/>
                            </v-chart>
                        </div>
                    </div>
                    <div slot="footer">日均注册<span>{{averageRegisterCount}}</span></div>
                </chart-card>
            </a-col>
            <!--      <a-col :sm="24" :md="12" :xl="6">
                    <chart-card :loading="loading" :title="$t('payments')" total="￥ 189,345">
                      <a-tooltip :title="$t('introduce')" slot="action">
                        <a-icon type="info-circle-o" />
                      </a-tooltip>
                      <div>
                        <mini-bar />
                      </div>
                      <div slot="footer">{{$t('conversion')}} <span>60%</span></div>
                    </chart-card>
                  </a-col>
                  <a-col :sm="24" :md="12" :xl="6">
                    <chart-card :loading="loading" :title="$t('operating')" total="73%">
                      <a-tooltip :title="$t('introduce')" slot="action">
                        <a-icon type="info-circle-o" />
                      </a-tooltip>
                      <div>
                        <mini-progress target="90" percent="78" color="#13C2C2" height="8px"/>
                      </div>
                      <div slot="footer" style="white-space: nowrap;overflow: hidden">
                        <trend style="margin-right: 16px" :term="$t('wow')" :percent="12" :is-increase="true" :scale="0" />
                        <trend :term="$t('dod')" :target="100" :value="89" :scale="0" />
                      </div>
                    </chart-card>
                  </a-col>-->
        </a-row>
    </div>
</template>

<script>
import Trend from "@/components/chart/Trend";
import ChartCard from '@/components/card/ChartCard'
import {dataSource} from "@/services";


const tooltip = [
    'x*y',
    (x, y) => ({
        name: x,
        value: y
    })
]

const scale = [{
    dataKey: 'x',
    min: 2
}, {
    dataKey: 'y',
    title: '时间',
    min: 1,
    max: 22
}]

export default {
    name: 'Analysis',
    i18n: require('./i18n'),
    data () {
        return {
            loading: true,
            totalRegisterCount : 0,
            todayRegisterCount : 0,
            lastDayRegisterCount : 0,
            lastLastDayRegisterCount : 0,
            lastDayPercent : 0,
            lastWeekPercent : 0,
            loginCountDatas:[],
            scale,

            tooltip,
            height: 100,
            averageLoginCount:0,
            twoWeeksLoginCount:0,

            registerCountDatas:[],
            averageRegisterCount:0,
            twoWeeksRegisterCount:0,
        }
    },
    created() {
        // setTimeout(() => this.loading = !this.loading, 100)
        this.getMemberCount()
    },
    methods: {
        getMemberCount() {
            this.loading = true
            dataSource.homeMemberCount().then(rows => {
                this.totalRegisterCount = rows.totalRegisterCount
                this.todayRegisterCount = rows.todayRegisterCount
                this.lastDayRegisterCount = rows.lastDayRegisterCount
                this.lastLastDayRegisterCount = rows.lastLastDayRegisterCount
                this.lastDayPercent = rows.lastDayPercent
                this.lastWeekPercent = rows.lastWeekPercent

                this.loginCountDatas = []
                for (let i = 0; i < rows.loginCountX.length; i += 1) {
                    this.loginCountDatas.push({
                        x: rows.loginCountX[i],
                        y: rows.loginCountY[i]
                    })
                }
                this.averageLoginCount = rows.averageLoginCount
                this.twoWeeksLoginCount = rows.twoWeeksLoginCount

                this.registerCountDatas = []
                for (let i = 0; i < rows.registerCountX.length; i += 1) {
                    this.registerCountDatas.push({
                        x: rows.registerCountX[i],
                        y: rows.registerCountY[i]
                    })
                }
                this.averageRegisterCount = rows.averageRegisterCount
                this.twoWeeksRegisterCount = rows.twoWeeksRegisterCount

                this.loading = false
            }).catch(res => {
                this.loading = false
            })
        },
    },
    components: {Trend, ChartCard}
}
</script>

<style lang="less" scoped>
.extra-wrap{
  .extra-item{
    display: inline-block;
    margin-right: 24px;
    a:not(:first-child){
      margin-left: 24px;
    }
  }
}
@media screen and (max-width: 992px){
  .extra-wrap .extra-item{
    display: none;
  }
}
@media screen and (max-width: 576px){
  .extra-wrap{
    display: none;
  }
}

.mini-chart {
  position: relative;
  width: 100%
}
.mini-chart .chart-content{
  position: absolute;
  bottom: -28px;
  width: 100%;
}

</style>
