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

    async sendDataToServer(health_data) {
      this.log("In sendDataToServer()")
      const data = health_data["params"]

      this.log(JSON.stringify(data));
      const url = "http://10.10.10.25:5000/health"
      const home_url = "http://192.168.0.106:5000/health"
      const res = await fetch({
        url: url,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { health: JSON.stringify(data) },
      });

      // this.log("RESPONSE BODY", JSON.stringify(res.body));

      return res.body;
    },

    async onCall(data) {



      if (data.method === 'HEALTH_DATA') {
        // this.log('req=>', JSON.stringify(data))
        await this.sendDataToServer(data)

      } else if (data.method === 'AXEL') {
        this.log('req=>', JSON.stringify(data))
      }
    },

  }))
