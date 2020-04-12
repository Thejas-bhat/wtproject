import os
from flask import Flask, flash, request, redirect, url_for, session, send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
import flask_cors
import logging

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger('HELLO WORLD')



UPLOAD_FOLDER = './'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
flask_cors.CORS(app, expose_headers="Access-Control-Allow-Origin: *")

@app.route('/upload', methods=['POST'])
def fileUpload():
    target=os.path.join(UPLOAD_FOLDER,'test_docs')
    if not os.path.isdir(target):
        os.mkdir(target)
    logger.info("welcome to upload`")
    file = request.files['file']
    filename = secure_filename(file.filename)
    destination="/".join([target, filename])
    file.save(destination)
    session['uploadFilePath']=destination
    response="Whatever you wish to return"


    return send_file("test_docs/prep.png", mimetype='image/gif')

if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.run(debug=True,host="0.0.0.0", port=5000, use_reloader=False)
