import requests
import json
def main():
    initPage = 0
    page = initPage
    url = "http://api.apitekt.se/transportstyrelsen/olyckor-2003-2012/list.json?kommun=Link%%C3%%B6ping&page=%s"
    result = []
    while True:
        temp = requests.get(url % page).json()
        page+=1
        if len(temp['rows']) == 0:
            break
        result += temp['rows']

    print json.dumps(result);
        
if __name__ == "__main__":
    main()
