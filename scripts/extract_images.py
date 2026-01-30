import json # Library for handling JSON data, used here to read and write pin information
import fitz  # PyMuPDF; Library for PDF processing, in this case to extract images from PDFs
import os

# Load pins from JSON
with open('../frontend/data/pins.json', 'r') as f:
    pins = json.load(f) 

# Process each pin
for pin in pins:
    if ('image' not in pin or not pin['image']) and 'pdf' in pin and pin['pdf'] and os.path.exists(os.path.join('../frontend', pin['pdf'])):
    #if there is no image associated with the pin, but there is a PDF file, it will try to extract the first image from the PDF
        try: 
            doc = fitz.open(pin['pdf']) # Open the PDF file with PyMuPDF, allowing the manipulation and extraction of its contents
            extracted = False
            for page in doc:
                images = page.get_images(full=True) # Retrieve all images on the current page of the PDF
                if images:
                    xref = images[0][0] # Get the xref of the first image found on the page
                    base_image = doc.extract_image(xref) # Extract the image data using the xref
                    image_bytes = base_image["image"] # Get the raw image bytes
                    image_ext = base_image["ext"] # Get the image file extension 
                    image_name = f"pin_{pin['id']}.{image_ext}" # Create a unique image name based on the pin ID
                    image_path = os.path.join("../frontend/assets", "images", image_name) # Define the path to save the extracted image
                    os.makedirs(os.path.dirname(image_path), exist_ok=True) # Ensure the directory exists
                    with open(image_path, "wb") as img_file: # Write the extracted image bytes to a file
                        img_file.write(image_bytes)
                    pin['image'] = image_path # Update the pin's image field with the path to the extracted image
                    extracted = True # Mark that an image has been extracted
                    break  # Only extract the first image found
            doc.close()
            if not extracted: # If no images were found in the PDF, it logs that no images were found
                print(f"No images found in PDF for pin {pin['id']}")
        except Exception as e: # If any error occurs during the PDF processing or image extraction, it logs the error
            print(f"Error processing PDF for pin {pin['id']}: {e}")
    else:
        if 'image' in pin and pin['image']: # If an image is already associated with the pin, it skips extraction
            print(f"Image already set for pin {pin['id']}")
        elif not ('pdf' in pin and pin['pdf']): # If no PDF is specified, it cannot extract an image
            print(f"PDF not specified for pin {pin['id']}")
        else: # If the specified PDF file does not exist, it logs that the PDF is not found
            print(f"PDF not found for pin {pin['id']}")

# Save updated pins back to JSON
with open('../frontend/data/pins.json', 'w') as f:
    json.dump(pins, f, indent=2) # Save the updated pins with extracted image paths back to the JSON file

print("Image extraction completed.")