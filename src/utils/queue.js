

const getRef = (current) => ({ current })

function enqueue(refQ, ...callbacks) {
  let Q = refQ.current

  for (const callback of callbacks) {
    Q = Q.then(async () => {
      // TODO: support cancelation?
      let { run, fail } = callback
      if (typeof callback === 'function') {
        // short version
        run = callback
        fail = err => console.log(`[uncatched enqueue error]: ${err}\n`, err.stack)
      }

      try {
        return await run()
      } catch (err) {
        fail(err)
      }
    })
  }

  refQ.current = Q
  return Q
}

export default function createQueue() {
  const Q = getRef(Promise.resolve())

  return {
    enqueue: enqueue.bind(null, Q),
  }
}
