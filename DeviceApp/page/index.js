import { BasePage } from "@zeppos/zml/base-page";
import { createWidget, widget } from "@zos/ui";
import { HeartRate } from '@zos/sensor'
import { setWakeUpRelaunch } from '@zos/display'
import { Accelerometer, FREQ_MODE_NORMAL, FREQ_MODE_LOW, Gyroscope } from '@zos/sensor'
import { Time } from '@zos/sensor'

Page(
  BasePage({
    state: {
      batch_size: 10,
      start_service: false
    },
    startService() {
      this.getHealthData()
    },
    build() {
      setWakeUpRelaunch({
        relaunch: true,
      })

      const send_health_data = (data) => {
        this.call({
          method: 'HEALTH_DATA',
          params: { ...data },
        })
      }

      //data arrays definitions
      let axel_data = []
      let guro_data = []

      //sensors definitions 
      const time = new Time()
      const gyroscope = new Gyroscope()
      const heartRate = new HeartRate()
      const accelerometer = new Accelerometer()

      //callbacks definitions
      const get_gyroscope_data_callback = () => {
        const currentTime = time.getTime()
        coord = gyroscope.getCurrent()
        params = {
          name: "guro",
          data: {
            time: currentTime,
            x: coord.x,
            y: coord.y,
            z: coord.z
          }
        }

        if (guro_data.length > 0) {
          let last_value = guro_data.slice(-1)[0].data;
          // console.log(last_value.x, "=", coord.x, last_value.y, "=", coord.y, last_value.z, "=", coord.z)
          // console.log(last_value.x === coord.x, last_value.y === coord.y, last_value.z === coord.z)
          if (!(last_value.x === coord.x & last_value.y === coord.y & last_value.z === coord.z)) {
            guro_data.push(params)
          } else {

          }

        } else {
          console.log("guro_data is empty");
          guro_data.push(params)
        }

        if (guro_data.length === this.state.batch_size) {
          // setTimeout(() => {
          gyroscope.stop()
          send_health_data(guro_data)
          guro_data.length = 0
          gyroscope.start()
          // }, 1000)



        }
      }

      const get_accelerometer_data_callback = () => {
        coord = accelerometer.getCurrent()
        const currentTime = time.getTime()
        params = {
          name: "axel",
          data: {
            time: currentTime,
            x: coord.x,
            y: coord.y,
            z: coord.z
          }

        }
        if (axel_data.length > 0) {
          let last_value = axel_data.slice(-1)[0].data;
          // console.log(last_value.x, "=", coord.x, last_value.y, "=", coord.y, last_value.z, "=", coord.z)
          // console.log(last_value.x === coord.x, last_value.y === coord.y, last_value.z === coord.z)
          if (!(last_value.x === coord.x & last_value.y === coord.y & last_value.z === coord.z)) {
            axel_data.push(params)
          } else {

          }

        } else {
          console.log("axel_data is empty");
          axel_data.push(params)
        }



        if (axel_data.length === this.state.batch_size) {
          // setTimeout(() => {
          accelerometer.stop()
          send_health_data(axel_data)
          axel_data.length = 0

          accelerometer.start()
          // }, 1000)

        }
      }


      const get_heart_rate_data_callback = () => {
        hr = heartRate.getCurrent()
        const currentTime = time.getTime()
        params = {
          name: "hr",
          data: {
            time: currentTime,
            hr: hr
          }

        }
        send_health_data(params)
      }

      //sensors listener definitons
      gyroscope.onChange(get_gyroscope_data_callback)
      gyroscope.setFreqMode(FREQ_MODE_LOW)

      accelerometer.onChange(get_accelerometer_data_callback)
      accelerometer.setFreqMode(FREQ_MODE_LOW)


      //start button params
      let params_start_btn = {
        x: 170,
        y: 150,
        text: 'Start',
        w: -1,
        h: -1,
        click_func: () => {
          console.log('button click')
          if (!this.state.start_service) {
            heartRate.onCurrentChange(get_heart_rate_data_callback)

            accelerometer.start()
            gyroscope.start()
            this.state.start_service = true
          }


        }
      }
      //create start button 
      createWidget(widget.BUTTON, params_start_btn)

      //stop button params
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

          gyroscope.stop()
          this.state.start_service = false
        }
      }
      //create stop button 
      createWidget(widget.BUTTON, params_stop_btn)
    }
  })
);
