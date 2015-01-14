from flask import Flask, request

app = Flask(__name__)

HOST = '0.0.0.0'
PORT = 80

@app.route('/color', methods=['POST'])
def set_color():
    value = request.args['value']
    # request's json data assumed to contain value field
    if not value:
        return "invalid request"
    else:
        return "set color " + value 


@app.route('/counterclockwise', methods=['POST'])
def rotate_counterclockwise():
    value = request.args['value']
    # request's json data assumed to contain value field
    if not value:
        return "invalid request"
    else:
        return "rotated counterclockwise " + value 


@app.route('/clockwise', methods=['POST'])
def rotate_clockwise():
    value = request.args['value']
    # request's json data assumed to contain value field
    if not value:
        return "invalid request"
    else:
        return "rotated clockwise " + value 

if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=True)





