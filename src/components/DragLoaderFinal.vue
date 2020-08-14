<template>
  <div class="drag-loader">
    <div :style="transformPosition$">
      <svg width="70" height="70" :style="transformRotation$">
        <circle cy="35" cx="35" r="35" fill="lightgrey" />
        <circle cy="15" cx="35" r="10" fill="black" />
      </svg>
    </div>
  </div>
</template>

<script>
import { fromEvent, concat, defer } from 'rxjs'
import {
  exhaustMap,
  takeUntil,
  map,
  startWith,
  tap,
  takeWhile,
  repeat,
  endWith,
} from 'rxjs/operators'
import RxAnimationService from '@/common/animation'
import { dogAPI$, refresh$ } from '@/App'

export default {
  subscriptions() {
    const touchStart$ = fromEvent(document, 'touchstart')
    const touchMove$ = fromEvent(document, 'touchmove')
    const touchEnd$ = fromEvent(document, 'touchend')

    const animationService = new RxAnimationService()
    let currentPosition = 0
    const returnPosition$ = defer(() =>
      animationService.tween(currentPosition, 0, 300),
    )
    const returnAfterLoadPosition$ = dogAPI$.pipe(
      exhaustMap(() => returnPosition$),
    )

    const drag$ = touchStart$.pipe(
      exhaustMap(start =>
        concat(
          touchMove$.pipe(
            map(move => move.touches[0].pageY - start.touches[0].pageY),
            takeUntil(touchEnd$),
            tap(dy => {
              currentPosition = dy
              if (dy > window.innerHeight / 2) {
                this.$emit('refresh')
              }
            }),
          ),
          returnPosition$,
        ),
      ),
      takeWhile(dy => dy <= window.innerHeight / 2),
    )

    const position$ = concat(drag$, returnAfterLoadPosition$).pipe(
      startWith(0),
      map(y => y - 70),
      repeat(),
    )

    const transformPosition$ = position$.pipe(
      map(dy => `transform: translate3d(0, ${dy}px, 0)`),
    )

    const rotation$ = refresh$.pipe(
      exhaustMap(() =>
        animationService
          .tween(0, 360, 500)
          .pipe(repeat(), takeUntil(dogAPI$), endWith(0)),
      ),
    )

    const transformRotation$ = rotation$.pipe(
      map(d => `transform: rotate(${d}deg`),
    )

    return {
      transformPosition$,
      transformRotation$,
    }
  },
}
</script>

<style scoped>
.drag-loader {
  position: absolute;
  top: 0px;
  left: 50%;
  margin-left: -35px;
}
</style>
