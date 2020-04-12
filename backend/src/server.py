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
@app.route('/upload', methods=['POST'])
def fileUpload():
    target=os.path.join(UPLOAD_FOLDER,'test_docs')
    if not os.path.isdir(target):
        os.mkdir(target)
    logger.info("welcome to upload`")
    global images
    images = []
    file1 = request.files['file']
    npimg = np.fromstring(file1.read(), np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    images.append(img)
    print(img.shape)
    # filename = secure_filename(file.filename)
    # destination="/".join([target, filename])
    # file.save(destination)
    # session['uploadFilePath']=destination

    return "OK"

@app.route('/send_mask', methods=['POST'])
def mask():
    logger.info("kill me")

    file1 = request.files['file']
    npimg = np.fromstring(file1.read(), np.uint8)
    mask = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    print(mask.shape)

    cv2.imwrite("hell.png", images[0])


    return send_file("hell.png", mimetype='image/gif')


if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.run(debug=True,host="0.0.0.0", port=5000, use_reloader=False)
