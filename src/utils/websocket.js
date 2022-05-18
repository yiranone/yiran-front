import Vue from "vue";
import Cookie from "js-cookie";

class Websocket {
  timeout = 55000      //55s发一次心跳
  timeoutObj = null
  serverTimeoutObj = null
  lockReconnect = false
  wsuri = null
  websock = null
  getWebIP = () => window.location.hostname
  createWebSocket = ({url, data = null, onmessage}) => {
    let token = Cookie.get('Authorization')
    if (!token) return;
    try{
      if (typeof (WebSocket) === 'undefined') {
        Vue.prototype.$message.error('您的浏览器不支持WebSocket，无法获取数据')
      } else {
        this.wsuri = `${process.env.NODE_ENV == 'development' ? process.env.VUE_APP_API_WS_URL : this.getWebIP()}/api/${url}/${token}`
        this.websock = new WebSocket(this.wsuri)
        this.initWebSocket({url, data, onmessage})
      }
    }catch(e){
      this.reconnect({url, data, onmessage});
      console.log(e);
    }
  }
  initWebSocket = ({url, data, onmessage}) => {
    this.websock.onmessage = (res) => {
      console.log(res)
      this.heartRest().heartStart()
      if (onmessage && typeof onmessage === 'function') {
        if (res.data != '连接成功' && res.data != 'pong') {
          onmessage(JSON.parse(res.data))
        }
      }
    }
    this.websock.onopen = () => {
      console.info('连接成功')
      this.heartRest().heartStart()
    }
    this.websock.onerror = (res) => {
      console.error(res)
      this.reconnect({url, data, onmessage})
      console.info('ws连接异常')
    }
    this.websock.onclose = (res) => {
      // console.error(res)
      this.reconnect({url, data, onmessage})
      console.info('ws链接关闭')
    }
  }

  reconnect = ({url, data, onmessage}) => {
    if (this.lockReconnect) return;
    this.lockReconnect = true;
    setTimeout(() => {     //没连接上会一直重连，设置延迟避免请求过多
      this.createWebSocket({url, data, onmessage})
      this.lockReconnect = false;
    }, 2000);
  }

  heartRest = () => {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  }

  heartStart = () => {
    this.timeoutObj = setTimeout(() => {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      this.websock.send("ping");
      console.log("ping!")
      this.serverTimeoutObj = setTimeout(() => {//如果超过一定时间还没重置，说明后端主动断开了
        this.websock.close();     //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
      }, this.timeout)
    }, this.timeout)
  }
}

export default Websocket