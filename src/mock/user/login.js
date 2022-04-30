import Mock from 'mockjs'
import '@/mock/extend'

const user = Mock.mock({
  name: '@ADMIN',
  avatar: '@AVATAR',
  address: '@CITY',
  position: '@POSITION'
})
Mock.mock('/api/log', 'post', ({body}) => {
  let result = {}
  const {username, password} = JSON.parse(body)

  if (username !== 'admin' || password !== '123456') {
    result.code = -1
    result.message = '账户名或密码错误（admin/123456）'
  } else {
    result.code = 200
    result.message = Mock.mock('@TIMEFIX').CN + '，欢迎回来'
    result.data = {}
    result.data.user = user
    result.data.token = 'Authorization:' + Math.random()
    // result.data.expireAt = new Date(new Date().getTime() + 30 * 60 * 1000)
    result.data.permissions = [
        {id: 'system:user:list', operation: ['add', 'edit']},
        {id: 'system:user:list', operation: ['add', 'edit']}
        ]
    // result.data.roles = [{id: 'admin', operation: ['add', 'edit', 'delete']}]
  }
  return result
})
