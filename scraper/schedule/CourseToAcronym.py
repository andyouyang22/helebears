import re
import requests
from bs4 import BeautifulSoup

def scrape_acronyms():
    mappings = {}
    sburl = 'http://guide.berkeley.edu/courses/'
    r = requests.get(sburl)
    soup = BeautifulSoup(r.text)
    trigger = False
    for ulist in soup.find_all('li'):
        if not trigger:
            if 'Aerospace Studies' in str(ulist):
                trigger = True
        if trigger:
            output = re.sub('<[^<]+?>', '', str(ulist)).split('(')
            output[1] = output[1][:len(output[1])-1]
            output[1] = output[1].replace(" ", "")
            mappings[output[0][:len(output[0])-1]] = output[1]
    return mappings

print scrape_acronyms()