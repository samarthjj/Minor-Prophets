import re

# Using regex in python:
# https://docs.python.org/3/library/re.html
# https://www.w3resource.com/python-exercises/python-conditional-exercise-15.php

def check_password(password):
    if len(password) < 8 or len(password) > 100:
        return False
    elif not re.search("[A-Z]", password):
        return False
    elif not re.search("[a-z]", password):
        return False
    elif not re.search("[0-9]", password):
        return False
    elif not re.search("[!@#$%^&*()]", password):
        return False
    elif re.search("[ \t\n\r\f\v]", password):
        return False

    return True

def check_username(username):
    if re.search("[ \t\n\r\f\v]", username):
        return False
    if re.search("[;]", username):
        return False

    return True
