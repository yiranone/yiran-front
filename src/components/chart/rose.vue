<template>
  <div class="rose">
    <v-chart :force-fit="true" :height="height" :padding="padding" :data="data" :scale="scale">
      <v-coord type="polar" />
      <v-axis :data-key="axis1Opts.dataKey" :label="axis1Opts.label" :tickLine="axis1Opts.tickLine" :line="axis1Opts.line" />
      <v-axis :data-key="axis2Opts.dataKey" :grid="axis2Opts.grid" :tickLine="axis2Opts.tickLine" :label="axis2Opts.label" :line="axis2Opts.line"/>
      <v-legend dataKey="name" :itemWidth="100" />
      <v-interval :position="interval1Opts.position" :color="interval1Opts.color"
                  :label="interval1Opts.label" :v-style="interval1Opts.style" />
    </v-chart>
  </div>
</template>

<script>
  const data = [{name:'USDT-TRC20',count:96},{name:'USDT-TRC30',count:121},{name:'USDT-TRC40',count:100},{name:'USDT-TRC22',count:96},{name:'USDT-TRC32',count:121},{name:'USDT-TRC42',count:100},{name:'USDT-TRC21',count:96},{name:'USDT-TRC31',count:121},{name:'USDT-TRC41',count:100}];

  const scale = [{
    dataKey: 'count',
    min: 0,
  }];

  const axis1Opts = {
    dataKey: 'count',
    label: null,
    tickLine: null,
    line: {
      stroke: '#E9E9E9',
      lineDash: [ 3, 3 ]
    }
  };
  const axis2Opts = {
    dataKey: 'name',
    tickLine: null,
    label: null,
    line: {
      stroke: '#E9E9E9',
      lineDash: [ 3, 3 ]
    }
  };

  const interval1Opts = {
    position: 'name*count',
    color: 'name',
    label: ['count', {
      offset: -15,
      textStyle: {
        textAlign: 'center',
        fontSize: 11,
        shadowBlur: 2,
        shadowColor: 'rgba(0, 0, 0, .45)'
      }
    }],
    style: {
      lineWidth: 1,
      stroke: '#fff',
    },
  };
  export default {
    name: "rose",
    data() {
      return {
        height: 410,
        padding:[ 20,40,100,20 ],
        data,
        scale,
        axis1Opts,
        axis2Opts,
        interval1Opts,
      };
    }
  }
</script>

<style scoped>
  .rose {
    width: 100%;
  }
</style>