import sys
sys.path.insert(0, "lib")

import Leap

from controller_listener import ControllerListener


def main():

    listener = ControllerListener()
    controller = Leap.Controller()

    # Have the listener receive events from the controller
    controller.add_listener(listener)

    # Keep this process running until Enter is pressed
    print "Press Enter to quit..."
    try:
        sys.stdin.readline()
    except KeyboardInterrupt:
        pass

if __name__ == "__main__":
    main()