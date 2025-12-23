m5gesture.onGestureChanged(function (gesture) {
    serial.writeLine(m5gesture.gestureName(gesture))
    if (m5gesture.isGesture(gesture, m5gesture.Gesture.Right)) {
        music.play(music.tonePlayable(523, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    } else if (m5gesture.isGesture(gesture, m5gesture.Gesture.Left)) {
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    }
})
m5gesture.init()
