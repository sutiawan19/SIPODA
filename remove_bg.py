import sys
from PIL import Image

def make_transparent(img_path):
    print(f"Processing {img_path}...")
    try:
        img = Image.open(img_path).convert("RGBA")
        datas = img.getdata()
        
        newData = []
        for item in datas:
            # item is (R, G, B, A)
            # If the pixel is white or very close to white, make it transparent
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
                
        img.putdata(newData)
        img.save(img_path, "PNG")
        print(f"Successfully processed {img_path}")
    except Exception as e:
        print(f"Failed to process {img_path}: {e}")

if __name__ == "__main__":
    make_transparent("public/mascot_blue_owl.png")
    make_transparent("public/mascot_cheering.png")
