from flask import Flask, request, jsonify
from flask_cors import CORS
from recognition_lib import search_pii
import os
from PIL import Image

app = Flask(__name__)

Upload = 'static/upload'
app = Flask(__name__)
app.config['uploadFolder'] = Upload

CORS(app)

@app.route('/verify_age', methods=['POST'])
def verify_age():
    if 'image' in request.files:
        image_file = request.files['image']
        temp_file_path = os.path.join(app.config['uploadFolder'], image_file.filename).replace('\\', '/')

        image_file.save(temp_file_path)

        image = Image.open(temp_file_path)

        resultat = search_pii(image)

        os.remove(temp_file_path)

        return jsonify(resultat)
    else:
        return jsonify({"erreur": "Aucune image n'a été téléchargée."})



if __name__ == '__main__' :
    app.run(debug=True)