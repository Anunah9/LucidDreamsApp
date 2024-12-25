import { BasePage } from "@zeppos/zml/base-page";
import { createWidget, widget } from "@zos/ui";
import { HeartRate } from '@zos/sensor'
import { setWakeUpRelaunch } from '@zos/display'
import { Accelerometer, FREQ_MODE_NORMAL, FREQ_MODE_LOW, Gyroscope } from '@zos/sensor'
import { Time } from '@zos/sensor'



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

      const time = new Time()


      // const accelerometer = new Accelerometer()
      // const callback = () => {
      //   coord = accelerometer.getCurrent()
      //   console.log("Current coord", coord.x, coord.y, coord.z)
      //   const currentTime = time.getTime()
      //   // this.call({
      //   //   method: 'AXEL',
      //   //   params: {
      //   //     time: currentTime,
      //   //     x: coord.x,
      //   //     y: coord.y,
      //   //     z: coord.z
      //   //   },
      //   // })

      // }
      // accelerometer.onChange(callback)
      // accelerometer.setFreqMode(FREQ_MODE_NORMAL)

      const gyroscope = new Gyroscope()

      const callback = () => {
        coord = gyroscope.getCurrent()
        console.log("Current coord", coord.x, coord.y, coord.z)
      }
      gyroscope.onChange(callback)
      gyroscope.setFreqMode(FREQ_MODE_LOW)




      const heartRate = new HeartRate()
      const curCallback = () => {
        console.log("Start measure")
        hr = heartRate.getCurrent()
        const currentTime = time.getTime()
        console.log()
        this.call({
          method: 'HR',
          params: {
            time: currentTime,
            hr: hr,
          },
        })
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

          // accelerometer.start()
          gyroscope.start()

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
          // accelerometer.stop()
          gyroscope.offChange()
          gyroscope.stop()
        }
      }

      createWidget(widget.BUTTON, params_stop_btn)
    }
  })
);
