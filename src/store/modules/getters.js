
// const dictTypes = {
//     system_normal_disable: state => state.account.dictTypes.system_normal_disable,
//     system_user_status: state => state.account.dictTypes.system_user_status,
// }

const getters = {
    user: state => state.account.user,
    permissions : state => state.account.permissions,
    dictTypes : state => state.account.dictTypes,
    isMenuLoad : state => state.setting.isMenuLoad,
    lang : state => state.setting.lang,
    system_normal_disable: state => state.account.dictTypes.system_normal_disable,
    system_yes_no: state => state.account.dictTypes.system_yes_no,
    system_user_status: state => state.account.dictTypes.system_user_status,
    system_visible_status: state => state.account.dictTypes.system_visible_status,
    system_online_offline: state => state.account.dictTypes.system_online_offline,
    system_result_status: state => state.account.dictTypes.system_result_status,
    system_operate_type: state => state.account.dictTypes.system_operate_type,
    system_notice_type: state => state.account.dictTypes.system_notice_type,
    system_notice_status: state => state.account.dictTypes.system_notice_status,
}

export default getters