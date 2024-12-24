import { BasePage } from "@zeppos/zml/base-page";
import { createWidget, widget } from "@zos/ui";
import { HeartRate } from '@zos/sensor'
import { setWakeUpRelaunch } from '@zos/display'
import { Accelerometer, FREQ_MODE_NORMAL, FREQ_MODE_LOW } from '@zos/sensor'


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


      const accelerometer = new Accelerometer()
      const callback = () => {
        coord = accelerometer.getCurrent()
        console.log("Current coord", coord.x, coord.y, coord.z)
      }
      accelerometer.onChange(callback)
      accelerometer.setFreqMode(FREQ_MODE_NORMAL)


      const heartRate = new HeartRate()
      const curCallback = () => {
        console.log("Start measure")
        console.log(heartRate.getCurrent())
      }


      let params_start_btn = {
        x: 170,
        y: 150,
        text: 'Start',
        w: -1,
        h: -1,
        click_func: () => {
          console.log('button click')
          heartRate.onCurrentChange(curCallback)
          accelerometer.start()
        }
      }

      createWidget(widget.BUTTON, params_start_btn)

      let params_stop_btn = {
        x: 170,
        y: 290,
        text: 'Stop',
        w: -1,
        h: -1,
        click_func: () => {
          console.log('Stop clicked')
          heartRate.offCurrentChange(curCallback)
          accelerometer.stop()
        }
      }

      createWidget(widget.BUTTON, params_stop_btn)
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
