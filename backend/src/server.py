import os
from flask import Flask, flash, request, redirect, url_for, session, send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
import flask_cors
import logging
import cv2
import numpy as np

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger('HELLO WORLD')



UPLOAD_FOLDER = './'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
flask_cors.CORS(app, expose_headers="Access-Control-Allow-Origin: *")

images = []
overlayed = []
@app.route('/upload', methods=['POST'])
def fileUpload():

    global images
    global overlayed

    images = []
    overlayed = []
    file1 = request.files['file']
    npimg = np.fromstring(file1.read(), np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    images.append(img)
    overlayed.append(img)
    print(img.shape)

    return "OK"

@app.route('/send_mask', methods=['POST'])
def mask():
    logger.info("kill me")

    file1 = request.files['file']
    npimg = np.fromstring(file1.read(), np.uint8)
    mask = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    cropped_mask = mask[:images[0].shape[0], :images[0].shape[1], :]
    print(cropped_mask.shape)

    overlayed = cv2.addWeighted(images[0], 1, cropped_mask, 0, 0)

    overlay = cv2.bitwise_or(cropped_mask, images[0])
    cv2.imwrite("hell.png", images[0])
    cv2.imwrite("hell1.png", overlay)
    cv2.imwrite("mask1.png", cropped_mask)


    return send_file("hell.png", mimetype='image/gif')


if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.run(debug=True,host="0.0.0.0", port=5000, use_reloader=False)
