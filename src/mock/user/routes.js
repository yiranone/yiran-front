import Mock from 'mockjs'

Mock.mock('/api/men', 'get', () => {
  let result = {}
  result.code = 200
  result.data = [
    {
      router: 'home'
    }, {
      router: 'system',
      children: [
        {
          router: 'menu',
          authority: {
            permission: 'system:menu'
          }
        },
        {
          router: 'role',
          authority: {
            permission: 'system:role'
          }
        },
        {
          router: 'user',
          authority: {
            permission: 'system:user'
          }
        },
        {
          router: 'perm',
          authority: {
            permission: 'system:perm'
          }
        }
      ]
    }, {
      router: 'transaction',
      children: [
        {
          router: 'recharge',
          authority: {
            permission: 'trans:recharge'
          }
        }, {
          router: 'withdraw',
          authority: {
            permission: 'trans:withdraw'
          }
        }, {
          router: 'userDeposit',
          authority: {
            permission: 'trans:userDeposit'
          }
        }, {
          router: 'userWithdraw',
          authority: {
            permission: 'trans:userWithdraw'
          }
        }
      ]
    }, {
      router: 'account',
      children: [
        {
          router: 'inner',
          authority: {
            permission: 'account:inner'
          }
        }, {
          router: 'external',
          authority: {
            permission: 'account:external'
          }
        },
      ]
    }
  ]
  return result
})
