#lib for making http requests
import requests


class RaspiServer:

    URL = "0.0.0.0:80/"


    def __init__(self):
        return


    def __url_for(self, route):
        return self.URL + route


    def rotate_clockwise(self, degrees):
        url = self.__url_for("clockwise")
        params = {'value': degrees}
        
        resp = requests.post(url, params=params)
        print "Response from rotating clockwise: " + resp.text 


    def rotate_counterclockwise(self, degrees):
        url = self.__url_for("counterclockwise")
        params = {'value': degrees}

        resp = requests.post(url, params=params)
        print "Response from rotating counterclockwise: " + resp.text 


    def set_color(self, rgb):
        url = self.__url_for("color")
        params = {'value': rgb}

        resp = requests.post(url, params=params)
        print "Response from setting color: " + resp.text 

