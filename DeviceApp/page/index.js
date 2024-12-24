import { log as Logger } from "@zos/utils";
import { BasePage } from "@zeppos/zml/base-page";
import { createWidget, widget } from "@zos/ui";
import { HeartRate } from '@zos/sensor'
import { setWakeUpRelaunch } from '@zos/display'



Page(
  BasePage({
    state: {},
    startService() {
      this.getHealthData()
    },
    build() {
      setWakeUpRelaunch({
        relaunch: true,
      })
      let healthData = {}
      const heartRate = new HeartRate()
      const curCallback = () => {
        console.log("Start measure")
        console.log(heartRate.getCurrent())
      }
      let params = {
        x: 170,
        y: 200,
        text: 'Start',
        w: -1,
        h: -1,

        click_func: () => {
          console.log('button click')
          heartRate.onCurrentChange(curCallback)

        }
      }

      createWidget(widget.BUTTON, params)
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
