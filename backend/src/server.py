import os
from flask import Flask, flash, request, redirect, url_for, session, send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
import flask_cors
import logging
import cv2
import numpy as np
import tensorflow as tf
import neuralgym as ng

from models.inpaint_model import InpaintCAModel

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
flask_cors.CORS(app, expose_headers="Access-Control-Allow-Origin: *")

images = []
overlayed = []
masks = []

FLAGS = ng.Config('models/inpaint.yml')



def getInpaintedImage(image, mask):


    model = InpaintCAModel()

    assert image.shape == mask.shape

    h, w, _ = image.shape
    grid = 8
    image = image[:h//grid*grid, :w//grid*grid, :]
    mask = mask[:h//grid*grid, :w//grid*grid, :]

    print('Shape of image: {}'.format(image.shape))

    image = np.expand_dims(image, 0)
    mask = np.expand_dims(mask, 0)
    input_image = np.concatenate([image, mask], axis=2)

    sess_config = tf.ConfigProto()
    sess_config.gpu_options.allow_growth = True

    with tf.Session(config=sess_config) as sess:
        input_image = tf.constant(input_image, dtype=tf.float32)
        output = model.build_server_graph(FLAGS, input_image)
        output = (output + 1.) * 127.5
        output = tf.reverse(output, [-1])
        output = tf.saturate_cast(output, tf.uint8)
        # load pretrained model
        vars_list = tf.get_collection(tf.GraphKeys.GLOBAL_VARIABLES)
        assign_ops = []
        for var in vars_list:
            vname = var.name
            from_name = vname
            var_value = tf.contrib.framework.load_variable("models/model_logs/release_places2_256_deepfill_v2/", from_name)
            assign_ops.append(tf.assign(var, var_value))
        sess.run(assign_ops)
        print('Model loaded.')
        result = sess.run(output)
        return result[0][:, :, ::-1]

@app.route('/upload', methods=['POST'])
def fileUpload():

    global images
    global overlayed
    global masks

    images = []
    overlayed = []
    masks = []
    file1 = request.files['file']
    npimg = np.fromstring(file1.read(), np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    images.append(img)
    overlayed.append(img)
    print(img.shape)

    return "OK"

@app.route('/send_mask', methods=['POST'])
def mask():

    file1 = request.files['file']
    npimg = np.fromstring(file1.read(), np.uint8)
    mask = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    cropped_mask = mask[:images[0].shape[0], :images[0].shape[1], :]
    print(cropped_mask.shape)

    # if(len(masks) >= 1):
    #     # cropped_mask = cv2.addWeighted(masks[0], 1, cropped_mask, 0, 0)
    #     cropped_mask = cv2.bitwise_or(cropped_mask, masks[0])
    #     masks[0] = cropped_mask
    # else:
    #     masks.append(cropped_mask)

    # overlayed = cv2.addWeighted(images[0], 1, cropped_mask, 0, 0)

    overlay = cv2.bitwise_or(cropped_mask, images[0])

    cv2.imwrite("hell.png", images[0])
    cv2.imwrite("hell1.png", overlay)
    cv2.imwrite("mask1.png", cropped_mask)

    res = getInpaintedImage(images[0], cropped_mask)
    images[0] = res
    cv2.imwrite("inpainted.png", res)

    return send_file("inpainted.png", mimetype='image/gif')

@app.route('/download', methods=['GET'])
def download():

    # cv2.imwrite("inpainted.png", images[0])

    return send_file("inpainted.png", mimetype='image/gif')

if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.run(debug=True,host="0.0.0.0", port=5000, use_reloader=False)
