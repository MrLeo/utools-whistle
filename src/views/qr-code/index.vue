<template>
  <div class="wrapper">
    <a-row :gutter="16">
      <a-col :span="24">
        <a-steps size="small">
          <a-step
            v-for="(step, index) in steps"
            :key="index"
            :title="step.title"
            :subTitle="step.subTitle"
            :description="step.desc"
            :status="step.status"
          >
            <a-icon v-if="step.loading" type="loading" slot="icon" />
          </a-step>
        </a-steps>
      </a-col>
    </a-row>
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
        <a-card :loading="!whistleRunning || loading" title="规则管理" class="list">
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
import { Button } from 'ant-design-vue'

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
      loading: true,
      whistleRunning: true,
      steps: [
        {
          title: `检查node环境`,
          subTitle: '',
          desc: '',
          status: 'process',
          loading: true
        },
        {
          title: `检查Whistle环境`,
          subTitle: '',
          desc: '',
          status: 'wait',
          loading: false
        },
        {
          title: `检查Whistle运行状态`,
          subTitle: '',
          desc: '',
          status: 'wait',
          loading: false
        }
      ]
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
    this.loading = true
    this.initWhistle()
    this.init()
  },
  beforeDestroy() {
    this.whistleRunning = false
  },
  methods: {
    async init() {
      try {
        await this.checkNode()
        await this.checkWhistle()
        await this.checkWhistleStatus()
        this.whistleRunning = true
      } catch (err) {
        console.log(`[LOG]: init -> err`, err)
        this.whistleRunning = false
      }
    },
    async checkNode() {
      try {
        this.steps[0].status = 'process'
        this.steps[0].loading = true
        this.steps[0].desc = ''

        await window.checkNode()

        this.steps[0].status = 'finish'
      } catch (err) {
        this.steps[0].desc = this.$createElement('div', {}, [err.message])
        this.steps[0].status = 'error'
        throw new Error(err.message)
      } finally {
        this.steps[0].loading = false
      }
    },
    async checkWhistle() {
      try {
        this.steps[1].status = 'process'
        this.steps[1].loading = true
        this.steps[1].desc = ''

        await window.whistleCheck()

        this.steps[1].status = 'finish'
      } catch (err) {
        this.steps[1].desc = this.$createElement('div', {}, [
          err.message,
          this.$createElement(
            Button,
            {
              props: { size: 'small', type: 'primary' },
              on: {
                click: () => {
                  this.installWhistle()
                }
              }
            },
            ['立即安装']
          )
        ])
        this.steps[1].status = 'error'
        throw new Error(err.message)
      } finally {
        this.steps[1].loading = false
      }
    },
    async installWhistle() {
      try {
        this.steps[1].status = 'process'
        this.steps[1].loading = true
        this.steps[1].desc = ''

        await window.whistleInstall()
        await window.whistleCheck()

        this.steps[1].status = 'finish'
      } catch (err) {
        this.steps[1].desc = this.$createElement('div', {}, [err.message])
        this.steps[1].status = 'error'
        throw new Error(err.message)
      } finally {
        this.steps[1].loading = false
      }
    },
    async checkWhistleStatus(cmd = 'status') {
      try {
        this.steps[2].status = 'process'
        this.steps[2].loading = true
        this.steps[2].desc = ''

        const { data } = await window.whistleControl(cmd)

        if (/(No running)|(whistle killed)/gi.test(data)) {
          this.steps[2].status = 'error'
          this.steps[2].desc = this.$createElement('div', {}, [
            data,
            this.$createElement(
              Button,
              {
                props: { size: 'small', type: 'primary' },
                on: { click: () => this.checkWhistleStatus('start') }
              },
              ['启动']
            )
          ])
          this.whistleRunning = false
        } else if (/(is running)|(local\.whistlejs\.com)/gi.test(data)) {
          this.steps[2].status = 'finish'
          this.steps[2].desc = this.$createElement('div', {}, [
            this.$createElement(
              Button,
              {
                props: { size: 'small', type: 'primary' },
                on: { click: () => this.checkWhistleStatus('restart') }
              },
              ['重启']
            ),
            this.$createElement(
              Button,
              {
                style: { marginLeft: '10px' },
                props: { size: 'small', type: 'danger' },
                on: { click: () => this.checkWhistleStatus('stop') }
              },
              ['停止']
            )
          ])
          this.whistleRunning = true
        }
      } catch (err) {
        this.steps[2].desc = this.$createElement('div', {}, [err.message])
        this.steps[2].status = 'error'
        throw new Error(err.message)
      } finally {
        this.steps[2].loading = false
      }
    },

    async initWhistle() {
      try {
        if (!this.whistleRunning) return

        const res = await http.get(`${this.url}/cgi-bin/init?_=${new Date().getTime()}`)
        if (!res?.version) {
          throw new Error(res)
        }

        this.loading = false
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
        console.log(`[LOG]: initWhistle -> err`, err)
      }
    },
    async refresh() {
      this.initWhistle()
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
        this.initWhistle()
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
        this.initWhistle()
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
