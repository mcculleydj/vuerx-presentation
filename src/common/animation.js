import { interval, animationFrameScheduler, defer } from 'rxjs'
import { map, takeWhile, endWith } from 'rxjs/operators'

export default class RxAnimationService {
  frame$ = interval(0, animationFrameScheduler)

  tick$ = defer(() => {
    const start = animationFrameScheduler.now()
    return this.frame$.pipe(map(() => animationFrameScheduler.now() - start))
  })

  duration(ms) {
    return this.tick$.pipe(
      map(t => t / ms),
      takeWhile(t => t <= 1),
      endWith(1),
    )
  }

  tween(start, end, duration) {
    const difference = end - start
    return this.duration(duration).pipe(
      map(d => Math.round(start + d * difference)),
    )
  }
}
