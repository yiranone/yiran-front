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
                            <v-chart :force-fit="true" :height="height" :data="loginCountDatas" :scale="scaleCount" :padding="[36, 5, 18, 5]">
                                <v-tooltip />
                                <v-smooth-area position="x*y" color="blue"/>
                                <v-smooth-line position="x*y" color="blue"/>
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
                            <v-chart :force-fit="true" :height="height" :data="registerCountDatas"  :scale="scaleCount" :padding="[36, 5, 18, 5]">
                                <v-tooltip crosshairs="y" title="x"/>
                                <v-line position="x*y" color="green"/>
                                <v-area position="x*y" color="green" :opacity="0.7"/>
                            </v-chart>
                        </div>
                    </div>
                    <div slot="footer">日均注册<span>{{averageRegisterCount}}</span></div>
                </chart-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import Trend from "@/components/chart/Trend";
import ChartCard from '@/components/card/ChartCard'
import {dataSource} from "@/services";


const data = [
    {country: 'Europe', year: '1750', value: 163},
    {country: 'Europe', year: '1800', value: 203},
    {country: 'Europe', year: '1950', value: 547},
    {country: 'Europe', year: '1999', value: 129},
];

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
            data2:[],
            scaleCount:[{
                dataKey: 'x',
                alias: '日期',
            }, {
                dataKey: 'y',
                alias: '次数',
                title: '',
                min: 0
            }],

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
                        y: rows.loginCountY[i],
                        // title: '登陆用户数量'
                    })
                }
                console.log(this.loginCountDatas)
                this.averageLoginCount = rows.averageLoginCount
                this.twoWeeksLoginCount = rows.twoWeeksLoginCount
                //debugger
                this.registerCountDatas = []
                for (let i = 0; i < rows.registerCountX.length; i += 1) {
                    this.registerCountDatas.push({
                        x: rows.registerCountX[i],
                        y: rows.registerCountY[i],
                        // title: '注册用户数量'
                    })
                }
                this.averageRegisterCount = rows.averageRegisterCount
                this.twoWeeksRegisterCount = rows.twoWeeksRegisterCount

                for (let i = 0; i < data.length; i += 1) {
                    this.data2.push(data[i])
                }

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
