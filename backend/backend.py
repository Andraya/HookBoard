from flask import Flask, request, send_from_directory, redirect, url_for
# going to use flask to create a web server that serves static files and handles form submissions

import os # to handle file paths
import json # to read and write JSON files
import uuid # to generate unique filenames for uploaded files
import subprocess # to run external scripts
import sys # to get the python executable path
from datetime import datetime # to get the current date

# create the flask app and set the static folder to the parent directory
app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), '..'), static_url_path='')

#when the root URL is accessed (http://localhost:5000), returns the index.html file
@app.route('/')
def index():
    return send_from_directory(os.path.join(os.path.dirname(__file__), '..'), 'index.html')


# when the /data/<filename> URL is accessed, returns the requested file from the data directory (for example, pins.json)
@app.route('/data/<path:filename>')
def data_files(filename):
    return send_from_directory(os.path.join(os.path.dirname(__file__), '..', 'data'), filename)

# when the /add_pin URL is accessed with a GET request (normal page load), serves the add_pin.html file
@app.route('/add_pin')
def add_pin_page():
    return send_from_directory(os.path.join(os.path.dirname(__file__), '..'), 'add_pin.html')

# when the /add_pin URL is accessed with a POST request (gets data and do something with it; != GET), handles the form submission to add a new pin
@app.route('/add_pin', methods=['POST'])
# function to handle adding a new pin (form submission, file upload, updating JSON, running script to extract images and generate thumbnails)
def add_pin(): 
    # Get form data
    title = request.form.get('title')
    tags = [tag.strip() for tag in request.form.get('tags', '').split(',') if tag.strip()] # split tags by comma and strip whitespace, saves in a list:  [tag1, tag2, ...]
    difficulty = request.form.get('difficulty')
    time = request.form.get('time')
    production_cost = request.form.get('productionCost')
    used_materials = [mat.strip() for mat in request.form.get('usedMaterials', '').split(',') if mat.strip()] # split used materials by comma and strip whitespace, saves in a list: [material1, material2, ...]
    
    # Handle PDF upload
    pdf_file = request.files.get('pdf') # get the uploaded PDF file from the form
    if pdf_file:
        # Generate unique filename
        pdf_filename = f"{uuid.uuid4()}_{pdf_file.filename}" # prepend a unique UUID (Universally Unique Identifier) to the original filename to avoid conflicts
        pdf_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'pdf', pdf_filename) # define the path to save the PDF file, in this case still locally in the assets/pdf directory
        os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
        pdf_file.save(pdf_path)
        pdf_relative = f"assets/pdf/{pdf_filename}" # relative path to be stored in the JSON file
    else:
        pdf_relative = "" # if no PDF uploaded, set to empty string

    # Load existing pins
    pins_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'pins.json')
    with open(pins_path, 'r') as f:
        pins = json.load(f)

    # Get next id
    if pins:
        next_id = max(pin['id'] for pin in pins) + 1
    else:
        next_id = 1

    # Create new pin
    new_pin = {
        "id": next_id,
        "title": title,
        "image": "",  # Will be set by extract script in file scripts/extract_images.py
        "tags": tags,
        "pdf": pdf_relative,
        "usedMaterials": used_materials,
        "difficulty": difficulty,
        "creationDate": datetime.now().strftime('%Y-%m-%d'), # current date in YYYY-MM-DD format
        "time": time, # estimated time to complete the project
        "productionCost": production_cost # estimated production cost, to be calculated automatically in the future
    }

    pins.append(new_pin) # add the new pin to the list of existing pins

    # Save pins
    with open(pins_path, 'w') as f:
        json.dump(pins, f, indent=2) # save the updated list of pins back to the JSON file, with automatic indentation for readability

    # Run extract script, to automatically extract images and generate thumbnails for the new pin
    try:
        script_path = os.path.join(os.path.dirname(__file__), '..', 'scripts', 'extract_images.py')
        script_dir = os.path.dirname(script_path)
        subprocess.run([sys.executable, script_path], cwd=script_dir, check=True) # run the script using the same python executable as the current script, set the working directory to the script's directory, and check for errors
    except subprocess.CalledProcessError as e:
        print(f"Error running extract script: {e}")

    return redirect(url_for('index')) # after processing the form, redirect back to the index page

# handles editing an existing pin
@app.route('/edit_pin/<int:pin_id>', methods=['GET', 'POST']) #accepts both GET and POST requests
def edit_pin(pin_id):
    if request.method == 'POST':
        # Get form data
        title = request.form.get('title')
        tags = [tag.strip() for tag in request.form.get('tags', '').split(',') if tag.strip()]
        difficulty = request.form.get('difficulty')
        time = request.form.get('time')
        production_cost = request.form.get('productionCost')
        used_materials = [mat.strip() for mat in request.form.get('usedMaterials', '').split(',') if mat.strip()]

        # Load existing pins
        pins_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'pins.json')
        with open(pins_path, 'r') as f:
            pins = json.load(f)

        # Find and update the pin
        for pin in pins:
            if pin['id'] == pin_id:
                pin['title'] = title
                pin['tags'] = tags
                pin['difficulty'] = difficulty
                pin['time'] = time
                pin['productionCost'] = production_cost
                pin['usedMaterials'] = used_materials
                break

        # Save pins
        with open(pins_path, 'w') as f:
            json.dump(pins, f, indent=2)

        return redirect(url_for('index'))

    # For GET, serve the edit page
    return send_from_directory(os.path.join(os.path.dirname(__file__), '..'), 'edit_pin.html') #

# handles deleting an existing pin
@app.route('/delete_pin/<int:pin_id>', methods=['POST'])
def delete_pin(pin_id):
    # Load existing pins
    pins_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'pins.json')
    with open(pins_path, 'r') as f:
        pins = json.load(f)

    # Remove the pin
    pins = [pin for pin in pins if pin['id'] != pin_id] # create a new list of pins excluding the one with the specified pin_id

    # Save pins
    with open(pins_path, 'w') as f:
        json.dump(pins, f, indent=2)

    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True) # run the flask app in debug mode when this script is executed directly