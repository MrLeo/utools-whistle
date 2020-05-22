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
        <WhistleQrcode></WhistleQrcode>
      </a-col>

      <a-col :span="16">
        <a-card :loading="!whistleRunning || loading" title="规则管理" class="list">
          <div slot="extra">
            <a-icon type="sync" :spin="!!autoRefresh.data || loading" @click="initWhistle" />
          </div>

          <a-list class="list" size="small" itemLayout="horizontal" :dataSource="rules">
            <div slot="header" class="list__header">
              <a-switch
                checkedChildren="开"
                unCheckedChildren="关"
                :checked="defaultEnabled"
                @change="changeDefault"
              />
              <div>Default</div>
            </div>

            <a-list-item slot="renderItem" slot-scope="item">
              <a-switch
                slot="actions"
                checkedChildren="开"
                unCheckedChildren="关"
                :checked="item.selected"
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
import WhistleQrcode from '@/views/rules/components/WhistleQrcode'

const http = new Http()
const DB_ID_FIELD_NAME = 'autoRefresh'
const DELAY = 500

export default {
  components: { WhistleQrcode },
  data() {
    return {
      apiUrl: process.env.VUE_APP_WHISTLE_API,
      version: '',
      latestVersion: '',
      mrulesClientId: '',
      mrulesTime: '',
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
      immediate: true,
      handler(val) {
        if (val.data) {
          this.loading = true
          this.initWhistle()
        }
      }
    }
  },
  created() {
    try {
      this.autoRefresh = dbGet(DB_ID_FIELD_NAME, true, true)
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
    /** 检查本地是否安装Node */
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
    /** 检查本地是否安装Whistle */
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
                click: async () => {
                  await this.installWhistle()
                  await this.checkWhistleStatus()
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
    /** 安装Whistle */
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
    /** 检查Whistle状态 */
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
                on: {
                  click: async () => {
                    await this.checkWhistleStatus('start')
                    await this.initWhistle()
                  }
                }
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
                on: {
                  click: async () => {
                    await this.checkWhistleStatus('restart')
                    await this.autoReloadWhistleRules()
                  }
                }
              },
              ['重启']
            ),
            this.$createElement(
              Button,
              {
                style: { marginLeft: '10px' },
                props: { size: 'small', type: 'danger' },
                on: {
                  click: async () => {
                    await this.checkWhistleStatus('stop')
                  }
                }
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
        this.setWhistleVersion()
      }
    },
    /** 重新安装/升级Whistle */
    setWhistleVersion() {
      let btnTxt = `重新安装 ${this.version}`

      if (this.latestVersion && this.version !== this.latestVersion) {
        btnTxt = `升级 ${this.version} -> ${this.latestVersion}`
      }
      console.log(`[LOG]: setWhistleVersion -> btnTxt`, btnTxt)

      this.steps[1].desc = this.$createElement(
        Button,
        {
          props: { size: 'small', type: 'primary' },
          on: {
            click: async () => {
              this.loading = true
              this.whistleRunning = false
              await this.installWhistle()
              await this.checkWhistleStatus('restart')
              setTimeout(() => {
                this.whistleRunning = true
                this.initWhistle()
              }, 0)
            }
          }
        },
        [btnTxt]
      )
    },

    /** 改变自动更新状态 */
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

    /** 初始化Whistle规则配置 */
    async initWhistle() {
      try {
        if (!this.whistleRunning) return

        const res = await http.get(`${this.url}/cgi-bin/init?_=${new Date().getTime()}`)
        if (!res?.version) {
          throw new Error(res)
        }

        this.loading = false
        this.version = res.version
        this.latestVersion = res.latestVersion
        this.clientId = res.clientId
        this.lastRowId = res.lastDataId
        this.mrulesClientId = res.mrulesClientId
        this.mrulesTime = res.mrulesTime
        this.rules.splice(0, this.rules.length, ...res.rules.list)
        this.defaultEnabled = !res.rules.defaultRulesIsDisabled
        this.allowMultipleChoice = res.rules.allowMultipleChoice
        this.defaultRules = res.rules.defaultRules
        this.server = res.server

        setTimeout(this.autoReloadWhistleRules, DELAY)
      } catch (err) {
        console.log(`[LOG]: initWhistle -> err`, err)
      }
    },
    /** 自动更新规则列表 */
    async autoReloadWhistleRules() {
      try {
        if (!this.whistleRunning) return

        const res = await this.getWhistleRules()

        if (!this.autoRefresh.data) return

        setTimeout(async () => {
          if (this.mrulesClientId === res.mrulesClientId && this.mrulesTime === res.mrulesTime) {
            await this.autoReloadWhistleRules()
          } else {
            await this.initWhistle()
          }
        }, DELAY)
      } catch (err) {
        console.log(`[LOG]: autoReloadWhistleRules -> err`, err)
        setTimeout(this.autoReloadWhistleRules, DELAY)
      }
    },
    /** 获取规则列表 */
    async getWhistleRules() {
      const res = await http.get(`${this.url}/cgi-bin/get-data`, {
        params: {
          clientId: this.clientId,
          startLogTime: -2,
          startSvrLogTime: -2,
          ids: '',
          startTime: this.lastRowId,
          dumpCount: 0,
          lastRowId: this.lastRowId,
          logId: '',
          count: 20,
          _: new Date().getTime()
        }
      })

      this.defaultEnabled = !res.defaultRulesIsDisabled
      this.rules.forEach(rule => (rule.selected = res.list.includes(rule.name)))

      return res
    },
    /** 应用修改并获取最新的规则 */
    async manuallyModifyRules() {
      const res = await this.getWhistleRules()
      if (this.mrulesClientId !== res.mrulesClientId || this.mrulesTime !== res.mrulesTime) {
        await this.initWhistle()
      }
    },
    /** 修改自定义规则状态 */
    async changeRule(item) {
      try {
        let url = !item.selected
          ? `${this.url}/cgi-bin/rules/select`
          : `${this.url}/cgi-bin/rules/unselect`
        await http.post(url, {
          clientId: this.clientId,
          name: item.name,
          value: item.data,
          selected: item.selected,
          active: true,
          key: `w-reactkey-${item.index + 2}`,
          icon: 'checkbox',
          hide: false,
          changed: false
        })

        await this.manuallyModifyRules()
      } catch (err) {
        console.error(`[LOG]: changeRule -> err`, err)
        this.$notification['error']({
          message: 'error in changeRule',
          description: err.message
        })
      }
    },
    /** 修改默认规则状态 */
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
          selected: !value,
          isDefault: true,
          active: true,
          key: 'w-reactkey-1',
          icon: 'checkbox'
        })

        await this.manuallyModifyRules()
      } catch (err) {
        console.error(`[LOG]: changeDefault -> err`, err)
        this.$notification['error']({
          message: 'error in changeDefault',
          description: err.message
        })
      }
    },

    /** 初始化Rules */
    async setDefaultRules() {
      try {
        const blob = new Blob([JSON.stringify(require('./data/rules.json'))], {
          type: 'plain/text'
        })
        const files = new window.File([blob], 'rules.txt', { type: 'plain/text' })

        const form = new FormData()
        form.append('rules', files)
        form.append('replaceAll', 1)

        await http.post(`${this.url}/cgi-bin/rules/import?clientId=${this.clientId}`, form)
      } catch (err) {
        console.error(`[LOG]: setDefaultRules -> err`, err)
        this.$notification['error']({
          message: 'error in setDefaultRules',
          description: err.message
        })
      }
    },
    /** 初始化Values */
    async setDefaultValues() {
      try {
        const blob = new Blob([JSON.stringify(require('./data/values.json'))], {
          type: 'plain/text'
        })
        const files = new window.File([blob], 'rules.txt', { type: 'plain/text' })

        const form = new FormData()
        form.append('rules', files)
        form.append('replaceAll', 1)

        await http.post(`${this.url}/cgi-bin/values/import?clientId=${this.clientId}`, form)
      } catch (err) {
        console.error(`[LOG]: setDefaultValues -> err`, err)
        this.$notification['error']({
          message: 'error in setDefaultValues',
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

<style lang="scss">
.ant-steps {
  min-height: 50px;

  &.ant-steps-horizontal:not(.ant-steps-label-vertical) .ant-steps-item-description {
    max-width: 100%;
  }
}
.card-meta {
  .ant-card-meta-detail {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__text {
    white-space: pre-wrap;
    word-break: break-all;
    text-align: center;
  }
}
</style>
