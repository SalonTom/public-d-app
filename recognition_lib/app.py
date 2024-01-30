from flask import Flask, request, jsonify
from flask_cors import CORS
from recognition_lib import search_pii
from PIL import Image
import os
import web3_utils
from concurrent.futures import ThreadPoolExecutor
import asyncio

app = Flask(__name__)

Upload = 'static/upload'
app.config['uploadFolder'] = Upload
executor = ThreadPoolExecutor()

CORS(app)

def async_process_image(image, eth_address,temp_file_path):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(search_pii(image,eth_address))
    os.remove(temp_file_path)


@app.route('/verify_age', methods=['POST'])
def verify_age():
    web3_utils.connect()
    eth_address = request.args.get('eth_address')
    if eth_address is not None:
        web3_utils.update_whitelist(eth_address, 1)
        if 'image' in request.files:
            try:
                image_file = request.files['image']
                temp_file_path = os.path.join(app.config['uploadFolder'], image_file.filename).replace('\\', '/')
                image_file.save(temp_file_path)

                image = Image.open(temp_file_path)

                # Exécuter la fonction asynchrone dans un thread ThreadPoolExecutor
                executor.submit(async_process_image, image, eth_address,temp_file_path)
            except Exception as e:
                print(f"An error occurred: {e}")

        return 'Image envoyée vers le serveur'
    else:
        return jsonify({"erreur": "Aucune image n'a été téléchargée."})

if __name__ == '__main__':
    app.run(debug=True)
