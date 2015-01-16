from flask import Flask, request, jsonify 
from datetime import datetime
import tweepy
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

    elif request.method == 'POST':
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

    elif request.method == 'POST':
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

    elif request.method == 'POST':
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

    elif request.method == 'POST':
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

    elif request.method == 'POST':
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
    photo_path = 'picture_perfect.jpg'

    # take picture and return success response
    timestamp = datetime.now()
    camera.capture(photo_path)

        # Consumer keys and access tokens, used for OAuth  
    consumer_key = 'I73UiEZsH83oMd9RfpFEulJS5'  
    consumer_secret = 'fge6JKablQXB1Hy31qoc1FeaYmLq160p0haku2PpGcy9JQJ9M1'  
    access_token = '2981412352-YolOdurfxumDu1bMIAfDdro4f6Evkd4Wbo0waMc'  
    access_token_secret = '9ZfGZ31gkejWBHxnFhuuBFB3oB2G0gco0t9awTxGeyS5o'  
      
    # OAuth process, using the keys and tokens  
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)  
    auth.set_access_token(access_token, access_token_secret)  
       
    # Creation of the actual interface, using authentication  
    api = tweepy.API(auth)  
      
    # Send the tweet with photo  
    status = 'Picture Perfect: ' + timestamp.strftime('%Y/%m/%d %H:%M:%S')   
    api.update_with_media(photo_path, status=status)  

    return response_success()

@app.route('/preview', methods=['POST'])
def preview():
    global camera 
    camera = picamera.PiCamera()

    #start the camera preview
    camera.resolution = (1920, 1080)
    camera.start_preview()
    return response_success()

@app.route('/stop_preview', methods=['POST'])
def stop_preview():
    camera.stop_preview()
    return response_success()


if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=True)

