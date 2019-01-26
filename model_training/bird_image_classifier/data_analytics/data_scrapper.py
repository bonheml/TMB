import os
from PIL import Image
from io import BytesIO
import requests
import flickrapi
import pandas as pd
from pathlib import Path

class FlickrPhotoScrapper:
    def __init__(self, max_size=200):
        api_key = os.environ['FLICKR_API_KEY']
        api_secret = os.environ['FLICKR_API_SECRET']
        self.flickr = flickrapi.FlickrAPI(api_key, api_secret,
                                          format='etree')
        self.flickr.authenticate_via_browser(perms='read')
        self.max_size = max_size
        self.df = None

    def save_images(self, entries, save_path):
        species_df = pd.DataFrame(entries, columns=['id', 'url', 'topic'])
        if self.df is not None:
            self.df = pd.concat([self.df, species_df], ignore_index=True)
        else:
            self.df = species_df
        self.df.to_csv(save_path, sep='\t')

    def search_images(self, text):
        entries = []

        for i, photo in enumerate(self.flickr.walk(tags=text.replace('_', ''),
                                                   content_type=1)):
            if i >= self.max_size:
                break
            filename = "{}_{}".format(photo.get('id'), photo.get('secret'))
            url = "https://farm{}.staticflickr.com/{}/{}.jpg".format(
                photo.get('farm'), photo.get('server'), filename)
            entries.append([filename, url, text])

        return entries

    def download_image_batch(self, urls, download_dir, resize):
        for url in urls:
            filename = url.split('/')[-1]
            download_path = "{}/{}".format(download_dir, filename)
            response = requests.get(url)
            if response.status_code == 200:
                img = Image.open(BytesIO(response.content))
                if resize is not None:
                    img = img.resize(resize)
                img.save(download_path)

    def download_images(self, df_path, save_path, resize=None):
        df = pd.read_csv(df_path, sep='\t')
        grouped_df = df.groupby('topic')
        topic_list = grouped_df.groups.keys()
        batch_len = len(topic_list)
        for i, topic in enumerate(topic_list):

            path = Path(save_path) / topic
            if not path.exists():
                path.mkdir()
            urls = grouped_df.get_group(topic)['url'].tolist()
            print("{}/{}: Saving {} images of {} in {}"
                  .format(i + 1, batch_len, len(urls), topic, path))
            self.download_image_batch(urls, str(path), resize)


    def scrap_images(self, topics, save_path):
        topic_len = len(topics)
        for i, topic in enumerate(topics):
            print('{}/{}: Scraping images from topic {}'
                  .format(i + 1, topic_len, topic))
            entries = self.search_images(topic)
            self.save_images(entries, save_path)
