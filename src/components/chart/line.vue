<template>
  <div class="line">
    <h4>{{title}}</h4>
    <div class="chart">
      <v-chart :force-fit="true" :height="height" :padding="padding" :data="data" :scale="scale">
        <v-axis />
        <v-legend />
        <v-smooth-line position="month*temperature" color="city" shape="smooth" />
        <!--<v-point position="month*temperature" color="city" :size="4" :v-style="style" :shape="'circle'" />-->
      </v-chart>
    </div>
  </div>
</template>

<script>
  const DataSet = require('@antv/data-set');
  const sourceData = [
    { month: 'Jan', Tokyo: 7.0, London: 3.9 },
    { month: 'Feb', Tokyo: 6.9, London: 4.2 },
    { month: 'Mar', Tokyo: 9.5, London: 5.7 },
    { month: 'Apr', Tokyo: 14.5, London: 8.5 },
    { month: 'May', Tokyo: 18.4, London: 11.9 },
    { month: 'Jun', Tokyo: 21.5, London: 15.2 },
    { month: 'Jul', Tokyo: 25.2, London: 17.0 },
    { month: 'Aug', Tokyo: 26.5, London: 16.6 },
    { month: 'Sep', Tokyo: 23.3, London: 14.2 },
    { month: 'Oct', Tokyo: 18.3, London: 10.3 },
    { month: 'Nov', Tokyo: 13.9, London: 6.6 },
    { month: 'Dec', Tokyo: 9.6, London: 4.8 },
  ];
  const dv = new DataSet.View().source(sourceData);
  dv.transform({
    type: 'fold',
    fields: ['Tokyo', 'London'],
    key: 'city',
    value: 'temperature',
  });
  const data = dv.rows;

  const scale = [{
    dataKey: 'month',
    min: 0,
    max: 1,
  }];
  export default {
    name: "line",
    props: ['title'],
    data() {
      return {
        data,
        scale,
        height: 100,
        padding:[20,20,20,20],
        style: { stroke: '#fff', lineWidth: 1 },
      };
    }
  }
</script>

<style lang="less" scoped>
  .line {

  }
</style>