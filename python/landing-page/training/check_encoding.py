with open("landing.html", "rb") as f:
    head = f.read(100)
    print("Head bytes:", head)
    try:
        print("UTF-8 decode:", head.decode("utf-8"))
    except:
        pass
    try:
        print("UTF-16 decode:", head.decode("utf-16"))
    except:
        pass
