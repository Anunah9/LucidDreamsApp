import { HeartRate } from '@zos/sensor'

export function getHealthData() {
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
}