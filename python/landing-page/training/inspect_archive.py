import zipfile
import tarfile
import os

path = os.path.expanduser("~/.cache/kagglehub/datasets/athlawange/ev-charging/1.archive")
if os.path.exists(path):
    print("File exists, size:", os.path.getsize(path))
    if zipfile.is_zipfile(path):
        print("It is a ZIP file!")
        with zipfile.ZipFile(path, 'r') as z:
            print("Files inside:")
            for f in z.namelist()[:20]:
                print(f)
    else:
        print("It is NOT a ZIP file.")
        # Try tar
        try:
            with tarfile.open(path, 'r') as t:
                print("Tar files:")
                for f in t.getnames()[:20]:
                    print(f)
        except Exception as e:
            print("Not a tar file either:", e)
else:
    print("File does not exist at:", path)
