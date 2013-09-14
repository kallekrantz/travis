#!/usr/bin/python
# -*- coding: utf-8 -*-
import requests
import json
import sys
def main():
    initPage = 0
    page = initPage
    url = "http://api.apitekt.se/transportstyrelsen/olyckor-2003-2012/list.json?lan=Östergötlands%20län&page=".decode('utf-8')
    result = []
    temp = requests.get(url + str(page)).json()

    while True:
        sys.stderr.write("Printing page: " + str(page) + "\n")
        temp = requests.get(url + str(page)).json()
        page+=1
        if len(temp['rows']) == 0:
            break
        result += temp['rows']
        
    print json.dumps(result);
        
if __name__ == "__main__":
    main()
