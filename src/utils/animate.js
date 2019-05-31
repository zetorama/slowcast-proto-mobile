import BackgroundTimer from 'react-native-background-timer'

export default function animate(durationMs, steps, onProgress) {
  if (steps < 2 || durationMs < 1) return Promise.resolve()

  let tid, resolve, reject
  let curStep = 1
  let lastTime = new Date()
  const stepEveryMs = durationMs / steps
  const runStep = async () => {
    const time = new Date()
    try {
      await onProgress(time - lastTime)
      lastTime = time
    } catch (err) {
      reject(err)
      return
    }

    if (++curStep >= steps) {
      BackgroundTimer.clearInterval(tid)
      resolve()
    }
  }
  const cancel = () => {
    BackgroundTimer.clearInterval(tid)
    reject('cancel')
  }

  const waitForIt = new Promise((res, rej) => {
    resolve = res
    reject = rej
    tid = BackgroundTimer.setInterval(runStep, stepEveryMs)
  })
  return Object.assign(waitForIt, { cancel })
}
