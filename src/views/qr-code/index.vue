<template>
  <div class="wrapper">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card hoverable>
          <img slot="cover" :src="qrcode" :alt="ss" />

          <a-card-meta :title="address" :description="ss"> </a-card-meta>

          <template slot="actions" class="ant-card-actions">
            <router-link to="/whistle"
              ><a-icon type="ellipsis" key="ellipsis" />&nbsp;查看Whistle控制台</router-link
            >
          </template>
        </a-card>
      </a-col>

      <a-col :span="16">
        <a-card :loading="loading" title="规则管理" class="list">
          <div slot="extra">
            <a-icon type="sync" :spin="!!autoRefresh.data || loading" @click="refresh" />
          </div>

          <a-list class="list" size="small" itemLayout="horizontal" :dataSource="rules">
            <div slot="header" class="list__header">
              <a-switch
                checkedChildren="开"
                unCheckedChildren="关"
                v-model="defaultEnabled"
                @change="changeDefault"
              />
              <div>Default</div>
            </div>

            <a-list-item slot="renderItem" slot-scope="item">
              <a-switch
                slot="actions"
                checkedChildren="开"
                unCheckedChildren="关"
                v-model="item.selected"
                @change="changeRule(item)"
              />
              <div>{{ item.name }}</div>
            </a-list-item>
          </a-list>

          <template slot="actions" class="ant-card-actions">
            <div>
              自动刷新
              <a-switch
                checkedChildren="开"
                unCheckedChildren="关"
                :checked="!!autoRefresh.data"
                @change="changeAutoRefresh"
              />
            </div>
          </template>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { Http } from '../../utils/http'
import { dbPut, dbGet } from '../../utils/utools'

const http = new Http()
const DB_ID_FIELD_NAME = 'autoRefresh'

export default {
  data() {
    return {
      address: '',
      ss: '',
      qrcode: '',

      activeNames: ['1', '2'],
      apiUrl: process.env.VUE_APP_WHISTLE_API,
      // autoRefresh: $storage.get('auto-refresh') === 'true',
      server: {},
      proxyEnabled: false,
      defaultEnabled: false,
      allowMultipleChoice: false,
      defaultRules: '',
      lastRowId: '',
      hasInit: false,
      clientId: '',
      rules: [],

      autoRefresh: false,
      loading: true
    }
  },
  computed: {
    url() {
      return this.apiUrl.replace(/\/$/, '')
    }
  },
  watch: {
    autoRefresh: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val.data) {
          this.initWhistle()
        }
      }
    }
  },
  created() {
    try {
      this.getQrCode()
      this.autoRefresh = dbGet(DB_ID_FIELD_NAME, true)
    } catch (err) {
      console.error(`[LOG]: created -> err`, err)
      this.$notification['error']({
        message: `error in created`,
        description: err.message
      })
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      try {
        this.loading = true
        await this.initWhistle()
        this.loading = false
      } catch (err) {
        console.error(`[LOG]: init -> err`, err)
        this.$notification['error']({
          message: 'error in init',
          description: err.message
        })
      }
    },
    async initWhistle() {
      try {
        const res = await http.get(`${this.url}/cgi-bin/init?_=${new Date().getTime()}`)

        this.clientId = res.clientId
        this.lastRowId = res.lastDataId
        // this.rules = res.rules.list
        this.rules.splice(0, this.rules.length, ...res.rules.list)
        this.defaultEnabled = !res.rules.defaultRulesIsDisabled
        this.allowMultipleChoice = res.rules.allowMultipleChoice
        this.defaultRules = res.rules.defaultRules
        this.server = res.server

        if (this.autoRefresh.data) setTimeout(this.initWhistle, 1000)
      } catch (err) {
        console.error(`[LOG]: initWhistle -> err`, err)
        this.$notification['error']({
          message: 'error in initWhistle',
          description: err.message
        })
      }
    },
    async refresh() {
      this.init()
    },
    async changeRule(item) {
      this.setEnable(item, item.selected)
    },
    async setEnable(item, enable) {
      try {
        let url = enable ? `${this.url}/cgi-bin/rules/select` : `${this.url}/cgi-bin/rules/unselect`
        await http.post(url, {
          clientId: this.clientId,
          name: item.name,
          value: item.data,
          selected: true,
          active: true,
          key: `w-reactkey-${item.index + 2}`,
          icon: 'checkbox',
          hide: false,
          changed: false
        })
        this.init()
      } catch (err) {
        console.error(`[LOG]: setEnable -> err`, err)
        this.$notification['error']({
          message: 'error in setEnable',
          description: err.message
        })
      }
    },
    async changeDefault(value) {
      try {
        let url = value
          ? `${this.url}/cgi-bin/rules/enable-default`
          : `${this.url}/cgi-bin/rules/disable-default`
        await http.post(url, {
          clientId: this.clientId,
          name: 'Default',
          fixed: true,
          value: this.defaultRules,
          selected: true,
          isDefault: true,
          active: true,
          key: 'w-reactkey-1',
          icon: 'checkbox'
        })
        this.init()
      } catch (err) {
        console.error(`[LOG]: changeDefault -> err`, err)
        this.$notification['error']({
          message: 'error in changeDefault',
          description: err.message
        })
      }
    },
    changeAutoRefresh(val) {
      try {
        this.autoRefresh.data = ~~val
        this.autoRefresh = dbPut({ ...this.autoRefresh })
      } catch (err) {
        console.error(`[LOG]: autoRefresh -> err`, err)
        this.$notification['error']({
          message: 'error in changeAutoRefresh',
          description: err.message
        })
      }
    },
    async getQrCode() {
      try {
        const { address, ss, qrcode } = await window.getQrCode()
        this.address = address
        this.ss = ss
        this.qrcode = qrcode
      } catch (err) {
        console.error(`[LOG]: getQrCode -> err`, err)
        this.$notification['error']({
          message: 'error in getQrCode',
          description: err.message
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  .ant-row {
    padding: 10px;
    display: flex;
    justify-content: center;
  }
  .list {
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: row-reverse;
      padding-right: 8px;
    }
  }
}
</style>
