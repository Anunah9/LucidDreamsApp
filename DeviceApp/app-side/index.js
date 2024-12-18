import { BaseSideService } from '@zeppos/zml/base-side'


AppSideService(
  BaseSideService({
    state: {
      service_started: false,
      interval: 1000,
      healthData: {}
    },
    onInit() {
      this.log('app side service invoke onInit')
    },
    onRun() {
      this.log('app side service invoke onRun')
    },
    onDestroy() {
      this.log('app side service invoke onDestroy')
    },
    async sendDataToServer() {
      this.log("In sendDataToServer()")
      const data = JSON.stringify(this.state.healthData)

      this.log(data);

      const res = await fetch({
        url: "http://10.10.10.25:5000/health",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });

      this.log(JSON.stringify(res.body));

      return res.body;
    },

    getDataFromDevice() {
      return this.request({
        method: 'GET_HEALTH_DATA',
        params: {
          param1: 'param1',
          param2: 'param2'
        }
      })
        .then((result) => {
          // receive your data
          this.log('result=>', result)
          this.state.healthData = result
          this.log(this.state)
          this.sendDataToServer()
        })
        .catch((error) => {
          // receive your error
        })
    },
    async getDataPeriodically() {
      while (this.state.service_started) {
        this.getDataFromDevice()
        await new Promise(r => setTimeout(r, this.state.interval))
        this.state.service_started = false
      }

    },
    onCall(req) {
      if (req.method === 'START_SERVICE') {
        this.state.service_started = true
        this.log("params->", req.params)
        this.log('START_SERVICE=>', this.state.service_started)
        this.getDataFromDevice()
        // this.getDataPeriodically()
      } else if (req.method === 'HEALTH') {
        this.log("params->", req.params)
        this.log('HEALTH=>')
      }
    },

  }))
