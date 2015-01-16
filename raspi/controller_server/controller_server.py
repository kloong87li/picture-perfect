from flask import Flask, request, jsonify

import picamera

app = Flask(__name__)

camera = None

HOST = '0.0.0.0'
PORT = 80


# creates a json response with success = false
def response_error():
    return jsonify(success = False)


# creates a json response with success = true in addition to other args
def response_success(**kwargs):
    return jsonify(success = True, **kwargs)


@app.route('/brightness', methods=['POST', 'GET'])
def set_color():
    if request.method == 'GET':
        # return camera brightness
        return response_success(value = camera.brightness)

    elif reuqest.method == 'POST':
        value = request.args['value']
        if not value:
            # no value param, return error response
            return response_error()
        else:
            # set camera brightness and return success response
            camera.brightness = value
            return response_success()


if __name__ == "__main__":
    with picamera.PiCamera() as camera:
        camera.resolution = (640, 480)
        # Start a preview and let the camera warm up for 2 seconds
        camera.start_preview()
        time.sleep(2)

        app.run(host=HOST, port=PORT, debug=True)
    finally:
        camera.stop_preview()





