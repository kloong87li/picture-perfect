from flask import Flask, request, jsonify
from multiprocessing import Process
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
def set_brightness():
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

@app.route('/contrast', methods=['POST', 'GET'])
def set_contrast():
    if request.method == 'GET':
        # return camera contrast
        return response_success(value = camera.contrast)

    elif reuqest.method == 'POST':
        value = request.args['value']
        if not value:
            # no value param, return error response
            return response_error()
        else:
            # set camera contrast and return success response
            camera.contrast = value
            return response_success()

@app.route('/zoom', methods=['POST', 'GET'])
def set_zoom():
    if request.method == 'GET':
        # return camera zoom
        return response_success(value = camera.zoom)

    elif reuqest.method == 'POST':
        value = request.args['value']
        if not value:
            # no value param, return error response
            return response_error()
        else:
            # set camera zoom and return success response
            camera.zoom = value
            return response_success()

@app.route('/image_effect', methods=['POST', 'GET'])
def set_image_effect():
    if request.method == 'GET':
        # return camera image_effect
        return response_success(value = camera.image_effect)

    elif reuqest.method == 'POST':
        value = request.args['value']
        if not value:
            # no value param, return error response
            return response_error()
        else:
            # set camera image_effect and return success response
            # assuming a valid image_effect was given as a value
            camera.image_effect = value
            return response_success()

@app.route('/flip', methods=['POST', 'GET'])
def set_flip():
    if request.method == 'GET':
        # return camera flip
        flip = (camera.vflip or camera.hflip)
        return response_success(value = flip)

    elif reuqest.method == 'POST':
        value = request.args['value']
        if not value:
            # no value param, return error response
            return response_error()
        else:
            # set camera flip and return success response
            if (value == 'hflip'):
                camera.hflip = not camera.hflip
            else:
                camera.vflip = not camera.vflip 
            return response_success()


@app.route('/capture', methods=['POST'])
def capture():
    # take picture and return success response
    camera.capture('picture_perfect', 'jpeg')
    return response_success()

def start_camera(camera):
    camera.resolution = (1920, 1080)

    # Start a preview
    camera.start_preview()


def start_server():
    app.run(host=HOST, port=PORT, debug=True)

if __name__ == "__main__":
    with picamera.PiCamera() as camera:
        p1 = Process(target = start_camera, args = camera)
        p2 = Process(target = start_server)
        p1.Start()
        p2.Start()

    camera.stop_preview()





