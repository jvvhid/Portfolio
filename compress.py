import os
from PIL import Image

def compress_to_webp(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                filepath = os.path.join(root, file)
                # Skip if a webp version already exists
                webp_filepath = os.path.splitext(filepath)[0] + '.webp'
                
                try:
                    with Image.open(filepath) as img:
                        # Convert RGBA to RGB for JPEG-like webp compression if needed, though WebP supports alpha.
                        # We will save as webp with high compression.
                        print(f"Compressing: {filepath}")
                        img.save(webp_filepath, 'webp', optimize=True, quality=60)
                        
                    # Delete original to save space
                    os.remove(filepath)
                except Exception as e:
                    print(f"Failed to compress {filepath}: {e}")

if __name__ == '__main__':
    compress_to_webp('src/assets')
