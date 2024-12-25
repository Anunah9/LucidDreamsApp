import { BaseSideService } from '@zeppos/zml/base-side'


AppSideService(
  BaseSideService({
    state: {
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
    onCall(data) {
      if (data.method === 'HEALTH_DATA') {
        this.log('req=>', JSON.stringify(data))
      } else if (data.method === 'AXEL') {
        this.log('req=>', JSON.stringify(data))
      }
    },

  }))
