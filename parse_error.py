import requests
from bs4 import BeautifulSoup

r = requests.get('https://www.wajd-agency.com/')
soup = BeautifulSoup(r.text, 'html.parser')

# Find code snippet lines or stack trace
for pre in soup.find_all('pre'):
    print('PRE:', pre.text[:300])
    break

for div in soup.find_all('span', class_='font-mono'):
    print('MONO:', div.text)
