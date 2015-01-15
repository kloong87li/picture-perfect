import sys
sys.path.insert(0, "lib")

# leapmotion dependencies
import Leap
from Leap import CircleGesture, KeyTapGesture, ScreenTapGesture, SwipeGesture

# class for making requests to raspi flask server
import raspi_server
from raspi_server import RaspiServer


class ControllerListener(Leap.Listener):
    HAND = {'LEFT': 0, 'RIGHT': 1}


    def on_connect(self, controller):
        controller.enable_gesture(Leap.Gesture.TYPE_CIRCLE)
        controller.enable_gesture(Leap.Gesture.TYPE_KEY_TAP)
        controller.enable_gesture(Leap.Gesture.TYPE_SCREEN_TAP)
        controller.enable_gesture(Leap.Gesture.TYPE_SWIPE)

        self.raspi = RaspiServer()
        self.count = 0
        print "Connected"


    def on_frame(self, controller):
        # throtle framerate
        self.count += 1
        if (self.count % 25 != 0):
            return

        frame = controller.frame()

        for hand in frame.hands:
            # Get the hand's normal vector and direction
            normal = hand.palm_normal
            direction = hand.direction

            if hand.is_left: #left controls color
                self.raspi.set_color(normal.roll * Leap.RAD_TO_DEG)
            else: # right controls motors
                deg = normal.roll * Leap.RAD_TO_DEG
                if (deg >= 0):
                    self.raspi.rotate_clockwise(deg);
                else:
                    self.raspi.rotate_counterclockwise(abs(deg))

            # Calculate the hand's pitch, roll, and yaw angles
            # print "  pitch: %f degrees, roll: %f degrees, yaw: %f degrees" % (
            #     direction.pitch * Leap.RAD_TO_DEG,
            #     normal.roll * Leap.RAD_TO_DEG,
            #     direction.yaw * Leap.RAD_TO_DEG)
            

        for gesture in frame.gestures():
            if gesture.type == Leap.Gesture.TYPE_SWIPE:
                circle = CircleGesture(gesture)
                if circle.state == Leap.Gesture.STATE_STOP:
                    print "Circle detected"

            if gesture.type == Leap.Gesture.TYPE_SWIPE:
                swipe = SwipeGesture(gesture)
                if swipe.state == Leap.Gesture.STATE_STOP:
                    print "Swipe detected"

            if gesture.type == Leap.Gesture.TYPE_KEY_TAP:
                keytap = KeyTapGesture(gesture)
                if keytap.state == Leap.Gesture.STATE_STOP:
                    print "Keytap detected"

            if gesture.type == Leap.Gesture.TYPE_SCREEN_TAP:
                screentap = ScreenTapGesture(gesture)
                if screentap.state == Leap.Gesture.STATE_STOP:
                    print "Screentap detected"


    def on_exit(self, controller):
        print "exited"
