import { log as Logger } from "@zos/utils";
import { BasePage } from "@zeppos/zml/base-page";
import { createWidget, widget } from "@zos/ui";
import { HeartRate } from '@zos/sensor'


Page(
  BasePage({
    state: {},
    startService() {
      this.call({
        method: 'START_SERVICE',
        params: {
          param1: 'param1',
          param2: 'param2',
        },
      })
    },
    build() {
      let params = {
        x: 170,
        y: 200,
        text: 'Start',
        w: -1,
        h: -1,

        click_func: () => {
          console.log('button click')
          this.startService()

        }
      }

      createWidget(widget.BUTTON, params)
    },

    getHealthData() {
      let healthData = {}
      const heartRate = new HeartRate()
      const callback = () => {
        hr = heartRate.getCurrent()
        console.log("HeartRate: ", hr)
        healthData.heart_rate = hr
      }

      heartRate.onCurrentChange(callback)
      heartRate.offCurrentChange(callback)
      return healthData
    },

    onRequest(req, res) {

      if (req.method === 'GET_HEALTH_DATA') {
        console.log("OnRequest, GET_HEALTH_DATA")
        let healthData = this.getHealthData()
        res(null, healthData)

      } else {
        res('error happened')
      }
    },
  })
);
