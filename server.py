from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# HERE, I'VE DEFINED A SUPER-USER
admins = [
    {
        'email': 'hansalkothari008@gmail.com'
    },
]

# STATIC IMAGES
imageUrls =[]
tags = []

# ENDPOINT TO GET ALL THE ADMINS
@app.route('/v1/admins',methods=['GET'])
def get_admins():
    return jsonify(admins)

# ENDPOINT TO CHECK IF LOGGED-IN USER IS AN ADMIN
@app.route('/v1/check-admin',methods=['POST'])
def check_admin():
    query = request.get_json()
    
    if 'email' not in query:
        return jsonify({
            'error':'Email is missing.'
        }),400
    
    email = query['email']
    
    for obj in admins:
        if 'email' in obj and obj['email'] == email:
            return jsonify({'found':True})
    
    return jsonify({'found':False})

# ENDPOINT TO GET ALL THE USERS
@app.route('/v1/users',methods=['GET'])
def get_users():
    return jsonify(admins)


# ENDPOINT TO GET ALL THE IMAGES 
@app.route('/v1/get-images',methods=['GET'])
def get_images():
    return jsonify({'imageUrls':imageUrls})    

# ENDPOINT TO UPLOAD AN IMAGE
@app.route('/v1/upload',methods=['POST'])
def upload_image():
    query = request.get_json()
    if query['url'] is None:
        return jsonify({'message':'URL not provided'}),400
    
    url = query['url']
    label = query['label']
    image_tags = query['tags']
    id = len(imageUrls) + 1
    
    found = any(url in obj.values() for obj in imageUrls)
    if not found:
        imageUrls.append({'url':url,'label':label,'tags':image_tags,'id':id})
    return jsonify({'imageUrls':imageUrls}),200

@app.route('/v1/save-label',methods=['POST'])
def save_label():
    query = request.get_json()
    if 'label' not in query:
        return jsonify({'message':'Error, label is not provided'}),400
    
    label = query['label']
    found = label in tags and label != ""

    if not found:
        tags.append(label)
    return jsonify({'labels':tags}),200

@app.route('/v1/get-labels',methods=['GET'])
def get_labels():
    return jsonify({'labels':tags}),200

@app.route('/v1/set-labels',methods=['POST'])
def set_labels():
    query = request.get_json();
    updated_tags = query['labels']
    tags[:] = updated_tags
    return jsonify({'labels':tags})

@app.route('/v1/add-label',methods=['POST'])
def add_label():
    query = request.get_json()
    id = query['id']
    tag = query['tag']
    for obj in imageUrls:
        if obj['id'] == id:
            obj['tags'].append(tag)
    return jsonify({"message":"tag added to the image, successfully"}),200

@app.route('/',methods=["GET"])
def home():
    return jsonify({"message":"Welcome to the server"}),200

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)
