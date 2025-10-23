import '@/vab'
import Vue from 'vue'
import App from './App'
import i18n from './i18n'
import store from './store'
import router from './router'
import commonJS from './utils/common'
import permission from './directive/permission'
import {getDicts} from '@/api/system/dict/data'
import {getConfigKey} from '@/api/system/config'
import {addDateRange, download, handleTree, parseTime, resetForm, selectDictLabel, zip,} from '@/utils/validate'


// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
 Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.$c = commonJS
Vue.prototype.zip = zip


Vue.prototype.msgSuccess = function (msg) {
  this.$message({showClose: true, message: msg, type: 'success'})
}

Vue.prototype.msgError = function (msg) {
  this.$message({showClose: true, message: msg, type: 'error'})
}


Vue.use(permission)

Vue.config.productionTip = false
new Vue({
  el: '#app',
  i18n,
  store,
  router,
  render: (h) => h(App),
})




